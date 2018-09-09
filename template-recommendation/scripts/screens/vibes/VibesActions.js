export const SELECT_IMAGE = 'SELECT_IMAGE'
export const DESELECT_IMAGE = 'DESELECT_IMAGE'
export const STORE_SIMILAR = 'STORE_SIMILAR'
export const ON_SEARCH = 'ON_SEARCH'
export const ON_SEARCH_CHANGE = 'ON_SEARCH_CHANGE'

import { getSimilarImages, searchForImages, IMAGE_DATASET } from '../../shared/api'
import { collectUserInputData } from '../../shared/CollectedDataStore/actions'

import { setScreenProgress } from '../../shared/Queue/actions'

const setSelectionProgress = ( selectionDelta ) => ( dispatch, getState ) => {
  const vibesState = getState().VibesReducer

  const progress = Math.min(( vibesState.selectedImages.length + selectionDelta ) / vibesState.minNumImages, 1 )
  dispatch( setScreenProgress( 'vibes', progress ))
}

export const deselectImage = ( label ) => ( dispatch ) => {
  dispatch( setSelectionProgress( -1 ))

  dispatch({
    type: DESELECT_IMAGE,
    label,
  })
}

export const selectImage = ( label ) => ( dispatch ) => {
  dispatch( setSelectionProgress( 1 ))

  dispatch({
    type: SELECT_IMAGE,
    label,
  })
}

const getSearchUrl = ( item ) => `${ IMAGE_DATASET[ 0 ] }${ item.label }${ IMAGE_DATASET[ 1 ] }`

export const onSearch = () => async ( dispatch, getState ) => {
  const searchString = getState().VibesReducer.searchString
  const searchResults = await searchForImages( searchString )
  dispatch({
    type: ON_SEARCH,
    searchResults: searchResults.map( getSearchUrl ),
  })
}

export const onSearchChange = ( searchString ) => ( dispatch ) => {
  dispatch({
    type: ON_SEARCH_CHANGE,
    searchString,
  })
}

export const saveResults = () => async ( dispatch, getState ) => {
  const images = getState().VibesReducer.selectedImages

  // Todo: Do we want to store the images, or the similar images? What does ML want?
  dispatch( collectUserInputData( images, 'selectedVibesImages' ))

  // todo: We can't store similar images anymore because they're not getty
  // I think Katya or someone had a new service up
  // const similar = await getSimilarImages( images )
  // dispatch({
  //   type: STORE_SIMILAR,
  //   similar,
  // })
}