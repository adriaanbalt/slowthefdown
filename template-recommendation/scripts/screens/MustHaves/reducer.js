import {
  ON_SELECT_FEATURE,
  ON_DESELECT_FEATURE
} from './actions'

const initialState = {
  selectedFeatures: [

  ]
}

export default ( state = initialState, action ) => {
  switch ( action.type ) {
    case ON_SELECT_FEATURE:
      return {
        ...state,
        selectedFeatures: [ ...state.selectedFeatures, action.feature ]
      }

    case ON_DESELECT_FEATURE:
      return {
        ...state,
        selectedFeatures: state.selectedFeatures.filter(( feature ) => feature !== action.feature )
      }
    default:
      return state
  }
}