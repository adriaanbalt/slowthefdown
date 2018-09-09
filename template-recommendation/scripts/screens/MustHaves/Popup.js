import React from 'react'
import OnBrandButton from '../../shared/OnBrandButton'

const Popup = ({ label, description, closeHandler }) => (
  <div style={
    {
      display: 'flex',
      'alignItems': 'center',
      'justifyContent': 'space-around',
      flexDirection: 'column',
      width: '72vw',
      minWidth: '300px',
      height: '60vh',
      minHeight: '430px',
      padding: '30px 20px',
      boxSizing: 'border-box',
      background: 'white',
      boxShadow: '0px 20px 200px rgba(0, 0, 0, 0.1)',
    }}
  >
    <h1 style={{ fontWeight: '400', alignSelf: 'flex-start', fontSize: '24px' }}>{label}</h1>
    <img style={{ width: '100%', border: '1px solid #DDD', maxHeight: '300px' }}
      src="https://s3.amazonaws.com/sqs.f.cl.ly/items/2622250v0I2j3n3O3Y41/Screen%20Recording%202018-03-02%20at%2002.50%20PM.gif?X-CloudApp-Visitor-Id=9f507b1a8ee45357572705c791e31108&v=45d272da"
    />
    <p style={{
      flexGrow: '1',
      display: 'flex',
      alignItems: 'center',
      fontSize: '13px',
      fontWeight: '300',
      lineHeight: '22px',
      color: '#767676',
    }}
    >
      {description}
    </p>
    <OnBrandButton
      onTouchEnd={closeHandler}
      onClick={closeHandler}
    >
    Got it
    </OnBrandButton>
  </div>
)

export default Popup