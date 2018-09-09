import React from 'react'
import platform from 'platform'

export default class Slider extends React.PureComponent {

  constructor() {
    super()
    this.isMobile = ( platform.os.family === 'Android' || platform.os.family === 'iOS' )
    this.mousedownFunc = this.mousedown.bind( this )
    this.mouseupFunc = this.mouseup.bind( this )
    this.mousemoveFunc = this.mousemove.bind( this )
    this.mousedownOnSlider = this.mousedownOnSlider.bind( this )
  }

  componentDidMount() {
    if ( this.isMobile ) {
      this.$handle.addEventListener( 'touchstart', this.mousedownFunc )
      window.addEventListener( 'touchend', this.mouseupFunc )
      this.$bar.addEventListener( 'touchstart', this.mousedownOnSlider )
      this.$bar.addEventListener( 'touchend', this.mouseupFunc )
    }
    else {
      this.$handle.addEventListener( 'mousedown', this.mousedownFunc )
      window.addEventListener( 'mouseup', this.mouseupFunc )
      this.$bar.addEventListener( 'mousedown', this.mousedownOnSlider )
      this.$bar.addEventListener( 'mouseup', this.mouseupFunc )
    }
    this.setPositionByPercentage( this.props.default )
  }

  componentWillUnmount() {
    if ( this.isMobile ) {
      this.$handle.removeEventListener( 'touchstart', this.mousedownFunc )
      window.removeEventListener( 'touchend', this.mouseupFunc )
      window.removeEventListener( 'touchmove', this.mousemoveFunc )
    }
    else {
      this.$handle.removeEventListener( 'mousedown', this.mousedownFunc )
      window.removeEventListener( 'mouseup', this.mouseupFunc )
      window.removeEventListener( 'mousemove', this.mousemoveFunc )
    }
  }

  getTouchFromEvent( e ) {
    return e.touches ? e.touches[ 0 ] : e
  }

  mousedownOnSlider( e ) {
    if ( this.isMobile ) {
      window.addEventListener( 'touchmove', this.mousemoveFunc )
    }
    else {
      window.addEventListener( 'mousemove', this.mousemoveFunc )
    }
    const touch = this.getTouchFromEvent( e )
    this.elemTouchX = touch.pageX
    this.startPositionX = this.elemTouchX - this.$bar.getBoundingClientRect().left
    this.setPosition( this.startPositionX )
  }

  mousedown( e ) {
    if ( this.isMobile ) {
      window.addEventListener( 'touchmove', this.mousemoveFunc )
    }
    else {
      window.addEventListener( 'mousemove', this.mousemoveFunc )
    }
    const touch = this.getTouchFromEvent( e )
    this.elemTouchX = touch.pageX
    if ( this.$handle.style.transform ) {
      this.startPositionX = parseInt( this.$handle.style.transform.split( '(' )[ 1 ].split( 'px' )[ 0 ])
    }
    else {
      this.startPositionX = 0
    }
  }

  mouseup( e ) {
    if ( this.isMobile ) {
      window.removeEventListener( 'touchmove', this.mousemoveFunc )
    }
    else {
      window.removeEventListener( 'mousemove', this.mousemoveFunc )
    }
  }

  clamp( val, min, max ) {
    return Math.min( Math.max( min, val ), max )
  }

  mousemove( e ) {
    const touch = this.getTouchFromEvent( e )
    this.cursorDelta = touch.pageX - this.elemTouchX
    let newPos = this.clamp( this.startPositionX + this.cursorDelta, 0, this.$bar.clientWidth - this.$handle.clientWidth )
    this.setPosition( newPos )
  }

  setPosition( newPos ) {
    // i dont want to fire render() on each mousemove, for fear of making a lot of virtual dom state comparisons
    this.props.onChange( newPos )
    this.$handle.style.transform = `translateX(${ newPos }px)`
    this.$low.style.opacity = 1 - newPos / ( this.$bar.clientWidth - this.$handle.clientWidth ) + .2
    this.$high.style.opacity = newPos / ( this.$bar.clientWidth - this.$handle.clientWidth ) + .2
  }

  setPositionByPercentage( percent ) {
    if ( percent <= 1 ) {
      this.setPosition(( this.$bar.clientWidth - this.$handle.clientWidth ) * percent )
    }
    else {
      this.setPosition(( this.$bar.clientWidth - this.$handle.clientWidth ) * percent / 100 )
    }
  }

  render() {
    return (
      <div className="slider">
        <div className="labels">
          <span className="low"
            ref={( elem ) => this.$low = elem}
          >{this.props.labelLow}</span>
          <span className="high"
            ref={( elem ) => this.$high = elem}
          >{this.props.labelHigh}</span>
        </div>
        <div className="handle"
          ref={( elem ) => this.$handle = elem}
        />
        <div className="bar"
          ref={( elem ) => this.$bar = elem}
        />
      </div>
    )
  }
}