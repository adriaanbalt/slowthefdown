const authenticateUser = require('./authenticateUser');
const co = require('co');

module.exports = (req, res, next) => co(function*() {

  const headers = req.headers;

  if (!headers.authorization) {
    throw console.error();
  }

  console.log('>>> ' + headers.authorization);
  const user = yield authenticateUser(headers.authorization);

  if (!user) {
    throw console.error(`Invalid authorization! ${headers.authorization}`);
  }

  req.user = user;

  next();

}).catch(next);