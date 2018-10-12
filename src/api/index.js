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

    // Listen for authentication state to change.
    firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {
        console.log("We are authenticated now!");
      }

      // Do other things
    });
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

  async loginWithFacebook() {
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(
      '331867204038135',
      { permissions: ["public_profile"] }
    );

    if (type === 'success') {
      // store the token in redux reducer
      set('/user/fbAccessToken', token);

      // Build Firebase credential with the Facebook access token.
      const credential = firebase.auth.FacebookAuthProvider.credential(token);

      // Sign in with credential from the Facebook user.
      firebase.auth().signInWithCredential(credential).catch((error) => {
        // Handle Errors here.
      });
      
      registerForPushNotifications(token);
    }
  }

}


module.exports = new API();
