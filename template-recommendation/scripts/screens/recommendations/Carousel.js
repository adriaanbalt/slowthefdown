import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Swiper from '../../lib/swiper'
import { waitForTransition } from '../swiper/transitionUtils'
import Chevron from '../../shared/icons/Chevron'
import CarouselItem from './CarouselItem'
import {
  setSlide
} from './RecommendationsActions'

const slideMargin = window.innerWidth * .03
const direction = {
  NEXT: 'next',
  PREV: 'prev',
}

class Carousel extends React.Component {
  constructor() {
    super()
    this.startPositionX = 0
    this.state = {
      loaded: false, // triggers a render
    }
    this.handleImageLoadFunc = this.handleImageLoaded.bind( this )
  }

  componentDidMount() {
    this.swiper = Swiper( this.$carousel, {
      onSwipeLeft: this.next.bind( this ),
      onSwipeRight: this.previous.bind( this ),
      threshold: .1,
      onMoveCallback: this.onMoveCallback.bind( this ),
      onDownCallback: this.onDownCallback.bind( this ),
      onBounceBackCallback: this.onBounceBackCallback.bind( this ),
      onUpCallback: this.onUpCallback.bind( this )
    })
    this.swiper.start()
  }

  onMoveCallback( cursorDelta ) {
    this.$carousel.style.transform = `translateX(${ this.startPositionX + cursorDelta }px)`
  }

  onUpCallback() {
    this.swiper.pause()
  }

  onDownCallback() {
    this.startPositionX = parseInt( this.$carousel.style.transform.split( '(' )[ 1 ].split( 'px' )[ 0 ])
    this.$carousel.style.transition = ''
  }

  onBounceBackCallback() {
    // Recenter to the current index
    this.recenterCarousel()
  }

  next() {
    const {
      currentSlideIndex,
      slides,
    } = this.props

    let index = currentSlideIndex + 1
    if ( index > slides.length - 1 ) {
      index = slides.length - 1
    }
    this.props.setSlide( index, slides[ currentSlideIndex ], direction.NEXT )
    this.recenterCarousel()
  }

  previous() {
    const {
      currentSlideIndex,
      slides,
    } = this.props

    let index  = currentSlideIndex - 1
    if ( index  < 0 ) {
      index = 0
    }
    this.props.setSlide( index, slides[ currentSlideIndex ], direction.PREV )
    this.recenterCarousel()
  }

  // Centers on the current slide
  async recenterCarousel() {
    const slideElem = this.$slideElem

    this.$carousel.style.transition = 'transform 500ms ease-in-out'
    const slideWidth = (( slideElem ? slideElem.clientWidth : 0 ) + slideMargin * 2 )
    const newPosition = slideWidth * this.props.currentSlideIndex
    this.$carousel.style.transform = `translateX(-${ newPosition }px)`
    await waitForTransition( this.$carousel, 'transform', 500 )
    this.$carousel.style.transition = ''
    this.swiper.start()
  }

  handleImageLoaded() {
    if ( this.$img.offsetWidth ) {
      this.setState({
        loaded: true,
      })
    }
  }

  render() {
    const {
      buttonsHeight,
      descriptionHeight,
    } = this.props

    return (
      <div
        style={{
          boxSizing: 'border-box',
          left: 0,
          height: '100%',
          paddingTop: descriptionHeight,
          position: 'absolute',
          opacity: this.state.loaded ? 1 : 0, // so if the image hasnt loaded the carousel doesnt jitter into position
          top: 0,
          transition: 'opacity 500ms', // some butter for when this element is ready to appear
          overflowX: 'hidden',
          width: '100vw',
        }}
      >
        <div
          style={{
            height: `calc(100% - (${ descriptionHeight + buttonsHeight }px)`,
            position: 'absolute'
          }}
        >
          <ul className='carousel'
            style={{
              left: this.state.loaded ? ( window.innerWidth - this.$img.offsetWidth - slideMargin * 2 ) / 2 : 0,
              position: 'relative',
              display: 'block',
              height: '100%',
              alignItems: 'top',
              width: `${ window.innerWidth * ( this.props.slides.length - 1 ) }px`,
              transform: `translateX(-${ (( this.$slideElem ? this.$slideElem.offsetWidth : 0 ) + slideMargin * 2 ) * this.props.currentSlideIndex }px)`,
            }}
            ref={(( $elem ) => this.$carousel = $elem )}
          >
            {
              this.props.slides.map(( slide, i ) => {
                if ( slide.websiteIdentifier ) {
                  return (
                    <CarouselItem
                      key={i}
                      currentSlideIndex={this.props.currentSlideIndex}
                      handleImageLoaded={this.handleImageLoadFunc}
                      slide={ slide }
                      slideMargin={ slideMargin }
                      slideNumber={ i }
                      slideElRef={ $el => this.$slideElem = $el }
                      imgRef={ $el => this.$img = $el }
                    />
                  )
                }
                else {
                  return (
                    <li
                      key="no-templates"
                      style={{
                        display: 'inline-block',
                        height: '100%',
                        margin: `0px ${ slideMargin }px`,
                        position: 'absolute',
                        width: this.$slideElem ? this.$slideElem.offsetWidth : 'auto',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: '50%',
                          opacity: this.props.currentSlideIndex === i ? 0 : 1,
                          transition: 'opacity .15s',
                          transform: 'scale(1.5)',
                        }}
                      >
                        <Chevron />
                      </div>
                      {slide}
                    </li>
                  )
                }
              })
            }
          </ul>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ( state ) => ({
  currentSlideIndex: state.RecommendationsReducer.currentSlideIndex,
})

const mapDispatchToProps = ( dispatch ) => bindActionCreators({
  setSlide,
}, dispatch )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( Carousel )
