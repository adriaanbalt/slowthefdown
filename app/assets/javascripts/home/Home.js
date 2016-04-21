'use strict';

import React from 'react';
import cx from 'classnames';
import { Link } from 'react-router';

import API from '../redux/API';
import AppStore from '../stores/AppStore';
import ActionCreator from '../actions/AppActions';
import Page from '../lib/Page';
import Login from '../components/Login';

export default class Home extends Page {

  componentWillMount () {
    document.title = `Contracktor`;

    // attach state
    super.componentWillMount();
  }

  render () {
      return (
        <div className='Home Page'>
          <div className='Home-container'>
            <section>
              <h2>Keep your renovation ontrack!</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
              <h1>VIDEO</h1>
              <Login />
              <Link to="/signup">Sign Up</Link>
              <h1>Features</h1>
              <h1>Images of Steps</h1>
            </section>
          </div>
        </div>
      );
  }

};
