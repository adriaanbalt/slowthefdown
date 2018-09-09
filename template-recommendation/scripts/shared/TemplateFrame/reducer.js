import {
  TOGGLE_DRAWER,
  SET_PAGE
} from './actions'


const initialState = {
  isDrawerOpen: false,
  activePage: 'image',
  currentPageIndex: 0,
  pages: [
    'image',
    'headline',
    'button',
  ],
}

export default ( state = initialState, action ) => {
  switch ( action.type ) {

  	case TOGGLE_DRAWER:
  		return {
  			...state,
  			isDrawerOpen: action.toggleDrawer,
  		}

  	case SET_PAGE: {
  		return {
  			...state,
        activePage: action.activePage,
        currentPageIndex: action.currentPageIndex,
  		}
  	}

    default:
      return state

  }
}

