import * as ActionTypes from '../ActionTypes';
import * as InitialState from '../InitialState';
import _ from 'lodash';

const rootReducer = (state = InitialState, action) => {
  switch (action.type) {
    case ActionTypes.INITIALIZE_APP :
      return Object.assign({},state,{
        user: action.user
      });


    case ActionTypes.LOG_IN :
      return Object.assign({},state,{
        user: action.user,
        projects: action.projects
      });

    case ActionTypes.LOG_OUT :
      return Object.assign({},state,{
        user: null,
        projects: []
      });

    case ActionTypes.EDIT_HIGHSCORE :
      // state is immutable, each change replaces an old object with a new one
      return Object.assign({},state,{
        project: Object.assign({}, state.project, action.obj)
      });

    case ActionTypes.ADD_HIGHSCORE :
      // state is immutable, each change replaces an old object with a new one
      return Object.assign({},state,{
        projects: [
          action.obj,
          ...state.projects
        ]
        ,
        project: Object.assign({}, action.obj) // clear form
      });

    case ActionTypes.UPDATE_HIGHSCORE :
      const updateProject = state.projects.slice(); // creating new array (removes pointer to old one)
      updateProject[action.index] = action.obj;
      // state is immutable, each change replaces an old object with a new one
      return Object.assign({},state,{
        projects: updateProject,
        project: Object.assign({}, state.project) // clear form
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
      console.log ('newT  ', state.animation );
      return newT;

    default:
      return state;
  }
};

export default rootReducer;
