import * as firebase from 'firebase'
import BASE_URL from '../BASE_URL'
import FIREBASE_CONSTANTS from '../constants/firebase'
const FACEBOOK_APP_ID = "331867204038135"

class API {
  
  constructor() {
    // Initialize Firebase
    firebase.initializeApp(FIREBASE_CONSTANTS)

    // Listen for authentication state to change.
    firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {
        console.log("We are authenticated now!")
      }

      // Do other things
    })
  }

  newRequest( fbAccessToken ) {
    return axios.create({
      baseURL: BASE_URL + '/api',
      headers: fbAccessToken ? {
        'Authorization': `Bearer ${fbAccessToken}`
      } : {}
    })
  }

  setHighscoreByUser(user, score) {
    if (user != null) {
      firebase.database().ref('users/' + user.uid).set({
        highscore: score
      })
    }
  }

  listenHighscoreByUser(userId) {
    firebase.database().ref('users/' + userId).on('value', (snapshot) => {
      const highscore = snapshot.val().highscore
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

  async loginWithFacebook() {
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(
      FACEBOOK_APP_ID,
      { permissions: ["public_profile"] }
    )

    if (type === 'success') {
      // store the token in redux reducer
      set('/user/fbAccessToken', token)

      // Build Firebase credential with the Facebook access token.
      const credential = firebase.auth.FacebookAuthProvider.credential(token)

      // Sign in with credential from the Facebook user.
      firebase.auth().signInWithCredential(credential).catch((error) => {
        // Handle Errors here.
      })
      
      registerForPushNotifications(token)
    }

    return token
  }

  logout() {
    firebase.auth().signOut()
  }
}


module.exports = new API()
