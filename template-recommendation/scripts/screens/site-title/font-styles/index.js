import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import FontButton from './font-button'

import STRINGS from '../../../shared/i18n/strings'

const FontStyles = () => {
  return (
    <React.Fragment>
      <div className="font-button-container">
        <FontButton
          fontStyle="modern"
          displayName={STRINGS.FONT_STYLE_MODERN}
        />
        <FontButton
          fontStyle="classic"
          displayName={STRINGS.FONT_STYLE_CLASSIC}
        />
      </div>
    </React.Fragment>
  )
}

const mapDispatchToProps = ( dispatch ) => bindActionCreators({
}, dispatch )

export default connect(
  null,
  mapDispatchToProps
)( FontStyles )
