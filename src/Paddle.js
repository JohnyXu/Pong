class Paddle {
  constructor(pong, rhs) {
    this.pong = pong;

    this.width = pong.cfg.paddleWidth;
    this.height = pong.cfg.paddleHeight;

    this.minY = pong.cfg.wallWidth;
    this.maxY = pong.height - pong.cfg.wallWidth - this.height;

    this.speed = (this.maxY - this.minY) / pong.cfg.paddleSpeed;
    this.setpos(rhs ? pong.width - this.width : 0, this.minY + (this.maxY - this.minY) / 2);
    this.setdir(0);
  }

  setpos(x, y) {
    this.x = x;
    this.y = y;
    this.left = this.x;
    this.right = this.left + this.width;
    this.top = this.y;
    this.bottom = this.y + this.height;
  }

  setdir(dy) {
    this.up = dy < 0 ? -dy : 0;
    this.down = dy > 0 ? dy : 0;
  }

  setAuto(on, level) {
    if (on && !this.auto) {
      this.auto = true;
      this.setLevel(level);
    } else if (!on && this.auto) {
      this.auto = false;
      this.setdir(0);
    }
  }

  setLevel(level) {
    if (this.auto) {
      this.level = this.pong.Levels[level];
    }
  }

  update(dt, ball) {
    if (this.auto) {
      this.ai(dt, ball);
    }

    let amount = this.down - this.up;
    if (amount != 0) {
      let y = this.y + amount * dt * this.speed;
      if (y < this.minY) {
        y = this.minY;
      } else if (y > this.maxY) {
        y = this.maxY;
      }
      this.setpos(this.x, y);
    }
  }

  ai(dt, ball) {
    if ((ball.x < this.left && ball.dx < 0) || (ball.x > this.right && ball.dx > 0)) {
      this.stopMovingUp();
      this.stopMovingDown();
      return;
    }

    this.predict(ball, dt);

    if (this.prediction) {
      if (this.prediction.y < this.top + this.height / 2 - 5) {
        this.stopMovingDown();
        this.moveUp();
      } else if (this.prediction.y > this.bottom - this.height / 2 + 5) {
        this.stopMovingUp();
        this.moveDown();
      } else {
        this.stopMovingUp();
        this.stopMovingDown();
      }
    }
  }

  predict(ball, dt) {
    // only re-predict if the ball changed direction, or its been some amount of time since last prediction
    if (
      this.prediction &&
      this.prediction.dx * ball.dx > 0 &&
      this.prediction.dy * ball.dy > 0 &&
      this.prediction.since < this.level.aiReaction
    ) {
      this.prediction.since += dt;
      return;
    }

    let pt = Helper.ballIntercept(
      ball,
      { left: this.left, right: this.right, top: -10000, bottom: 10000 },
      ball.dx * 10,
      ball.dy * 10,
    );
    if (pt) {
      let t = this.minY + ball.radius;
      let b = this.maxY + this.height - ball.radius;

      while (pt.y < t || pt.y > b) {
        if (pt.y < t) {
          pt.y = t + (t - pt.y);
        } else if (pt.y > b) {
          pt.y = t + (b - t) - (pt.y - b);
        }
      }
      this.prediction = pt;
    } else {
      this.prediction = null;
    }

    if (this.prediction) {
      this.prediction.since = 0;
      this.prediction.dx = ball.dx;
      this.prediction.dy = ball.dy;
      this.prediction.radius = ball.radius;
      this.prediction.exactX = this.prediction.x;
      this.prediction.exactY = this.prediction.y;
      let closeness = (ball.dx < 0 ? ball.x - this.right : this.left - ball.x) / this.pong.width;
      let error = this.level.aiError * closeness;
      this.prediction.y = this.prediction.y + this.pong.random(-error, error);
    }
  }

  draw(ctx) {
    ctx.fillStyle = this.pong.Colors.walls;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    if (this.prediction && this.pong.cfg.predictions) {
      ctx.strokeStyle = this.pong.Colors.predictionExact;
      ctx.strokeRect(
        this.prediction.x - this.prediction.radius,
        this.prediction.exactY - this.prediction.radius,
        this.prediction.radius * 2,
        this.prediction.radius * 2,
      );

      ctx.strokeStyle = this.pong.Colors.predictionGuess;
      ctx.strokeRect(
        this.prediction.x - this.prediction.radius,
        this.prediction.y - this.prediction.radius,
        this.prediction.radius * 2,
        this.prediction.radius * 2,
      );
    }
  }

  moveUp() {
    this.up = 1;
  }
  moveDown() {
    this.down = 1;
  }
  stopMovingUp() {
    this.up = 0;
  }
  stopMovingDown() {
    this.down = 0;
  }
}
