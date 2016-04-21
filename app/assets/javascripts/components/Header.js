'use strict';

import React from 'react';
import cx from 'classnames';

import AppStore from '../stores/AppStore';
import ActionCreator from '../actions/AppActions';
import UI from '../lib/UI';
import Navigation from './navigation/Navigation';

export default class Header extends UI {

  render () {
    return (
      <header className='Header'>
      	<Navigation />
      </header>
    )
  }

};
