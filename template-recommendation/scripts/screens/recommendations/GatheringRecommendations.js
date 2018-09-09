import React from 'react'
import LoadingAnimation from '../../shared/LoadingAnimation'
import STRINGS from '../../shared/i18n/strings'

export default () => (
  <div className='gathering-recommendations'>
    <LoadingAnimation />
    <h3>{STRINGS.GATHERING_RECOMMENDATIONS}</h3>
  </div>
)