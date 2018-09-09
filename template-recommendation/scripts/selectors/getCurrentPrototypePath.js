import { createSelector } from 'reselect'
import getCurrentPrototypeInfo from './getCurrentPrototypeInfo'

export default createSelector(
  getCurrentPrototypeInfo,
  currentPrototypeInfo => currentPrototypeInfo.path
)