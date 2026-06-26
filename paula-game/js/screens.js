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

  function startIntro(done) {
    currentDone = done;

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
    clearTimeout(introTimer);

    if (typeof done === 'function') {
      done();
    }
  }

  document.addEventListener('touchend', () => {
    const introScreen = document.getElementById('intro-screen');

    if (!introScreen || !introScreen.classList.contains('active')) return;

    const now = Date.now();

    if (now - lastTap < 320) {
      skipIntro();
    }

    lastTap = now;
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
