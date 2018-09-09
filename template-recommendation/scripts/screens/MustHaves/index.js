import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Description from '../../shared/Description'
import LongTouchable from '../../shared/LongTouchable'
import CornerBowl from '../../shared/CornerBowl'
import Screen from '../../shared/Screen'
import features from './features'
import Popup from './Popup'
import Pill from './Pill'

import {
  openModal,
  closeModal
} from '../../shared/Modal/ModalActions'

import {
  onSelectFeature,
  onDeselectFeature,
  saveResults
} from './actions'

const paddingBottom = 44

class MustHaves extends React.Component {

  render() {
    return (
      <Screen>
        <Description
          ref={( $el ) => this.$description = $el}
          title="Must Haves"
          subtitle="Press and hold on a feature to learn more."
        />
        <div
          style={{
            marginTop: '20px',
            marginLeft: '-5px',
            paddingBottom,
          }}
        >
          {features.map(( feature ) => {
            const isSelected = this.props.selectedFeatures.includes( feature.label )
            const clickHandler = isSelected ? () => this.props.onDeselectFeature( feature.label ) : () => this.props.onSelectFeature( feature.label )
            const PopupWithProps = () => Popup({ label: feature.label, description: feature.description, closeHandler: this.props.closeModal })
            const openPopup = () => this.props.openModal( PopupWithProps )
            return (
              <LongTouchable
                time={250}
                onLongTouch={openPopup}
                key={feature.label}
              >
                <Pill selected={isSelected}
                  onClick={clickHandler}
                >{feature.label}</Pill>
              </LongTouchable>
            )
          })}
        </div>
        {
          this.props.currentPrototype === 'contentswap' &&
          <CornerBowl />
        }
      </Screen>
    )
  }

}

const mapStateToProps = ( state ) => ({
  currentPrototype: state.QueueReducer.currentPrototype,
  selectedFeatures: state.MustHavesReducer.selectedFeatures,
})

const mapDispatchToProps = ( dispatch ) => bindActionCreators({
  saveResults,
  openModal,
  closeModal,
  onSelectFeature,
  onDeselectFeature,
}, dispatch )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( MustHaves )
