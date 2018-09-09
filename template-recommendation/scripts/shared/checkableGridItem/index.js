import React from 'react'
import classnames from 'classnames'
import Waypoint from 'react-waypoint'
import Checkmark from '../checkmark'

const styles = {
  image: {
    transition: 'opacity 500ms ease-in-out',
    maxWidth: 'none',
    position: 'absolute',
    height: '100%',
    width: 'auto',
    top: 0,
    left: 0,
  },
  container: {
    width: '50%',
    padding: '6px',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    userSelect: 'none',
  },
  imageWrapper: {
    display: 'block',
    paddingTop: '100%',
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    height: '0',
  },
  checkmarkWrapper: {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    top: '50%',
    left: '50%',
  },
  label: {
    display: 'block',
    lineHeight: '10px',
    marginTop: '15px',
    marginBottom: '5px',
    opacity: 0.5,
    fontSize: '15px',
    fontWeight: 500,
  },
}

class CheckableGridItem extends React.Component {
  constructor( props ) {
    super( props )
    if ( props.width !== 50 && props.width !== 100 ) console.warn( 'HEY! CheckableGridItem prefers a width of 50 or 100, instead of provided', props.width )
    this.state = {
      isImageLoaded: false,
      imageTagSource: undefined, // Image source gets populated when Waypoint says its in the view, causing a lazy load.
    }
    this.handleClick = this.handleClick.bind( this )
    this.onLoad = this.onLoad.bind( this )
    this.loadImage = this.loadImage.bind( this )
  }

  handleClick( e ) {
    this.props.onClick( this.props.identifier )
  }

  onLoad() {
    const imageAspectRatio = this.$img.naturalWidth / this.$img.naturalHeight
    const containerAspectRatio = this.props.width > 50 ? 2 : 1

    const shouldFillWidth = imageAspectRatio < containerAspectRatio

    this.setState({
      isImageLoaded: true,
      fitWidth: shouldFillWidth,
      fitHeight: !shouldFillWidth,
    })
  }

  loadImage() {
    this.setState({ imageTagSource: this.props.imgSrc })
  }

  componentDidMount() {
    this.$img.addEventListener( 'load', this.onLoad )
  }

  componentWillUnmount() {
    this.$img.removeEventListener( 'load', this.onLoad )
  }

  getOpacity() {
    let selectedOpacity = this.props.isSelected ? '0.7' : '1.0'
    return this.state.isImageLoaded ? selectedOpacity : '0.0'
  }

  render() {
    const { label, padding, width, isSelected } = this.props
    const { imageTagSource, fitWidth, fitHeight } = this.state
    const lazyLookahead = -window.innerHeight
    return (
      <Waypoint onEnter={this.loadImage}
        topOffset={lazyLookahead}
        bottomOffset={lazyLookahead}
      >
        <div
          style={{
            ...styles.container,
            padding,
            width: `${ width }%`,
          }}
          onClick={this.handleClick}
        >
          <div style={{
            ...styles.imageWrapper,
            paddingTop: width === 50 ? '100%' : '50%',
          }}
          >
            <img src={imageTagSource}
              ref={( $img ) => this.$img = $img}
              style={{
                ...styles.image,
                width: fitWidth ? '100%' : 'auto',
                height: fitHeight ? '100%' : 'auto',
                opacity: this.getOpacity(),
              }}
            />
            {isSelected && <div style={styles.checkmarkWrapper}><Checkmark /></div>}
          </div>
          {label && <div style={styles.label}>{label}</div>}
        </div>
      </Waypoint>
    )
  }
}

CheckableGridItem.defaultProps = {
  width: 50,
  padding: 6,
}

export default CheckableGridItem