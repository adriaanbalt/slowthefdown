import * as firebase from 'firebase'
import FIREBASE_CONSTANTS from '../constants/firebase'
const FACEBOOK_APP_ID = "331867204038135"

class API {

  // initialize() {
  //   firebase.initializeApp(FIREBASE_CONSTANTS);

  //   // Listen for authentication state to change.
  //   firebase.auth().onAuthStateChanged(user => {
  //     if (user != null) {
  //       this.listenHighscoreByUser(firebase.auth().currentUser.uid);
  //     }
  //     // Do other things
  //   });
  // }

  setHighscore(score) {
    const user = firebase.auth().currentUser;
    if (user != null) {
      firebase.database().ref('users/' + user.uid).set({
        highscore: score
      })
    }
  }

  listenHighscoreByUser(userId) {
    firebase.database().ref('users/' + userId).on('value', (snapshot) => {
      const highscore = snapshot.val().highscore;
    })
  }

  getHighscores() {
    // https://firebase.google.com/docs/reference/js/firebase.database.DataSnapshot#forEach
    var query = firebase.database().ref("users").orderByKey()
    const highscores = query.once("value")
      .then(function (snapshot) {
        return snapshot
      })
    
    return highscores
  }
}


module.exports = new API()
