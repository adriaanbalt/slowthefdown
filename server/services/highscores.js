const express = require('express');
const friendlyRequestScopedUser = require('./highscores/friendlyRequestScopedUser');
const getHighscoresList = require('./highscores/getHighscoresList');
const getHighscoreById = require('./highscores/getHighscoreById');
const postHighscore = require('./highscores/postHighscore');
const co = require('co');

const app = express();

app.use(friendlyRequestScopedUser);

app.get('', getHighscoresList);

app.use((req, res, next) => {
  if (!req.user) {
    return next();
  }

  next();
})

app.get('/:id', (req, res, next) => co(function*() {
  res.header('Content-Type', 'application/json');
  res.send(JSON.stringify(yield getHighscoreById(req.params.id), null, 2));
}).catch(next));

app.post('/:userid', (req, res, next) => co(function* () {
  res.header('Content-Type', 'application/json');
  res.send(JSON.stringify(yield postHighscore(req.params.highscore), null, 2));
}).catch(next));

module.exports = app;