var config       = require('../config/video');
var gulp         = require('gulp');
var handleErrors = require('../lib/handleErrors');

gulp.task('video', () => gulp.src(config.src)
    .on('error', handleErrors)
    .pipe(gulp.dest(config.dest)));
