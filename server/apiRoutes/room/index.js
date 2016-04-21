const mongoose = require('mongoose');
const Room = mongoose.model('Room');
const Promise = require('bluebird');
const shortid = require('shortid');
const _ = require('lodash');
const passport = require('passport');

// promisifies methods on "Room" and "Room" instances
Promise.promisifyAll(Room);
Promise.promisifyAll(Room.prototype);

module.exports = (router) => {

  // Get initial app data
  router.get('/room', function(req, res, next) {
    Room.findAsync({ creator: req.session.passport.user }, null, {sort:'-createdDate'})
      .then(allRooms => res.json(allRooms))
      .catch(err => !console.log(err) && next(err));
  });

  router.post('/room', function(req, res, next) {
    // let tempId = shortid.generate();
    const newRoom = new Room(req.body);
    newRoom.saveAsync()
      .then(savedRoom => res.json(savedRoom[0] || savedRoom)) // sometimes returns array of [savedRoom, 1], not sure if this a MongoDB or Mongoose version thing
      .catch(err => !console.log(err) && next(err));
  });

  router.put('/room/:id', function(req, res, next) {
    Room.findByIdAndUpdateAsync(req.params.id, req.body, {new:true}) // new option here says return the updated object to the following promise
      .then(updatedRoom => res.status(200).json(updatedRoom))
      .catch(err => !console.log(err) && next(err));
  });

  router.get('/room/:id', function(req, res, next) {
    Room.findById(req.params.id)
      .then(obj => res.status(200).json(obj))
      .catch(err => !console.log(err) && next(err));
  });

  router.delete('/room/:id', function(req, res, next) {
    // only delete if the user id is the same as passport...

    let sameUser = false;

    Room.findByIdAsync(req.params.id)
      .then( checkRoom => {
        if ( req.session.passport.user == checkRoom.creator ){
          sameUser = true;
        }
      })
      .catch(err => !console.log(err) && next(err));

    console.log ( "sameUser", sameUser );
     
      if ( sameUser ){
        Room.findByIdAndRemoveAsync(req.params.id)
          .then(deletedRoom => {
            console.log ( 'deletedRoom', deletedRoom );
            return res.status(200).json(deletedRoom)
          })
          .catch(err => !console.log(err) && next(err));
      }
  });

};