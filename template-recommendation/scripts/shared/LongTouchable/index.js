import React from 'react'

const platform = require( 'platform' )

const hasTouch = platform.os.family === 'Android' || platform.os.family === 'iOS'

export default class LongTouchable extends React.Component {

  constructor( props ) {
    super( props )
    this.onPressStart = this.onPressStart.bind( this )
    this.onTimeout = this.onTimeout.bind( this )
    this.onPressEnd = this.onPressEnd.bind( this )
    this.timer = undefined // Timeout goes here
  }


  componentDidMount() {
    window.addEventListener( 'touchend', this.onPressEnd )
    window.addEventListener( 'touchcancel', this.onPressEnd )
    window.addEventListener( 'mouseup', this.onPressEnd )
  }

  componentWillUnmount() {
    window.removeEventListener( 'touchend', this.onPressEnd )
    window.removeEventListener( 'touchcancel', this.onPressEnd )
    window.removeEventListener( 'mouseup', this.onPressEnd )
  }

  preventContextMenu( e ) {
    e.preventDefault()
    e.stopPropagation()
    return false
  }

  onPressStart( e ) {
    // Prevent context menus from long presses
    document.addEventListener( 'contextmenu', this.preventContextMenu )

    // allow existing props passthru (because we replace these properties)
    const childProps = this.props.children.props
    if ( childProps.onTouchStart ) childProps.onTouchStart()
    if ( childProps.onMouseDown ) childProps.onMouseDown()

    this.timer = window.setTimeout( this.onTimeout, this.props.time )
  }

  onPressEnd( e ) {
    document.removeEventListener( 'contextmenu', this.preventContextMenu )
    window.clearTimeout( this.timer )
    if ( this.timer && this.props.onTouchRelease ) {
      this.props.onTouchRelease()
    }
  }

  onTimeout() {
    window.clearTimeout( this.timer )
    this.timer = undefined
    this.props.onLongTouch()
  }

  render() {
    const { children, ...otherProps } = this.props
    const newProps = {
      onTouchStart: hasTouch ? this.onPressStart : null,
      onMouseDown: hasTouch ? null : this.onPressStart,
      onTouchCancel: this.onPressEnd,
      className: 'long-touchable',
    }

    return React.cloneElement( children, newProps )
  }
}

LongTouchable.defaultProps = {
  time: 250,
}