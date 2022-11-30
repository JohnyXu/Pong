function main() {
  const game = new Game();
  game.ready(() => {
    let sound = document.getElementById('sound');
    let stats = document.getElementById('stats');
    let footprints = document.getElementById('footprints');
    let predictions = document.getElementById('predictions');

    let pong = game.start('game', Pong, {
      sound: sound.checked,
      stats: stats.checked,
      footprints: footprints.checked,
      predictions: predictions.checked,
    });

    game.addEvent(sound, 'change', () => {
      pong.enableSound(sound.checked);
    });
    game.addEvent(stats, 'change', () => {
      pong.showStats(stats.checked);
    });
    game.addEvent(footprints, 'change', () => {
      pong.showFootprints(footprints.checked);
    });
    game.addEvent(predictions, 'change', () => {
      pong.showPredictions(predictions.checked);
    });
  });
}

main();
