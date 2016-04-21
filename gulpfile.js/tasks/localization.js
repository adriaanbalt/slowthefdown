var config       = require('../config/localization');
var gulp         = require('gulp');
var handleErrors = require('../lib/handleErrors');

gulp.task('localization', function() {
  return gulp.src(config.src)
    .on('error', handleErrors)
    .pipe(gulp.dest(config.dest));
});
