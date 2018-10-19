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
    console.log( 'set', path, value )
    return dispatch(actions.set(path, value))
  }

  const initialize = () => {
    // Initialize Firebase
    if ( !store.getState().initialized ){
      firebase.initializeApp(FIREBASE_CONSTANTS);
      set('/initialized', true)
    }
    // firebase.auth().signOut()

    // // Listen for authentication state to change.
    firebase.auth().onAuthStateChanged(user => {
      console.log("user", user.uid);
      if (user != null) {
        // console.log("user", user);

        // set("/user", user);
        setupUserData( user ) 
        
        firebase.database().ref('users/' + user.uid).on('value', (snapshot) => {
          const hs = snapshot.val().highscore
          set("/user/highscore", hs );
        })
        // this.listenHighscoreByUser(firebase.auth().currentUser.highscore);
        // firebase.database().ref('users/' + user.uid).set({
          //   highscore: 1000
          // })
        }
        // Do other things
      });
  }
    
  const setupUserData = ( user ) => {
    set("/user/highscore", user.highscore);
    set("/user/email", user.email )
    set("/user/lastLoginAt", user.lastLoginAt )
    set("/user/phoneNumber",user.phoneNumber )
    set("/user/photoURL", user.photoURL )
  }

  const fbAccessToken = () => store.getState().user.fbAccessToken


  const getHighscores = () => {
    // could also set something on the reducer
    // return API.getHighscores()
    firebase
      .database()
      .ref("users")
      .on("value", snapshot => {
        const highscore = snapshot.val().highscore;
        console.log("New high score: " + highscore);
      });
  }

  const setHighscore = (score) => {
    const user = firebase.auth().currentUser;
    const highscore = store.getState().user.highscore;
    if (user != null && highscore < score) {
      firebase.database().ref('users/' + user.uid).set({
        highscore: score
      })
    }
  }

  const listenHighscoreByUser = (userId) => {
    API.listenHighscoreByUser( userId )
  }

  const logout = () => {
    Expo.SecureStore.deleteItemAsync(SECURE_STORE_FACEBOOK_TOKEN).then(() => {
      set('/user/fbAccessToken', null)
    })
    firebase.auth().signOut()
  }

  const setFacebookAccessToken = token => {
    return Expo.SecureStore.setItemAsync(SECURE_STORE_FACEBOOK_TOKEN, token).then(() => {
      set('/user/fbAccessToken', token)
    })
  }

  const getFacebookAccessToken = () => {
    return Expo.SecureStore.getItemAsync(SECURE_STORE_FACEBOOK_TOKEN)
  }

  const login = async () => {
    let accessToken = await getFacebookAccessToken();

    if ( !accessToken ) {
      const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(
        FACEBOOK_APP_ID,
        { permissions: ["public_profile"] }
      )
      accessToken = token
      setFacebookAccessToken( accessToken )
    }


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




