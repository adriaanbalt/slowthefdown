const HighscoresDataSource = require('./HighscoresDataSource')
const co = require('co');

module.exports = (req, res, next) => co(function*() {

  res.header('Content-Type', 'application/json');
  res.send(JSON.stringify(HighscoresDataSource.highscores, null, 2));

}).catch(next)