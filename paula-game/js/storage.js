window.GameStorage = (() => {
  const keys = window.GAME_CONFIG.storageKeys;
  const defaultScores = {
    paulaToMiguel: { besos: 0, mordidas: 0, abrazos: 0, manitas: 0 },
    miguelToPaula: { besos: 0, mordidas: 0, abrazos: 0, manitas: 0 }
  };
  const read = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  return {
    getSelectedPlayer(){ return localStorage.getItem(keys.selectedPlayer); },
    setSelectedPlayer(player){ localStorage.setItem(keys.selectedPlayer, player); },
    clearSelectedPlayer(){ localStorage.removeItem(keys.selectedPlayer); },
    getScores(){ return read(keys.scores, structuredClone(defaultScores)); },
    saveScores(scores){ write(keys.scores, scores); },
    incrementVisit(player){
      const visits = read(keys.visits, { paula: 0, miguel: 0 });
      visits[player] = (visits[player] || 0) + 1;
      write(keys.visits, visits);
      return visits[player];
    },
    addAction(fromPlayer, action){
      const scores = this.getScores();
      const bucket = fromPlayer === 'paula' ? 'paulaToMiguel' : 'miguelToPaula';
      scores[bucket][action] = (scores[bucket][action] || 0) + 1;
      this.saveScores(scores);
      return scores;
    },
    getReceivedScores(player){
      const scores = this.getScores();
      return player === 'paula' ? scores.miguelToPaula : scores.paulaToMiguel;
    }
  };
})();
