'use strict';

import React from 'react';
import cx from 'classnames';
import UI from '../lib/UI';

export default class Icon extends UI {
	render () {
		return (
			<span className={`icon icon-${ this.props.name }`}></span>
		)
	}
};
