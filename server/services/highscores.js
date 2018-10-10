const express = require('express');
const friendlyRequestScopedUser = require('./highscores/friendlyRequestScopedUser');
const getHighscoresList = require('./highscores/getHighscoresList');
const getHighscoresById = require('./highscores/getHighscoresById');
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
  res.send(JSON.stringify(yield getHighscoresById(req.params.id, req.user), null, 2));
}).catch(next));

module.exports = app;