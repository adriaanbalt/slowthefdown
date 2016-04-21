'use strict';

import React from 'react';
import cx from 'classnames';
import { Link } from 'react-router';

import API from '../../redux/API';
import AppStore from '../../stores/AppStore';
import ActionCreator from '../../actions/AppActions';
import Page from '../../lib/Page';

export default class Details extends Page {

  componentWillMount () {
    document.title = `Contracktor`;

    // attach state
    super.componentWillMount();
  }

  render () {
      return (
        <div className='Details Page'>
          <div className='container'>
            <h1>Budget</h1>
            <h1>Progress</h1>
            <h1>Tasks</h1>
            <h1>Calendar</h1>
            <h1>Rooms</h1>
            <ul>
              <li>
                <h4>Kitchen</h4>
                <p>2x</p>
              </li>
              <li>
                <h4>Bathroom</h4>
                <p>5x</p>
              </li>
              <li>
                <h4>Foyer</h4>
                <p>2x</p>
              </li>
              <li>
                <h4>Bedroom</h4>
                <p>3x</p>
              </li>
              <li>
                <h4>Garden</h4>
                <p>3x</p>
              </li>
            </ul>
          </div>
        </div>
      );
  }

};
