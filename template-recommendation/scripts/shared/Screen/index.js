import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import classnames from 'classnames'
import getCurrentScreen from '../../selectors/getCurrentScreen'
import { hasNav } from '../../selectors/screensWithoutComponent'

const Screen = ( props ) => {
  return (
    <div
      className={classnames( props.className, {
        'screen': true,
        [ props.direction ]: true,
        'fade': props.currentScreen === 'recommendations',
        'has-nav-padding': props.hasNav
      })}
    >{props.children}</div>
  )
}

const mapStateToProps = ( state ) => ({
  direction: state.QueueReducer.direction,
  currentScreen: getCurrentScreen( state ),
  hasNav: hasNav( state )
})

const mapDispatchToProps = ( dispatch ) => bindActionCreators({
}, dispatch )

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)( Screen )