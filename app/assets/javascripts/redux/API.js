// import jsonTest from './utils/jsonTest';
// import pathJoin from './utils/pathJoin';

import request from 'superagent';
import Promise from 'bluebird';
import _ from 'lodash';
import shortid from 'shortid';

import pathJoin from '../lib/utils/pathJoin';
import isJSON from '../lib/utils/isJSON';
import Config from '../lib/Config';
import ActionCreator from './ActionCreator';

export default {

	authenticate() {
		return dispatch =>
			// retrieve app authentication data once root component has mounted
			Promise.all([
				this.get({ route:`/auth/session` })
			])
			.then(([user]) =>{
				return dispatch(ActionCreator.initializeUser({
					user: user || null
				}));
			});
	},

	login( user ) {
		return (dispatch) => 
			this.post({
				route: `/auth/login`,
				body: user
			})
			.then( res => {
				return Promise.all([
        			Promise.resolve(res),
					this.get({
						route: `/api/highscore`
					})
				]);
			})
			.then(([user, HighScores]) => {
				return dispatch(ActionCreator.login({
					user:user, 
					HighScores:HighScores
				}))
			})
			.catch( err => console.log(err));
	},

	logout() {
		return dispatch => this.get(`/auth/logout`)
			.then(() => dispatch(ActionCreator.logout()))
			.catch( err => console.log(err));;
	},

	addHighScore( newHighScore ) {
		console.log ( 'newHighScore', newHighScore );
		return dispatch => 
			this.post({
					route: '/api/highscore',
					body: newHighScore
				})
				.then( res => dispatch(ActionCreator.addHighScore(res)))
				.catch( err => console.log(err));
	},

	updateHighScore(HighScore) {
		const index = HighScore.editIndex;
		return dispatch => 
			this.put({
					route: `/api/highscore/${HighScore.editId}`,
					body: {
						title: HighScore.title,
						body: HighScore.body,
						createdDate: new Date()
					}
				})
				.then(res =>
					dispatch(ActionCreator.updateHighScore({
						index: index,
						post: res
					})))
				.catch( err => console.log(err));
	},

	deleteHighScore(_id) {
		return dispatch => 
			this.del(`/api/highscore/${_id}`)
				.then(res => dispatch(ActionCreator.deleteHighScore(_id)))
				.catch( (err) => console.log(err) );
	},

	getHighScoreById(_id) {
		return dispatch => 
			this.get(`/api/highscore/${_id}`)
				.then(res =>  { 
					return dispatch(ActionCreator.getHighScoreById( res ))
				})
				.catch( (err) => console.log(err) );
	},

	getAllHighScores() {
		return dispatch => 
			this.get({ route:`/api/highscore` })
				.then( (res) => dispatch(ActionCreator.getAllHighScores(res)))
				.catch( (err) => console.log(err) );
	},

	updateRoom( newRoom ) {
		return dispatch => 
			this.put({
					route:`/api/room/${ newRoom._id }`,
					body: newRoom
				})
				.then( (res) => dispatch(ActionCreator.updateRoom(res)))
				.catch( (err) => console.log(err) );
	},

	addRoom( newRoom ) {
		return dispatch => 
			this.post({
					route:`/api/room`,
					body: newRoom
				})
				.then( (res) => dispatch(ActionCreator.addRoom(res)))
				.catch( (err) => console.log(err) );
	},

	make(o){
		o.route = o.route || [];
		o.params = o.params || [];
		o.query = o.query ? `?${Object.keys(o.query).map((val) => val + "=" + (o.query[val] && typeof o.query[val] === 'object'? JSON.stringify(o.query[val]) : o.query[val]) ).join("&")}` : "";
		o.body = o.body || {};
		o.headers = o.headers || {'Accept':'application/json'}; // default to 'Accept': 'application/json' header

		console.log ( "  > API makeRequest ", o.method, o.route, o.body, o.params );

		return new Promise((resolve, reject) => {
			request
			[o.method]( o.route )
				// [o.method](pathJoin(o.route, typeof o.params === 'string' ? o.params : pathJoin(...o.params)) + o.query) // if o.params is not string destructure it
				.set(o.headers)
				.send(o.body)
				.end((err, res) => err ?
				reject(err) :
				resolve(isJSON(res.text) ? JSON.parse(res.text) : res.text));
		});

	},

	get (o) {
		if(typeof o === 'string') o = {route: o}; // if string is passed just use that as route
		o.method = 'get';
		return this.make(o);
	},

	del (o) {
		if(typeof o === 'string') o = {route: o}; // if string is passed just use that as route
		o.method = 'del';
		return this.make(o);
	},

	post (o) {
		if(typeof o === 'string') o = {route: o}; // if string is passed just use that as route
		o.method = 'post';
		return this.make(o);
	},

	put (o) {
		if(typeof o === 'string') o = {route: o}; // if string is passed just use that as route
		o.method = 'put';
		return this.make(o);
	},

	handleError ( res, route ) {
		if ( !res.success ) {
			Promise.reject( 'Error ', route );
		}
	},

};