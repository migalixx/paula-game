window.GameImages = (() => {
  const testImage = (src) => new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
  async function applyImage(imgEl, item){
    const ok = await testImage(item.file);
    if (ok) {
      imgEl.src = item.file;
      imgEl.style.display = '';
      const fallback = imgEl.parentElement?.querySelector('.fallback-emoji');
      if (fallback) fallback.remove();
    } else {
      imgEl.removeAttribute('src');
      imgEl.style.display = 'none';
      let fallback = imgEl.parentElement?.querySelector('.fallback-emoji');
      if (!fallback) {
        fallback = document.createElement('div');
        fallback.className = 'fallback-emoji';
        imgEl.parentElement?.insertBefore(fallback, imgEl);
      }
      fallback.textContent = item.fallback;
    }
  }
  return {
    async refresh(player){
      const cfg = window.GAME_CONFIG.images;
      document.querySelectorAll('[data-img="paula"]').forEach(el => applyImage(el, cfg.paula));
      document.querySelectorAll('[data-img="miguel"]').forEach(el => applyImage(el, cfg.miguel));
      const currentAvatar = document.getElementById('current-avatar');
      if (currentAvatar) await applyImage(currentAvatar, player === 'paula' ? cfg.paula : cfg.miguel);
      document.querySelectorAll('[data-action-img]').forEach(el => {
        const action = el.dataset.actionImg;
        applyImage(el, cfg.actions[player][action]);
      });
    }
  };
})();
