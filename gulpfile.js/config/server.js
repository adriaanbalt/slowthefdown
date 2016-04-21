var config = require('./');
var path = require('path');

module.exports = {
  watch: path.join(config.root + '/server/**/*.js')
};
