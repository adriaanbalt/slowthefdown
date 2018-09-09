
const sl_tr_start = require( './translate' )
const sl_tr_end = require( './translate' )

const DEBUG_REVEAL_TRANSLATIONS = false //set this to true to view strings that'll be translated locally

sl_tr_start()
const dictionary = {
  //Nav
  NAV_BACK: 'Back',
  NAV_NEXT: 'Next',

  //Splash screen
  SKIP_SEE_ALL: 'Skip, see all templates',
  FIND_STARTING_POINT: 'Find Your Starting Point',
  GET_RECOMMENDATION: 'Get Recommendation',

  //Site title screen
  SITE_TITLE: 'Site Title',
  SET_A_SITE_TITLE: 'Set a site title to preview on your template recommendations.',
  FONT_STYLE_MODERN: 'modern',
  FONT_STYLE_CLASSIC: 'classic',
  DEFAULT_SITE_TITLE: 'My Organized Life',

  //Vibes screen
  VIBES_TITLE: 'Images',
  VIBES_SUBTITLE: 'Choose images that best represent your idea.',
  IMAGE_SEARCH_PLACEHOLDER: 'Search for an image',

  //Layouts screen
  LAYOUTS_TITLE: 'Layouts',
  LAYOUTS_SUBTITLE: 'Swipe right on layouts that you like. This helps us learn your style.',

  //Recommendations screen
  GATHERING_RECOMMENDATIONS: 'Gathering recommendations...',
  YOUR_RESULTS: 'Your Results',
  RECOMMENDATIONS_SUBTITLE: 'Here are the matches based on your preferences. Choose one and get started.',
  GET_STARTED_WITH: 'Get started with',
  PREVIEW_TEMPLATE: 'Preview',
}
sl_tr_end()

if ( DEBUG_REVEAL_TRANSLATIONS ) {
  Object.keys( dictionary ).map(( k ) => {
    dictionary[ k ] = '<is-translated>'
  })
}

export default dictionary