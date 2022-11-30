class Game {
  KEY = {
    BACKSPACE: 8,
    TAB: 9,
    RETURN: 13,
    ESC: 27,
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    DELETE: 46,
    HOME: 36,
    END: 35,
    PAGEUP: 33,
    PAGEDOWN: 34,
    INSERT: 45,
    ZERO: 48,
    ONE: 49,
    TWO: 50,
    A: 65,
    L: 76,
    P: 80,
    Q: 81,
    TILDA: 192,
  };

  start(id, game, cfg) {
    // return the game instance, not the runner (caller can always get at the runner via game.runner)
    return new Runner(id, game, cfg).game;
  }

  ua() {
    // should avoid user agent sniffing... but sometimes you just gotta do what you gotta do
    let ua = navigator.userAgent.toLowerCase();
    let key = ua.indexOf('opera') > -1 ? 'opera' : null;
    key = key || (ua.indexOf('firefox') > -1 ? 'firefox' : null);
    key = key || (ua.indexOf('chrome') > -1 ? 'chrome' : null);
    key = key || (ua.indexOf('safari') > -1 ? 'safari' : null);
    key = key || (ua.indexOf('msie') > -1 ? 'ie' : null);

    let version;
    try {
      let re = key == 'ie' ? 'msie (\\d)' : key + '\\/(\\d\\.\\d)';
      let matches = ua.match(new RegExp(re, 'i'));
      version = matches ? parseFloat(matches[1]) : null;
    } catch (e) {}

    return {
      full: ua,
      name: key + (version ? ' ' + version.toString() : ''),
      version: version,
      isFirefox: key == 'firefox',
      isChrome: key == 'chrome',
      isSafari: key == 'safari',
      isOpera: key == 'opera',
      isIE: key == 'ie',
      hasCanvas: document.createElement('canvas').getContext,
      hasAudio: typeof Audio != 'undefined',
    };
  }

  addEvent(obj, type, fn) {
    obj.addEventListener(type, fn, false);
  }
  removeEvent(obj, type, fn) {
    obj.removeEventListener(type, fn, false);
  }

  ready(fn) {
    this.addEvent(document, 'DOMContentLoaded', fn);
  }

  createCanvas() {
    return document.createElement('canvas');
  }

  createAudio(src) {
    try {
      let a = new Audio(src);
      // lets be real quiet please
      a.volume = 0.1;
      return a;
    } catch (e) {
      return null;
    }
  }

  loadImages(sources, callback) {
    /* load multiple images and callback when ALL have finished loading */
    let images = {};
    let count = sources ? sources.length : 0;
    if (count == 0) {
      callback(images);
    } else {
      for (let n = 0; n < sources.length; n++) {
        let source = sources[n];
        let image = document.createElement('img');
        images[source] = image;
        this.addEvent(image, 'load', () => {
          if (--count == 0) callback(images);
        });
        image.src = source;
      }
    }
  }

  random(min, max) {
    return min + Math.random() * (max - min);
  }

  timestamp() {
    return new Date().getTime();
  }
}
