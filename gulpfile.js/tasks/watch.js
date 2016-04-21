var gulp     = require('gulp');
var html     = require('../config/html');
var iconFont = require('../config/iconFont');
var images   = require('../config/images');
var compass     = require('../config/compass');
var fonts    = require('../config/fonts');
var server    = require('../config/server');
var scripts  = require('../config/scripts');
var data  = require('../config/data');
var watch    = require('gulp-watch');

gulp.task('watch', () => {
  watch(images.src, () => gulp.start('images'));
  watch(compass.src, () => gulp.start('compass'));
  watch(iconFont.src, () => gulp.start('iconFont'));
  watch(fonts.src, () => gulp.start('fonts'));
  watch(html.watch, () => gulp.start('html'));
  watch(scripts.src, () => gulp.start('scripts'));
  watch(data.src, () => gulp.start('data'));

  //@TODO figure out dev server restarts
  //watch(server.watch, function() { gulp.start('webpack:development'); });
});
