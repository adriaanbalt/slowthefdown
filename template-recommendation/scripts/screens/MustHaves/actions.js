import { getTemplatesFromText, getTemplates } from '../../shared/api'
import { collectTemplateData } from '../../shared/CollectedDataStore/actions'
import intersectionBy from 'lodash/intersectionBy'
import { setScreenProgress } from '../../shared/Queue/actions';

export const ON_SELECT_FEATURE = 'ON_SELECT_FEATURE'
export const ON_DESELECT_FEATURE = 'ON_DESELECT_FEATURE'


export const onSelectFeature = ( feature ) => ( dispatch ) => {

  dispatch(setScreenProgress('features', 1))

  dispatch({
    type: ON_SELECT_FEATURE,
    feature
  })
}
export const onDeselectFeature = ( feature ) => ( dispatch, getState ) => {

  const progress = getState().MustHavesReducer.selectedFeatures.length > 1 ? 1 : 0; // 1 must-have is enough for 100% progress on this screen
  dispatch(setScreenProgress('features', progress))

  dispatch({
    type: ON_DESELECT_FEATURE,
    feature
  })
}


export const saveResults = () => async ( dispatch, getState ) => {
  const { selectedFeatures } = getState().MustHavesReducer
  const requests = selectedFeatures.map( getTemplatesFromText )
  const outerJoinTemplatesFeatures = await Promise.all( requests )

  // get intersection of results comparing on label
  // for some reason intersectionby returns a nested array?
  const intersect = intersectionBy( outerJoinTemplatesFeatures, ( item ) => item.label )[ 0 ]

  // gettemplates needs an array of strings ie ['bedford-demo']
  const templateData = await getTemplates( intersect.map(( item ) => item.label ))

  dispatch( collectTemplateData( templateData, 'templatesWithSelectedFeatures' ))
}