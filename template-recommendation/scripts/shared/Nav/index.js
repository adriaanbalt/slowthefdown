import React from 'react'
import { Transition } from 'react-transition-group'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Chevron from '../icons/Chevron'
import { hasNav } from '../../selectors/screensWithoutComponent'
import getCurrentPrototypeIndex from '../../selectors/getCurrentPrototypeIndex'
import STRINGS from '../../shared/i18n/strings'
import classnames from 'classnames'

import {
  nextPage,
  prevPage
} from '../../shared/Queue/actions'

class Nav extends React.Component {

  getHeight() {
    return this.$container.offsetHeight
  }

  render() {
    const { index } = this.props

    return (
      <Transition in={this.props.hasNav} timeout={350}>
        {state => {
          return (
          <nav className={classnames('nav', {
            visible: state === 'entered'
          })}>
            {index !== 1 && (
              <div
                className="nav-button"
                onClick={this.props.prevPage}
              >
                <Chevron />
                {STRINGS.NAV_BACK}
              </div>
            )}
            <div
              onClick={this.props.nextPage}
              className="nav-button next"
            >{STRINGS.NAV_NEXT}</div>
          </nav>
        )}}
      </Transition>
    )
  }
}

const mapStateToProps = ( state ) => ({
  index: getCurrentPrototypeIndex( state ),
  hasNav: hasNav( state ),
})

const mapDispatchToProps = ( dispatch ) => bindActionCreators({
  nextPage,
  prevPage,
}, dispatch )

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true }
)( Nav )
