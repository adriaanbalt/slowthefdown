'use strict';

import React, {Component} from 'react';
import AppStore from '../../stores/AppStore';
import cx from 'classnames';
import { Link } from 'react-router';
import UI from '../../lib/UI';

import InputElement from './InputElement';

export default class Radio extends InputElement {

  render () {
    var { value, ...other } = this.props;

    return (
      <div className="radio">
        <label >
          <input type="radio" { ...other} value={this.props.option.displayName} /><span className="check"></span>
              {this.props.option.image   ? (
                <img src={ this.props.option.image.url } />
              ) : <span>{this.props.option.displayName}</span> }

        </label>
      </div>
    );
  }

};
