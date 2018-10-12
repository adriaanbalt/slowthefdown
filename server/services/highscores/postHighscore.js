const co = require('co');
const { MongoClient } = require('mongodb');
const { MONGO_URL, HIGHSCORES_COLLECTION } = require('../../config/mongo');

module.exports = () => (req, res, next) => co(function*() {

  const db = yield MongoClient.connect(MONGO_URL);

  try {
    yield db.collection(HIGHSCORES_COLLECTION).insert({
      createdDate: new Date(),
      value: req.highscore.value,
    });
    // TODO: update the user highscore if it is higher than the user's existing highsore
  } finally {
    db.close();
  }

  res.status(200);
  res.send();

}).catch(next);