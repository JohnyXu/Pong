class Court {
  DIGITS = [
    [1, 1, 1, 0, 1, 1, 1], // 0
    [0, 0, 1, 0, 0, 1, 0], // 1
    [1, 0, 1, 1, 1, 0, 1], // 2
    [1, 0, 1, 1, 0, 1, 1], // 3
    [0, 1, 1, 1, 0, 1, 0], // 4
    [1, 1, 0, 1, 0, 1, 1], // 5
    [1, 1, 0, 1, 1, 1, 1], // 6
    [1, 0, 1, 0, 0, 1, 0], // 7
    [1, 1, 1, 1, 1, 1, 1], // 8
    [1, 1, 1, 1, 0, 1, 0], // 9
  ];

  constructor(pong) {
    let w = pong.width;
    let h = pong.height;
    let ww = pong.cfg.wallWidth;
    this.pong = pong;

    this.ww = ww;
    this.walls = [];

    this.walls.push({ x: 0, y: 0, width: w, height: ww });
    this.walls.push({ x: 0, y: h - ww, width: w, height: ww });

    let nMax = h / (ww * 2);
    for (let n = 0; n < nMax; n++) {
      // draw dashed halfway line
      this.walls.push({ x: w / 2 - ww / 2, y: ww / 2 + ww * 2 * n, width: ww, height: ww });
    }

    let sw = 3 * ww;
    let sh = 4 * ww;
    this.score1 = { x: 0.5 + w / 2 - 1.5 * ww - sw, y: 2 * ww, w: sw, h: sh };
    this.score2 = { x: 0.5 + w / 2 + 1.5 * ww, y: 2 * ww, w: sw, h: sh };
  }

  draw(ctx, scorePlayer1, scorePlayer2) {
    ctx.fillStyle = this.pong.Colors.walls;
    for (let n = 0; n < this.walls.length; n++) {
      ctx.fillRect(this.walls[n].x, this.walls[n].y, this.walls[n].width, this.walls[n].height);
    }
    this.drawDigit(ctx, scorePlayer1, this.score1.x, this.score1.y, this.score1.w, this.score1.h);
    this.drawDigit(ctx, scorePlayer2, this.score2.x, this.score2.y, this.score2.w, this.score2.h);
  }

  drawDigit(ctx, n, x, y, w, h) {
    // draw the score of player1 or player2
    ctx.fillStyle = this.pong.Colors.score;
    let dh = (this.ww * 4) / 5;
    let dw = dh;
    let blocks = this.DIGITS[n];
    if (blocks[0]) ctx.fillRect(x, y, w, dh);
    if (blocks[1]) ctx.fillRect(x, y, dw, h / 2);
    if (blocks[2]) ctx.fillRect(x + w - dw, y, dw, h / 2);
    if (blocks[3]) ctx.fillRect(x, y + h / 2 - dh / 2, w, dh);
    if (blocks[4]) ctx.fillRect(x, y + h / 2, dw, h / 2);
    if (blocks[5]) ctx.fillRect(x + w - dw, y + h / 2, dw, h / 2);
    if (blocks[6]) ctx.fillRect(x, y + h - dh, w, dh);
  }
}
