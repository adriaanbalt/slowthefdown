'use strict';

import React, { PropTypes } from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';

import UI from '../lib/UI';
import API from '../redux/API';

class TermsPage extends UI {

  render () {
      return (
        <div>TERMS AND CONDITIONS</div>
      );
  }

};

function mapStateToProps(store) {
  return {
  };
}

TermsPage.propTypes = {
  dispatch: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(TermsPage);
