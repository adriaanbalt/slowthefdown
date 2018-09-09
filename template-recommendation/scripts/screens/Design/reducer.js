import {
  ON_CHANGE
} from './actions'

const initialState = {
}

export default ( state = initialState, action ) => {
  switch ( action.type ) {
    case ON_CHANGE:
      return {
        ...state,
        ...action, // yes, the TYPE prop will also transfer but I kinda like this approach cuz it's so simple.  ideally we strip out the TYPE property
      }
    default:
      return state
  }
}

