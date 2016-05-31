import * as ActionTypes from '../ActionTypes';
import InitialState from '../InitialState';
import _ from 'lodash';

const rootReducer = (state = InitialState, action) => {
  switch (action.type) {
    case ActionTypes.INITIALIZE_APP :
      return Object.assign({},state,{
        user: action.user,
        highscore: action.user.highscore ? action.user.highscore : { score:0 }
      });


    case ActionTypes.LOG_IN :
      return Object.assign({},state,{
        user: action.user,
        highscore: action.user.highscore
      });

    case ActionTypes.LOG_OUT :
      return Object.assign({},state,{
        user: null,
        highscore: { score: 0 }
      });

    case ActionTypes.HIDE_DRAWER :
      // state is immutable, each change replaces an old object with a new one
      return Object.assign({},state,{
        drawerOpen: false,
        drawerPeak: false
      });

    case ActionTypes.TOGGLE_INSTRUCTIONS :
      // state is immutable, each change replaces an old object with a new one
      return Object.assign({},state,{
        instructionsOpen: !state.instructionsOpen
      });

    case ActionTypes.TOGGLE_DRAWER :
      // state is immutable, each change replaces an old object with a new one
      return Object.assign({},state,{
        drawerOpen: !state.drawerOpen
      });

    case ActionTypes.EDIT_HIGHSCORE :
      // state is immutable, each change replaces an old object with a new one
      return Object.assign({},state,{
        project: Object.assign({}, state.project, action.obj)
      });

    case ActionTypes.SET_SCORE :
      // state is immutable, each change replaces an old object with a new one
      return Object.assign({},state,{
        score: action.obj
      });

    case ActionTypes.SET_HIGHSCORE :
      // state is immutable, each change replaces an old object with a new one
      return Object.assign({},state,{
        highscore: action.obj,
        drawerPeak: true
      });

    case ActionTypes.SET_USER_HIGHSCORE :
      // state is immutable, each change replaces an old object with a new one
      return Object.assign({},state,{
        highscore: action.obj.highscore,
        user: action.obj,
        drawerPeak: true
      });

    case ActionTypes.UPDATE_HIGHSCORE :
      // state is immutable, each change replaces an old object with a new one
      return Object.assign({},state,{
        highscore: action.obj
      });

    case ActionTypes.DELETE_HIGHSCORE :
      return Object.assign({},state,{
        projects: state.projects.filter(obj => obj._id !== action._id),
      });

    case ActionTypes.GET_HIGHSCORE_BY_ID :
      state.projects.push( action.obj ); // add element to existing state if it doesn't exist already
      return Object.assign({},state,{
        projects: state.projects
      });

    case ActionTypes.GET_ALL_HIGHSCORES :
      return Object.assign({},state,{
        projects: action.obj
      });

    case ActionTypes.UPDATE_ANIMATION :
      let newT = Object.assign({}, state, _.merge(state.animation, action.obj) );
      return newT;

    default:
      return state;
  }
};

export default rootReducer;
