var gulp        = require('gulp'),
    path        = require('path'),
    config      = require('../config'),
    connectToDB = require(path.join(config.root, 'server', 'db'));

// retrieve serverType from command line args
var serverType = ['dev','qa','prod'].indexOf(process.argv[2]) !== -1 ? process.argv[2] : process.env.NODE_ENV;

gulp.task('mongo', (cb) => {
    connectToDB(serverType === 'prod'? process.env.MONGODB_URI_PROD : process.env.MONGODB_URI)  // DB connection, use prod db if running prod
        .then(() => cb())
        .catch((err) => {throw err;});
});
