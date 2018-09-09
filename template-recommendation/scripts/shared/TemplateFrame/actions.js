export const TOGGLE_DRAWER = 'TOGGLE_DRAWER'
export const SET_PAGE = 'SET_PAGE'

export const toggleDrawer = ( message ) => {
  return {
    type: TOGGLE_DRAWER,
    toggleDrawer: ( message.action === 'open' ),
  }
}

export const setPage = ( action ) => {
  return {
    type: SET_PAGE,
    activePage: action.activePage,
    currentPageIndex: action.currentPageIndex,
  }
}
