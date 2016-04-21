'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Element from '../../lib/Element';
import NavigationDesktop from './NavigationDesktop';
import NavigationMobile from './NavigationMobile';
import Login from '../Login';

class Navigation extends Element {

	render() {
		return (
			<div>
				{
					this.props.isMobile
					&&
					<NavigationMobile />
					||
					<NavigationDesktop />
				}
				<Login />
			</div>
		);
	}

};

function mapStateToProps(store) {
  return {
    isMobile: store.isMobile
  };
}

Navigation.propTypes = {
   isMounted: PropTypes.bool,
  dispatch: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(Navigation);