const { MongoClient } = require('mongodb');
const { USERS_MONGO_URL, USERS_COLLECTION } = require('../config/mongo');
const FB = require('fb');

const getFacebookUserId = accessToken => new Promise(resolve => {
  FB.api('me', {
    fields: 'id',
    access_token: accessToken // eslint-disable-line camelcase
  }, ({ id }) => {
    resolve(id);
  });
});

const getFullFacebookUser = accessToken => new Promise(resolve => {
  FB.api('me', {
    fields: [
      'id',
      'name',
      'picture.width(1000)',
      'cover'
    ],
    access_token: accessToken // eslint-disable-line camelcase
  }, response => resolve(Object.assign(response, {
    picture: response.picture.data
  })))
});

const header = 'Bearer ';

function name(name) {
  const splits = name.split(' ');
  // return splits.slice(0, splits.length - 1).join(' ');
  return splits[0];
}

module.exports = function* authenticateUser(authorization) {
  if (!authorization.startsWith(header)) {
    return null;
  }

  const token = authorization.replace(header, '').trim();
  const db = yield MongoClient.connect(USERS_MONGO_URL);

  try {
    const userId = yield getFacebookUserId(token);

    if (!userId) {
      return null;
    }

    console.log('authenticated!', userId, token);

    let user = yield db.collection(USERS_COLLECTION).findOne({
      id: userId
    });

    if (!user || !user.facebookLastUpdatedAt) {
      const fbUser = yield getFullFacebookUser(token);

      yield db.collection(USERS_COLLECTION).update({
        id: userId
      }, {
        $set: {
          id: userId,
          name: name(fbUser.name),
          picture: fbUser.picture,
          cover: fbUser.cover,
          facebookLastUpdatedAt: Date.now(),
        }
      }, {
        upsert: true
      });

      user = yield db.collection(USERS_COLLECTION).findOne({
        id: userId
      });
    }

    if (!user.highscore) {
      user = yield setFieldValue(db, userId, 'highscore', 0);
    }

    return user;
  } finally {
    db.close();
  }

  return null;

}

function* setFieldValue(db, userId, fieldName, value) {
  yield db.collection(USERS_COLLECTION).update({
    id: userId
  }, {
    $set: {
      [fieldName]: value
    }
  });

  return yield db.collection(USERS_COLLECTION).findOne({
    id: userId
  });
}