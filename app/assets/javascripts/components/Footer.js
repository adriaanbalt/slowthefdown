'use strict';

import React from 'react';
import { Link } from 'react-router';

import Icon from './Icon';
import Login from './Login';

function Footer( props ) {
	let drawerOpen = props.drawerOpen ? ' drawerOpen' : '';
	let drawerPeak = props.drawerPeak ? ' drawerPeak' : '';
	return (
		<footer className={`Footer${ drawerOpen }${ drawerPeak }`}>
			<div className="info">
				<h6 className="highscore-small">{ props.score }</h6>
				<a className="drawerBtn" onTouchStart={ props.toggleDrawer } onClick={ props.toggleDrawer }>				
					<Icon name="icon-menu"/>	
				</a>
			</div>
			<div className="drawer">
				<div className="inner">
					<div className="highscore-container">
						<h3>High Score</h3>
						<h3 className="highscore-big">{ props.highscore }</h3>
					</div>
					<Login />
					<small><a href="http://balt.us">BALT.us</a>  Copyright 2016</small>
				</div>
			</div>
		</footer>
	);
};

export default Footer;