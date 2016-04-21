var Promise = require('bluebird');

module.exports = function(runFunc, matchFunc, obj, ...additionalArgs) {

    return new Promise(function(resolve, reject){
        // type checks
        if(typeof obj !== 'object') reject(new Error('expecting object as the object to search'));
        else if(typeof matchFunc !== 'function') reject(new Error('expecting string as key to be found'));
        else if(typeof runFunc !== 'function') reject(new Error('expecting function to run on key'));

        else {
            // run array of retrieved promises
            Promise.all(
                // gets array of promises of function being called on respective properties
                propPromiseGetter(runFunc, matchFunc, obj, additionalArgs)
            ).then(function(){
                resolve(obj);
            })
            .catch(function(err){
                console.log('Error running deep search function: ', err);
                reject(err);
            });
        }
    });

};

function propPromiseGetter(runFunc, matchFunc, obj, additionalArgs, promiseArr) {
  promiseArr = promiseArr || [];
  Object.keys(obj).forEach((val, index) => {
    if(matchFunc(val)) {
      promiseArr.push(runFunc instanceof Promise ?
        runFunc(obj, val, ...additionalArgs)
      :
        new Promise((resolve, reject) => {
          runFunc(function(err, returnedVal){
            if(err) return console.log('Error running promise at this index: ', index,'  Error: ', err), reject(err);
            else resolve(returnedVal);
          }, obj, val, ...additionalArgs);
        })
      );
    }
    if(typeof obj[val] === 'object') propPromiseGetter(runFunc, matchFunc, obj[val], additionalArgs, promiseArr);
  });
  return promiseArr;
}
