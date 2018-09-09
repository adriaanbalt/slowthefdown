import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  setRecommendations,
  onSelectTemplate,
  showRecommendations
} from './RecommendationsActions'
import { TRACK_LINK_CLICK_PREVIEW } from '../../shared/TrackableLink/LinkActions'
import Screen from '../../shared/Screen'
import Carousel from './Carousel'
import GetStartedButton from './GetStartedButton'
import NoTemplateCard from './NoTemplateCard'
import Description from '../../shared/Description'
import GatheringRecommendations from './GatheringRecommendations'
import hasEnoughDataToRecommend from '../../selectors/hasEnoughDataToRecommend'
import classnames from 'classnames'
import STRINGS from '../../shared/i18n/strings'
import TrackableLink from '../../shared/TrackableLink'

const MIN_WAIT_TIME = 2000

class Recommendations extends React.Component {

  constructor( props ) {
    super( props )
    this.state = { offset: 0 }
  }

  componentWillMount() {
    this.setState({ waitedMinGatheringTime: false })
    setTimeout(() => {
      this.setState({ waitedMinGatheringTime: true })
      // if we got data and then waited the minimum time, call show recommendations action
      if ( this.props.hasEnoughDataToRecommend ) {
        this.props.showRecommendations()
      }
    }, MIN_WAIT_TIME )
  }

  async componentDidMount() {
    // set recommendations based on what was swiper from the previous screen
    await this.props.setRecommendations()
    this.setState({
      descriptionHeight: this.$Description.getHeight(),
      buttonsHeight: this.$buttons.offsetHeight,
    })
  }

  componentWillReceiveProps( nextProps ) {
    if (
      this.props.recommendations && nextProps && this.props.recommendations.length !== nextProps.recommendations.length
    ) {
      this.props.onSelectTemplate( nextProps.recommendations[ 1 ])
    }

    // if we've waiting the minimum time and then get data, call show recommendations action
    if (
      !this.props.hasEnoughDataToRecommend && nextProps.hasEnoughDataToRecommend && this.state.waitedMinGatheringTime
    ) {
      this.props.showRecommendations()
    }
  }

  render() {
    const template = this.props.recommendations[ this.props.currentSlideIndex ]
    const isGathering = !this.state.waitedMinGatheringTime || !this.props.hasEnoughDataToRecommend

    return (
      <Screen className={classnames( 'recommendations-screen', { 'is-gathering': isGathering })}>
        <GatheringRecommendations />
        <Description
          title={STRINGS.YOUR_RESULTS}
          ref={( $el ) => this.$Description = $el }
        />
        {
          this.props.recommendations && (
            <Carousel
              descriptionHeight={this.state.descriptionHeight}
              buttonsHeight={this.state.buttonsHeight}
              slides={ this.props.recommendations.concat( <NoTemplateCard /> )}
            />
          )}
        <div
          ref={( $el ) => this.$buttons = $el}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            paddingBottom: 10,
            width: '100%',
          }}
        >
          <GetStartedButton template={template} />
          {template && (
            <div
              style={{
                textAlign: 'center',
              }}
            >
              <TrackableLink
                className="preview-link"
                style={{
                  color: 'black',
                  fontSize: 11,
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  outline: 'none',
                  fontWeight: 500,
                  lineHeight: '16px',
                  letterSpacing: '1.5px',
                  position: 'relative',
                  paddingBottom: 5.5,
                }}
                href={template.websiteUrl}
                label={`${ STRINGS.PREVIEW_TEMPLATE } ${ template.displayName }`}
                target="_blank"
                trackingData={{
                  templateId: template.websiteId,
                }}
                actionType={ TRACK_LINK_CLICK_PREVIEW }
              />
            </div>
          )}
        </div>
      </Screen>
    )
  }
}

const mapStateToProps = ( state ) => ({
  recommendations: state.RecommendationsReducer.recommendations,
  selectedTemplate: state.RecommendationsReducer.selectedTemplate,
  currentSlideIndex: state.RecommendationsReducer.currentSlideIndex,
  hasEnoughDataToRecommend: hasEnoughDataToRecommend( state ),
})

const mapDispatchToProps = ( dispatch ) => bindActionCreators({
  onSelectTemplate,
  setRecommendations,
  showRecommendations
}, dispatch )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( Recommendations )
