const { MongoClient } = require('mongodb');
const { MONGO_URL, PUSH_NOTIFICATION_TOKENS } = require('../../config/mongo');

function* handlePushNotificationToken(req, res) {

  const db = yield MongoClient.connect(MONGO_URL);

  try {
    yield db.collection(PUSH_NOTIFICATION_TOKENS).update({
      userId: req.user._id
    }, {
      $set: {
        token: req.body.token.value
      }
    }, {
      upsert: true
    });
  } finally {
    db.close();
  }

  res.status(200);
  res.send();
  
}

module.exports = handlePushNotificationToken;