import {
  DESELECT_IMAGE,
  SELECT_IMAGE
} from './categoriesActions'


const initialState = {
  selectedLabels: [],
}

export default ( state = initialState, action ) => {
  switch ( action.type ) {

    case SELECT_IMAGE:
      return {
        ...state,
        selectedLabels: [ ...state.selectedLabels, action.label ],
      }

    default:
      return state

  }
}