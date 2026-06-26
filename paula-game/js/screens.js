window.GameScreens = (() => {
  const screens = ['select-screen', 'intro-screen', 'main-screen'];

  const show = (id) => {
    screens.forEach((screenId) => {
      const screen = document.getElementById(screenId);
      if (!screen) return;
      screen.classList.toggle('active', screenId === id);
    });
  };

  let introTimer = null;
  let introIndex = 0;
  let lastTap = 0;
  let currentDone = null;
  let introAlreadySkipped = false;

  function isIntroActive() {
    const introScreen = document.getElementById('intro-screen');

    return introScreen && introScreen.classList.contains('active');
  }

  function startIntro(done) {
    currentDone = done;
    introAlreadySkipped = false;
    lastTap = 0;

    if (window.GameAudio) {
      window.GameAudio.stopSelectMusic?.();
      window.GameAudio.startMainMusic?.();
    }

    show('intro-screen');

    const text = document.getElementById('intro-text');
    const phrases = window.GAME_CONFIG.introPhrases;

    introIndex = 0;
    clearTimeout(introTimer);

    const next = () => {
      if (!text) return;

      text.style.animation = 'none';
      void text.offsetWidth;

      text.textContent = phrases[introIndex];
      text.style.animation = '';

      introIndex++;

      if (introIndex >= phrases.length) {
        introTimer = setTimeout(() => {
          done();
        }, 5300);
      } else {
        introTimer = setTimeout(next, 5300);
      }
    };

    next();
  }

  function skipIntro(done = currentDone) {
    if (introAlreadySkipped) return;

    introAlreadySkipped = true;
    clearTimeout(introTimer);

    if (typeof done === 'function') {
      done();
    }
  }

  function registerTap() {
    if (!isIntroActive()) return;

    const now = Date.now();

    if (now - lastTap < 420) {
      skipIntro();
      lastTap = 0;
      return;
    }

    lastTap = now;
  }

  document.addEventListener('pointerup', (event) => {
    if (!isIntroActive()) return;

    event.preventDefault();
    registerTap();
  });

  document.addEventListener('dblclick', (event) => {
    if (!isIntroActive()) return;

    event.preventDefault();
    skipIntro();
  });

  document.addEventListener('keydown', (event) => {
    if (!isIntroActive()) return;

    if (
      event.key === 'Enter' ||
      event.key === ' ' ||
      event.key === 'Escape'
    ) {
      skipIntro();
    }
  });

  return {
    show,
    startIntro,
    skipIntro,
    setSkipHandler(fn) {
      currentDone = fn;
    }
  };
})();