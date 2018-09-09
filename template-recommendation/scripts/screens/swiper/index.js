import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  onSwipeRight,
  onSwipeLeft,
  getTemplatesByTitle,
  nextScreen,
  fetchNextTemplate,
  saveResults,
  onEnter,
  RIGHT_SWIPES_REQUIRED
} from './SwiperActions'
import Screen from '../../shared/Screen'
import Description from '../../shared/Description'
import Swiper from '../../lib/swiper'
import LikeButton from './LikeButton'
import DislikeButton from './DislikeButton'
import { waitForTransition } from './transitionUtils'
import STRINGS from '../../shared/i18n/strings'

const screenBottomPadding = 20

const opacityFalloff = 400
const rotationSpeed = 10000

const swiperCSS = {
  transform: 'translate(-50%, 0%)',
  position: 'relative',
  left: '50%',
  display: 'flex',
  justifyContent: 'center',
}

class SwiperScreen extends React.Component {

  constructor( props ) {
    super( props )
    this.onLike = this.onLike.bind( this )
    this.onDislike = this.onDislike.bind( this )
    this.state = {
      descriptionOffset: 0,
    }
  }

  async componentDidMount() {
    this.props.onEnter()

    const descriptionHeight = this.$description.getHeight()
    // intentionally triggering rerender in componentDidMount since now we have access to refs
    this.setState({
      descriptionOffset: descriptionHeight + screenBottomPadding,
    })
    await this.props.getTemplatesByTitle()
    if ( this.$hitArea && this.$swipeableElem ) {
      this.dragController = Swiper( this.$hitArea, {
        onSwipeLeft: this.onDislike,
        onSwipeRight: this.onLike,
        onMoveCallback: this.onMoveCallback.bind( this ),
        onDownCallback: this.onDownCallback.bind( this ),
        onUpCallback: this.onUpCallback.bind( this ),
        onBounceBackCallback: this.onBounceBackCallback.bind( this ),
      })
      this.dragController.start()
    }
  }

  async onLike() {
    this.$swipeableElem.classList.add( 'like' ) // not too fond of this but it gets the job done
    await this.$swipeableElem.classList.remove( 'dislike' ) // not too fond of this but it gets the job done
    this.onComplete()
    // need to wait for the swipe to complete
    // by doing so, a render is triggered and the currentTemplateIndex is incremented
    // once the first card has been swiped away, the "new" first element is the next card in the stack
    const thisTemplate = this.props.templateQueue[ this.props.currentTemplateIndex ]
    this.props.onSwipeRight( thisTemplate )
    // set the "new" element within the dragController
    if ( this.props.swipedRightTemplates.length === RIGHT_SWIPES_REQUIRED ) {
      this.dragController.pause()
      await waitForTransition( this.$swipeableElem, 'transform', 1000 )
      this.props.saveResults()
      this.props.nextScreen()
    }
    else {
      this.props.fetchNextTemplate( this.props.currentTemplateIndex )
    }
  }

  async onDislike() {
    this.$swipeableElem.classList.add( 'dislike' ) // not too fond of this but it gets the job done
    await this.$swipeableElem.classList.remove( 'like' ) // not too fond of this but it gets the job done
    this.onComplete()
    // need to wait for the swipe to complete
    // by doing so, a render is triggered and the currentTemplateIndex is incremented
    // once the first card has been swiped away, the "new" first element is the next card in the stack
    const thisTemplate = this.props.templateQueue[ this.props.currentTemplateIndex ]
    await this.props.onSwipeLeft( thisTemplate )
    // set the "new" element within the dragController
    this.props.fetchNextTemplate( this.props.currentTemplateIndex )
  }

  // after a Like or Dislike, we need to set the current $elem and icons back to opacity 0
  onComplete() {
    this.$swipeableElem.style.opacity = 0
    this.$iconYes.style.opacity = 0
    this.$iconNo.style.opacity = 0
  }

  onBounceBackCallback() {
    this.$iconYes.style.opacity = 0
    this.$iconNo.style.opacity = 0

    const wait = 250
    this.$swipeableElem.style.transition = `transform ${ wait }ms ease-in-out, opacity ${ wait } ease-in-out, box-shadow ${ wait } ease-in-out`
    this.$swipeableElem.style.transform = 'translateX(0px)'
    this.$swipeableElem.style.opacity = 1
    setTimeout(() => { this.$swipeableElem.style.transition = '' }, wait * 2 )
  }

  onDownCallback() {
    this.$swipeableElem.style.transition = ''
  }

  onUpCallback() {
    this.$swipeableElem.style.transition = 'transform 500ms ease-in-out, opacity 500ms ease-in-out, box-shadow 500ms ease-in-out'
  }

