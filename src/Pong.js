class Pong extends Game {
  static Defaults = {
    width: 640, // logical canvas width (browser will scale to physical canvas size - which is controlled by @media css queries)
    height: 480, // logical canvas height (ditto)

    wallWidth: 12,
    paddleWidth: 12,
    paddleHeight: 60,
    paddleSpeed: 2, // should be able to cross court vertically   in 2 seconds
    ballSpeed: 4, // should be able to cross court horizontally in 4 seconds, at starting speed ...

    ballAccel: 8, // ... but accelerate as time passes
    ballRadius: 5,
    sound: true,
  };

  Colors = {
    walls: 'white',
    ball: 'white',
    score: 'red',
    footprint: '#333',
    predictionGuess: 'yellow',
    predictionExact: 'red',
  };

  Images = ['images/press1.png', 'images/press2.png', 'images/winner.png'];

  Levels = [
    { aiReaction: 0.2, aiError: 40 }, // 0:  ai is losing by 8
    { aiReaction: 0.3, aiError: 50 }, // 1:  ai is losing by 7
    { aiReaction: 0.4, aiError: 60 }, // 2:  ai is losing by 6
    { aiReaction: 0.5, aiError: 70 }, // 3:  ai is losing by 5
    { aiReaction: 0.6, aiError: 80 }, // 4:  ai is losing by 4
    { aiReaction: 0.7, aiError: 90 }, // 5:  ai is losing by 3
    { aiReaction: 0.8, aiError: 100 }, // 6:  ai is losing by 2
    { aiReaction: 0.9, aiError: 110 }, // 7:  ai is losing by 1
    { aiReaction: 1.0, aiError: 120 }, // 8:  tie
    { aiReaction: 1.1, aiError: 130 }, // 9:  ai is winning by 1
    { aiReaction: 1.2, aiError: 140 }, // 10: ai is winning by 2
    { aiReaction: 1.3, aiError: 150 }, // 11: ai is winning by 3
    { aiReaction: 1.4, aiError: 160 }, // 12: ai is winning by 4
    { aiReaction: 1.5, aiError: 170 }, // 13: ai is winning by 5
    { aiReaction: 1.6, aiError: 180 }, // 14: ai is winning by 6
    { aiReaction: 1.7, aiError: 190 }, // 15: ai is winning by 7
    { aiReaction: 1.8, aiError: 200 }, // 16: ai is winning by 8
  ];

  constructor(runner, cfg) {
    super();
    this.loadImages(this.Images, (images) => {
      this.cfg = cfg;
      this.runner = runner;

      this.width = runner.width;
      this.height = runner.height;

      // court image
      this.images = images;
      this.playing = false;
      this.scores = [0, 0];

      this.menu = new Menu(this);
      this.court = new Court(this);
      this.sounds = new Sounds(this);

      this.leftPaddle = new Paddle(this);
      this.rightPaddle = new Paddle(this, true);
      this.ball = new Ball(this);
      this.runner.start();
    });
  }

  startDemo() {
    this.start(0);
  }
  startSinglePlayer() {
    this.start(1);
  }
  startDoublePlayer() {
    this.start(2);
  }

  start(numPlayers) {
    if (!this.playing) {
      this.scores = [0, 0];
      this.playing = true;

      // how many players
      this.leftPaddle.setAuto(numPlayers < 1, this.level(0));
      this.rightPaddle.setAuto(numPlayers < 2, this.level(1));

      // reset ball
      this.ball.reset();
      this.runner.hideCursor();
    }
  }

  stop(ask) {
    if (this.playing) {
      if (!ask || this.runner.confirm('Abandon game in progress ?')) {
        this.playing = false;
        this.leftPaddle.setAuto(false);
        this.rightPaddle.setAuto(false);
        this.runner.showCursor();
      }
    }
  }

  level(playerNo) {
    return 8 + (this.scores[playerNo] - this.scores[playerNo ? 0 : 1]);
  }

  goal(playerNo) {
    // get on goal with playerNo
    this.sounds.goal();
    this.scores[playerNo] += 1;

    if (this.scores[playerNo] == 9) {
      this.menu.declareWinner(playerNo);
      this.stop();
    } else {
      this.ball.reset(playerNo);
      this.leftPaddle.setLevel(this.level(0));
      this.rightPaddle.setLevel(this.level(1));
    }
  }

  update(dt) {
    this.leftPaddle.update(dt, this.ball);
    this.rightPaddle.update(dt, this.ball);

    if (this.playing) {
      let dx = this.ball.dx;
      let dy = this.ball.dy;

      // update ball state
      this.ball.update(dt, this.leftPaddle, this.rightPaddle);

      // after updates, check whether the direction of the ball changed
      if (this.ball.dx < 0 && dx > 0) {
        this.sounds.ping();
      } else if (this.ball.dx > 0 && dx < 0) {
        this.sounds.pong();
      } else if (this.ball.dy * dy < 0) {
        this.sounds.wall();
      }

      if (this.ball.left > this.width) {
        this.goal(0);
      } else if (this.ball.right < 0) {
        this.goal(1);
      }
    }
  }

  draw(ctx) {
    // wall(left & right)
    this.court.draw(ctx, this.scores[0], this.scores[1]);

    // paddles
    this.leftPaddle.draw(ctx);
    this.rightPaddle.draw(ctx);

    // playing state, draw the ball
    if (this.playing) {
      this.ball.draw(ctx);
    } else {
      this.menu.draw(ctx);
    }
  }

  onkeydown(keyCode) {
    switch (keyCode) {
      case this.KEY.ZERO:
        this.startDemo();
        break;
      case this.KEY.ONE:
        this.startSinglePlayer();
        break;
      case this.KEY.TWO:
        this.startDoublePlayer();
        break;
      case this.KEY.ESC:
        this.stop(true);
        break;
      case this.KEY.Q:
        if (!this.leftPaddle.auto) {
          this.leftPaddle.moveUp();
        }
        break;
      case this.KEY.A:
        if (!this.leftPaddle.auto) {
          this.leftPaddle.moveDown();
        }
        break;
      case this.KEY.P:
        if (!this.rightPaddle.auto) {
          this.rightPaddle.moveUp();
        }
        break;
      case this.KEY.L:
        if (!this.rightPaddle.auto) {
          this.rightPaddle.moveDown();
        }
        break;
    }
  }

  onkeyup(keyCode) {
    switch (keyCode) {
      case this.KEY.Q:
        if (!this.leftPaddle.auto) {
          this.leftPaddle.stopMovingUp();
        }
        break;
      case this.KEY.A:
        if (!this.leftPaddle.auto) {
          this.leftPaddle.stopMovingDown();
        }
        break;
      case this.KEY.P:
        if (!this.rightPaddle.auto) {
          this.rightPaddle.stopMovingUp();
        }
        break;
      case this.KEY.L:
        if (!this.rightPaddle.auto) {
          this.rightPaddle.stopMovingDown();
        }
        break;
    }
  }

  showStats(on) {
    this.cfg.stats = on;
  }
  showFootprints(on) {
    this.cfg.footprints = on;
    this.ball.footprints = [];
  }
  showPredictions(on) {
    this.cfg.predictions = on;
  }
  enableSound(on) {
    this.cfg.sound = on;
  }
}
