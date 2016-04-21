'use strict';

import React from 'react';
import cx from 'classnames';
import { Link } from 'react-router';

import API from '../redux/API';
import AppStore from '../stores/AppStore';
import ActionCreator from '../actions/AppActions';
import Page from '../lib/Page';
import Login from '../components/Login';

export default class LoginPage extends Page {

  componentWillMount () {
    document.title = `Contracktor`;
    super.componentWillMount();
  }

  render () {
      return (
        <div className='Login Page'>
          <div className='container'>
            <Login />
          </div>
        </div>
      );
  }

};
