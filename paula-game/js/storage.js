window.GameStorage = (() => {
  const keys = window.GAME_CONFIG.storageKeys;

  const defaultScores = {
    paulaToMiguel: { besos: 0, mordidas: 0, abrazos: 0, manitas: 0 },
    miguelToPaula: { besos: 0, mordidas: 0, abrazos: 0, manitas: 0 }
  };

  const defaultVisits = {
    paula: 0,
    miguel: 0
  };

  let unsubscribeScores = null;
  let unsubscribeVisits = null;

  const read = (key, fallback) => {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  };

  const write = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function normalizeScores(data) {
    return {
      paulaToMiguel: {
        besos: data?.paulaToMiguel?.besos || 0,
        mordidas: data?.paulaToMiguel?.mordidas || 0,
        abrazos: data?.paulaToMiguel?.abrazos || 0,
        manitas: data?.paulaToMiguel?.manitas || 0
      },
      miguelToPaula: {
        besos: data?.miguelToPaula?.besos || 0,
        mordidas: data?.miguelToPaula?.mordidas || 0,
        abrazos: data?.miguelToPaula?.abrazos || 0,
        manitas: data?.miguelToPaula?.manitas || 0
      }
    };
  }

  function normalizeVisits(data) {
    return {
      paula: data?.paula || 0,
      miguel: data?.miguel || 0
    };
  }

  async function ensureDocExists(ref, fallbackData) {
    const {
      getDoc,
      setDoc
    } = await window.PaulaFirebase.init();

    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      await setDoc(ref, fallbackData);
    }
  }

  async function startFirebaseSync(onChange) {
    try {
      const {
        db,
        doc,
        onSnapshot
      } = await window.PaulaFirebase.init();

      const scoresRef = doc(db, "game", "scores");
      const visitsRef = doc(db, "game", "visits");

      await ensureDocExists(scoresRef, defaultScores);
      await ensureDocExists(visitsRef, defaultVisits);

      if (unsubscribeScores) unsubscribeScores();
      if (unsubscribeVisits) unsubscribeVisits();

      unsubscribeScores = onSnapshot(scoresRef, (snapshot) => {
        const scores = normalizeScores(snapshot.data());

        write(keys.scores, scores);

        if (typeof onChange === "function") {
          onChange();
        }
      });

      unsubscribeVisits = onSnapshot(visitsRef, (snapshot) => {
        const visits = normalizeVisits(snapshot.data());

        write(keys.visits, visits);
      });
    } catch (error) {
      console.warn("No se pudo conectar con Firebase:", error);
    }
  }

  async function saveScoresToFirebase(scores) {
    try {
      const {
        db,
        doc,
        setDoc
      } = await window.PaulaFirebase.init();

      await setDoc(doc(db, "game", "scores"), scores, { merge: true });
    } catch (error) {
      console.warn("No se pudo guardar el marcador en Firebase:", error);
    }
  }

  async function incrementActionInFirebase(fromPlayer, action) {
    try {
      const {
        db,
        doc,
        runTransaction
      } = await window.PaulaFirebase.init();

      const scoresRef = doc(db, "game", "scores");
      const bucket = fromPlayer === "paula" ? "paulaToMiguel" : "miguelToPaula";

      await runTransaction(db, async (transaction) => {
        const snapshot = await transaction.get(scoresRef);
        const currentScores = normalizeScores(snapshot.data());

        currentScores[bucket][action] = (currentScores[bucket][action] || 0) + 1;

        transaction.set(scoresRef, currentScores, { merge: true });
      });
    } catch (error) {
      console.warn("No se pudo sumar la acción en Firebase:", error);
    }
  }

  async function incrementVisitInFirebase(player) {
    const {
      db,
      doc,
      runTransaction
    } = await window.PaulaFirebase.init();

    const visitsRef = doc(db, "game", "visits");

    const newVisitCount = await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(visitsRef);
      const currentVisits = snapshot.exists()
        ? normalizeVisits(snapshot.data())
        : clone(defaultVisits);

      const nextValue = (currentVisits[player] || 0) + 1;

      transaction.set(
        visitsRef,
        {
          ...currentVisits,
          [player]: nextValue
        },
        { merge: true }
      );

      return nextValue;
    });

    const localVisits = read(keys.visits, clone(defaultVisits));

    localVisits[player] = newVisitCount;
    write(keys.visits, localVisits);

    return newVisitCount;
  }

  return {
    startFirebaseSync,

    getSelectedPlayer() {
      return localStorage.getItem(keys.selectedPlayer);
    },

    setSelectedPlayer(player) {
      localStorage.setItem(keys.selectedPlayer, player);
    },

    clearSelectedPlayer() {
      localStorage.removeItem(keys.selectedPlayer);
    },

    getScores() {
      return read(keys.scores, clone(defaultScores));
    },

    saveScores(scores) {
      write(keys.scores, scores);
      saveScoresToFirebase(scores);
    },

    async incrementVisit(player) {
      const localVisits = read(keys.visits, clone(defaultVisits));

      localVisits[player] = (localVisits[player] || 0) + 1;
      write(keys.visits, localVisits);

      try {
        return await incrementVisitInFirebase(player);
      } catch (error) {
        console.warn("No se pudo sumar la visita en Firebase:", error);
        return localVisits[player];
      }
    },

    addAction(fromPlayer, action) {
      const scores = this.getScores();
      const bucket = fromPlayer === "paula" ? "paulaToMiguel" : "miguelToPaula";

      scores[bucket][action] = (scores[bucket][action] || 0) + 1;

      write(keys.scores, scores);
      incrementActionInFirebase(fromPlayer, action);

      return scores;
    },

    getReceivedScores(player) {
      const scores = this.getScores();

      return player === "paula"
        ? scores.miguelToPaula
        : scores.paulaToMiguel;
    }
  };
})();