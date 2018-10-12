import * as firebase from 'firebase';

class API {
  
  constructor() {
    // Initialize Firebase
    const firebaseConfig = {
      apiKey: "AIzaSyDgip9A7gS0lGXFjhQApa_s4fVgcuDoBs8",
      authDomain: "slowitdown-d1ac8.firebaseio.com",
      databaseURL: "https://slowitdown-d1ac8.firebaseio.com",
      storageBucket: "slowitdown-d1ac8.appspot.com"
    };
    
    firebase.initializeApp(firebaseConfig);
  }

  storeHighScore(userId, score) {
    firebase.database().ref('users/' + userId).set({
      highscore: score
    });
  }

  setupHighscoreListener(userId) {
    firebase.database().ref('users/' + userId).on('value', (snapshot) => {
      const highscore = snapshot.val().highscore;
      console.log("New high score: " + highscore);
    });
  }

}


module.exports = new API();
