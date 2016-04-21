'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Router } from 'react-router';
import {IntlProvider} from 'react-intl';

import ActionCreator from './actions/AppActions';
import AppStore from './stores/AppStore';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './home/Home';
import API from './redux/API';
import _ from 'lodash';

class App extends Component {
	constructor() {
		super();

		// initialize state on this component from store
		this.state = AppStore.getState();

		this._onChange = () => {
			this.setState( AppStore.getState() );
		};

		// update mobile boolean in store based on viewport size
		this.updateViewport = () =>
			ActionCreator.setRootProps({
				isMobile : window.innerWidth <= 768,
				isTablet : 768 < window.innerWidth <= 1024,
				isDesktop : 1024 < window.innerWidth,
				windowWidth: window.innerWidth,
				windowHeight: window.innerHeight
			});

		
		// console.log ( " " );
		// API.addTask( this.state.checklist[0] );
		// API.addTask( this.state.checklist[1] );
		// API.addTask( this.state.checklist[2] );
		// API.addTask( this.state.checklist[3] );

		// console.log ( " " );
		// API.addSkill( this.state.skills[0] );
		// API.addSkill( this.state.skills[1] );
		// API.addSkill( this.state.skills[2] );
		// API.addSkill( this.state.skills[3] );
		// API.addSkill( this.state.skills[4] );

		// console.log ( " " );
		// API.addMaterial( this.state.materials[0] );
		// API.addMaterial( this.state.materials[1] );

		// console.log ( " " );
		// API.addProduct( this.state.products[0] );

		// console.log ( " " );
		// API.addProduct( this.state.products[0] );

		// console.log ( " " );
		// API.addUser( this.state.contractor );
		// API.addUser( this.state.client );

		// console.log ( " " );
		// API.addProject( this.state.projects[0] );
		// API.addProject( this.state.projects[1] );
		// API.addProject( this.state.projects[2] );
		// API.addProject( this.state.projects[3] );

		// API.updateProject( 'project-1', {
		// 	title: "dude AGAIN new title",
		// 	description: "testing this updated copy"
		// });

		// API.addRoom( this.state.rooms[0] );
		// API.addRoom( this.state.rooms[1] );
		// API.addRoom( this.state.rooms[2] );
		// API.addRoom( this.state.rooms[3] );
		// API.addRoom( this.state.rooms[4] );
		// API.addRoom( this.state.rooms[5] );

		// initialize viewport onto state
		this.updateViewport();
	}

	componentWillMount () {
		// initialize user with their locale data
		this.props.dispatch(API.authenticate());

		// listen for updates on passing viewport threshold
		window.addEventListener('orientationchange', this.updateViewport, false);
		window.addEventListener('resize', this.updateViewport, false);

		// listen for state changes, needed here for locale changes
		AppStore.listen(this._onChange);
	}

	componentWillUnmount () {
		AppStore.unlisten(this._onChange);
	}

	render () {
		return (
			<IntlProvider {...this.state.intlContent || {locales: this.state.currentLocale, messages:{}}}>
				<div  id='main' rel="main" >
					<Header />
					{
						this.props.children
					}
					<Footer />
				</div>
			</IntlProvider>
		);
	}
};

App.propTypes = {
  dispatch: PropTypes.func.isRequired
};

export default connect()(App);
