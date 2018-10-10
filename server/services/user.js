const co = require('co');
const express = require('express');
const bodyParser = require('body-parser');
const requestScopedAuthenticatedUser = require('../shared/requestScopedAuthenticatedUser');
const { MongoClient } = require('mongodb');
const { USERS_MONGO_URL, USERS_COLLECTION } = require('../config/mongo');

const app = express();

const handlePushNotificationToken = require('./user/push-notification-token');

app.use(bodyParser.json());

app.use(requestScopedAuthenticatedUser);

app.put('', (req, res, next) => co(function*() {

  const db = yield MongoClient.connect(USERS_MONGO_URL);

  console.log('user > put');

  try {
    yield db.collection(USERS_COLLECTION).update({
      id: req.user.id
    }, {
      highscore: 0,
    });
  } finally {
    db.close();
  }

  res.status(200);
  res.send();

}).catch(next));

app.post('/push-notification-token', (req, res, next) => co(function*() {
  yield handlePushNotificationToken(req, res);
}).catch(next));

module.exports = app;