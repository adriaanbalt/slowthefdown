import getCurrentPrototypePath from './getCurrentPrototypePath'

test( 'returns path for current queue prototype', () => {
  const state = {
    QueueReducer: {
      currentPrototype: 'contentswap',
      contentswap: {
        name: 'Content Swap',
        path: [ 'swap1', 'swap2' ],
      },
    },
  }

  expect( getCurrentPrototypePath( state )).toEqual([ 'swap1', 'swap2' ])
})