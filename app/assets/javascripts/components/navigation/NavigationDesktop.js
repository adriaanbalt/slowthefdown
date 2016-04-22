'use strict';

import React, {Component} from 'react';
import { Link } from 'react-router';

import NavigationSearch from './NavigationSearch';

function NavigationDesktop( props ) {
	return (
		<div className="navigation">
			<div className="main-nav">
				<Link className={`home${( window.location.pathname.split('/')[1] == "" ) ? " nav-active" : ""}`} to="/">Home</Link>
				<Link to="/login">Login</Link>
				<Link to="/signup">Signup</Link>
				<Link to="/terms-and-conditions">TermsAndConditions</Link>
			</div>
		</div>
	)
};

export default NavigationDesktop;