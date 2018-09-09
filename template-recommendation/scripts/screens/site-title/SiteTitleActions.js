import { collectUserInputData, collectTemplateData } from '../../shared/CollectedDataStore/actions'
import { getTemplatesFromText, getTemplates } from '../../shared/api'
import { setScreenProgress } from '../../shared/Queue/actions'

export const INCREMENT_PROGRESS = 'INCREMENT_PROGRESS'
export const SELECT_FONT = 'SELECT_FONT'
export const ON_CHANGE_SITE_TITLE = 'ON_CHANGE_SITE_TITLE'
export const ON_NEXT = 'ON_NEXT'

export const selectFont = ( name ) => {
  return {
    type: SELECT_FONT,
    name,
  }
}

export const onChangeSiteTitle = ( evt ) => {
  return {
    type: ON_CHANGE_SITE_TITLE,
    siteTitle: evt.target.value,
  }
}

export const incrementProgress = () => {
  return setScreenProgress( 'title', 1 )
}

export const saveResults = ( ) => async ( dispatch, getState ) => {
  const { siteTitle } = getState().SiteTitleReducer
  dispatch( collectUserInputData( siteTitle, 'siteTitle' ))

  const templateNames = await getTemplatesFromText( siteTitle )
  const templateData = await getTemplates( templateNames.map(( item ) => item.label ))
  dispatch( collectTemplateData( templateData, 'templatesFromSiteTitle' ))
}