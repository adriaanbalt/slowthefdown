export const INITIALIZE_APP = 'INITIALIZE_APP'
export const LOG_IN = 'LOG_IN'
export const LOG_OUT = 'LOG_OUT'

// HIGHSCORE
export const EDIT_HIGHSCORE = 'EDIT_HIGHSCORE'
export const SET_HIGHSCORE = 'SET_HIGHSCORE'
export const SET_USER_HIGHSCORE = 'SET_USER_HIGHSCORE'
export const SET_SCORE = 'SET_SCORE'
export const UPDATE_HIGHSCORE = 'UPDATE_HIGHSCORE'
export const DELETE_HIGHSCORE = 'DELETE_HIGHSCORE'
export const GET_ALL_HIGHSCORES = 'GET_ALL_HIGHSCORES'
export const GET_HIGHSCORE_BY_ID = 'GET_HIGHSCORE_BY_ID'

export const UPDATE_ANIMATION = 'UPDATE_ANIMATION'
export const TOGGLE_DRAWER = 'TOGGLE_DRAWER'
export const TOGGLE_INSTRUCTIONS = 'TOGGLE_INSTRUCTIONS'
export const CLOSE_INSTRUCTIONS = 'CLOSE_INSTRUCTIONS'

export const HIDE_DRAWER = 'HIDE_DRAWER'

const initialState = {
  user: null,
  isMobile: false,
  isiPhone4orLG3: /iPhone/i.test(navigator.userAgent)  && (window.devicePixelRatio || 1) == 2 || /LG-D855|LG-D852|LG-D851|LG-D850|VS985 4G|LGLS990|LGUS990/i.test(navigator.userAgent)  && (window.devicePixelRatio || 1) == 3,
  currentLocale: window.navigator && window.navigator.language || 'en', // default to language detected by browser
  acceptedLocales: window.navigator && window.navigator.languages || [], // default to languages list detected by browser
  highscore: {
    score: 0
  },
  score: 0,
  highscores: [],
  drawerOpen: true,
  instructionsOpen: true,
  drawerPeak: false,
  animation: {
    callback: null,
    x: 0,
    y: 0,
    rotation: 0,
    speed: 1
  }
}

export default (state = initialState, action) => {
  switch (action.type) {

    case INITIALIZE_APP :
      return Object.assign({},state,{
        user: action.user,
        highscore: action.user.highscore ? action.user.highscore : { score:0 }
      })


    case LOG_IN :
      return Object.assign({},state,{
        user: action.user,
        highscore: action.user.highscore
      })

    case LOG_OUT :
      return Object.assign({},state,{
        user: null,
        highscore: { score: 0 }
      })

    case HIDE_DRAWER :
      // state is immutable, each change replaces an old object with a new one
      return Object.assign({},state,{
        drawerOpen: false,
        drawerPeak: false
      })

    case TOGGLE_INSTRUCTIONS :
      // state is immutable, each change replaces an old object with a new one
      return Object.assign({},state,{
        instructionsOpen: !state.instructionsOpen
      })

    case CLOSE_INSTRUCTIONS :
      // state is immutable, each change replaces an old object with a new one
      return Object.assign({},state,{
        instructionsOpen: false
      })

    case TOGGLE_DRAWER :
      // state is immutable, each change replaces an old object with a new one
      return Object.assign({},state,{
        drawerOpen: !state.drawerOpen
      })

    case EDIT_HIGHSCORE :
      // state is immutable, each change replaces an old object with a new one
      return Object.assign({},state,{
        project: Object.assign({}, state.project, action.obj)
      })

    case SET_SCORE :
      // state is immutable, each change replaces an old object with a new one
      return Object.assign({},state,{
        score: action.obj
      })

    case SET_HIGHSCORE :
      // state is immutable, each change replaces an old object with a new one
      return Object.assign({},state,{
        highscore: action.obj
      })

    case SET_USER_HIGHSCORE :
      // state is immutable, each change replaces an old object with a new one
      return Object.assign({},state,{
        highscore: action.obj.highscore,
        user: action.obj
      })

    case UPDATE_HIGHSCORE :
      // state is immutable, each change replaces an old object with a new one
      return Object.assign({},state,{
        highscore: action.obj
      })

    case DELETE_HIGHSCORE :
      return Object.assign({},state,{
        projects: state.projects.filter(obj => obj._id !== action._id),
      })

    case GET_HIGHSCORE_BY_ID :
      state.projects.push( action.obj ) // add element to existing state if it doesn't exist already
      return Object.assign({},state,{
        projects: state.projects
      })

    case GET_ALL_HIGHSCORES :
      return Object.assign({},state,{
        projects: action.obj
      })

    case UPDATE_ANIMATION :
      let newT = Object.assign({}, state, _.merge(state.animation, action.obj) )
      return newT

    default:
      return state
  }
}


export const initializeUser = ({user: user, obj: obj}) => {
    return (dispatch, getState) => dispatch( {
      type: INITIALIZE_APP,
      user,
      obj
    })
  }

export const login = ({user: user, highScores: highScores}) => {
    return (dispatch, getState) => dispatch( {
      type: LOG_IN,
      user,
      highScores
    })
  }

export const logout = () => {
    return (dispatch, getState) => dispatch( {
      type: LOG_OUT
    })
  }

export const toggleInstructions = (obj) => {
    return (dispatch, getState) => dispatch( {
      type: TOGGLE_INSTRUCTIONS,
      obj
    })
  }

export const closeInstructions = (obj) => {
    return (dispatch, getState) => dispatch( {
      type: CLOSE_INSTRUCTIONS,
      obj
    })
  }

export const toggleDrawer = (obj) => {
    return (dispatch, getState) => dispatch( {
      type: TOGGLE_DRAWER,
      obj
    })
  }

export const hideDrawer = (obj) => {
    return (dispatch, getState) => dispatch( {
      type: HIDE_DRAWER,
      obj
    })
  }

// HighScore

export const editHighScore = (obj) => {
    return (dispatch, getState) => dispatch( {
      type: EDIT_HIGHSCORE,
      obj
    })
  }

export const setScore = (obj) => {
    return (dispatch, getState) => dispatch( {
      type: SET_SCORE,
      obj
    })
  }

export const setHighscore = (obj) => {
    return (dispatch, getState) => dispatch( {
      type: SET_HIGHSCORE,
      obj
    })
  }

export const setUserHighscore = (obj) => {
    return (dispatch, getState) => dispatch( {
      type: SET_USER_HIGHSCORE,
      obj
    })
  }

export const updateHighScore = ({index: index, obj: obj}) => {
    return (dispatch, getState) => dispatch( {
      type: UPDATE_HIGHSCORE,
      index,
      obj
    })
  }

export const deleteHighScore = (_id) => {
    return (dispatch, getState) => dispatch( {
      type: DELETE_HIGHSCORE,
      _id
    })
  }

export const getHighScoreById = (obj) => {
    return (dispatch, getState) => dispatch( {
      type: GET_HIGHSCORE_BY_ID,
      obj
    })
  }
  
export const getAllHighScores = (obj) => {
    return (dispatch, getState) => dispatch( {
      type: GET_ALL_HIGHSCORES,
        obj
    })
  }
  
export const updateAnimation = (obj) => {
    return (dispatch, getState) => dispatch( {
      type: UPDATE_ANIMATION,
        obj
    })
  }