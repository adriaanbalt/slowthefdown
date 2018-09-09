import {
  ON_SELECT_TEMPLATE,
  SET_RECOMMENDATIONS,
  SET_SLIDE
} from './RecommendationsActions'


const initialState = {
  selectedTemplate: {},
  currentSlideIndex: 0,
  recommendations: [],
}

export default ( state = initialState, action ) => {
  switch ( action.type ) {
    case ON_SELECT_TEMPLATE:
      return {
        ...state,
        selectedTemplate: action.template,
      }

    case SET_RECOMMENDATIONS:
      return {
        ...state,
        recommendations: action.recommendations,
      }

    case SET_SLIDE: {
      return {
        ...state,
        currentSlideIndex: action.currentSlideIndex,
      }
    }

    default:
      return state
  }
}

