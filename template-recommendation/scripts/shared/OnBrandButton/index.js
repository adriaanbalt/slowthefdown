import React from 'react'

/*
  A squarespacey button. You can still add custom styles via style prop. Everything else (including children) is passed.
*/
export default ({ style, ...props }) => (
  <div
    style={{
      display: 'inline-block',
      width: '100%',
      height: '55px',
      lineHeight: '55px',
      fontSize: '11px',
      boxSizing: 'border-box',
      border: '1px solid #979797',
      cursor: 'pointer',
      textTransform: 'uppercase',
      fontWeight: '500',
      letterSpacing: '1.5px',
      textAlign: 'center',
      ...style,
    }}
    {...props}
  />
)