import { createSelector } from 'reselect'

import getCurrentScreen from './getCurrentScreen'

const getSelectedVibes = state => state.VibesReducer.selectedImages
const getFontStyle = state => state.SiteTitleReducer.selected


export default createSelector(
  getSelectedVibes,
  getFontStyle,
  getCurrentScreen,
  ( vibes, title, screen ) => {
    if ( screen === 'vibes' ) {
      return vibes.length
    }
    if ( screen === 'title' ) {
      return title
    }
  }
)