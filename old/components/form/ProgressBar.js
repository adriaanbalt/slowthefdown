'use strict';

import React, {Component} from 'react';
import UI from '../../lib/UI';
import cx from 'classnames';

export default class ProgressBar extends UI {

  constructor(props) {
    super(props);
  }

  render () {
    var classnames = cx({ 'progress': true, 'selected': this.props.selected })
    return (
        <div className="progress-wrapper">
          <progress value={this.props.value} max="100"></progress>
        </div>
    );
  }
};
