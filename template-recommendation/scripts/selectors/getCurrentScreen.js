import { createSelector } from 'reselect'
import getCurrentPrototypePath from './getCurrentPrototypePath'
import getCurrentPrototypeIndex from './getCurrentPrototypeIndex'

export default createSelector(
  getCurrentPrototypePath,
  getCurrentPrototypeIndex,
  ( path, index ) => path[ index ]
)