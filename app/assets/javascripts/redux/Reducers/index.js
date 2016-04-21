import * as ActionTypes from '../ActionTypes';
import * as InitialState from '../InitialState';

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

    case ActionTypes.EDIT_PROJECT :
      // state is immutable, each change replaces an old object with a new one
      return Object.assign({},state,{
        project: Object.assign({}, state.project, action.obj)
      });

    case ActionTypes.ADD_PROJECT :
      // state is immutable, each change replaces an old object with a new one
      return Object.assign({},state,{
        projects: [
          action.obj,
          ...state.projects
        ]
        ,
        project: Object.assign({}, action.obj) // clear form
      });

    case ActionTypes.UPDATE_PROJECT :
      const updateProject = state.projects.slice(); // creating new array (removes pointer to old one)
      updateProject[action.index] = action.obj;
      // state is immutable, each change replaces an old object with a new one
      return Object.assign({},state,{
        projects: updateProject,
        project: Object.assign({}, state.project) // clear form
      });

    case ActionTypes.DELETE_PROJECT :
      return Object.assign({},state,{
        projects: state.projects.filter(obj => obj._id !== action._id),
      });

    case ActionTypes.GET_PROJECT_BY_ID :
      state.projects.push( action.obj ); // add element to existing state if it doesn't exist already
      return Object.assign({},state,{
        projects: state.projects
      });

    case ActionTypes.GET_ALL_PROJECTS :
      return Object.assign({},state,{
        projects: action.obj
      });

    default:
      return state;
  }
};

export default rootReducer;
