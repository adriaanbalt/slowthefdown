import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import {
  openModal,
  closeModal
} from './ModalActions'

const modalStyles = {
  default: {
    opacity: 0.0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    position: 'absolute',
    overflow: 'hidden',
    pointerEvents: 'none',
    top: 0,
    left: 0,
    willChange: 'opacity, transform',
    transform: 'scale(0.8)',
    transition: 'opacity 200ms ease-in-out, transform 200ms ease-in-out',
    userSelect: 'none',
    MozUserSelect: 'none',
    WebkitUserSelect: 'none',
  },
  active: {
    opacity: 1.0,
    transform: 'scale(1.0)',
    pointerEvents: 'all',
  },
}

const contentStyles = {
  default: {
    willChange: 'filter',
    minHeight: '100%',
    minWidth: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    transition: 'filter 200ms ease-in-out',
  },
  active: {
    filter: 'blur(20px)',
    overflow: 'hidden',
  },
}

const getModalStyle = ( isActive ) => {
  if ( isActive ) {
    return {
      ...modalStyles.default,
      ...modalStyles.active,
    }
  }
  else return modalStyles.default
}

const getContentStyle = ( isActive ) => {
  if ( isActive ) {
    return {
      ...contentStyles.default,
      ...contentStyles.active,
    }
  }
  else return contentStyles.default
}

class Modal extends React.Component {
  render() {
    const PassedComponent = this.props.component
    return (
      <React.Fragment>
        <div id="modal-content-wrapper"
          style={getContentStyle( this.props.isOpen )}
        >
          {this.props.children}
        </div>
        <div id="modal-component"
          style={getModalStyle( this.props.isOpen )}
        >
          {PassedComponent ? <PassedComponent /> : null}
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = ( state ) => ({
  isOpen: state.ModalReducer.isOpen,
  component: state.ModalReducer.component,
})

const mapDispatchToProps = ( dispatch ) => bindActionCreators({
  openModal,
  closeModal,
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( Modal )