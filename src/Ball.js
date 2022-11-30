class Ball {
  constructor(pong) {
    this.pong = pong;
    this.radius = pong.cfg.ballRadius;

    this.minX = this.radius;
    this.maxX = pong.width - this.radius;

    this.minY = pong.cfg.wallWidth + this.radius;
    this.maxY = pong.height - pong.cfg.wallWidth - this.radius;

    this.speed = (this.maxX - this.minX) / pong.cfg.ballSpeed;
    this.accel = pong.cfg.ballAccel;
  }

  reset(playerNo) {
    this.footprints = [];
    this.setpos(playerNo == 1 ? this.maxX : this.minX, this.pong.random(this.minY, this.maxY));
    this.setdir(playerNo == 1 ? -this.speed : this.speed, this.speed);
  }

  // set the position of the ball and left, top, right, bottom
  setpos(x, y) {
    this.x = x;
    this.y = y;
    this.left = this.x - this.radius;
    this.top = this.y - this.radius;
    this.right = this.x + this.radius;
    this.bottom = this.y + this.radius;
  }

  setdir(dx, dy) {
    // set the velocity of x direction and y direction
    // did horizontal direction change
    this.dxChanged = this.dx < 0 != dx < 0;

    // did vertical direction change
    this.dyChanged = this.dy < 0 != dy < 0;
    this.dx = dx;
    this.dy = dy;
  }

  footprint() {
    if (this.pong.cfg.footprints) {
      if (!this.footprintCount || this.dxChanged || this.dyChanged) {
        this.footprints.push({ x: this.x, y: this.y });

        // remove previous foot print if the length is greater than 50
        if (this.footprints.length > 50) {
          this.footprints.shift();
        }
        this.footprintCount = 5;
      } else {
        this.footprintCount--;
      }
    }
  }

  update(dt, leftPaddle, rightPaddle) {
    let pos = Helper.accelerate(this.x, this.y, this.dx, this.dy, this.accel, dt);

    if (pos.dy > 0 && pos.y > this.maxY) {
      // change direction in y from "to bottom" to "to top"
      pos.y = this.maxY;
      pos.dy = -pos.dy;
    } else if (pos.dy < 0 && pos.y < this.minY) {
      // change direction in y from "to top" to "to bottom"
      pos.y = this.minY;
      pos.dy = -pos.dy;
    }

    // dx < 0, move to left
    let paddle = pos.dx < 0 ? leftPaddle : rightPaddle;
    let pt = Helper.ballIntercept(this, paddle, pos.nx, pos.ny);

    if (pt) {
      switch (pt.d) {
        case 'left':
        case 'right':
          pos.x = pt.x;
          pos.dx = -pos.dx;
          break;
        case 'top':
        case 'bottom':
          pos.y = pt.y;
          pos.dy = -pos.dy;
          break;
      }

      // add/remove spin based on paddle direction
      if (paddle.up) {
        pos.dy = pos.dy * (pos.dy < 0 ? 0.5 : 1.5);
      } else if (paddle.down) {
        pos.dy = pos.dy * (pos.dy > 0 ? 0.5 : 1.5);
      }
    }

    this.setpos(pos.x, pos.y);
    this.setdir(pos.dx, pos.dy);
    this.footprint();
  }

  draw(ctx) {
    let h = this.radius * 2;
    let w = h;

    // draw the ball
    ctx.fillStyle = this.pong.Colors.ball;
    ctx.fillRect(this.x - this.radius, this.y - this.radius, w, h);

    // footprints
    if (this.pong.cfg.footprints) {
      let max = this.footprints.length;
      ctx.strokeStyle = this.pong.Colors.footprint;
      for (let n = 0; n < max; n++)
        ctx.strokeRect(
          this.footprints[n].x - this.radius,
          this.footprints[n].y - this.radius,
          w,
          h,
        );
    }
  }
}
