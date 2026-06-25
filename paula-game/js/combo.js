window.GameCombo = (() => {
  const state = {};
  const thresholds = [10, 20, 30, 40, 50];

  function spawnHearts(count) {
    const layer = document.getElementById('floating-layer');
    const max = Math.min(count, 80);

    for (let i = 0; i < max; i++) {
      const h = document.createElement('span');
      h.className = 'floating-heart';
      h.textContent = '♥';

      h.style.left = `${Math.random() * 100}vw`;
      h.style.top = `${45 + Math.random() * 35}vh`;
      h.style.setProperty('--dx', `${(Math.random() - 0.5) * 260}px`);
      h.style.setProperty('--dy', `${-80 - Math.random() * 260}px`);
      h.style.setProperty('--rot', `${(Math.random() - 0.5) * 180}deg`);

      layer.appendChild(h);

      setTimeout(() => {
        h.remove();
      }, 2400);
    }
  }

  function resetCombo(action, card, badge) {
    const s = state[action];

    if (!s) return;

    if (s.count >= 5) {
      spawnHearts(s.count);

      window.GameAudio.playSound('aww');

      if (action === 'besos') {
        setTimeout(() => {
          window.GameAudio.playSound('besoCombo');
        }, 1400);
      }
    }

    s.count = 0;

    badge.classList.add('hidden');

    card.classList.remove(
      'pop',
      'combo-10',
      'combo-20',
      'combo-30',
      'combo-40',
      'combo-50'
    );
  }

  return {
    hit(action, card) {
      const s = state[action] || {
        count: 0,
        timer: null
      };

      s.count++;

      clearTimeout(s.timer);

      card.classList.remove(
        'pop',
        'combo-10',
        'combo-20',
        'combo-30',
        'combo-40',
        'combo-50'
      );

      void card.offsetWidth;

      card.classList.add('pop');

      const badge = document.querySelector(`[data-combo-for="${action}"]`);

      if (s.count >= 5) {
        badge.textContent = `x${s.count}`;
        badge.classList.remove('hidden');
      }

      thresholds.forEach((threshold) => {
        if (s.count >= threshold) {
          card.classList.add(`combo-${Math.min(threshold, 50)}`);
        }
      });

      s.timer = setTimeout(() => {
        resetCombo(action, card, badge);
      }, 2000);

      state[action] = s;
    }
  };
})();