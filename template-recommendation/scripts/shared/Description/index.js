import React from 'react'

class Description extends React.Component {
  getHeight() {
    return this.$container.offsetHeight +
      parseInt( window.getComputedStyle( this.$container ).marginBottom, 10 ) +
      parseInt( window.getComputedStyle( this.$container ).marginTop, 10 )
  }

  render() {
    return (
      <div
        className="title-container"
        ref={( $el ) => this.$container = $el}
      >
        <h1
          className="title"
        >{this.props.title}</h1>
        <h2
          className="subtitle"
        >{this.props.subtitle}</h2>
      </div>
    )
  }
}

export default Description