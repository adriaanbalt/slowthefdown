import React from 'react'

export default ( props ) => (
  <li
    ref={ $el  => props.slideElRef( $el )}
    style={{
      display: 'inline-block',
      height: '100%',
      margin: `0px ${ props.slideMargin }px`,
      boxShadow: 'rgba(0, 0, 0, 0.15) 0px 6px 25px 0px',
      transition: 'opacity 500ms', // fades all slides when dragging is complete
      opacity: props.currentSlideIndex === props.slideNumber ? 1 : 0.4,
    }}
    key={props.slide.websiteIdentifier}
  >
    <img
      style={{
        display: 'inline-block',
        height: '100%',
      }}
      ref={ $el => props.imgRef( $el ) }
      onLoad={ props.handleImageLoaded }
      src={ props.slide.phoneImageAssetUrl }
    />
  </li>
)
