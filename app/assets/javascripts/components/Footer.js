'use strict';

import React from 'react';
import cx from 'classnames';
import { Link } from 'react-router';

import AppStore from '../stores/AppStore';
import ActionCreator from '../actions/AppActions';
import UI from '../lib/UI';

export default class Footer extends UI {

  render () {
    return (
      <footer className='Footer'>
      	<div className="inner">
      		<Link to="/login">Login</Link>
      		<Link to="/termsandconditions">Terms and Conditions</Link>
      		<p>Copyright 2016</p>
      	</div>
      </footer>
    )
  }

};
