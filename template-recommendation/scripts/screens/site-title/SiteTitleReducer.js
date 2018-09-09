import {
  SELECT_FONT,
  ON_CHANGE_SITE_TITLE
} from './SiteTitleActions'

import STRINGS from '../../shared/i18n/strings'

const initialState = {
  selected: 'modern',
  siteTitle: STRINGS.DEFAULT_SITE_TITLE,
  templateResults: [],
}

export default ( state = initialState, action ) => {
  switch ( action.type ) {
    case SELECT_FONT:
      return {
        ...state,
        selected: action.name,
      }

    case ON_CHANGE_SITE_TITLE:
      return {
        ...state,
        siteTitle: action.siteTitle,
      }

    default:
      return state

  }
}
