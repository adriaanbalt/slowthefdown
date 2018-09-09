import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Logo from '../../shared/Logo'
import OnBrandButton from '../../shared/OnBrandButton'

import STRINGS from '../../shared/i18n/strings'

import {
  nextPage
} from '../../shared/Queue/actions'

class Splash extends React.Component {

  render() {
    return (
      <div id="splash">
        <Logo style={{ fill: '#fff' }} />
        <div className='info'>
          <h1>{STRINGS.FIND_STARTING_POINT}</h1>
          <OnBrandButton
            onClick={this.props.nextPage}
          >{STRINGS.GET_RECOMMENDATION}</OnBrandButton>
        </div>
        <a href="http://www.squarespace.com/templates">{STRINGS.SKIP_SEE_ALL}</a>
        <div className="gradient white"
          style={{
            position: 'absolute',
            zIndex: '-1',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
          }}
        />
        <img src="/assets/splash-bg.jpg"
          style={{
            position: 'absolute',
            zIndex: '-2',
            top: '0',
            left: '0',
            width: 'auto',
            height: '100vh',
          }}
        />
      </div>
    )
  }
}


const mapDispatchToProps = ( dispatch ) => bindActionCreators({
  nextPage,
}, dispatch )

export default connect(
  null,
  mapDispatchToProps
)( Splash )
