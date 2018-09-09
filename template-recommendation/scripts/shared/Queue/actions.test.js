import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {
  direction,
  prevPage,
  nextPage,
  setScreenProgress,
  SET_SCREEN_INDEX,
  SET_SCREEN_PROGRESS
} from './actions'

const mockStore = configureMockStore([ thunk ])

test( 'nextPage increments the index by 1 and pushes the next path name to the browser history api', () => {
  const store = mockStore({
    QueueReducer: {
      currentPrototype: 'wizard',
      wizard: {
        path: [ 'splash', 'title', 'vibes', 'recommendations' ],
        index: 1,
      },
    },
  })

  store.dispatch( nextPage())
  expect( store.getActions()).toEqual([
    {
      index: 2,
      type: SET_SCREEN_INDEX,
      direction: direction.FORWARD,
    },
    {
      payload: {
        args: [ 'vibes' ],
        method: 'push',
      },
      type: '@@router/CALL_HISTORY_METHOD',
    },
  ])
})

test( 'prevPage decrements the index by 1 and pushes the previous path name to the browser history api', () => {
  const store = mockStore({
    QueueReducer: {
      currentPrototype: 'wizard',
      wizard: {
        path: [ 'splash', 'title', 'vibes', 'recommendations' ],
        index: 1,
      },
    },
  })

  store.dispatch( prevPage())
  expect( store.getActions()).toEqual([
    {
      index: 0,
      type: SET_SCREEN_INDEX,
      direction: direction.BACK,
    },
    {
      payload: {
        args: [ 'splash' ],
        method: 'push',
      },
      type: '@@router/CALL_HISTORY_METHOD',
    },
  ])
})

