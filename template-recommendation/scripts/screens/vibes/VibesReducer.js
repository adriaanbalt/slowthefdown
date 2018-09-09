import shuffle from 'lodash/shuffle'
import uniq from 'lodash/uniq'
import popularImages from './popularGettyImages'
import {
  DESELECT_IMAGE,
  SELECT_IMAGE,
  STORE_SIMILAR,
  ON_SEARCH,
  ON_SEARCH_CHANGE
} from './VibesActions'

const flattenImages = ( batch ) => batch.reduce(( arr, item ) => {
  return [ ...arr, ...item.results.map(( neighbor ) => neighbor.label ) ]
}, [])
const MIN_NUM_IMAGES = 3
const seedData = shuffle( uniq( flattenImages( popularImages.batch )))


const initialState = {
  hasSelectedEnough: false,
  minNumImages: MIN_NUM_IMAGES,
  selectedImages: [],
  vibes: seedData,
  searchString: '',
  similarImages: [],
}

export default ( state = initialState, action ) => {
  switch ( action.type ) {

    case SELECT_IMAGE:
      return {
        ...state,
        hasSelectedEnough: state.selectedImages.length + 1 >= MIN_NUM_IMAGES,
        selectedImages: state.selectedImages.concat( action.label ),
      }

    case DESELECT_IMAGE:
      const current = state.selectedImages
      const sliceIndex = current.indexOf( action.label )
      const updated = current.slice( 0, sliceIndex ).concat( current.slice( sliceIndex + 1 ))
      return {
        ...state,
        hasSelectedEnough: updated.length >= MIN_NUM_IMAGES,
        selectedImages: updated,
      }

    case ON_SEARCH_CHANGE:
      return {
        ...state,
        searchString: action.searchString,
      }

    case ON_SEARCH:
      return {
        ...state,
        vibes: action.searchResults,
      }

    case STORE_SIMILAR:
      return {
        ...state,
        similarImages: action.similar,
      }


    default:
      return state

  }
}