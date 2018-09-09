
// How many pixels per raf iteration
const advanceBy = 1

// Reference to the raf so we can cancel it
let rafLoop

// Resets everything to initial state
function reset( $rows ) {
  // Ignore bottom two rows because they should start with 'set' class on already
  $rows.slice( 0, $rows.length - 2 ).forEach(( $row ) => {
    const $bricks = [ ...$row.children ]
    $bricks.forEach(( $brick ) => {
      $brick.classList.remove( 'set' )
    })
  })
}

// Lays a row of bricks from left to right
async function layBricks( $row, delay = 200 ) {
  return new Promise(( resolve ) => {
    const $bricks = [ ...$row.children ]
    let count = 0
    const interval = setInterval(() => {
      if ( count === $bricks.length ) {
        clearInterval( interval )
        resolve()
        return
      }
      $bricks[ count ].classList.add( 'set' )
      count += 1
    }, delay )
  })
}

// Starts the animation
export async function startAnimation( $elemWithOverflow ) {
  const $content = $elemWithOverflow.firstElementChild

  // Clone the content so it loops nicely
  const $contentClone = $content.cloneNode( true )
  const $rows = [ ...$content.getElementsByClassName( 'row' ), ...$contentClone.getElementsByClassName( 'row' ) ]

  // Cache some values
  const height = $content.offsetHeight
  let scroll = -height

  // Transform to center on the new cloned element
  $contentClone.style.transform = `translateY(${ scroll }px)`
  $content.style.transform = `translateY(${ scroll }px)`
  $elemWithOverflow.appendChild( $contentClone )

  const rowHeight = $rows[ 1 ].offsetHeight

  const advance = () => {
    // Reset the loop
    if ( scroll === 0 ) {
      requestAnimationFrame(() => {
        reset( $rows )
        scroll = -height
      })
    }
    else {
      // Lays the top row of bricks.
      if ( scroll % rowHeight === 0 ) {
        const thisRow = scroll / rowHeight * -1
        layBricks( $rows[ thisRow ])
      }

      scroll += advanceBy

      // Scrolls the content
      $content.style.transform = `translateY(${ scroll }px)`
      $contentClone.style.transform = `translateY(${ scroll }px)`
    }
    rafLoop = requestAnimationFrame( advance )
  }

  // Reverse because rows are counted from top to bottom
  const firstTwoRows = $rows.slice( -2 ).reverse()

  // Lay first two rows before starting the scroll loop
  await layBricks( firstTwoRows[ 0 ])
  await layBricks( firstTwoRows[ 1 ])
  advance()
}

export function stopAnimation() {
  cancelAnimationFrame( rafLoop )
}