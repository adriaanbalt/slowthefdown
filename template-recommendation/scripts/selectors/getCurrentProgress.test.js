import getCurrentProgress from './getCurrentProgress'

describe( 'progress calculations from current prototype pathProgress values', () => {

  const assertProgress = ( pathProgress, expected ) => {
    const state = {
      QueueReducer: {
        currentPrototype: 'wizard',
        wizard: {
          pathProgress,
        },
      },
    }

    expect( getCurrentProgress( state )).toEqual( expected )
  }

  test( 'zero progress', () => {
    assertProgress({ vibes: 0 }, 0 )
    assertProgress({ vibes: 0, title: 0, layouts: 0 }, 0 )
  })

  test( 'intermediate progress', () => {
    assertProgress({ vibes: 0.5 }, 50 )
    assertProgress({ vibes: 0, title: 0.5, layouts: 0, recs: 0 }, 12.5 )
    assertProgress({ vibes: 0, title: 0, layouts: 0.5, recs: 0 }, 12.5 )
    assertProgress({ vibes: 0, title: 0, layouts: 0, recs: 1 }, 25 )
    assertProgress({ vibes: 0, title: 1, layouts: 1, recs: 1 }, 75 )
  })

  test( 'full progress', () => {
    assertProgress({ vibes: 1 }, 100 )
    assertProgress({ vibes: 1, title: 1, layouts: 1 }, 100 )
  })
})