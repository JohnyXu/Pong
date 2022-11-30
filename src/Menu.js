class Menu {
  constructor(pong) {
    let press1 = pong.images['images/press1.png'];
    let press2 = pong.images['images/press2.png'];
    let winner = pong.images['images/winner.png'];

    this.press1 = { image: press1, x: 10, y: pong.cfg.wallWidth };
    this.press2 = { image: press2, x: pong.width - press2.width - 10, y: pong.cfg.wallWidth };

    this.winner1 = {
      image: winner,
      x: pong.width / 2 - winner.width - pong.cfg.wallWidth,
      y: 6 * pong.cfg.wallWidth,
    };
    this.winner2 = {
      image: winner,
      x: pong.width / 2 + pong.cfg.wallWidth,
      y: 6 * pong.cfg.wallWidth,
    };
  }

  declareWinner(playerNo) {
    this.winner = playerNo;
  }

  draw(ctx) {
    ctx.drawImage(this.press1.image, this.press1.x, this.press1.y);
    ctx.drawImage(this.press2.image, this.press2.x, this.press2.y);

    if (this.winner == 0) {
      ctx.drawImage(this.winner1.image, this.winner1.x, this.winner1.y);
    } else if (this.winner == 1) {
      ctx.drawImage(this.winner2.image, this.winner2.x, this.winner2.y);
    }
  }
}
