window.PaulaGame = (() => {
  let currentPlayer = 'paula';
  let currentVisit = null;

  function preloadImages() {
    [
      'assets/img/paula.png',
      'assets/img/miguel.png',

      'assets/img/besar.png',
      'assets/img/besar2.png',
      'assets/img/morder.png',
      'assets/img/morder2.png',
      'assets/img/abrazar.png',
      'assets/img/abrazar2.png',
      'assets/img/manitas.png',
      'assets/img/manitas2.png',

      'assets/img/mute.png',
      'assets/img/mute2.png',
      'assets/img/shh.png',
      'assets/img/shh2.png'
    ].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }

  function setTheme() {
    document.body.classList.toggle('theme-paula', currentPlayer === 'paula');
    document.body.classList.toggle('theme-miguel', currentPlayer === 'miguel');
  }

  function makeHearts() {
    const bg = document.getElementById('hearts-bg');
    bg.innerHTML = '';

    for (let i = 0; i < 24; i++) {
      const h = document.createElement('span');
      h.textContent = '♥';
      h.style.left = `${(i * 17) % 104}vw`;
      h.style.top = `${10 + (i * 23) % 82}vh`;
      h.style.animationDelay = `${(i % 7) * 0.35}s`;
      bg.appendChild(h);
    }
  }

  function render() {
    setTheme();

    const playerData = window.GAME_CONFIG.players[currentPlayer];

    document.getElementById('player-name').textContent = playerData.name;

    document.getElementById('interaction-text').textContent =
      `Pulsa cualquier botón para interactuar con ${playerData.other}.`;

    const received = window.GameStorage.getReceivedScores(currentPlayer);

    ['besos', 'mordidas', 'abrazos', 'manitas'].forEach((a) => {
      document.getElementById(`score-${a}`).textContent = received[a] || 0;
    });

    window.GameImages.refresh(currentPlayer);
  }

  async function startIntroMusic() {
    const playerWhenStarted = currentPlayer;

    if (currentVisit === null) {
      currentVisit = await window.GameStorage.incrementVisit(playerWhenStarted);
    }

    if (playerWhenStarted !== currentPlayer) return;

    window.GameAudio.stopSelect();
    window.GameAudio.playMainForVisit(currentVisit);
  }

  function enterMain() {
    window.GameScreens.show('main-screen');
    render();
  }

  function beginWithPlayer(player) {
    currentPlayer = player;
    currentVisit = null;

    window.GameStorage.setSelectedPlayer(player);

    render();
    startIntroMusic();

    window.GameScreens.setSkipHandler(() => {
      window.GameScreens.skipIntro(enterMain);
    });

    window.GameScreens.startIntro(enterMain);
  }

  function bind() {
    document.body.addEventListener('pointerdown', () => {
      window.GameAudio.unlock();

      const selectScreen = document.getElementById('select-screen');

      if (selectScreen && selectScreen.classList.contains('active')) {
        window.GameAudio.forceSelectAfterUserTap();
      }
    });

    document.querySelectorAll('[data-select-player]').forEach((btn) => {
      btn.addEventListener('click', () => {
        beginWithPlayer(btn.dataset.selectPlayer);
      });
    });

    document.getElementById('avatar-toggle').addEventListener('click', () => {
      currentPlayer = currentPlayer === 'paula' ? 'miguel' : 'paula';
      currentVisit = null;

      window.GameStorage.setSelectedPlayer(currentPlayer);

      render();
    });

    document.getElementById('menu-button').addEventListener('click', () => {
      document.getElementById('dropdown').classList.toggle('hidden');
    });

    document.querySelector('[data-section="buttons"]').addEventListener('click', () => {
      document.getElementById('buttons-section').scrollIntoView({ behavior: 'smooth' });
      document.getElementById('dropdown').classList.add('hidden');
    });

    document.querySelector('[data-section="scoreboard"]').addEventListener('click', () => {
      document.getElementById('scoreboard-section').scrollIntoView({ behavior: 'smooth' });
      document.getElementById('dropdown').classList.add('hidden');
    });

    document.getElementById('playlist-link').addEventListener('click', () => {
      window.location.href = window.GAME_CONFIG.spotifyUrl;
    });

    const musicMuteButton = document.getElementById('music-mute-button');
    const sfxMuteButton = document.getElementById('sfx-mute-button');

    function refreshAudioButtons() {
      const settings = window.GameAudio.getSettings();

      const musicImg = musicMuteButton.querySelector('img');
      const sfxImg = sfxMuteButton.querySelector('img');

      musicMuteButton.classList.toggle('active', settings.musicMuted);
      sfxMuteButton.classList.toggle('active', settings.sfxMuted);

      musicImg.src = settings.musicMuted
        ? 'assets/img/mute2.png'
        : 'assets/img/mute.png';

      sfxImg.src = settings.sfxMuted
        ? 'assets/img/shh2.png'
        : 'assets/img/shh.png';

      musicImg.alt = settings.musicMuted
        ? 'Música muteada'
        : 'Mutear música';

      sfxImg.alt = settings.sfxMuted
        ? 'Efectos silenciados'
        : 'Silenciar efectos';

      musicMuteButton.setAttribute(
        'aria-label',
        settings.musicMuted ? 'Activar música' : 'Mutear música'
      );

      sfxMuteButton.setAttribute(
        'aria-label',
        settings.sfxMuted ? 'Activar efectos' : 'Silenciar efectos'
      );
    }

    musicMuteButton.addEventListener('click', () => {
      window.GameAudio.toggleMusicMuted();
      refreshAudioButtons();
    });

    sfxMuteButton.addEventListener('click', () => {
      window.GameAudio.toggleSfxMuted();
      refreshAudioButtons();
    });

    refreshAudioButtons();

    document.querySelectorAll('.love-card').forEach((card) => {
      card.addEventListener('click', () => {
        const action = card.dataset.action;

        window.GameStorage.addAction(currentPlayer, action);
        render();

        window.GameAudio.playSound('click');
        window.GameCombo.hit(action, card);
      });
    });
  }

  function init() {
    makeHearts();
    preloadImages();

    window.GameAudio.init();

    window.GameStorage.startFirebaseSync(() => {
      render();
    });

    bind();

    const saved = window.GameStorage.getSelectedPlayer();

    if (saved === 'paula' || saved === 'miguel') {
      currentPlayer = saved;
      currentVisit = null;

      render();
      startIntroMusic();

      window.GameScreens.setSkipHandler(() => {
        window.GameScreens.skipIntro(enterMain);
      });

      window.GameScreens.startIntro(enterMain);
    } else {
      currentPlayer = 'paula';
      currentVisit = null;

      render();

      window.GameScreens.show('select-screen');
      window.GameAudio.playSelect();
    }
  }

  return {
    init,
    getCurrentPlayer() {
      return currentPlayer;
    }
  };
})();

document.addEventListener('DOMContentLoaded', window.PaulaGame.init);