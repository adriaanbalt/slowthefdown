import Expo from "expo"
const actions = require("./actions")
import axios from "axios"
import store from "./store"
import registerForPushNotifications from "../api/registerForPushNotifications"
import API from "../api"
import * as firebase from "firebase"
import FIREBASE_CONSTANTS from "../constants/firebase"
const FACEBOOK_APP_ID = "331867204038135";
const SECURE_STORE_FACEBOOK_TOKEN = "FACEBOOK_ACCESS_TOKEN"
const SECURE_STORE_FIRST_TIME = "FIRST_TIME"
const SECURE_STORE_HIGHSCORE = "SECURE_STORE_HIGHSCORE"

export default dispatch => (() => {

  // used to set values to the reducer
  const set = (path, value) => {
    return dispatch(actions.set(path, value))
  }

  const initialize = () => {
    // Initialize Firebase
    if ( !store.getState().initialized ){
      firebase.initializeApp(FIREBASE_CONSTANTS)
      set("/initialized", true)
    }

    // load as existing or new user
      // check if secure store has info?
      // check if server has info?
    const firstTimeSecureStore = getUserFirstTimeSecureStore()
    // whatever the value of first time, set it to the reducer state for internal tracking
    console.log("firstTimeSecureStore", firstTimeSecureStore);
    set("/user/firstime", firstTimeSecureStore);

    // check auth login state changes
    firebase.auth().onAuthStateChanged(async user => {
      if (user != null) {
        // since user exists, store user data in the reducer
        console.log('user auth changed', user )
        setUserDataLocal( user ) 
        
        // check if this is the user's first time in the App
        // getUserFirstTimeSecureStore()
        
        // get the user's local highscore to compare to the server highscore, take whatever is higher
        // server is what other users will see but secure store lets users play offline and keep their highscore...
        // if they play offline they will compete against themselves, but when they go online and they play their new highscore will in fact be updated online
        // TODO: add this updating online/offline to the ABOUT page
        const userHsFromSecureStore = await getSecureStoreHighScore()
        
        // get the current user"s highscore
        firebase.database().ref("users/" + user.uid).on("value", (snapshot) => {
          let hs = snapshot.val() && snapshot.val().highscore
          if ( hs < userHsFromSecureStore) {
            // if server highscore is less than local highscore, take choose the local highscore
            hs = userHsFromSecureStore;
            // since server is not as high as local secure store, also update the server
            const user = firebase.auth().currentUser;
            firebase
              .database()
              .ref("users/" + user.uid)
              .update({
                highscore: hs
              })
          }
          set("/user/highscore", hs )
        })
      }
      // Do other things
    })

    getHighscores()
  }
    
  const setUserDataLocal = ( user ) => {
    setUserToDb( user )
    set("/user/highscore", user.highscore)
    set("/user/email", user.email )
    set("/user/displayName", user.displayName )
    set("/user/lastLoginAt", Date.now() )
    set("/user/phoneNumber", user.phoneNumber )
    set("/user/photoURL", user.photoURL )
  }

  const clearUserDataLocal = () => {
    set("/user/highscore", null )
    set("/user/email", null )
    set("/user/displayName", null )
    set("/user/lastLoginAt", null )
    set("/user/phoneNumber", null )
    set("/user/photoURL", null )
  }

  const fbAccessToken = () => store.getState().user.fbAccessToken

  const getUserFirstTimeSecureStore = () => {
    return Expo.SecureStore.getItemAsync(SECURE_STORE_FIRST_TIME)
  }

  const setUserFirstTime = async ( bool ) => {
    let firstTime = await getUserFirstTime()
    if ( firstTime || firstTime == undefined ) {
      set("/user/firstime", bool)
      console.log( 'set user first time', firstTime)
      return Expo.SecureStore.setItemAsync(SECURE_STORE_FIRST_TIME, bool );
    }
  }

  const getHighscores = () => {
    // a promise is used here to create a loader
    return new Promise( (resolve, reject) => {
      // get all users" highscores
      var query = firebase.database().ref("users")
      query.once("value")
        .then((snapshot) => {
          let highscores = []
          snapshot.forEach((childSnapshot) => {
            highscores.push(childSnapshot.val())
          })
          set("/highscores", highscores)
          resolve( highscores )
        })
    })
  }

  const getSecureStoreHighScore = () => {
    return Expo.SecureStore.getItemAsync(SECURE_STORE_HIGHSCORE).then( res => {
      return res
    })
  }

  const setUserAttributeDb = ( obj ) => {
    const user = firebase.auth().currentUser;
    firebase
      .database()
      .ref("users/" + user.uid)
      .update(obj);
  }

  const setUserHighscore = (score) => {
    setUserAttributeDb({
      highscore: score
    })
    set("/user/highscore", score)
    console.log( 'set user highscore' )
    Expo.SecureStore.setItemAsync(SECURE_STORE_HIGHSCORE, JSON.stringify(score))
  }

  const setHighscore = async (score) => {
    const user = firebase.auth().currentUser
    let highscore = await getSecureStoreHighScore()
    highscore = highscore || store.getState().user.highscore
    // if the user is defined
    // if the user"s highscore has never been set (aka is equal to undefined), then it should be set to the score
    // if the user"s highscore is less than the score sent, then it shoudl be set to the score
    if (user != null && (highscore === undefined || highscore < score)) {
      setUserHighscore( score )
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
      })
  }

  const listenHighscoreByUser = (userId) => {
    API.listenHighscoreByUser( userId )
  }

  const setFacebookAccessToken = token => {
    console.log("setFacebookAccessToken", token);
    if ( token ) {
      console.log( 'here?')
      return Expo.SecureStore.setItemAsync(SECURE_STORE_FACEBOOK_TOKEN, token).then(() => {
        set("/user/fbAccessToken", token)
      })
    }
  }
  const getFacebookAccessToken = () => {
    return Expo.SecureStore.getItemAsync(SECURE_STORE_FACEBOOK_TOKEN)
  }
  const deleteUserAccount = () => {
    const user = firebase.auth().currentUser
    if ( user != null ) {
      user
        .delete()
        .then( (e) => {
          set("/user", null)
        })
        .catch( (error) => {
          // An error happened.
          console.log( "error deleting user" )
        })
    }
  }
  const logout = () => {
    Expo.SecureStore.deleteItemAsync(SECURE_STORE_FACEBOOK_TOKEN).then(() => {
      clearUserDataLocal()
    })
    firebase.auth().signOut()
  }
  const login = async () => {
    let accessToken = await getFacebookAccessToken()
    console.log("login", accessToken);

    // if hadn"t logged in already and the user"s fb token isnt store in the app"s secure store
    if ( !accessToken ) {
      // we must use facebook to login and get the access token
      const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(
        FACEBOOK_APP_ID,
        { permissions: ["public_profile"] }
      )
      accessToken = token
      setFacebookAccessToken( accessToken )
      // setUserFirstTime( false )
    }
    else {
      // if you are already a user and have automatically logged in, then we need to update the state to include your access token for authentication verification
      set("/user/fbAccessToken", accessToken)
    }
    
    const credential = firebase.auth.FacebookAuthProvider.credential(accessToken)
    firebase.auth().signInAndRetrieveDataWithCredential(credential)
  }
  const checkUserAccessToken = async () => {
    let accessToken = await getFacebookAccessToken()
    console.log("checkUserAccessToken", accessToken);
    if ( accessToken ) {
      set("/user/fbAccessToken", accessToken)
    }
  }

  return {
    initialize,
    set,
    login,
    logout,
    deleteUserAccount,
    checkUserAccessToken,
    getHighscores,
    setHighscore,
    listenHighscoreByUser,
  }
})




