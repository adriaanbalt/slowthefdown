import { createSelector } from 'reselect'
import getCurrentPrototypePath from './getCurrentPrototypePath'
import getCurrentPrototypeIndex from './getCurrentPrototypeIndex'

const screensWithoutNav = [ 'splash', 'recommendations' ]
const screensWithoutProgress = [ 'splash', 'recommendations', 'create' ]

const screensWithoutComponentBuilder = screensWithout => createSelector(
  getCurrentPrototypePath,
  getCurrentPrototypeIndex,
  ( path, index ) => {
    const currentScreen = path[ index ]
    return !screensWithout.contains( currentScreen )
  }
)

export const hasNav = screensWithoutComponentBuilder(screensWithoutNav)

export const hasProgressBar = screensWithoutComponentBuilder(screensWithoutProgress)
