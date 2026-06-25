window.GAME_CONFIG = {
  spotifyUrl: 'https://open.spotify.com/playlist/4sy2FEH92ZDMl1c2Om7vrZ?si=89cafb8335ea4e13',
  storageKeys: {
    selectedPlayer: 'paulaGame.selectedPlayer',
    scores: 'paulaGame.scores',
    visits: 'paulaGame.visits'
  },
  players: {
    paula: { name: 'Paula', other: 'Miguel' },
    miguel: { name: 'Miguel', other: 'Paula' }
  },
  introPhrases: [
    'FELIZ ANIVERSARIO',
    'Paula, te quiero',
    'Has sido el rayo de luz que ha iluminado el mes que llevamos juntos.',
    'Esta pequeña aventura es solo para ti.'
  ],
  images: {
    paula: { file: 'assets/img/paula.png', fallback: '👧' },
    miguel: { file: 'assets/img/miguel.png', fallback: '👦' },
    actions: {
      paula: {
        besos: { file: 'assets/img/besar.png', fallback: '💋' },
        mordidas: { file: 'assets/img/morder.png', fallback: '😼' },
        abrazos: { file: 'assets/img/abrazar.png', fallback: '🤗' },
        manitas: { file: 'assets/img/manitas.png', fallback: '🤝' }
      },
      miguel: {
        besos: { file: 'assets/img/besar2.png', fallback: '💋' },
        mordidas: { file: 'assets/img/morder2.png', fallback: '😼' },
        abrazos: { file: 'assets/img/abrazar.png', fallback: '🤗' },
        manitas: { file: 'assets/img/manitas.png', fallback: '🤝' }
      }
    }
  },
  audio: {
    select: 'assets/music/selectcharacter.mp3',
    playlist: ['assets/music/01.mp3','assets/music/02.mp3','assets/music/03.mp3'],
    sounds: {
      aww: 'assets/sounds/aww.mp3',
      besoCombo: 'assets/sounds/sonidobeso.mp3',
      click: 'assets/sounds/click.mp3'
    }
  }
};
