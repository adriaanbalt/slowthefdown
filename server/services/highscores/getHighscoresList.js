
const { MongoClient } = require('mongodb');
const co = require('co');
const {
  MONGO_URL,
  HIGHSCORES_COLLECTION,
} = require('../../config/mongo');

module.exports = (req, res, next) => co(function*() {

  const db = yield MongoClient.connect(MONGO_URL);

  let highscores;

  try {
    highscores = yield db.collection(HIGHSCORES_COLLECTION).find({}).toArray();
  } finally {
    db.close();
  }

  res.status(200);
  res.send({ 
    highscores
  });

}).catch(next)


