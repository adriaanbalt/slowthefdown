import getCurrentPrototypeInfo from './getCurrentPrototypeInfo'

test( 'returns all prototype info for current queue prototype', () => {
  const state = {
    QueueReducer: {
      currentPrototype: 'wizard',
      wizard: {
        name: 'Wizard',
        path: [ 'wiz1', 'wiz2' ],
      },
      contentswap: {
        name: 'Content Swap',
        path: [ 'swap1', 'swap2' ],
      },
    },
  }

  expect( getCurrentPrototypeInfo( state )).toEqual({
    name: 'Wizard',
    path: [ 'wiz1', 'wiz2' ],
  })
})