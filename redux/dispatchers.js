import Expo from 'expo';
const actions = require('./actions');
import axios from 'axios';
import store from './store';
import registerForPushNotifications from '../api/registerForPushNotifications';
import BASE_URL from '../BASE_URL';
const FACEBOOK_APP_ID = "331867204038135";

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

  const logout = () => {
    // Expo.SecureStore.deleteItemAsync(SECURE_STORE_FACEBOOK_TOKEN).then(() => {
    //   set('/user/fbAccessToken', null);
    // });
  };

  const loadUser = () => {
    return Expo.Facebook.logInWithReadPermissionsAsync(FACEBOOK_APP_ID).then( res => {
      const {
        token
      } = res
      set('/user/fbAccessToken', token);
      console.log ( 'token', token )

      if (!token) {
        return;
      }

      let user = null;

      return Promise.all([
        newRequest(token).get('/user').catch(error => {
          if (error.response.status === 401) {
            logout();
          }

          throw error;
        }).then(({ data }) => {
          user = data;
          set('/user/profile', data);

          
          //return loadDates(data._id, token);
        }),
        newRequest(token).get('/phone-number').then(({ data }) => set('/user/phoneNumber', data.phoneNumber))
      ]).then(() => {

        registerForPushNotifications(token);

        return user;
      });
    });
  };

  const setFacebookAccessToken = token => {
    // return Expo.SecureStore.setItemAsync(SECURE_STORE_FACEBOOK_TOKEN, token).then(() => {
    //   set('/user/fbAccessToken', token);
    //   return loadUser();
    // });
  };

  const setProfileFields = (fields) => {
    for (let key in fields) {
      set(`/user/profile/${key}`, fields[key]);
    }

    return newRequest(fbAccessToken()).put('/user', fields).then(() => loadUser());
  };

  const startFacebookLogin = () => Expo.Facebook.logInWithReadPermissionsAsync('______', {
    permissions: ['public_profile', 'user_birthday'],
    behavior: Expo.Constants.appOwnership === 'standalone' ? 'browser' : 'web'
  }).then(({ type, token }) => {
    if (type === 'success') {
      return setFacebookAccessToken(token);
    }
    throw new Error('Could not login!');

  });

  return {
    set,
    loadUser,
    setFacebookAccessToken,
    setProfileFields,
    logout,
    startFacebookLogin
  };
});




