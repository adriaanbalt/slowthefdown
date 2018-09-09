import React from 'react'
import { getStartedWithTemplate } from './RecommendationsActions'
import { connect } from 'react-redux'
import STRINGS from '../../shared/i18n/strings'

const buttonStyles = {
  border: '1px solid black',
  textTransform: 'uppercase',
  fontFamily: 'Gotham, sans-serif',
  background: 'inherit',
  padding: '20px',
  width: '90%',
  margin: '20px auto 10px auto',
  display: 'block',
  outline: 'none',
  fontSize: 11,
  fontWeight: 500,
  lineHeight: '16px',
  letterSpacing: '1.5px',
}

class GetStartedButton extends React.Component {

  constructor( props ) {
    super( props )
    this.onClick = this.onClick.bind( this )
  }

  onClick() {
    this.props.getStartedWithTemplate( this.props.template )
  }

  render() {
    return (
      <React.Fragment>
        {
          this.props.template ? (
            <button
              style={buttonStyles}
              onClick={this.onClick}
            >{STRINGS.GET_STARTED_WITH} {this.props.template.displayName}
            </button>
          ) :
            null
        }
      </React.Fragment>
    )
  }
}

const mapDispatchToProps = {
  getStartedWithTemplate,
}

export default connect(
  null,
  mapDispatchToProps
)( GetStartedButton )
