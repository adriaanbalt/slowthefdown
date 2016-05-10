var config = require('../config/'),
    path = require('path'),
    gulp = require('gulp'),
    logger = require('../lib/compileLogger'),
    webpack = require('webpack'),
    bluebird = require('bluebird');

gulp.task('webpack:production', (callback) => {
  var server = require(path.join(config.root, 'server')),
      webpackConfig = require('../config/webpack')('prod'),
      serverType = process.argv[2] || process.env.NODE_ENV,
      server = require(path.join(config.root, 'server'))('prod', serverType),
      serverPort = process.env.PORT,
      app = server.app;

  app.listenAsync = bluebird.promisify(app.listen);

  webpack(webpackConfig, (err, stats) => {

    console.log ( 'webpack!', serverPort, serverPort, server );
    //run logger
    logger(err, stats);

    //launch app
    app.listenAsync(serverPort)
      .then((result) => {
        console.log(`App is listening at port ${serverPort} (production)`);
        callback();
      })
      .catch((err) => console.error(err));
  });
});

// var gulp    = require('gulp'),
//     webpack = require('webpack'),
//     config  = require('../config/webpack.config.production')('production'),
//     logger  = require('../lib/compileLogger'),
//     server  = require('../../server');

// gulp.task('webpack:production', function(callback) {
//   webpack(config, function(err, stats) {
//     logger(err, stats);
//     // server(callback);
//   });
// });
