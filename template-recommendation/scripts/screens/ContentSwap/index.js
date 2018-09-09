import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Swiper from '../../lib/swiper'
import Screen from '../../shared/Screen'
import Description from '../../shared/Description'
import Template from '../../shared/TemplateFrame'

import {
  gotoTemplate,
  activateTemplate
} from './actions'

import {
  nextPage
} from '../../shared/Queue/actions'

class ContentSwap extends PureComponent {

  constructor() {
    super()
    this.positions = [
      '-32vw',
      '-100vw',
      '-167vw',
    ]

    this.closeActiveTemplatesFunc = this.closeActivatedTemplate.bind( this )
    this.activateTemplateFunc = this.activateTemplate.bind( this )
  }

  componentDidMount() {
    this.swiper = Swiper( this.$hitRegion, {
      onSwipeLeft: this.next.bind( this ),
      onSwipeRight: this.previous.bind( this ),
      threshold: 0,
    })
    this.swiper.start()
  }


  next() {
    let pageIndex = this.props.currentTemplateIndex + 1
    if ( pageIndex >= this.props.templates.length ) {
      pageIndex = this.props.templates.length - 1
    }
    this.props.gotoTemplate( pageIndex )
  }

  previous() {
    let pageIndex = this.props.currentTemplateIndex - 1
    if ( pageIndex < 0 ) {
      pageIndex = 0
    }
    this.props.gotoTemplate( pageIndex )
  }

  activateTemplate() {
    this.swiper.reset()
    this.swiper.pause()
    this.props.activateTemplate( this.props.currentTemplateIndex )
  }

  closeActivatedTemplate() {
    this.props.activateTemplate( null )
    this.swiper.start()
  }

  render() {
    return (
      <Screen>
        <div id="content-swap"
          className={`wrapper ${ this.props.activeTemplateIndex ? 'closeUpActive' : '' }`}
          ref={ ( elem ) => {this.$hitRegion = elem}}
        >
          {
            !this.props.activeTemplateIndex && (
              <Description
                title="Templates"
                subtitle="Our top recommendations for your business."
              />
            )}
          {
            this.props.activeTemplateIndex && (
              <button onClick={ this.closeActiveTemplatesFunc }
                className="btn-Done"
              >&#60; DONE</button>
            )}
          {
            !this.props.activeTemplateIndex &&
            <div className="hitRegion" />
          }

          <div className="templates-wrapper">
            <div className="templates-container"
              style={{
                left: this.positions[ this.props.currentTemplateIndex ],
              }}
            >
              {
                this.props.templates.map(( template, index ) => {
                  return (
                    <Template
                      key={`template-${ index }`}
                      src={template.iframe}
                      activate={this.props.activeTemplateIndex === index}
                      className={`template-position-${ index } ${ this.props.currentTemplateIndex === index ? 'center' : '' } ${ this.props.activeTemplateIndex === index ? 'active' : '' }`}
                    />
                  )
                })
              }
            </div>
          </div>
          {
            !this.props.activeTemplateIndex && (
              <div className="buttons">
                <button onClick={ this.activateTemplateFunc}
                  onTouchStart={this.activateTemplateFunc }
                  className="btn-Customize"
                >Try Changing Styles</button>
                <button onClick={ this.props.nextPage }
                  onTouchStart={ this.props.nextPage }
                  className="btn-Create"
                >CREATE AN ACCOUNT</button>
              </div>
            )}
        </div>
      </Screen>
    )
  }
}

const mapStateToProps = ( state ) => ({
  templates: state.ContentSwapReducer.templates,
  currentTemplateIndex: state.ContentSwapReducer.currentTemplateIndex,
  activeTemplateIndex: state.ContentSwapReducer.activeTemplateIndex,
})

const mapDispatchToProps = ( dispatch ) => bindActionCreators({
  nextPage,
  gotoTemplate,
  activateTemplate,
}, dispatch )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( ContentSwap )
