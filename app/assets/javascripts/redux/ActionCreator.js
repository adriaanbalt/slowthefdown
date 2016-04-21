import * as ActionTypes from './ActionTypes';

export default {

  initializeUser({user: user, obj: obj}) {
    return {
      type: ActionTypes.INITIALIZE_APP,
      user,
      obj
    };
  },

  login({user: user, highScores: highScores}) {
    return {
      type: ActionTypes.LOG_IN,
      user,
      highScores
    };
  },

  logout() {
    return {
      type: ActionTypes.LOG_OUT
    };
  },

// HighScore

  editHighScore(obj) {
    return {
      type: ActionTypes.EDIT_HIGHSCORE,
      obj
    };
  },

  addHighScore(obj) {
    return {
      type: ActionTypes.ADD_HIGHSCORE,
      obj
    };
  },

  updateHighScore({index: index, obj: obj}) {
    return {
      type: ActionTypes.UPDATE_HIGHSCORE,
      index,
      obj
    };
  },

  deleteHighScore(_id) {
    return {
      type: ActionTypes.DELETE_HIGHSCORE,
      _id
    };
  },

  getHighScoreById(obj) {
    return {
      type: ActionTypes.GET_HIGHSCORE_BY_ID,
      obj
    };
  },
  
  getAllHighScores(obj) {
    return {
      type: ActionTypes.GET_ALL_HIGHSCORES,
        obj
    };
  }

};