var changed     = require('gulp-changed');
var config      = require('../config/publish');
var gulp        = require('gulp');

gulp.task('publish', () => gulp.src(config.src)
    .pipe(changed(config.dest)) // Ignore unchanged files
    .pipe(gulp.dest(config.dest)));
