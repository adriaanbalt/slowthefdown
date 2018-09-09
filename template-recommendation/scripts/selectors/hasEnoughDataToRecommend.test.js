import hasEnoughDataToRecommend from './hasEnoughDataToRecommend'

test( 'returns true once resultingTemplates contains both templatesFromSiteTitle and visuallySimilarTemplates', () => {
  expect( hasEnoughDataToRecommend({
    CollectedDataReducer: {
      resultingTemplates: {},
      userInput: {},
    },
  })).toEqual( false )

  expect( hasEnoughDataToRecommend({
    CollectedDataReducer: {
      resultingTemplates: {
        templatesFromSiteTitle: [ 'bedford' ],
      },
      userInput: {},
    },
  })).toEqual( false )

  expect( hasEnoughDataToRecommend({
    CollectedDataReducer: {
      resultingTemplates: {
        templatesFromSiteTitle: [ 'bedford' ],
        visuallySimilarTemplates: [ 'skye', 'flatiron' ],
      },
      userInput: {},
    },
  })).toEqual( true )
})