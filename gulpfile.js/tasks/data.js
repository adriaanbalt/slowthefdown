var config       = require('../config/data');
var gulp         = require('gulp');
var handleErrors = require('../lib/handleErrors');

gulp.task('data', () => gulp.src(config.src)
    .on('error', handleErrors)
    .pipe(gulp.dest(config.dest)));
