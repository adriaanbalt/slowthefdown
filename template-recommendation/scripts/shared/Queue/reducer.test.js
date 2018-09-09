import QueueReducer from './reducer'
import {
  direction,
  setScreenProgress,
  SET_SCREEN_INDEX
} from './actions'

test( 'initial state contains both prototypes and sets currentPrototype to wizard, index to 0 by default', () => {
  const initialState = QueueReducer( undefined, {})

  //Assert that both prototypes are present, but don't yet assert on their screens or order
  expect( initialState.wizard ).not.toBeFalsy()
  expect( initialState.wizard ).not.toBeFalsy()

  expect( initialState.currentPrototype ).toEqual( 'wizard' )
  expect( initialState.wizard.index ).toEqual( 0 )
  expect( initialState.direction ).toEqual( direction.FORWARD )
})

test( 'SET_SCREEN_INDEX action sets new index on current prototype', () => {
  const state = {
    currentPrototype: 'wizard',
    wizard: {
      index: 3,
    },
  }
  const action = {
    type: SET_SCREEN_INDEX,
    index: 2,
    direction: direction.BACK,
  }

  expect( QueueReducer( state, action )).toEqual({
    currentPrototype: 'wizard',
    wizard: {
      index: 2,
    },
    direction: direction.BACK,
  })
})

test( 'setScreenProgress updates the specified screen progress for the current prototype', () => {
  const state = {
    currentPrototype: 'wizard',
    wizard: {
      pathProgress: {
        vibes: 0,
        title: 1,
        layouts: 2,
      },
    },
  }

  expect( QueueReducer( state, setScreenProgress( 'vibes', 0.2 ))).toEqual({
    currentPrototype: 'wizard',
    wizard: {
      pathProgress: {
        vibes: 0.2,
        title: 1,
        layouts: 2,
      },
    },
  })
})
