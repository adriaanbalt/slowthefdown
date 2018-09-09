import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Description from '../../shared/Description'
import CornerBowl from '../../shared/CornerBowl'
import Slider from './Slider'
import {
  onChange
} from './actions'

class Design extends React.Component {

  render() {
    return (
      <div id="design">
        <Description
          title="Design"
          subtitle="What are your style preferences?"
        />
        <div className="slider-container">
          <Slider labelLow='Minimal'
            labelHigh='Bold'
            default="50"
            onChange={( val ) => this.props.onChange( 'minimalBold', val )}
          />
          <Slider labelLow='Clean'
            labelHigh='Colorful'
            default="50"
            onChange={( val ) => this.props.onChange( 'cleanColorful', val )}
          />
          <Slider labelLow='Image-Heavy'
            labelHigh='Text-Heavy'
            default="50"
            onChange={( val ) => this.props.onChange( 'imageText', val )}
          />
        </div>
        <CornerBowl />
      </div>
    )
  }
}

const mapDispatchToProps = ( dispatch ) => bindActionCreators({
  onChange,
}, dispatch )

export default connect(
  null,
  mapDispatchToProps
)( Design )
