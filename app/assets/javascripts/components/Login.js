'use strict';

import React, { PropTypes } from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';

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
		this.props.dispatch(
			API.logout()
		);
	}

	onFocus() {

	}
	
	onChange() {
		
	}

	render () {
		const user = this.props.user;
		return (

		  <ul className="nav navbar-nav navbar-right">
			<li className={`nav user-photo ${user && user.google && user.google.photo && 'show'}`}
				style={user && user.google && user.google.photo && {backgroundImage: `url(${user.google.photo})`}}/>
			<li className={`nav user-photo ${user && user.facebook && user.facebook.photo && 'show'}`}
				style={user && user.facebook && user.facebook.photo && {backgroundImage: `url(${user.facebook.photo})`}}></li>
			<li className="nav-button">
			  {
				(!user || !user.email || !user.hasPassword || !user.google || !user.google.photo || !user.facebook || !user.facebook.photo)
				&&
				<span>
				  LOG IN
				  {
					(!user || !user.google)
					&&
					<a href="/auth/google"><i className="fa fa-google o-auth-btn"></i></a>
				  }
				  {
					(!user || !user.facebook)
					&&
					<a href="/auth/facebook"><i className="fa fa-facebook o-auth-btn"></i></a>
				  }
				  {
					(!user || !user.email)
					&&
					<input 
						ref="email" 
						type="text" 
						className="textinput" 
						name="emailInput" 
						placeholder="email"
						onFocus={ this.onFocus.bind(this) } 
						onChange={ this.onChange.bind(this) }/>
				  }
				  {
					(!user || !user.hasPassword)
					&&
					<input 
						ref="password" 
						type="text" 
						className="textinput" 
						name="passwordInput" 
						placeholder="password"
						onFocus={ this.onFocus.bind(this) } 
						onChange={ this.onChange.bind(this) }/>
				  }
				  {
					(!user || !user.hasPassword)
					&&
					<button className="local-auth-button" onClick={this.login.bind(this)}>Post LocalAuth</button>
				  }
				</span>
			  }
			  {
				user
				&&
				<a className="nav-button log-out-button show" href="#" onClick={this.logout.bind(this)}>
				  LOG OUT
				</a>
			  }
			</li>
		  </ul>
		);
	}
};

function mapStateToProps(store) {
  return {
	user: store.user,
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
