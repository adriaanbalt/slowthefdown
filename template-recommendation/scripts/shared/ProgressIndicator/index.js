import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import getCurrentProgress from '../../selectors/getCurrentProgress'
import { hasProgressBar } from '../../selectors/screensWithoutComponent'

const ProgressIndicator = ( props ) => {
  return props.isVisible && (
    <div className="progress-container">
      <div className="progress"
        style={{ width: `${ props.progress }%` }}
      />
    </div>
  )
}

const mapStateToProps = ( state ) => ({
  progress: getCurrentProgress( state ),
  isVisible: hasProgressBar( state )
})

const mapDispatchToProps = ( dispatch ) => bindActionCreators({
  // remember to bind to any progress updates from each component
}, dispatch )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( ProgressIndicator )
