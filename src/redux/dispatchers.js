import Expo from 'expo'
import actions from './actions'
import axios from 'axios'
import store from './store'
import registerForPushNotifications from '../api/registerForPushNotifications'
import API from '../api'
const SECURE_STORE_FACEBOOK_TOKEN = "FACEBOOK_ACCESS_TOKEN"

export default dispatch => (() => {

  const fbAccessToken = () => store.getState().user.fbAccessToken

  // used to set values to the reducer
  const set = (path, value) => {
    return dispatch(actions.set(path, value))
  }

  const getHighscores = () => {
    // could also set something on the reducer
    return API.getHighscores()
  }

  const setHighscoreByUser = (user, score) => {
    // could also set something on the reducer
    return API.setHighscoreByUser(user, score)
  }

  const listenHighscoreByUser = (userId) => {
    API.listenHighscoreByUser( userId )
  }

  const logout = () => {
    Expo.SecureStore.deleteItemAsync(SECURE_STORE_FACEBOOK_TOKEN).then(() => {
      set('/user/fbAccessToken', null)
    })
    API.logout()
  }

  const setFacebookAccessToken = token => {
    return Expo.SecureStore.setItemAsync(SECURE_STORE_FACEBOOK_TOKEN, token).then(() => {
      set('/user/fbAccessToken', token)
    })
  }

  const login = async () => {
    const fbToken = API.loginWithFacebook()
    this.setFacebookAccessToken( token )
  }

  return {
    set,
    login,
    logout,
    getHighscores,
    setHighscoreByUser,
    listenHighscoreByUser,
  }
})




