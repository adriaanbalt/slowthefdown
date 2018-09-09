import CollectedDataReducer from './reducer'
import {
  collectUserInputData,
  collectTemplateData
} from './actions'

test( 'initial state has no collected data', () => {
  const initialState = CollectedDataReducer( undefined, {})
  expect( initialState ).toEqual({
    resultingTemplates: {},
    userInput: {},
  })
})

test( 'collectTemplateData stores relevant keys of template data', () => {
  const templateData = [
    {
      websiteIdentifier: 'bedford',
      websiteUrl: 'bedford-demo.squarespace.com',
      displayName: 'Bedford',
      phoneImageAssetUrl: 'bedford.png',
      websiteType: 1,
      irrelevantExtraThing: 'blah',
    },
    {
      websiteIdentifier: 'skye',
      websiteUrl: 'skye-demo.squarespace.com',
      displayName: 'Skye',
      phoneImageAssetUrl: 'skye.png',
      websiteType: 1,
      moreStuffWeDontCareAbout: 'more more more',
    },
  ]

  const result = CollectedDataReducer( undefined, collectTemplateData( templateData, 'someTemplateData' ))
  expect( result.resultingTemplates ).toEqual({
    someTemplateData: [
      {
        websiteIdentifier: 'bedford',
        websiteUrl: 'bedford-demo.squarespace.com',
        displayName: 'Bedford',
        phoneImageAssetUrl: 'bedford.png',
        websiteType: 1,
      },
      {
        websiteIdentifier: 'skye',
        websiteUrl: 'skye-demo.squarespace.com',
        displayName: 'Skye',
        phoneImageAssetUrl: 'skye.png',
        websiteType: 1,
      },
    ],
  })
})

test( 'collectUserInputData stores user input', () => {
  const userInputData = {
    siteTitle: 'i dont know',
  }

  const result = CollectedDataReducer( undefined, collectUserInputData( userInputData, 'someUserInput' ))
  expect( result.userInput ).toEqual({
    someUserInput: userInputData,
  })
})
