'use strict';

import React, { PropTypes } from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';

import UI from '../lib/UI';
import API from '../redux/API';

class HomePage extends UI {

  render () {
    console.log ( "Rnder HomePage" )
      return (

        <div>Hello World!</div>
      );
  }

};

function mapStateToProps(store) {
  return {
  };
}

HomePage.propTypes = {
  dispatch: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(HomePage);
