class Runner {
  constructor(id, game, cfg) {
    this.cfg = Object.assign({}, game.Defaults, cfg);

    this.fps = this.cfg.fps || 60;
    this.interval = 1000.0 / this.fps;
    this.canvas = document.getElementById(id);
    this.width = this.cfg.width || this.canvas.offsetWidth;
    this.height = this.cfg.height || this.canvas.offsetHeight;

    // front canvas
    this.front = this.canvas;
    this.front.width = this.width;
    this.front.height = this.height;
    this.front2d = this.front.getContext('2d');

    // finally construct the game object itself
    this.game = new game(this, this.cfg);

    // back canvas
    this.back = this.game.createCanvas();
    this.back.width = this.width;
    this.back.height = this.height;
    this.back2d = this.back.getContext('2d');

    this.addEvents();
    this.resetStats();
  }

  start() {
    // game instance should call runner.start() when its finished initializing and is ready to start the game loop
    this.lastFrame = this.game.timestamp();
    this.timer = setInterval(this.loop.bind(this), this.interval);
  }
  stop() {
    clearInterval(this.timer);
  }

  loop() {
    let start = this.game.timestamp();
    // send dt as seconds
    this.update((start - this.lastFrame) / 1000.0);

    let middle = this.game.timestamp();
    this.draw();
    let end = this.game.timestamp();

    this.updateStats(middle - start, end - middle);
    this.lastFrame = start;
  }

  update(dt) {
    this.game.update(dt);
  }

  draw() {
    // back canvas and front canvas, draw to back canvas
    this.back2d.clearRect(0, 0, this.width, this.height);
    this.game.draw(this.back2d);

    this.drawStats(this.back2d);

    // from back to front
    this.front2d.clearRect(0, 0, this.width, this.height);
    this.front2d.drawImage(this.back, 0, 0);
  }

  resetStats() {
    this.stats = {
      count: 0,
      fps: 0,
      update: 0,
      draw: 0,
      frame: 0, // update + draw
    };
  }

  updateStats(update, draw) {
    if (this.cfg.stats) {
      this.stats.update = Math.max(1, update);
      this.stats.draw = Math.max(1, draw);
      this.stats.frame = this.stats.update + this.stats.draw;
      this.stats.count = this.stats.count == this.fps ? 0 : this.stats.count + 1;
      this.stats.fps = Math.min(this.fps, 1000 / this.stats.frame);
    }
  }

  drawStats(ctx) {
    if (this.cfg.stats) {
      const statusX = this.width - 100;
      const topY = this.height - 60;
      ctx.fillText('frame: ' + this.stats.count, statusX, topY);
      ctx.fillText('fps: ' + this.stats.fps, statusX, topY + 10);
      ctx.fillText('update: ' + this.stats.update + 'ms', statusX, topY + 20);
      ctx.fillText('draw: ' + this.stats.draw + 'ms', statusX, topY + 30);
    }
  }

  addEvents() {
    // keyboard event
    this.game.addEvent(document, 'keydown', this.onkeydown.bind(this));
    this.game.addEvent(document, 'keyup', this.onkeyup.bind(this));
  }

  onkeydown(ev) {
    if (this.game.onkeydown) {
      this.game.onkeydown(ev.keyCode);
    }
  }
  onkeyup(ev) {
    if (this.game.onkeyup) {
      this.game.onkeyup(ev.keyCode);
    }
  }

  hideCursor() {
    this.canvas.style.cursor = 'none';
  }
  showCursor() {
    this.canvas.style.cursor = 'auto';
  }

  alert(msg) {
    // alert blocks thread, so need to stop game loop in order to avoid sending huge dt values to next update
    this.stop();
    let result = window.alert(msg);
    this.start();
    return result;
  }

  confirm(msg) {
    // alert blocks thread, so need to stop game loop in order to avoid sending huge dt values to next update
    this.stop();
    let result = window.confirm(msg);
    this.start();
    return result;
  }
}
