'use strict';

import React, { PropTypes } from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';

import Icon from './Icon';
import UI from '../lib/UI';
import API from '../redux/API';

import TextInput from './form/TextInput';

class Login extends UI {

	login() {
		let email = this.refs.email && this.refs.email.value;
		let password = this.refs.password && this.refs.password.value;
		this.props.dispatch(
			API.login(_.merge( { email: email, password: password }, _.omit(this.props.user, ['email','password']) ))
			// API.login(email, password)
		);
	}

	logout(e) {
		e.preventDefault();
		this.props.dispatch( API.logout() );
	}

	googleAuth() {
		e.preventDefault();
		window.location="/auth/google";
	}

	facebookAuth(e) {
		e.preventDefault();
		window.location="/auth/facebook";
	}

	render () {
		const user = this.props.user;

		/*
		<li className={`nav user-photo ${user && user.google && user.google.photo && 'show'}`}
			style={user && user.google && user.google.photo && {backgroundImage: `url(${user.google.photo})`}}/>
		<li className={`nav user-photo ${user && user.facebook && user.facebook.photo && 'show'}`}
			style={user && user.facebook && user.facebook.photo && {backgroundImage: `url(${user.facebook.photo})`}}></li>
		<a href="/auth/google" onTouchStart={ this.googleAuth.bind(this) }>Google</a>
		*/

		return (
		  <div>
		  	{
			!user
			&&
			<a className="facebook log-button" href="/auth/facebook" onTouchStart={ this.facebookAuth.bind(this) }><Icon name="icon-facebook"/><span className="font-bold">Login </span> <span className="font-reg">with</span> <span className="font-bold">Facebook</span></a>
			}
			{
			user
			&&
			<a className="log-button" href="#" onClick={this.logout.bind(this)} onTouchStart={this.logout.bind(this)}><Icon name="icon-facebook"/>Log out</a>
		  	}
		  </div>
		);
	}
};

function mapStateToProps(store) {
  return {
	user: store.user
  };
}

Login.propTypes = {
  user: PropTypes.shape({
	_id: PropTypes.string.isRequired,
	createdDate: PropTypes.string.isRequired,
	lastLoginDate: PropTypes.string,
	type: PropTypes.string, 
	avatar: PropTypes.string,
	email: PropTypes.string,
	phone: PropTypes.string,
	fax: PropTypes.string,
	hasPassword: PropTypes.bool,
	google: PropTypes.shape({
	  _id: PropTypes.string,
	  photo: PropTypes.string,
	  link: PropTypes.string
	}),
	facebook: PropTypes.shape({
	  _id: PropTypes.string,
	  photo: PropTypes.string,
	  link: PropTypes.string
	})
  }),
  dispatch: PropTypes.func.isRequired
};



export default connect(mapStateToProps)(Login);
