import {
  SET_SCREEN_PROGRESS,
  SET_SCREEN_INDEX,
  direction
} from './actions'

// the names of these prototypes match the names of the properties within the "initialState" object
const projects = [
  'wizard',
  'contentswap',
]
const wizardPath = [
  'splash',
  'title',
  'vibes',
  'layouts',
  'recommendations',
]
const contentswapPath = [
  'splash',
  'categories',
  'features',
  'recommendations',
  'create',
]
const path = window.location.pathname.split( '/' )
const initialState = {
  currentPrototype: projects.includes( path[ 1 ]) ? path[ 1 ]  : 'wizard',
  wizard: {
    path: wizardPath,
    index: Math.max( 0, wizardPath.indexOf( path[ 2 ])),
    pathProgress: {
      vibes: 0,
      title: 0,
      layouts: 0,
    },
  },
  contentswap: {
    path: contentswapPath,
    index: Math.max( 0, contentswapPath.indexOf( path[ 2 ])),
    pathProgress: {},
  },
  direction: direction.FORWARD,
}

export default ( state = initialState, action ) => {
  switch ( action.type ) {

    case SET_SCREEN_PROGRESS:

      return {
        ...state,
        [ state.currentPrototype ]: {
          ...state[ state.currentPrototype ],
          pathProgress: {
            ...state[ state.currentPrototype ].pathProgress,
            [ action.screen ]: action.progress,
          },
        },
      }

    case SET_SCREEN_INDEX:

      return {
        ...state,
        [ state.currentPrototype ]: {
          ...state[ state.currentPrototype ],
          index: action.index,
        },
        direction: action.direction,
      }

    default:
      return state
  }
}