import React from 'react'
import { startAnimation, stopAnimation } from './controller'

export default class LoadingAnimation extends React.PureComponent {

  componentDidMount() {
    startAnimation( this.$container )
  }

  componentWillUnmount() {
    stopAnimation( this.$container )
  }

  render() {
    return (
      <div id="loading-animation">
        <div id="scroll-container"
          ref={( $container ) => this.$container = $container}
        >
          <div className="flex-wrapper">

            <div className="row">
              <section />
              <section />
              <section />
            </div>
            <div className="row">
              <section />
              <section />
            </div>
            <div className="row">
              <section />
            </div>
          </div>
        </div>
      </div>
    )
  }
}