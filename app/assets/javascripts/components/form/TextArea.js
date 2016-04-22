'use strict';

import React, {Component} from 'react';
import AppStore from '../../stores/AppStore';
import cx from 'classnames';
import { Link } from 'react-router';
import UI from '../../lib/UI';
import InputElement from './InputElement';
import Icon from '../Icon';

export default class TextArea extends InputElement {

  render () {

    return (

        <textarea className="textarea"></textarea>

    );
  }
};
