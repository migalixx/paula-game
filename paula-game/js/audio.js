window.GameAudio = (() => {
  const musicVolume = 0.55;
  const soundVolume = 0.9;

  const STORAGE_KEYS = {
    musicMuted: 'paulaGame.musicMuted',
    sfxMuted: 'paulaGame.sfxMuted'
  };

  let selectMusic = null;
  let mainMusic = null;
  let pendingMusic = null;
  let restoreMusicTimer = null;
  let currentTrackIndex = 0;

  let musicMuted = localStorage.getItem(STORAGE_KEYS.musicMuted) === 'true';
  let sfxMuted = localStorage.getItem(STORAGE_KEYS.sfxMuted) === 'true';

  const sounds = {};

  const mainTracks = [
    'assets/music/01.mp3',
    'assets/music/02.mp3',
    'assets/music/03.mp3',
    'assets/music/04.mp3',
    'assets/music/05.mp3',
    'assets/music/06.mp3',
    'assets/music/07.mp3',
    'assets/music/08.mp3',
    'assets/music/09.mp3',
    'assets/music/10.mp3',
    'assets/music/11.mp3',
    'assets/music/12.mp3',
    'assets/music/13.mp3',
    'assets/music/14.mp3',
    'assets/music/15.mp3'
  ];

  function createAudio(src, volume = 1, loop = false) {
    const audio = new Audio(src);
    audio.volume = volume;
    audio.loop = loop;
    audio.preload = 'auto';
    return audio;
  }

  function applyMusicMuteState() {
    if (selectMusic) {
      selectMusic.muted = musicMuted;
      selectMusic.volume = musicMuted ? 0 : musicVolume;
    }

    if (mainMusic) {
      mainMusic.muted = musicMuted;
      mainMusic.volume = musicMuted ? 0 : musicVolume;
    }
  }

  function applySfxMuteState() {
    Object.values(sounds).forEach((sound) => {
      sound.muted = sfxMuted;
      sound.volume = sfxMuted ? 0 : soundVolume;
    });
  }

  function safePlay(audio) {
    if (!audio) return;

    if (audio === selectMusic || audio === mainMusic) {
      audio.muted = musicMuted;
      audio.volume = musicMuted ? 0 : musicVolume;
    }

    const playPromise = audio.play();

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        pendingMusic = audio;
      });
    }
  }

  function stopAudio(audio) {
    if (!audio) return;

    audio.pause();

    try {
      audio.currentTime = 0;
    } catch (e) {}
  }

  function init() {
    selectMusic = createAudio(
      'assets/music/selectcharacter.mp3',
      musicVolume,
      true
    );

    sounds.click = createAudio(
      'assets/sounds/click.mp3',
      soundVolume,
      false
    );

    sounds.aww = createAudio(
      'assets/sounds/aww.mp3',
      soundVolume,
      false
    );

    sounds.besoCombo = createAudio(
      'assets/sounds/sonidobeso.mp3',
      soundVolume,
      false
    );

    applyMusicMuteState();
    applySfxMuteState();
  }

  function unlock() {
    if (pendingMusic) {
      const audioToPlay = pendingMusic;
      pendingMusic = null;
      safePlay(audioToPlay);
    }
  }

  function isSelectPlaying() {
    return selectMusic && !selectMusic.paused;
  }

  function playSelect() {
    if (!selectMusic) return;

    stopMain();

    applyMusicMuteState();
    safePlay(selectMusic);
  }

  function restartSelect() {
    if (!selectMusic) return;

    stopMain();

    try {
      selectMusic.currentTime = 0;
    } catch (e) {}

    applyMusicMuteState();
    safePlay(selectMusic);
  }

  function forceSelectAfterUserTap() {
    if (!selectMusic) return;

    stopMain();

    if (selectMusic.paused) {
      applyMusicMuteState();
      safePlay(selectMusic);
    }
  }

  function stopSelect() {
    stopAudio(selectMusic);
  }

  function normalizeTrackIndex(index) {
    if (!mainTracks.length) return 0;

    return ((index % mainTracks.length) + mainTracks.length) % mainTracks.length;
  }

  function playMainByIndex(index) {
    if (!mainTracks.length) return;

    stopSelect();
    stopMain();

    currentTrackIndex = normalizeTrackIndex(index);

    const track = mainTracks[currentTrackIndex];

    mainMusic = createAudio(track, musicVolume, false);
    applyMusicMuteState();

    mainMusic.addEventListener('ended', () => {
      playMainByIndex(currentTrackIndex + 1);
    });

    mainMusic.addEventListener(
      'error',
      () => {
        playMainByIndex(0);
      },
      { once: true }
    );

    safePlay(mainMusic);
  }

  function playMainForVisit(visit) {
    const startIndex = normalizeTrackIndex(visit - 1);
    playMainByIndex(startIndex);
  }

  function stopMain() {
    clearTimeout(restoreMusicTimer);
    restoreMusicTimer = null;

    stopAudio(mainMusic);
    mainMusic = null;
  }

  function lowerMusicTemporarily() {
    if (musicMuted) return;
    if (!mainMusic || mainMusic.paused) return;

    mainMusic.volume = 0.18;

    clearTimeout(restoreMusicTimer);

    restoreMusicTimer = setTimeout(() => {
      if (mainMusic && !mainMusic.paused && !musicMuted) {
        mainMusic.volume = musicVolume;
      }
    }, 1200);
  }

  function playSound(name) {
    if (sfxMuted) return;

    const sound = sounds[name];

    if (!sound) return;

    lowerMusicTemporarily();

    sound.muted = false;
    sound.volume = soundVolume;

    try {
      sound.currentTime = 0;
    } catch (e) {}

    const playPromise = sound.play();

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {});
    }
  }

  function playOptionalSound(src) {
    if (sfxMuted) return;

    const optionalSound = createAudio(src, soundVolume, false);

    optionalSound.addEventListener(
      'canplaythrough',
      () => {
        lowerMusicTemporarily();

        const playPromise = optionalSound.play();

        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => {});
        }
      },
      { once: true }
    );

    optionalSound.addEventListener(
      'error',
      () => {
        // Si el archivo no existe, no suena nada.
      },
      { once: true }
    );

    optionalSound.load();
  }

  function setMusicMuted(value) {
    musicMuted = Boolean(value);
    localStorage.setItem(STORAGE_KEYS.musicMuted, String(musicMuted));

    applyMusicMuteState();
  }

  function setSfxMuted(value) {
    sfxMuted = Boolean(value);
    localStorage.setItem(STORAGE_KEYS.sfxMuted, String(sfxMuted));

    applySfxMuteState();
  }

  function toggleMusicMuted() {
    setMusicMuted(!musicMuted);
    return musicMuted;
  }

  function toggleSfxMuted() {
    setSfxMuted(!sfxMuted);
    return sfxMuted;
  }

  function getSettings() {
    return {
      musicMuted,
      sfxMuted
    };
  }

  return {
    init,
    unlock,
    playSelect,
    restartSelect,
    forceSelectAfterUserTap,
    stopSelect,
    playMainForVisit,
    stopMain,
    playSound,
    playOptionalSound,
    isSelectPlaying,
    toggleMusicMuted,
    toggleSfxMuted,
    setMusicMuted,
    setSfxMuted,
    getSettings
  };
})();