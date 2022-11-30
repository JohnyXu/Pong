class Helper {
  static accelerate(x, y, dx, dy, accel, dt) {
    // s=v0t+at²/2, next destination position
    let x2 = x + dt * dx + accel * dt * dt * 0.5;
    let y2 = y + dt * dy + accel * dt * dt * 0.5;
    // next velocity in x and y direction
    let dx2 = dx + accel * dt * (dx > 0 ? 1 : -1);
    let dy2 = dy + accel * dt * (dy > 0 ? 1 : -1);

    // nx: offsetx, ny: offsety
    return { nx: x2 - x, ny: y2 - y, x: x2, y: y2, dx: dx2, dy: dy2 };
  }

  static intercept(x1, y1, x2, y2, x3, y3, x4, y4, d) {
    let denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    if (denom != 0) {
      let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
      if (ua >= 0 && ua <= 1) {
        let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
        if (ub >= 0 && ub <= 1) {
          let x = x1 + ua * (x2 - x1);
          let y = y1 + ua * (y2 - y1);
          return { x: x, y: y, d: d };
        }
      }
    }
    return null;
  }

  // check intercept
  static ballIntercept(ball, rect, nx, ny) {
    let pt;
    if (nx < 0) {
      // move to left
      pt = this.intercept(
        ball.x,
        ball.y,
        ball.x + nx,
        ball.y + ny,
        rect.right + ball.radius,
        rect.top - ball.radius,
        rect.right + ball.radius,
        rect.bottom + ball.radius,
        'right',
      );
    } else if (nx > 0) {
      // move to right
      pt = this.intercept(
        ball.x,
        ball.y,
        ball.x + nx,
        ball.y + ny,
        rect.left - ball.radius,
        rect.top - ball.radius,
        rect.left - ball.radius,
        rect.bottom + ball.radius,
        'left',
      );
    }
    if (!pt) {
      if (ny < 0) {
        // move to top
        pt = this.intercept(
          ball.x,
          ball.y,
          ball.x + nx,
          ball.y + ny,
          rect.left - ball.radius,
          rect.bottom + ball.radius,
          rect.right + ball.radius,
          rect.bottom + ball.radius,
          'bottom',
        );
      } else if (ny > 0) {
        // move to bottom
        pt = this.intercept(
          ball.x,
          ball.y,
          ball.x + nx,
          ball.y + ny,
          rect.left - ball.radius,
          rect.top - ball.radius,
          rect.right + ball.radius,
          rect.top - ball.radius,
          'top',
        );
      }
    }
    return pt;
  }
}
