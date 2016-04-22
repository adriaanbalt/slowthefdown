var mongoose = require('mongoose'),
    Promise = require('bluebird'),
    _ = require('lodash');

module.exports = (model, prop, testVal, returnUnique) => new Promise((resolve,reject) =>
    uniqueInMongoCheck(model, prop, testVal, returnUnique, '', (err, returnedVal) =>
        err ?
        reject(err) :
        resolve(returnedVal)));

function uniqueInMongoCheck(model, props, testVal, returnUnique, counter, cb) {
    // convert props to array if string
    props = typeof props === 'string' ? [props] : props;

    // create queryObj
    const queryObj = typeof testVal !== 'object'?
        {
          [props[0]]: testVal // handle primitive testVal
        } :
        _.merge(_.pick(testVal, props), // handle object testVal
          props.indexOf('_id') > -1 || !testVal.hasOwnProperty('_id') ? {} : // if "_id" is not one of the "props" to check and testVal has a property named "_id" then exclude values matching "_id" from unique check
            {
              _id: {
                $ne: testVal._id
              }
            });
    queryObj[props[0]] += counter; // add counter to first prop in "props" array, if "returnUnique" is true this is how we achieve a unique value (function is run recursively until this counter makes this prop unique)

    model.findOneAsync(queryObj)
        .then((highscore) => !returnUnique ? (testVal.unique = !highscore, cb(null, testVal)) : // if "returnUnique" is false just return boolean indicating whether or not a highscore with specified parameters was found
            highscore ? //if "returnUnique" is true use counter to make unique and return that
            uniqueInMongoCheck(model, props, testVal, !counter ? 2 : counter + 1, cb) : //recurse if highscoreName already exists
            cb(null, typeof testVal === 'object' ?
                (testVal[props[0]] += counter, testVal) :
                testVal + counter))
        .catch((err) => {
            console.log('Error checking for uniqueness in MongoDB: ', err);
            cb(err, null);
        });
}
