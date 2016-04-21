var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');

gulp.task('build:development', (cb) =>
    gulpSequence('clean', ['fonts', 'iconFont', 'images', 'video', 'data', 'publish'], ['compass', 'html', 'scripts','mongo'], ['webpack:development', 'watch'], () => {console.log('Running!'); cb();}));
