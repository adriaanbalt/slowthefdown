import React from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { selectFont } from '../../SiteTitleActions'

class FontButton extends React.Component {

  constructor( props ) {
    super( props )
    this.handleButtonClick = this.handleButtonClick.bind( this )
  }

  handleButtonClick() {
    this.props.selectFont( this.props.fontStyle )
  }

  render() {
    const {
      fontStyle,
      displayName,
      selected,
    } = this.props

    return (
      <button
        className={classnames( `font-button ${ fontStyle }`, {
          active: selected === fontStyle,
        })}
        onClick={this.handleButtonClick}
      >
        {displayName}
      </button>
    )
  }
}

const mapStateToProps = ( state ) => ({
  selected: state.SiteTitleReducer.selected,
})

const mapDispatchToProps = ( dispatch ) => bindActionCreators({
  selectFont,
}, dispatch )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( FontButton )