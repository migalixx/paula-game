window.PaulaFirebase = (() => {
  const firebaseConfig = {
    apiKey: "AIzaSyBjWJtBo9KppxMh_HoBJoVJFBDUadA014",
    authDomain: "paula-aniversario.firebaseapp.com",
    projectId: "paula-aniversario",
    storageBucket: "paula-aniversario.firebasestorage.app",
    messagingSenderId: "1090183886853",
    appId: "1:1090183886853:web:5bcdcabaac316407dbc46c"
  };

  let app = null;
  let db = null;
  let tools = null;

  async function init() {
    if (tools) return tools;

    const appModule = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js");
    const firestoreModule = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js");

    app = appModule.initializeApp(firebaseConfig);
    db = firestoreModule.getFirestore(app);

    tools = {
      db,
      doc: firestoreModule.doc,
      setDoc: firestoreModule.setDoc,
      getDoc: firestoreModule.getDoc,
      updateDoc: firestoreModule.updateDoc,
      increment: firestoreModule.increment,
      onSnapshot: firestoreModule.onSnapshot,
      runTransaction: firestoreModule.runTransaction
    };

    return tools;
  }

  return {
    init
  };
})();