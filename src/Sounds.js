class Sounds {
  constructor(pong) {
    this.game = pong;
    this.supported = pong.ua().hasAudio;
    if (this.supported) {
      this.files = {
        ping: pong.createAudio('sounds/ping.wav'),
        pong: pong.createAudio('sounds/pong.wav'),
        wall: pong.createAudio('sounds/wall.wav'),
        goal: pong.createAudio('sounds/goal.wav'),
      };
    }
  }

  play(name) {
    if (this.supported && this.game.cfg.sound && this.files[name]) {
      this.files[name].play();
    }
  }

  ping() {
    this.play('ping');
  }
  pong() {
    this.play('pong');
  }
  wall() {
    this.play('wall');
  }
  goal() {
    this.play('goal');
  }
}
