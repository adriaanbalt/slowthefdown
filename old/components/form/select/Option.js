'use strict';

import React, {Component} from 'react';
import cx from 'classnames';
import { Link } from 'react-router';
import UI from '../../UI';
import Icon from '../../Icon';

export default class Option extends UI {

  constructor(props) {
    super(props);
  }

  handleMouseDown (event) {
    event.preventDefault();
    event.stopPropagation();
    this.props.onSelect(this.props.option, event);
  }

  handleMouseEnter (event) {
    this.onFocus(event);
  }

  handleMouseMove (event) {
    this.onFocus(event);
  }

  onFocus (event) {
    if (!this.props.isFocused) {
      this.props.onFocus(this.props.option, event);
    }
  }

  render () {
    return (
        <div className="option-select"
           onMouseDown={this.handleMouseDown.bind(this)}
           value={this.props.option.displayName}>{this.props.option.displayName}</div>
       );
  }
};
