import React from 'react'

export default () => (
  <div style={{
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  }}
  >
    <p style={{
      fontSize: 18,
      fontWeight: 100,
      marginBottom: 20,
      width: 205,
      textAlign: 'center',
    }}
    >Don't see what you're looking for?</p>
    <a
      style={{
        textDecoration: 'underline',
        fontSize: 11,
        textTransform: 'uppercase',
      }}
      href="https://www.squarespace.com/templates"
    >See all templates</a>
  </div>
)