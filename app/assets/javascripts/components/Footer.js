'use strict';

import React from 'react';
import { Link } from 'react-router';

import Icon from './Icon';

function Footer( props ) {
	return (
		<footer className={`Footer ${ props.drawerOpen }`}>
			<div className="info">
				<h6 className="highscore-small">{ props.highscore.highscore }</h6>
				<a className="drawerBtn" onClick={ props.toggleDrawer }>				
					<Icon name="icon-menu"/>	
				</a>
			</div>
			<div className="drawer">
				<div className="inner">
					<div className="highscore-container">
						<h3>HighScore</h3>
						<h3 className="highscore-big">{ props.highscore.highscore }</h3>
					</div>
					<p>BALT.us  Copyright 2016</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;