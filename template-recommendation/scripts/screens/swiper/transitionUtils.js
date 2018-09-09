export const waitForTransition = ( elem, propertyName, maxOverrideWaitTime ) => new Promise(( resolve, reject ) => {
  const transitionEndListener = ( evt ) => {
    if ( evt.propertyName === propertyName ) {
      elem.removeEventListener( 'transitionend', transitionEndListener )
      resolve()
    }
  }
  elem.addEventListener( 'transitionend', transitionEndListener )
  if ( maxOverrideWaitTime ) {
    setTimeout(() => {
      resolve()
    }, maxOverrideWaitTime )
  }

})