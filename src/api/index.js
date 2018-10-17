import * as firebase from 'firebase'
import FIREBASE_CONSTANTS from '../constants/firebase'
const FACEBOOK_APP_ID = "331867204038135"

class API {

  // initialize() {
  //   firebase.initializeApp(FIREBASE_CONSTANTS);

  //   // Listen for authentication state to change.
  //   firebase.auth().onAuthStateChanged(user => {
  //     if (user != null) {
  //       console.log("We are authenticated now!", firebase.auth().currentUser.uid);
  //       this.listenHighscoreByUser(firebase.auth().currentUser.uid);
  //     }
  //     // Do other things
  //   });
  // }

  setHighscore(score) {
    const user = firebase.auth().currentUser;
    if (user != null) {
      console.log( "setHighscore", user.uid )
      firebase.database().ref('users/' + user.uid).set({
        highscore: score
      })
    }
  }

  listenHighscoreByUser(userId) {
    firebase.database().ref('users/' + userId).on('value', (snapshot) => {
      const highscore = snapshot.val().highscore;
      console.log("New high score: " + highscore)
    })
  }

  getHighscores() {
    // https://firebase.google.com/docs/reference/js/firebase.database.DataSnapshot#forEach
    var query = firebase.database().ref("users").orderByKey()
    const highscores = query.once("value")
      .then(function (snapshot) {
        return snapshot
      })
    
    console.log('getHighscores', highscores)
    return highscores
  }
}


module.exports = new API()
