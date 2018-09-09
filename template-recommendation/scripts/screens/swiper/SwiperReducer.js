// future API call?
// const TEMPLATE_QUEUE = [
//   'https://static1.squarespace.com/static/images/58586839d2b8571d3768b82b?format=300w',
//   'https://static1.squarespace.com/static/images/57d1c07a46c3c47efa313359?format=300w',
//   'https://static1.squarespace.com/static/images/5750dfe2557725719ed8ede1?format=300w',
//   'https://static1.squarespace.com/static/images/58586b8b9f74569a3c040440?format=300w',
//   'https://static1.squarespace.com/static/images/5888d0df414fb544050808d2?format=300w',
//   'https://static1.squarespace.com/static/images/585870784402437df49a8302?format=300w'
// ]

const TEMPLATE_QUEUE_IFRAME = [
  'bedford-clone', 'avenue-clone',
].map(( url ) => `https://${ url }.squarespace.com` )

import {
  ON_SWIPE_RIGHT,
  ON_SWIPE_LEFT,
  SAVE_TEMPLATES,
  SAVE_ORDER,
  ON_ENTER
} from './SwiperActions'

const initialState = {
  currentTemplateIndex: 0,
  swipedRightTemplates: [],
  swipedLeftTemplates: [],
  templates: [],
  templateQueueIframe: TEMPLATE_QUEUE_IFRAME,
  templateOrderForSwiper: [],
}


export default ( state = initialState, action ) => {
  switch ( action.type ) {
    case ON_ENTER:
      return { ...initialState }

    case ON_SWIPE_RIGHT: {
      return {
        ...state,
        swipedRightTemplates: [ ...state.swipedRightTemplates, action.swipedTemplate ],
        currentTemplateIndex: state.currentTemplateIndex + 1,
      }
    }

    case ON_SWIPE_LEFT:
      return {
        ...state,
        swipedLeftTemplates: [ ...state.swipedLeftTemplates, action.swipedTemplate ],
        currentTemplateIndex: state.currentTemplateIndex + 1,
      }

    case SAVE_TEMPLATES:
      return {
        ...state,
        templates: state.templates.concat( action.templateResults ),
      }

    case SAVE_ORDER:
      return {
        ...state,
        templateOrderForSwiper: action.templateOrderForSwiper,
      }

    default:
      return state

  }
}

