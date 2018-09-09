import getCurrentPrototypeIndex from './getCurrentPrototypeIndex'

test( 'returns index for current queue prototype', () => {
  const state = {
    QueueReducer: {
      currentPrototype: 'wizard',
      wizard: { index: 1 },
      contentswap: { index: 2 },
    },
  }

  expect( getCurrentPrototypeIndex( state )).toEqual( 1 )
})