'use strict';

import React from 'react';
import cx from 'classnames';
import { Link } from 'react-router';

import API from '../../redux/API';
import AppStore from '../../stores/AppStore';
import ActionCreator from '../../actions/AppActions';
import Page from '../../lib/Page';
import TextArea from '../../components/form/TextArea';
import Checkbox from '../../components/form/Checkbox';

export default class ClientCreate extends Page {

	componentWillMount () {
		document.title = `Contracktor`;
		super.componentWillMount();
	}

	render () {
		return (
			<div className='Create Page'>
				<div className='container'>
					<h2>Create</h2>
					<h6></h6>
					<ul>
						<li>
							<Checkbox />
							<span>Feature 1</span>
						</li>
						<li>
							<Checkbox />
							<span>Feature 2</span>
						</li>
						<li>
							<Checkbox />
							<span>Feature 3</span>
						</li>
					</ul>
				</div>
			</div>
		);
	}

};
