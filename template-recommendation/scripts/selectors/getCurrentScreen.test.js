import getCurrentScreen from './getCurrentScreen'

test( 'returns current screen in path of current prototype', () => {
  const state = {
    QueueReducer: {
      currentPrototype: 'wizard',
      wizard: {
        path: [ 'splash',
          'title',
          'vibes',
          'layouts',
          'recommendations',
          'create',
        ],
        index: 3,
      },
    },
  }

  expect( getCurrentScreen( state )).toEqual( 'layouts' )
})