var Promise = require('bluebird'),
    fs = require('fs'),
    childProcess = require('child_process'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    HighScore = mongoose.model('HighScore');

//promisify 'fs' library for later use
Promise.promisifyAll(fs);
Promise.promisifyAll(childProcess);

// Allow fs and s3 promises

//// User
// User.findByIdAndUpdateAsync = Promise.promisify(User.findByIdAndUpdate);
// User.findByIdAndRemoveAsync = Promise.promisify(User.findByIdAndRemove);
// User.findByIdAsync = Promise.promisify(User.findById);
// User.findOneAsync = Promise.promisify(User.findOne);
// User.findAsync = Promise.promisify(User.find);
// User.countAsync = Promise.promisify(User.count);
// User.prototype.saveAsync = Promise.promisify(User.prototype.save);

//// HighScore
HighScore.findByIdAndUpdateAsync = Promise.promisify(HighScore.findByIdAndUpdate);
HighScore.findByIdAndRemoveAsync = Promise.promisify(HighScore.findByIdAndRemove);
HighScore.findByIdAsync = Promise.promisify(HighScore.findById);
HighScore.findOneAsync = Promise.promisify(HighScore.findOne);
HighScore.findAsync = Promise.promisify(HighScore.find);
HighScore.countAsync = Promise.promisify(HighScore.count);
HighScore.prototype.saveAsync = Promise.promisify(HighScore.prototype.save);


// ensure fs.existsSync is kept (getting deprecated in future versions of node)
fs.existsSync = (filename) => {
  try {
    fs.accessSync(filename);
    return true;
  } catch(ex) {
    return false;
  }
};
