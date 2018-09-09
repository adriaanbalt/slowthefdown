import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Description from '../../shared/Description'
import FontStyles from './font-styles'
import { onChangeSiteTitle, incrementProgress, saveResults } from './SiteTitleActions'
import Screen from '../../shared/Screen'

import STRINGS from '../../shared/i18n/strings'

class SiteTitle extends React.PureComponent {

  constructor( props ) {
    super( props )
  }

  componentWillUnmount() {
    this.props.incrementProgress()
    this.props.saveResults()
  }

  render() {
    return (
      <Screen>
        <Description
          title={STRINGS.SITE_TITLE}
          subtitle={STRINGS.SET_A_SITE_TITLE}
        />
        <FontStyles />
        <textarea
          className={`site-title-input ${ this.props.selectedFont }`}
          ref={( el ) => this.input = el}
          onChange={this.props.onChangeSiteTitle}
          value={this.props.siteTitle}
        />
      </Screen>
    )
  }
}



const mapStateToProps = ( state ) => ({
  selectedFont: state.SiteTitleReducer.selected,
  siteTitle: state.SiteTitleReducer.siteTitle,
})

const mapDispatchToProps = ( dispatch ) => bindActionCreators({
  onChangeSiteTitle,
  incrementProgress,
  saveResults,
}, dispatch )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( SiteTitle )
