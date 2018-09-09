import { createSelector } from 'reselect'
import getCurrentPrototypeInfo from './getCurrentPrototypeInfo'

export default createSelector(
  getCurrentPrototypeInfo,
  ( currentPrototype ) => {
    const progresses = Object.values( currentPrototype.pathProgress )

    return progresses.reduce(( sum, p ) => sum + p, 0 ) / progresses.length * 100
  }
)