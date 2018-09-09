import { createSelector } from 'reselect'
import difference from 'lodash/difference'

const getCollectedData = ( state ) => state.CollectedDataReducer

const requiredResultingTemplates = [ 'templatesFromSiteTitle', 'visuallySimilarTemplates' ]

export default createSelector(
  getCollectedData,
  collectedData => difference( requiredResultingTemplates, Object.keys( collectedData.resultingTemplates )).length === 0,
)