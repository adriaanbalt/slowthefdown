import Expo from 'expo';
const actions = require('./actions');
import axios from 'axios';
import store from './store';
import registerForPushNotifications from '../api/registerForPushNotifications';
import BASE_URL from '../BASE_URL';
const FACEBOOK_APP_ID = "331867204038135";
const SECURE_STORE_FACEBOOK_TOKEN = "FACEBOOK_ACCESS_TOKEN";

export default dispatch => (() => {

  const fbAccessToken = () => store.getState().user.fbAccessToken;

  const newRequest = fbAccessToken => axios.create({
    baseURL: BASE_URL + '/api',
    headers: fbAccessToken ? {
      'Authorization': `Bearer ${fbAccessToken}`
    } : {}
  });

  const set = (path, value) => {
    return dispatch(actions.set(path, value));
  };

  const getHighscores = () => {
    // https://firebase.google.com/docs/reference/js/firebase.database.DataSnapshot#forEach
    var query = firebase.database().ref("users").orderByKey();
    const highscores = query.once("value")
      .then(function (snapshot) {
        return snapshot
      });
    
    console.log('getHighscores', highscores)
    return highscores;
  };


  const setHighscoreByUser = (user, score) => {
    if (user != null) {
      firebase.database().ref('users/' + user.uid).set({
        highscore: score
      });
    }
  }

  const listenHighscoreByUser = (userId) => {
    firebase.database().ref('users/' + userId).on('value', (snapshot) => {
      const highscore = snapshot.val().highscore;
      console.log("New high score: " + highscore);
    });
  }


  const logout = () => {
    Expo.SecureStore.deleteItemAsync(SECURE_STORE_FACEBOOK_TOKEN).then(() => {
      set('/user/fbAccessToken', null);
    });
    firebase.auth().signOut();
  };

  const setFacebookAccessToken = token => {
    return Expo.SecureStore.setItemAsync(SECURE_STORE_FACEBOOK_TOKEN, token).then(() => {
      set('/user/fbAccessToken', token);
    });
  };

  const login = async () => {
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(
      FACEBOOK_APP_ID,
      { permissions: ["public_profile"] }
    );

    console.log("startFacebookLogin token", type, token);

    if (type === 'success') {
      // store the token in redux reducer
      setFacebookAccessToken( token )

      // Build Firebase credential with the Facebook access token.
      const credential = firebase.auth.FacebookAuthProvider.credential(token);
      console.log( "firebase login to facebook ", credential)
      // Sign in with credential from the Facebook user.
      firebase.auth().signInWithCredential(credential).catch((error) => {
        // Handle Errors here.
      });
      
      registerForPushNotifications(token);
    }
  }

  return {
    set,
    setFacebookAccessToken,
    logout,
    startFacebookLogin,
    getHighscores,
  };
});




