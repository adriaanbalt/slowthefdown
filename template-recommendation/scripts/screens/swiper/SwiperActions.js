import { getRecommendationsByCustomerExamples, getTemplates } from '../../shared/api'
import { push } from 'react-router-redux'

import {
  nextPage,
  setScreenProgress
} from '../../shared/Queue/actions'
import { collectTemplateData, collectUserInputData } from '../../shared/CollectedDataStore/actions'

const HANDPICKED_SWIPER_ORDER = [ 'foundry-demo', 'harris-demo', 'bedford-demo', 'om-demo', 'juke-demo', 'blend-demo', 'pedro-demo', 'gravity-demo', 'sonora-demo', 'heights-demo', 'flores-demo', 'margot-demo', 'tremont-demo', 'henson-demo', 'foster-demo' ]

export const SAVE_TEMPLATES = 'SAVE_TEMPLATES'
export const ON_SWIPE_RIGHT = 'ON_SWIPE_RIGHT'
export const ON_SWIPE_LEFT = 'ON_SWIPE_LEFT'
export const SAVE_ORDER = 'SAVE_ORDER'
export const ON_ENTER = 'ON_SWIPER_ENTER'
export const RIGHT_SWIPES_REQUIRED = 3

export const onSwipeRight = ( swipedTemplate ) => ( dispatch, getState ) => {

  const progress = ( getState().SwiperReducer.swipedRightTemplates.length + 1 ) / RIGHT_SWIPES_REQUIRED
  dispatch( setScreenProgress( 'layouts', progress ))

  dispatch({
    type: ON_SWIPE_RIGHT,
    swipedTemplate,
  })
}

export const onEnter = () => ( dispatch ) => {
  dispatch({
    type: ON_ENTER,
  })
  dispatch( setScreenProgress( 'layouts', 0 ))
}

export const nextScreen = () => ( dispatch ) => {
  dispatch( nextPage())
}

export const onSwipeLeft = ( swipedTemplate ) => {
  return {
    type: ON_SWIPE_LEFT,
    swipedTemplate,
  }
}

export const getTemplatesByTitle = () => async ( dispatch ) => {
  const BATCH_SIZE = 2
  const templateNames = HANDPICKED_SWIPER_ORDER
  dispatch({
    type: SAVE_ORDER,
    templateOrderForSwiper: templateNames,
  })

  const templateBatch = templateNames.slice( 0, BATCH_SIZE )
  const templateResults = await getTemplates( templateBatch )

  dispatch({
    type: SAVE_TEMPLATES,
    templateResults,
  })
}

export const fetchNextTemplate = ( index ) => async ( dispatch, getState ) => {
  const templateOrder = getState().SwiperReducer.templateOrderForSwiper
  const nextTemplate = templateOrder[ index + 1 ]
  const templateResults = await getTemplates([ nextTemplate ])
  dispatch({
    type: SAVE_TEMPLATES,
    templateResults,
  })
}


export const saveResults = () => async ( dispatch, getState ) => {
  const swipedTemplates = getState().SwiperReducer.swipedRightTemplates.map(( item ) => item.websiteIdentifier )
  dispatch( collectUserInputData( swipedTemplates, 'swipedTemplates' ))
  const similarTemplates = await getRecommendationsByCustomerExamples( swipedTemplates )
  dispatch( collectTemplateData( similarTemplates, 'recommendations' )) // set to RECOMMENDATIONS for algo 1 [refactor required to handle for algo 2]
}