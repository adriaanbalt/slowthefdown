import intersectionBy from 'lodash/intersectionBy'
import { install } from '@sqs/template-installer'

export const ON_SELECT_TEMPLATE = 'ON_SELECT_TEMPLATE'
export const SET_RECOMMENDATIONS = 'SET_RECOMMENDATIONS'
export const SET_SLIDE = 'SET_SLIDE'
export const SHOW_RECOMMENDATIONS = 'SHOW_RECOMMENDATIONS'
export const CLICK_GET_STARTED = 'CLICK_GET_STARTED'

export const getStartedWithTemplate = ( template ) => async ( dispatch ) => {
  dispatch({
    type: CLICK_GET_STARTED,
    template
  })
  await install( template.websiteIdentifier, template.websiteType )
}

export const onSelectTemplate = ( template ) => {
  return {
    type: ON_SELECT_TEMPLATE,
    template,
  }
}

export const setSlide = ( index, template, direction ) => {
  return {
    type: SET_SLIDE,
    currentSlideIndex: index,
    template,
    direction
  }
}

export const showRecommendations = () => ({ type: SHOW_RECOMMENDATIONS })

export const setRecommendations = () => async ( dispatch, getState ) => {
  // const {
  //   templatesFromSiteTitle = [],
  //   visuallySimilarTemplates = [],
  // } = getState().CollectedDataReducer.resultingTemplates

  // const intersect = intersectionBy([ templatesFromSiteTitle, visuallySimilarTemplates ], ( item ) => item.websiteIdentifier )[ 0 ]

  // Send this to an ML service in the future
  // const sortedIdentifierList = [ templatesFromSiteTitle, visuallySimilarTemplates ]
  // .map(( collection ) => collection.map(( template ) => template.websiteIdentifier ))


  dispatch({
    type: SET_RECOMMENDATIONS,
    recommendations: getState().CollectedDataReducer.resultingTemplates.recommendations, // for ALGO 1
  })
}

// category <- taxonomy brain / search ML <- return templates
// featureas <- ML search <- return templates
// site title gets templates for layout <- ML search (order of templates) [show top 10 heightest weight]
// layout <- visually similar (depends on site title) [only 3 templates]
// GET RECS



// send one template
// returns 1 template

// x5