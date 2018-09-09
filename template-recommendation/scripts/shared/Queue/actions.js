import { push } from 'react-router-redux'
import getCurrentPrototypeIndex from '../../selectors/getCurrentPrototypeIndex'
import getCurrentPrototypePath from '../../selectors/getCurrentPrototypePath'

export const SET_SCREEN_INDEX = 'SET_SCREEN_INDEX'
export const SET_SCREEN_PROGRESS = 'SET_SCREEN_PROGRESS'
export const direction = {
  FORWARD: 'next',
  BACK: 'back',
}

export const onBrowserPopstate = () => ( dispatch, getState ) => {
  const screenFromUrl = window.location.pathname.split( '/' )[ 2 ]
  const index = getCurrentPrototypePath( getState() ).indexOf( screenFromUrl )
  const currentIndex = getCurrentPrototypeIndex( getState() )

  dispatch({
    direction: index > currentIndex ? direction.FORWARD : direction.BACK,
    type: SET_SCREEN_INDEX,
    index,
  })
}

const changePage = ( delta ) => ( dispatch, getState ) => {
  const currentPrototypePath = getCurrentPrototypePath( getState())
  const currentIndex = getCurrentPrototypeIndex( getState())
  const newIndex = Math.max( 0, Math.min( currentIndex + delta, currentPrototypePath.length - 1 ))

  dispatch({
    direction: delta === 1 ? direction.FORWARD : direction.BACK,
    type: SET_SCREEN_INDEX,
    index: newIndex,
  })

  dispatch( push( currentPrototypePath[ newIndex ]))
}

export const prevPage = () => changePage( -1 )

export const nextPage = () => changePage( 1 )

export const setScreenProgress = ( screen, progress ) => ({
  type: SET_SCREEN_PROGRESS,
  screen: screen,
  progress: progress,
})