const { MongoClient } = require('mongodb');
const {
    MONGO_URL, 
    HIGHSCORES_COLLECTION
} = require('../../config/mongo');

function* getHighscoreById(id, user, db) {
  const response = yield db.collection(HIGHSCORES_COLLECTION).findOne({
    id: id
  });

  if (!response) {
    return [];
  }

  return response;
}

module.exports = function* (id, user) {
    let highscore;

    // connect to the DB (probably could just do this once?)
    const db = yield MongoClient.connect(MONGO_URL);
    try {
        highscore = yield getHighscoreById(id, user, db);
    } finally {
        db.close();
    }

    return highscore;
}