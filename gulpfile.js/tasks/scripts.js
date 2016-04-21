var gulp         = require('gulp');
var uglify       = require('gulp-uglify');
var concat       = require('gulp-concat');
var config       = require('../config/scripts');
var handleErrors = require('../lib/handleErrors');

gulp.task('scripts', () => gulp.src(config.src)
    .pipe(concat('main.js'))
    .on('error', handleErrors)
    .pipe(gulp.dest(config.dest)));
