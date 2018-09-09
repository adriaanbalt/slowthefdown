import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

const Header = ( props ) => (
  <div>
    <button onClick={ props.closeDrawer }>X</button>
  </div>
)

const mapDispatchToProps = ( dispatch ) => bindActionCreators({
}, dispatch )

export default connect(
  null,
  mapDispatchToProps
)( Header )
