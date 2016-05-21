var gulp    = require('gulp'),
    webpack = require('webpack'),
    config  = require('../config/webpack.config.production')('production'),
    logger  = require('../lib/compileLogger'),
    server  = require('../../server');

gulp.task('webpack:production', function(callback) {
  webpack(config, function(err, stats) {
    logger(err, stats);
    server(callback, process.env.PORT);
  });
});
