'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import UI from '../../lib/UI';
import NavigationDesktop from './NavigationDesktop';
import NavigationMobile from './NavigationMobile';

class Navigation extends UI {

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