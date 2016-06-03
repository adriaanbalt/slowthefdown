'use strict';

import React from 'react';
import { Link } from 'react-router';

import Icon from './Icon';
import Login from './Login';
import Ads from '../lib/Ads';

function Footer( props ) {
	let drawerOpen = props.drawerOpen ? ' drawerOpen' : '';
	let drawerPeak = props.drawerPeak ? ' drawerPeak' : '';
	return (
		<footer className={`Footer${ drawerOpen }${ drawerPeak }`}>
			<div className="info">
				<h3 className="highscore big">{ props.highscore }</h3>
				<h2 className="highscore small">{ props.score }</h2>
				<a className="drawerBtn" onTouchStart={ props.toggleDrawer } onClick={ props.toggleDrawer }>				
					<Icon name="icon-menu"/>	
				</a>
			</div>
			<div className="drawer">
				<div className="inner"> 
					<Login />
					<small><a href="http://balt.us" onTouchStart={ props.gotoBalt }>BALT.us</a> Copyright &#169; 2016</small>
				</div>
			</div>
		</footer>
	);
};

export default Footer;