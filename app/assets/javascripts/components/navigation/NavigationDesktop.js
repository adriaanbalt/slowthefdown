'use strict';

import React, {Component} from 'react';
import { Link } from 'react-router';

import NavigationSearch from './NavigationSearch';

function NavigationDesktop( props ) {
	return (
		<div className="navigation">
			<div className="main-nav">
				<div className="left">
					
					<div className="links public">
						<Link className={`home${( window.location.pathname.split('/')[1] == "" ) ? " nav-active" : ""}`} to="/">Home</Link>
						<Link to="/login">Login</Link>
						<Link to="/signup">Signup</Link>
						<Link to="/terms-and-conditions">TermsAndConditions</Link>
					</div>
					
					<div className="links contractor">
						<Link to="/contractor">ContractorLanding</Link>
						<Link to="/contractor/billing">ContractorBilling</Link>
            			<Link to="/contractor/projects/details/001">ContractorProjectsDetails</Link>
						<Link to="/contractor/projects/create">ContractorProjectsCreate</Link>
						<Link to="/contractor/settings">ContractorSettings</Link>
						<Link to="/contractor/checklist">ContractorChecklist</Link>
						<Link to="/contractor/subs">ContractorSubs</Link>
					</div>

					<div className="links client">
						<Link to="/client">ClientLanding</Link>
						<Link to="/client/projects/details/001">ClientProjectsDetails</Link>
						<Link to="/client/projects/create">ClientProjectsCreate</Link>
						<Link to="/client/checklist">ClientChecklist</Link>
						<Link to="/client/settings">ClientSettings</Link>
					</div>
					
				</div>
				<div className="right">
					<NavigationSearch id="2" />
				</div>
			</div>
		</div>
	)
};

export default NavigationDesktop;