import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  toggleDrawer,
  setPage
} from './actions'

import Drawer from './Drawer'

class Template extends PureComponent {

  componentDidMount() {
    this.first = true

    // handle iframe load listener
    this.$iframe.addEventListener( 'load', () => {
      this.$iframe.contentWindow.postMessage( 'init', '*' )
    })

  }

  activate() {
    if ( this.first ) {
      // we only want to activate the blue halo inside the iframe on the first load, not on subsequent loads (the tricky part is that it must use 'componentWillUpdate()', but i'm open to alternatives)
      this.first = false
      this.$iframe.contentWindow.postMessage({
        activePage: this.props.pages[ this.props.currentPageIndex ],
      }, '*' )
    }
    // handle mesages that come back from the iframe
    // window.addEventListener( 'message', this.iframeReceiveMessage.bind( this ))
  }

  deactivate() {
    this.$iframe.contentWindow.postMessage({
      activePage: 'done',
    }, '*' )
    // window.removeEventListener( 'message', this.iframeReceiveMessage.bind( this ))
    this.first = true
  }

  componentWillUpdate( nextProps ) {
    if ( !nextProps.activate ) {
      this.deactivate()
    }
    else if ( this.props.activate || nextProps.activate ) {
      this.activate()
    }
  }

  next() {
    let pageIndex = this.props.currentPageIndex + 1
    if ( pageIndex >= this.props.pages.length ) {
      pageIndex = 0
    }
    let obj = {
      activePage: this.props.pages[ pageIndex ],
      currentPageIndex: pageIndex,
    }
    this.$iframe.contentWindow.postMessage( obj, '*' )
    this.props.setPage( obj )
  }

  previous() {
    let pageIndex = this.props.currentPageIndex - 1
    if ( pageIndex < 0 ) {
      pageIndex = this.props.pages.length - 1
    }
    let obj = {
      activePage: this.props.pages[ pageIndex ],
      currentPageIndex: pageIndex,
    }
    this.$iframe.contentWindow.postMessage( obj, '*' )
    this.props.setPage( obj )
  }

  setStyleOnIframe( e ) {
    let postObject = {
      type: e.target.dataset.type,
      selection: e.target.dataset.option,
    }
    this.$iframe.contentWindow.postMessage( postObject, '*' )
  }

  render() {
    return (
      <div className={`template-container ${ this.props.className }`}
        ref={ ( elem ) => {this.$hitRegion = elem}}
      >
        <div className="iframe-container">
          <iframe ref={ ( elem ) => {this.$iframe = elem} }
            scrolling="no"
            src={ this.props.src }
          />
        </div>
        <Drawer gotoNext={ this.next.bind( this ) }
          gotoPrevous={ this.previous.bind( this ) }
          isOpen={ this.props.activate }
          activePage={ this.props.activePage }
          setStyleOnIframe={ this.setStyleOnIframe.bind( this ) }
        />
      </div>
    )
  }
}

const mapStateToProps = ( state ) => {
  return ({
    isDrawerOpen: state.TemplateReducer.isDrawerOpen,
    activePage: state.TemplateReducer.activePage,
    pages: state.TemplateReducer.pages,
    currentPageIndex: state.TemplateReducer.currentPageIndex,
  })
}

const mapDispatchToProps = ( dispatch ) => bindActionCreators({
  toggleDrawer,
  setPage,
}, dispatch )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( Template )
