import React from 'react'
import { trackLink } from './LinkActions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class TrackableLink extends React.Component {

  constructor( props ) {
    super( props )
    this.handleClick = this.handleClick.bind( this )
  }

  handleClick() {
    const eventData = Object.assign({
      label: this.props.label,
    }, this.props.trackingData )
    this.props.trackLink( this.props.actionType, eventData )
  }

  render() {
    const {
      className,
      href,
      label,
      style,
      target = '_self',
    } = this.props

    return (
      <a
        className={className}
        href={href}
        onClick={this.handleClick}
        style={style}
        target={target}
      >{label}</a>
    )
  }
}

const mapDispatchToProps = ( dispatch ) => bindActionCreators({
  trackLink,
}, dispatch )

export default connect(
  null,
  mapDispatchToProps
)( TrackableLink )