'use strict';

import React, { Component }  from 'react';
import cx from 'classnames';

import AppStore from '../stores/AppStore';
import ActionCreator from '../actions/AppActions';
import UI from '../lib/UI';

export default class Loading extends UI {
	render () {
		return(
			<div className="loading">
				<div className="loader"></div>
				<h2>Loading</h2>
			</div>
		);
	 }

};



