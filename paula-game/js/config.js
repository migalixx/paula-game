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
    'Paula,',
'Has sido el rayo de luz que ha iluminado el mes que llevamos juntos.',
'No hay momento contigo que no añore;',
'Cada unas de tus palabras resuenan en mi cabeza por días,',
'Tu risa alegra mi alma, tu mirada la mata de felicidad.',
'Me encanta la sensación de tu piel, tus mordidas a mis labios,',
'También el notar su respiración sobre mi cuello, y las cosquillas que me haces',
'Por ello maldigo la distancia que nos separa,',
'Aquella que me impide besarte, cogerte del brazo y llenarte la cara de babas.',
'Así pues, en busca de paliar esta crueldad del destino he creado esta web...',
'TE AMO'
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
