'use strict';

import React from 'react';
import cx from 'classnames';
import { Link } from 'react-router';

import API from '../../redux/API';
import AppStore from '../../stores/AppStore';
import ActionCreator from '../../actions/AppActions';
import Page from '../../lib/Page';

export default class Checklist extends Page {

  componentWillMount () {
    document.title = `Contracktor - Checklist`;
    super.componentWillMount();
  }

  render () {
      return (
        <div className='Checklist Page'></div>
      );
  }

};
