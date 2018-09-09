import React from 'react'


const PillHeight = 48
const YPadding = 10
const XPadding = 30
const getPx = ( val ) => `${ val }px`

const Pill = ( props ) => {
  // Need to pass down the callbacks from LongTouchable
  const { children, selected, ...touchableProps } = props
  return (
    <div
      style={{
        display: 'inline-block',
        width: 'auto',
        height: getPx( PillHeight ),
        lineHeight: getPx( PillHeight - YPadding - YPadding ), // height - paddingtop - paddingbottom
        padding: `${ getPx( YPadding ) } ${ getPx( XPadding ) }`,
        textAlign: 'center',
        boxSizing: 'border-box',
        borderRadius: getPx( PillHeight ),
        border: '1px solid rgba(0, 0, 0, 0.2)',
        margin: '5px',
        fontSize: '14px',
        userSelect: 'none',
        color: selected ? 'white' : '#313131',
        backgroundColor: selected ? '#313131' : '#f7f7f7',
        transition: 'background-color 250ms',
        WebkitTapHighlightColor: 'transparent'

      }}
      {...touchableProps}
    >
      {children}
    </div>
  )
}

export default Pill