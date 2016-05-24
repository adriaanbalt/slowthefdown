'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Router } from 'react-router';

import Header from './components/Header';
import Footer from './components/Footer';
import API from './redux/API';
import ActionCreator from './redux/ActionCreator';
import _ from 'lodash';

class App extends Component {
	
	updateViewport() {
		// ActionCreator.setRootProps({
		// 	isMobile : window.innerWidth <= 768,
		// 	isTablet : 768 < window.innerWidth <= 1024,
		// 	isDesktop : 1024 < window.innerWidth,
		// 	windowWidth: window.innerWidth,
		// 	windowHeight: window.innerHeight
		// });
	}

	componentWillMount () {
		// initialize user with their locale data
		this.props.dispatch(API.authenticate());

		// listen for updates on passing viewport threshold
		window.addEventListener('orientationchange', this.updateViewport, false);
		window.addEventListener('resize', this.updateViewport, false);
	}

	toggleDrawer() {
		console.log ('toggleDrawer');
		this.props.dispatch( ActionCreator.toggleDrawer() );
	}

	render () {
		console.log ( "this.props", this.props );
		return (
			<div  id='main' rel="main" >
				<Header />
				{
					this.props.children
				}
				<Footer 
					score={ this.props.score} 
					highscore={ (this.props.user && this.props.user.highscore && this.props.user.highscore.score) || this.props.highscore.score } 
					toggleDrawer={ () => this.toggleDrawer() } 
					drawerOpen={ this.props.drawerOpen } 
					drawerPeak={ this.props.drawerPeak } />
			</div>
		);
	}
};

function mapStateToProps(store) {
  return {
  	user: store.user,
    score: store.score,
    highscore: store.highscore,
    drawerOpen: store.drawerOpen,
    drawerPeak: store.drawerPeak
  };
}
App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object,
  score: PropTypes.number,
  highscore: PropTypes.object,
  drawerOpen: PropTypes.bool,
  drawerPeak: PropTypes.bool
};

export default connect(mapStateToProps)(App);
