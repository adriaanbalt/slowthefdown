const mongoose = require('mongoose');
const HighScore = mongoose.model('HighScore');
const User = mongoose.model('User');
const Promise = require('bluebird');
const shortid = require('shortid');
const _ = require('lodash');
const passport = require('passport');

// promisifies methods on "HighScore" and "HighScore" instances
Promise.promisifyAll(HighScore);
Promise.promisifyAll(HighScore.prototype);

module.exports = (router) => {

	// Get initial app data
	router.get('/highscore', function(req, res, next) {
		HighScore.findAsync({ creator: req.session.passport.user }, null, {sort:'-createdDate'})
			.then(allHighScores => res.json(allHighScores))
			.catch(err => !console.log(err) && next(err));
	});


	router.post('/highscore', function(req, res, next) {
		if ( req.session.passport && req.session.passport.user ){
			User.findByIdAsync(req.session.passport.user)
					.then(( found ) => {
						return Promise.resolve( _.merge(found, req.body ) );
					})
					.then((updated) => {
						// SAVE TO MONGOLAB
						return Promise.resolve( updated.saveAsync() );
					})
					.then((saved) => {
						res.json( _.merge(_.omit(saved.toObject(), ['password','salt']),{
							hasPassword: !!saved.password
						}));
					})
					.catch((err) => res.json(err));
		}
	});



	router.post('/highscore', function(req, res, next) {
		if ( req.session.passport && req.session.passport.user ){
			let tempId = shortid.generate();
			const newHighScore = new HighScore(_.merge({ _id: Number(new Date()).toString() + '_' + tempId }, req.body));
			console.log ( 'req.session.passport.user', req.session.passport.user, newHighScore );
			User.findByIdAsync(req.session.passport.user)
					.then(( found ) => {
						return Promise.resolve(_.merge(found, newHighScore));
					})
					.then((updated) => {
						console.log ( 'updated', updated );
						// SAVE TO MONGOLAB
						updated.saveAsync()
					})
					.catch((err) => res.json(err));

			//   .then((found) => {
			//     // STORING INTO S3
			//     // if(!found) throw new Error('no User matching Id to update');
			//     if(req.body.name && req.body.name !== found.name) return api.renameS3(_.merge(found, req.body), req.body.name);  // rename in S3 if name has changed
			//     else return Promise.resolve(_.merge(found, req.body));
			//   })
			//   .then((updated) => {
			//     // SAVE TO MONGOLAB
			//     updated.saveAsync()
			//   })
			//   .then((saved) => {
			//     console.log(saved.name + ' has been updated!');
			//     res.json(saved);
			//   })
			//   .catch((err) => res.json(err)));
			

			// const newHighScore = new HighScore(req.body);
			// newHighScore.saveAsync()
			//   .then(savedHighScore => res.json(savedHighScore[0] || savedHighScore)) // sometimes returns array of [savedHighScore, 1], not sure if this a MongoDB or Mongoose version thing
			//   .catch(err => !console.log(err) && next(err));
		}
	});

	router.put('/highscore/:id', function(req, res, next) {
		HighScore.findByIdAndUpdateAsync(req.params.id, req.body, {new:true}) // new option here says return the updated object to the following promise
			.then(updatedHighScore => res.status(200).json(updatedHighScore))
			.catch(err => !console.log(err) && next(err));
	});

	router.get('/highscore/:id', function(req, res, next) {
		HighScore.findById(req.params.id)
			.then(obj => res.status(200).json(obj))
			.catch(err => !console.log(err) && next(err));
	});

	router.delete('/highscore/:id', function(req, res, next) {
		// only delete if the user id is the same as passport...
		HighScore.findByIdAsync(req.params.id)
			.then( checkHighScore => {
				Promise.resolve(res);
				if ( req.session.passport.user == checkHighScore.creator ){
					HighScore.findByIdAndRemoveAsync(req.params.id)
				}
			})
			.then(obj => {
				return res.status(200).json(obj)
			})
			.catch(err => !console.log(err) && next(err));
	});

};