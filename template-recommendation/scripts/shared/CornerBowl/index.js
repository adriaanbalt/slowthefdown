import React from 'react'

const cornerImage = {
  position: 'absolute',
  right: '0',
  bottom: '0',
  zIndex: '-1',
  userSelect: 'none',
  pointerEvents: 'none',
  maxWidth: '100%',
  width: '100%',
}

export default () =>   (
  <img src="/assets/images/bowl.png"
    style={cornerImage}
  />
)