  onMoveCallback( relativeX ) {
    // useful for connecting the swiping movement to other elements outside of the swiping controller.
    // like revealing the <3 or x on the sides based on the direction being swiped
    if ( relativeX >= 0 && this.$iconYes ) this.$iconYes.style.opacity = `${ relativeX / 100 }`
    if ( relativeX <= 0 && this.$iconNo ) this.$iconNo.style.opacity = `${ relativeX / -100 }`

    this.$swipeableElem.style.transform = `translateX(${ relativeX }px) rotate(${ ( relativeX / rotationSpeed ) * 360 }deg)`
    this.$swipeableElem.style.opacity = relativeX > 0 ? ( 1 - relativeX / opacityFalloff ) : ( 1 + relativeX / opacityFalloff )
  }

  getBoxShadowByIndex( index ) {
    if ( index === this.props.currentTemplateIndex || index === this.props.currentTemplateIndex + 1 ) {
      return 'rgba(0, 0, 0, 0.07) 0px 0px 60px'
    }
  }

  renderRemainingTemplates() {
    return this.props.templateQueue.map(( template, i ) => {
      // the first element in the list will be the current index
      const isVisibleTemplate = [ i - 1, i, i + 1 ].includes( this.props.currentTemplateIndex )
      const isCurrentTemplate = this.props.currentTemplateIndex === i

      // Reference this locally so we can fade it in
      let $thisElem

      // Apply a transition delay to the element underneath so it doesnt fade-in before the top.
      const opacityTransition = isCurrentTemplate ? '200ms ease-in-out' : '200ms ease-in-out 200ms'

      return (
        <div key={`template-queue-${ i }`}
          ref={( $elem ) => {
            $thisElem = $elem
            if ( isCurrentTemplate ) this.$swipeableElem = $elem
          }}
          style={{
            display: isVisibleTemplate ? 'block' : 'none', // improves performance drastically
            opacity: 0, // we want to fade-in the first image after it loads
            overflow: 'hidden',
            position: 'absolute',
            height: '100%', // not a fan of hardcoded numbers
            boxShadow: this.getBoxShadowByIndex( i ), // we only want drop shadows on the first two items
            zIndex: `${ this.props.templateQueue.length - i - 1 }`,
            transition: `transform 500ms ease-in-out, box-shadow 500ms ease-in-out, opacity ${ opacityTransition }`, // this is used by the 2nd card to scale up and animate in, because only the first card is using the swipe control
            transform: `scale(${ isCurrentTemplate ? '1' : '.9' })`, // if you are not the first item, then you are 90% of your original scale
          }}
        >
          <img className="preview-image"
            onLoad={() => $thisElem.style.opacity = 1}
            src={template.phoneImageAssetUrl + '?format=500w'}
          />
        </div>
      )
    })
  }

  render() {
    return (
      <Screen>
        <Description
          ref={( $el ) => this.$description = $el}
          title={STRINGS.LAYOUTS_TITLE}
          subtitle={STRINGS.LAYOUTS_SUBTITLE}
        />
        <div className="icon-background hidden yes"
          ref={(( $elem ) => this.$iconYes = $elem )}
        >
          <LikeButton />
        </div>
        <div className="icon-background hidden no"
          ref={(( $elem ) => this.$iconNo = $elem )}
        >
          <DislikeButton />
        </div>
        {/* Make sure templates do not render until their size is calculated */}
        {!!this.state.descriptionOffset && (
          <div id="swiper"
            style={{ ...swiperCSS, height: `calc(100% - ${ this.state.descriptionOffset }px)` }}
          >
            <div
              style={{
                width: '100vw',
                height: '100%',
                position: 'absolute',
                top: '0px',
                zIndex: '10000',
                left: '50%',
                right: '50%',
                marginLeft: '-50vw',
                marginRight: '-50vw',
              }}
              ref={(( $hitArea ) => this.$hitArea = $hitArea )}
            />
            {
              this.props.templateQueue &&
              this.renderRemainingTemplates()
            }
          </div>
        )}
      </Screen>
    )
  }
}

const mapStateToProps = ( state ) => ({
  templateQueue: state.SwiperReducer.templates,
  currentTemplateIndex: state.SwiperReducer.currentTemplateIndex,
  swipedRightTemplates: state.SwiperReducer.swipedRightTemplates,
  images: state.VibesReducer.similarImages,
})

const mapDispatchToProps = ( dispatch ) => bindActionCreators({
  onSwipeRight,
  onSwipeLeft,
  getTemplatesByTitle,
  saveResults,
  nextScreen,
  fetchNextTemplate,
  onEnter,
}, dispatch )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( SwiperScreen )
