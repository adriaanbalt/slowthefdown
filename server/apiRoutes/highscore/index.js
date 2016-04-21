const mongoose = require('mongoose');
const HighScore = mongoose.model('HighScore');
const Promise = require('bluebird');
const shortid = require('shortid');
const _ = require('lodash');
const passport = require('passport');

// promisifies methods on "HighScore" and "HighScore" instances
Promise.promisifyAll(HighScore);
Promise.promisifyAll(HighScore.prototype);

module.exports = (router) => {

  // Get initial app data
  router.get('/HighScore', function(req, res, next) {
    HighScore.findAsync({ creator: req.session.passport.user }, null, {sort:'-createdDate'})
      .then(allHighScores => res.json(allHighScores))
      .catch(err => !console.log(err) && next(err));
  });

  router.post('/HighScore', function(req, res, next) {
    let tempId = shortid.generate()
    const newHighScore = new HighScore(_.merge({ _id: Number(new Date()).toString() + '_' + tempId }, req.body));

    console.log ( 'newHighScore', newHighScore._id );
    // const newHighScore = new HighScore(req.body);
    newHighScore.saveAsync()
      .then(savedHighScore => res.json(savedHighScore[0] || savedHighScore)) // sometimes returns array of [savedHighScore, 1], not sure if this a MongoDB or Mongoose version thing
      .catch(err => !console.log(err) && next(err));
  });

  router.put('/HighScore/:id', function(req, res, next) {
    HighScore.findByIdAndUpdateAsync(req.params.id, req.body, {new:true}) // new option here says return the updated object to the following promise
      .then(updatedHighScore => res.status(200).json(updatedHighScore))
      .catch(err => !console.log(err) && next(err));
  });

  router.get('/HighScore/:id', function(req, res, next) {
    HighScore.findById(req.params.id)
      .then(obj => res.status(200).json(obj))
      .catch(err => !console.log(err) && next(err));
  });

  router.delete('/HighScore/:id', function(req, res, next) {
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