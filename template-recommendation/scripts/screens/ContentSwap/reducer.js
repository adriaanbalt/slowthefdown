import {
  GO_TO_TEMPLATE,
  ACTIVATE_TEMPLATE
} from './actions'


const initialState = {
  templates: [
    {
      name: 'READY',
      iframe: 'https://adriaan-scholvinck-mrka.squarespace.com/',
    },
    {
      name: 'HYDE',
      iframe: 'https://adriaan-scholvinck-8lam.squarespace.com/',
    },
    {
      name: 'ROVER',
      iframe: 'https://adriaan-scholvinck-lg8a.squarespace.com/',
    },
  ],
  currentTemplateIndex: 1,
  activeTemplateIndex: null,
}

export default ( state = initialState, action ) => {
  switch ( action.type ) {

  	case GO_TO_TEMPLATE:
  		return {
  			...state,
        currentTemplateIndex: action.currentTemplateIndex,
  		}

    case ACTIVATE_TEMPLATE: {
      return {
        ...state,
        activeTemplateIndex: action.activeTemplateIndex,
      }
    }

    default:
      return state

  }
}

