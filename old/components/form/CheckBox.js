'use strict';

import React, {Component} from 'react';
import cx from 'classnames';
import { Link } from 'react-router';

import UI from '../../lib/UI';
import InputElement from './InputElement';
import AppStore from '../../stores/AppStore';
import ActionCreator from '../../actions/AppActions';

export default class Checkbox extends UI {

  render () {
    return (
      <div className="checkbox">
          <input type="checkbox"/>
      </div>
    );
  }
};
