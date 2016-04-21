var Promise = require('bluebird'),
    fs = require('fs'),
    path = require('path'),
    rimrafAsync = Promise.promisify(require('rimraf'));

module.exports = function(api) {
    return {
        getDeletePromise: function(path) {
          return new Promise(function(resolve, reject){
            rimrafAsync(path)
              .then(() => {
                console.log('succesfully deleted ', path);
                resolve();
              })
              .catch((err) => {
                console.log('Error deleting zip at: ', path, '  Error: ' , err);
                reject();
              });
          });
        },
        idDeleteCheck: function(idPath) {
            idPath = path.join(api.getValue('clientArchivePath'), idPath.split('/').slice(-2)[0]); //make client-side and server-side provided paths equal
            var deleteFunc = this.getDeletePromise(idPath);
            if(this[idPath]) {
                if(fs.existsSync(idPath)) {
                    clearTimeout(this[idPath]);
                    console.log('temp zip dir deleted: ', idPath);
                    deleteFunc.then();
                }
                delete this[idPath];
            }
            else this[idPath] = setTimeout(deleteFunc.then, 300000);  //delete provided zip path after 5 minutes if function not called again
        }
    };
};
