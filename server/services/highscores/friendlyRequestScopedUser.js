const co = require('co');
const requestScopedAuthenticatedUser = require('../../shared/requestScopedAuthenticatedUser');

module.exports = (req, res, next) => co(function*() {
  try {
    yield requestScopedAuthenticatedUser(req, res, () => {});
    next();
  } catch (error) {
    next();
  }
}).catch(next)