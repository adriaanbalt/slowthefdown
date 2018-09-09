import React from 'react'

const buttonStyles = {
  border: '1px solid white',
  textTransform: 'uppercase',
  fontFamily: 'Gotham, sans-serif',
  background: 'inherit',
  padding: '20px',
  width: '90%',
  margin: '20px 0 10px 0',
  display: 'block',
  outline: 'none',
  fontSize: 11,
  fontWeight: 500,
  lineHeight: '16px',
  letterSpacing: '1.5px',
}

export default ( props ) => (
  <button
    style={{
      border: `1px solid ${ props.color }`,
      textTransform: 'uppercase',
      fontFamily: 'Gotham, sans-serif',
      background: 'inherit',
      padding: '20px',
      width: '90%',
      margin: '20px 0 10px 0',
      display: 'block',
      outline: 'none',
      fontSize: 11,
      fontWeight: 500,
      lineHeight: '16px',
      letterSpacing: '1.5px',
    }}
    onClick={props.onClick}
  >{props.label}
  </button>
)