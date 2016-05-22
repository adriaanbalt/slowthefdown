var router = require('express').Router(),
    fs = require('fs'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    HighScore = mongoose.model('HighScore'),
    path = require('path'),
    _ = require('lodash');

module.exports = (api) => {

  router.post('/', (req, res) => {
    console.log ( "endpoint: post /login", req.body );
    var newObj = new User(req.body);
    newObj.saveAsync()
      .then( savedObj  => User.populate(savedObj, {path:"HighScores"} ))
      .then( populatedObj => {
        console.log ( "USER ", populatedObj )
        res.json( populatedObj ) 
      });
  });

  router.get('/', (req, res) => {
    User.find({})
      .then( object  => res.json( object ) )
  });

  router.delete( '/:id', (req, res, next) => {
    User.findByIdAndRemoveAsync(req.params.id).then( ( newUser ) => res.json( newUser ) );
  });


  router.get('/:id', (req, res) =>
    User.findById(req.params.id)
      .then((found) => res.json(found)));

  router.put('/:id', (req, res) => 
    User.findByIdAsync(req.params.id)
      .then((found) => {
        // STORING INTO S3
        // if(!found) throw new Error('no User matching Id to update');
        if(req.body.name && req.body.name !== found.name) return api.renameS3(_.merge(found, req.body), req.body.name);  // rename in S3 if name has changed
        else return Promise.resolve(_.merge(found, req.body));
      })
      .then((updated) => {
        // SAVE TO MONGOLAB
        updated.saveAsync()
      })
      .then((saved) => {
        console.log(saved.name + ' has been updated!');
        res.json(saved);
      })
      .catch((err) => res.json(err)));

  return router;
};
