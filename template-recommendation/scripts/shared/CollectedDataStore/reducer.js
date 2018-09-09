import {
  COLLECT_USER_INPUT_DATA,
  COLLECT_TEMPLATE_DATA
} from './actions'

const initialState = {
  resultingTemplates: {},
  userInput: {},
}

export default ( state = initialState, action ) => {
  switch ( action.type ) {
    case COLLECT_USER_INPUT_DATA:
      return {
        ...state,
        userInput: {
          ...state.userInput,
          [ action.key ]: action.data,
        },
      }
    case COLLECT_TEMPLATE_DATA:
      return {
        ...state,
        resultingTemplates: {
          ...state.resultingTemplates,
          [ action.key ]: action.data,
        },
      }
    default:
      return state
  }
}
