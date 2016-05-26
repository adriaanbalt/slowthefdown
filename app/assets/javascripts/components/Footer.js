'use strict';

import React from 'react';
import { Link } from 'react-router';

import Icon from './Icon';
import Login from './Login';
import Ads from '../lib/Ads';

function Footer( props ) {
	let drawerOpen = props.drawerOpen ? ' drawerOpen' : '';
	let drawerPeak = props.drawerPeak ? ' drawerPeak' : '';
    // <ins className="adsbygoogle"
    // 	 style={{display: 'block'}}
    //      data-ad-client="ca-pub-3194664333843576"
    //      data-ad-slot="7746823241"
    //      data-ad-test="on"
    //      data-ad-format="auto"></ins>
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
				    <Ads 
				    	open={ props.drawerOpen }
				    	id="div-gpt-ad-1464203173988-0"
				    	adUnit="/22986605/slowthefdown"
				    	slot="7746823241" 
				    	format="auto" 
				    	client="ca-pub-3194664333843576" 
				    	width="300" 
				    	height="100"/>
					<div>
						<h3>High Score</h3>
						<h3 className="highscore-big">{ props.highscore }</h3>
					</div>
					<Login />
					<small><a href="http://balt.us">BALT.us</a> 123 Copyright 2016</small>
				</div>

			</div>
		</footer>
	);
};

export default Footer;