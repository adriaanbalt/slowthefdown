import Expo from 'expo'
const actions = require("./actions");
import axios from 'axios'
import store from './store'
import registerForPushNotifications from '../api/registerForPushNotifications'
import API from '../api'
import * as firebase from "firebase";
import FIREBASE_CONSTANTS from "../constants/firebase";
const FACEBOOK_APP_ID = "331867204038135";
const SECURE_STORE_FACEBOOK_TOKEN = "FACEBOOK_ACCESS_TOKEN"

export default dispatch => (() => {

  // used to set values to the reducer
  const set = (path, value) => {
    return dispatch(actions.set(path, value))
  }

  const initialize = () => {
    // Initialize Firebase
    if ( !store.getState().initialized ){
      firebase.initializeApp(FIREBASE_CONSTANTS);
      set('/initialized', true)
    }

    // // Listen for authentication state to change.
    firebase.auth().onAuthStateChanged(user => {
      if (user != null) {
        setupUserData( user ) 

        getHighscores()

        // get the current user's highscore
        firebase.database().ref('users/' + user.uid).on('value', (snapshot) => {
          const hs = snapshot.val() && snapshot.val().highscore
          set("/user/highscore", hs );
        })
      }
      // Do other things
    });
  }
    
  const setupUserData = ( user ) => {
    setUserToDb( user )
    set("/user/highscore", user.highscore);
    set("/user/email", user.email )
    set("/user/displayName", user.displayName)
    set("/user/lastLoginAt", Date.now() );
    set("/user/phoneNumber",user.phoneNumber )
    set("/user/photoURL", user.photoURL )
  }

  const fbAccessToken = () => store.getState().user.fbAccessToken

  const getHighscores = () => {
    // get all users' highscores
    var query = firebase.database().ref("users");
    query.once("value")
      .then((snapshot) => {
        let highscores = []
        snapshot.forEach((childSnapshot) => {
          highscores.push(childSnapshot.val());
        });
        set("/highscores", highscores);
      });
  }

  const setHighscore = (score) => {
    const user = firebase.auth().currentUser;
    const highscore = store.getState().user.highscore;
    if (user != null && highscore < score) {
      firebase
        .database()
        .ref("users/" + user.uid)
        .update({ 
          highscore: score
        });
    }
    getHighscores()
  }

  const setUserToDb = (user) => {
    firebase
      .database()
      .ref("users/" + user.uid)
      .update({
        displayName: user.displayName,
        lastLoginAt: Date.now(),
        email: user.email,
        photoURL: user.photoURL,
      });
  }

  const listenHighscoreByUser = (userId) => {
    API.listenHighscoreByUser( userId )
  }

  const setFacebookAccessToken = token => {
    console.log("setFacebookAccessToken", token);
    return Expo.SecureStore.setItemAsync(SECURE_STORE_FACEBOOK_TOKEN, token).then(() => {
      set('/user/fbAccessToken', token)
    })
  }
  const getFacebookAccessToken = () => {
    return Expo.SecureStore.getItemAsync(SECURE_STORE_FACEBOOK_TOKEN)
  }
  const logout = () => {
    Expo.SecureStore.deleteItemAsync(SECURE_STORE_FACEBOOK_TOKEN).then(() => {
      console.log( 'remove access token from state')
      set('/user/fbAccessToken', null)
    })
    firebase.auth().signOut()
  }
  const login = async () => {
    let accessToken = await getFacebookAccessToken();

    // if hadn't logged in already and the user's fb token isnt store in the app's secure store
    if ( !accessToken ) {
      // we must use facebook to login and get the access token
      const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(
        FACEBOOK_APP_ID,
        { permissions: ["public_profile"] }
      )
      accessToken = token
      setFacebookAccessToken( accessToken )
    }
    // if you are already a user and have automatically logged in, then we need to update the state to include your access token for authentication verification
    set("/user/fbAccessToken", accessToken);

    const credential = firebase.auth.FacebookAuthProvider.credential(accessToken);
    firebase.auth().signInAndRetrieveDataWithCredential(credential);
  }

  return {
    initialize,
    set,
    login,
    logout,
    getHighscores,
    setHighscore,
    listenHighscoreByUser,
  }
})




