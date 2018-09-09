const platform = require( 'platform' )

const noop = () => {}

const defaultConfig = {
  threshold: .2, // A percentage of the screen to be crossed to trigger a "Swipe"
  onDownCallback: noop, // Called on mousedown
  onUpCallback: noop, // Called on mouseup
  onSwipeLeft: noop, // Called on swiped left
  onSwipeRight: noop, // Called on swiped right
  onMoveCallback: noop, // Called on mousemove
  onBounceBackCallback: noop, // Called after you've mouseup'd below the threshold
}

const getTouchFromEvent = ( e ) => e.touches ? e.touches[ 0 ] : e

export default function Swiper( $hitArea, _config ) {

  // Copy custom properties onto default config
  const config = Object.assign({}, defaultConfig, _config )

  let elemTouchX = 0 // Initial click location on the element
  let cursorDelta = 0 // Pixel value to CSS transform the element
  const threshold = window.innerWidth * config.threshold // Pixel value of the threshold
  const isMobile = platform.os.family === 'Android' || platform.os.family === 'iOS'


  const mousedown = ( e ) => {
    e.preventDefault()
    const touch = getTouchFromEvent( e )
    elemTouchX = touch.pageX
    // Cursor delta is reset here. If/when a mousemove is triggered, it will update.
    cursorDelta = 0
    config.onDownCallback()
    if ( isMobile ) {
      window.addEventListener( 'touchmove', mousemove )
    }
    else {
      window.addEventListener( 'mousemove', mousemove )
    }
  }

  const mouseup = ( e ) => {
    e.preventDefault()
    if ( isMobile ) {
      window.removeEventListener( 'touchmove', mousemove )
    }
    else {
      window.removeEventListener( 'mousemove', mousemove )
    }

    // Always call onUp
    config.onUpCallback()

    // If you didn't move your cursor, don't do anything
    if ( cursorDelta === 0 ) return

    // Decide to call left or right swipe based on cursorDelta
    if ( cursorDelta < threshold * -1 ) {
      config.onSwipeLeft()
    }
    else if ( cursorDelta > threshold ) {
      config.onSwipeRight()
    }
    // If your cursorDelta was below the threshold call a "bounce back" - this usually recenter something in the implementation.
    else config.onBounceBackCallback()
  }

  const mousemove = ( e ) => {
    const touch = getTouchFromEvent( e )
    cursorDelta = touch.pageX - elemTouchX
    config.onMoveCallback( cursorDelta )
  }

  return {
    start: () => {
      $hitArea.addEventListener( 'mousedown', mousedown )
      $hitArea.addEventListener( 'mouseup', mouseup )

      $hitArea.addEventListener( 'touchstart', mousedown )
      $hitArea.addEventListener( 'touchend', mouseup )
    },
    reset: () => {
      cursorDelta = 0
      config.onMoveCallback( cursorDelta )
    },
    pause: () => {
      $hitArea.removeEventListener( 'mousedown', mousedown )
      $hitArea.removeEventListener( 'mouseup', mouseup )

      $hitArea.removeEventListener( 'touchstart', mousedown )
      $hitArea.removeEventListener( 'touchend', mouseup )
    },
  }
}