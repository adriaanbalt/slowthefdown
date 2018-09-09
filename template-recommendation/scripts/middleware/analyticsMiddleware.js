/* analytics uses snake_case */
/* eslint camelcase: 0 */
import analytics from '../lib/analytics'
import getCurrentScreen from '../selectors/getCurrentScreen'
import getCurrentUserSelection from '../selectors/getCurrentUserSelection'
import {
  SELECT_FONT
} from '../screens/site-title/SiteTitleActions'
import {
  direction,
  SET_SCREEN_INDEX
} from '../shared/Queue/actions'
import {
  SELECT_IMAGE
} from '../screens/vibes/VibesActions'
import {
  ON_SWIPE_LEFT,
  ON_SWIPE_RIGHT
} from '../screens/swiper/SwiperActions'
import {
  CLICK_GET_STARTED,
  SHOW_RECOMMENDATIONS,
  SET_SLIDE
} from '../screens/recommendations/RecommendationsActions'
import {
  TRACK_LINK_CLICK_PREVIEW
} from '../shared/TrackableLink/LinkActions'

export const VIEW_EVENT = 'template_recommender_view'
export const CLICK_EVENT = 'template_recommender_click'
export const LOAD_EVENT = 'template_recommender_load'
export const VIEW_ACTION = 'view'
export const CLICK_ACTION = 'click'
export const LOAD_ACTION = 'load'

export const trackRecommender = ( eventName, data ) => {
  return analytics.trackInternal( eventName, Object.assign({
    actor: 'user',
    area: 'template_recommender',
  }, data ))
}


// should this entire thing be in a try/catch so nothing breaks the app?
export default store => next => action => {
  const state = store.getState()
  const page = getCurrentScreen( state )

  // log every router change event
  if ( action.type === '@@router/LOCATION_CHANGE' ) {
    trackRecommender( VIEW_EVENT, {
      action: VIEW_ACTION,
      page,
      section: `${ page }-screen`,
    })
  }

  if ( action.type === SELECT_FONT ) {
    trackRecommender( CLICK_EVENT, {
      action: CLICK_ACTION,
      direct_object_type: 'button',
      direct_object_display_name: action.name,
      direct_object_identifier: `select-${ action.name }-style`,
      page,
      section: 'style-selector',
    })
  }

  if ( action.type === SELECT_IMAGE ) {
    trackRecommender( CLICK_EVENT, {
      action: CLICK_ACTION,
      direct_object_type: 'image-grid',
      direct_object_identifier: 'select-image-grid',
      page,
      section: 'image-grid',
    })
  }

  if ( action.type === SET_SCREEN_INDEX ) {
    const isNext = action.direction === direction.FORWARD

    trackRecommender( CLICK_EVENT, {
      action: CLICK_ACTION,
      direct_object_type: 'button',
      direct_object_display_name: action.direction,
      direct_object_identifier: `submit-${ page }-${ action.direction }-button`,
      page,
      section: 'nav',
      template_recommender_selection: isNext ? getCurrentUserSelection( state ) : null,
    })
  }

  if ( action.type === ON_SWIPE_RIGHT ) {
    trackRecommender( CLICK_EVENT, {
      action: CLICK_ACTION,
      direct_object_display_name: action.swipedTemplate.displayName,
      direct_object_id: action.swipedTemplate.websiteId,
      direct_object_identifier: 'right-swipe-template-layout',
      direct_object_type: 'layout',
      page,
      section: 'swiper',
    })
  }

  if ( action.type === ON_SWIPE_LEFT ) {
    trackRecommender( CLICK_EVENT, {
      action: CLICK_ACTION,
      direct_object_display_name: action.swipedTemplate.displayName,
      direct_object_id: action.swipedTemplate.websiteId,
      direct_object_identifier: 'left-swipe-template-layout',
      direct_object_type: 'layout',
      page,
      section: 'swiper',
    })
  }

  if ( action.type === SHOW_RECOMMENDATIONS ) {
    trackRecommender( LOAD_EVENT, {
      action: LOAD_ACTION,
      page,
    })
  }

  if ( action.type === SET_SLIDE ) {
    trackRecommender( CLICK_EVENT, {
      action: CLICK_ACTION,
      direct_object_display_name: action.template.displayName,
      // this is missing websiteId as the template data is stripped down
      direct_object_id: action.template.websiteId,
      direct_object_identifier: `see-${ action.direction }-template-recommendation`,
      direct_object_type: 'carousel',
      page,
      section: 'carousel',
    })
  }

  if ( action.type === TRACK_LINK_CLICK_PREVIEW ) {
    const {
      label,
      websiteId,
    } = action.eventData

    trackRecommender( CLICK_EVENT, {
      action: CLICK_ACTION,
      page,
      section: 'buttons',
      direct_object_type: 'button',
      direct_object_display_name: label,
      direct_object_id: websiteId,
      direct_object_identifier: 'preview-template-button',
    })
  }

  if ( action.type === CLICK_GET_STARTED ) {
    const { template } = action
    trackRecommender( CLICK_EVENT, {
      action: CLICK_ACTION,
      page,
      section: 'buttons',
      direct_object_type: 'button',
      direct_object_display_name: `Start With ${ template.displayName }`,
      direct_object_identifier: 'start-with-template-button',
      direct_object_id: template.websiteId,
    })
  }

  return next( action )
}