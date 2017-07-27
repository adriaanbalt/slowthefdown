'use strict';

import React, {Component} from 'react';
import AppStore from '../../stores/AppStore';
import cx from 'classnames';
import { Link } from 'react-router';
import UI from '../../lib/UI';
import Icon from '../Icon';

export default class Form extends UI {

  constructor(props) {
    super(props);
  }

  render () {

    return (
      <form onSubmit={this.props.onSubmit}>
        {this.props.children}
      </form>
    );

  }
};
