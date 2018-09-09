/* analytics uses snake_case */
/* eslint camelcase: 0 */
import configureMockStore from 'redux-mock-store'
import analytics from '../lib/analytics'
import analyticsMiddleware, {
  VIEW_EVENT,
  CLICK_EVENT,
  LOAD_EVENT,
  VIEW_ACTION,
  CLICK_ACTION,
  LOAD_ACTION
} from './analyticsMiddleware'
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
import getCurrentScreen from '../selectors/getCurrentScreen'
import getCurrentUserSelection from '../selectors/getCurrentUserSelection'

// mock analytics.trackInternal so we can test against its arguments
jest.mock( '../lib/analytics', () => ({
  trackInternal: jest.fn(),
}))

// mock selectors
jest.mock( '../selectors/getCurrentScreen' )
jest.mock( '../selectors/getCurrentUserSelection' )

// create a mock store that uses analyticsMiddleware
const mockStore = configureMockStore([ analyticsMiddleware ])
const store = mockStore()

// this data is added to every recommendation analytics event
const recommendationTrackingData = {
  actor: 'user',
  area: 'template_recommender',
}

// clear mock calls after each test
afterEach(() => analytics.trackInternal.mockClear())

test( 'Analytics can track router LOCATION_CHANGE action', () => {
  getCurrentScreen.mockImplementation(() => 'title' )

  const trackingData = Object.assign({
    action: VIEW_ACTION,
    page: 'title',
    section: 'title-screen',
  }, recommendationTrackingData )

  store.dispatch({ type: '@@router/LOCATION_CHANGE' })

  expect( analytics.trackInternal ).toHaveBeenCalledTimes( 1 )
  expect( analytics.trackInternal ).toHaveBeenCalledWith( VIEW_EVENT, trackingData )
})

test( 'Analytics can track SELECT_FONT action', () => {
  getCurrentScreen.mockImplementation(() => 'title' )

  const trackingData = Object.assign({
    action: CLICK_ACTION,
    direct_object_type: 'button',
    direct_object_display_name: 'modern',
    direct_object_identifier: 'select-modern-style',
    page: 'title',
    section: 'style-selector',
  }, recommendationTrackingData )

  store.dispatch({ type: SELECT_FONT, name: 'modern' })

  expect( analytics.trackInternal ).toHaveBeenCalledTimes( 1 )
  expect( analytics.trackInternal ).toHaveBeenCalledWith( CLICK_EVENT, trackingData )
})

test( 'Analytics can track SELECT_IMAGE action', () => {
  getCurrentScreen.mockImplementation(() => 'images' )

  const trackingData = Object.assign({
    action: CLICK_ACTION,
    direct_object_type: 'image-grid',
    direct_object_identifier: 'select-image-grid',
    page: 'images',
    section: 'image-grid',
  }, recommendationTrackingData )

  store.dispatch({ type: SELECT_IMAGE })

  expect( analytics.trackInternal ).toHaveBeenCalledTimes( 1 )
  expect( analytics.trackInternal ).toHaveBeenCalledWith( CLICK_EVENT, trackingData )
})

test( 'Analytics can track SET_SCREEN_INDEX action', () => {
  getCurrentScreen.mockImplementation(() => 'images' )
  getCurrentUserSelection.mockImplementation(() => 0 )

  const trackingData = Object.assign({
    action: CLICK_ACTION,
    direct_object_type: 'button',
    direct_object_display_name: direction.FORWARD,
    direct_object_identifier: `submit-images-${ direction.FORWARD }-button`,
    page: 'images',
    section: 'nav',
    template_recommender_selection: 0,
  }, recommendationTrackingData )

  store.dispatch({ type: SET_SCREEN_INDEX, direction: direction.FORWARD })

  expect( analytics.trackInternal ).toHaveBeenCalledTimes( 1 )
  expect( analytics.trackInternal ).toHaveBeenCalledWith( CLICK_EVENT, trackingData )
})

test( 'Analytics can track ON_SWIPE_RIGHT action', () => {
  getCurrentScreen.mockImplementation(() => 'layouts' )

  const template = {
    displayName: 'Bedford',
    websiteId: 123,
  }

  const trackingData = Object.assign({
    action: CLICK_ACTION,
    direct_object_display_name: template.displayName,
    direct_object_id: template.websiteId,
    direct_object_identifier: 'right-swipe-template-layout',
    direct_object_type: 'layout',
    page: 'layouts',
    section: 'swiper',
  }, recommendationTrackingData )

  store.dispatch({ type: ON_SWIPE_RIGHT, swipedTemplate: template })

  expect( analytics.trackInternal ).toHaveBeenCalledTimes( 1 )
  expect( analytics.trackInternal ).toHaveBeenCalledWith( CLICK_EVENT, trackingData )
})

