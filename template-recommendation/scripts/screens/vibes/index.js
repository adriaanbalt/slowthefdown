import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Description from '../../shared/Description'
import CheckableGridItem from '../../shared/checkableGridItem'
import Search from './search'
import {
  deselectImage,
  selectImage,
  saveResults
} from './VibesActions'
import Screen from '../../shared/Screen'
import STRINGS from '../../shared/i18n/strings'

class Vibes extends React.Component {

  componentWillUnmount() {
    this.props.saveResults()
  }

  render() {
    return (
      <Screen>
        <Description
          title={STRINGS.VIBES_TITLE}
          subtitle={STRINGS.VIBES_SUBTITLE}
        />
        <Search />
        <div className="vibes-container">
          {this.props.vibes.map(( vibeId, index ) => {
            const isSelected = this.props.selectedImages.includes( vibeId )
            return (
              <CheckableGridItem
                width={( index + 1 ) % 3 === 0 ? 100 : 50}
                padding={8}
                imgSrc={vibeId}
                key={vibeId}
                isSelected={isSelected}
                identifier={vibeId}
                onClick={isSelected ? this.props.deselectImage : this.props.selectImage}
              />
            )
          })}
        </div>
      </Screen>
    )
  }
}

const mapStateToProps = ( state ) => ({
  hasSelectedEnough: state.VibesReducer.hasSelectedEnough,
  selectedImages: state.VibesReducer.selectedImages,
  vibes: state.VibesReducer.vibes,
})

const mapDispatchToProps = ( dispatch ) => bindActionCreators({
  deselectImage,
  selectImage,
  saveResults,
}, dispatch )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( Vibes )