test( 'Analytics can track ON_SWIPE_LEFT action', () => {
  getCurrentScreen.mockImplementation(() => 'layouts' )

  const template = {
    displayName: 'Bedford',
    websiteId: 123,
  }

  const trackingData = Object.assign({
    action: CLICK_ACTION,
    direct_object_display_name: template.displayName,
    direct_object_id: template.websiteId,
    direct_object_identifier: 'left-swipe-template-layout',
    direct_object_type: 'layout',
    page: 'layouts',
    section: 'swiper',
  }, recommendationTrackingData )

  store.dispatch({ type: ON_SWIPE_LEFT, swipedTemplate: template })

  expect( analytics.trackInternal ).toHaveBeenCalledTimes( 1 )
  expect( analytics.trackInternal ).toHaveBeenCalledWith( CLICK_EVENT, trackingData )
})

test( 'Analytics can track SHOW_RECOMMENDATIONS action', () => {
  getCurrentScreen.mockImplementation(() => 'recommendations' )

  const trackingData = Object.assign({
    action: LOAD_ACTION,
    page: 'recommendations',
  }, recommendationTrackingData )

  store.dispatch({ type: SHOW_RECOMMENDATIONS })

  expect( analytics.trackInternal ).toHaveBeenCalledTimes( 1 )
  expect( analytics.trackInternal ).toHaveBeenCalledWith( LOAD_EVENT, trackingData )
})

test( 'Analytics can track SET_SLIDE action', () => {
  getCurrentScreen.mockImplementation(() => 'recommendations' )

  const template = {
    displayName: 'Bedford',
    websiteId: 123,
  }

  const trackingData = Object.assign({
    action: CLICK_ACTION,
    direct_object_display_name: template.displayName,
    direct_object_id: template.websiteId,
    direct_object_identifier: 'see-next-template-recommendation',
    direct_object_type: 'carousel',
    page: 'recommendations',
    section: 'carousel',
  }, recommendationTrackingData )

  store.dispatch({ type: SET_SLIDE, template, direction: 'next' })

  expect( analytics.trackInternal ).toHaveBeenCalledTimes( 1 )
  expect( analytics.trackInternal ).toHaveBeenCalledWith( CLICK_EVENT, trackingData )
})

test( 'Analytics can track TRACK_LINK_CLICK_PREVIEW action', () => {
  getCurrentScreen.mockImplementation(() => 'recommendations' )

  const linkData = {
    label: 'Click me',
    websiteId: 123,
  }

  const trackingData = Object.assign({
    action: CLICK_ACTION,
    page: 'recommendations',
    section: 'buttons',
    direct_object_type: 'button',
    direct_object_display_name: linkData.label,
    direct_object_id: linkData.websiteId,
    direct_object_identifier: 'preview-template-button',
  }, recommendationTrackingData )

  store.dispatch({ type: TRACK_LINK_CLICK_PREVIEW, eventData: linkData })

  expect( analytics.trackInternal ).toHaveBeenCalledTimes( 1 )
  expect( analytics.trackInternal ).toHaveBeenCalledWith( CLICK_EVENT, trackingData )
})

test( 'Analytics can track CLICK_GET_STARTED action', () => {
  getCurrentScreen.mockImplementation(() => 'recommendations' )

  const template = {
    displayName: 'Bedford',
    websiteId: 123,
  }

  const trackingData = Object.assign({
    action: CLICK_ACTION,
    page: 'recommendations',
    section: 'buttons',
    direct_object_type: 'button',
    direct_object_display_name: `Start With ${ template.displayName }`,
    direct_object_identifier: 'start-with-template-button',
    direct_object_id: template.websiteId,
  }, recommendationTrackingData )

  store.dispatch({ type: CLICK_GET_STARTED, template })

  expect( analytics.trackInternal ).toHaveBeenCalledTimes( 1 )
  expect( analytics.trackInternal ).toHaveBeenCalledWith( CLICK_EVENT, trackingData )
})
