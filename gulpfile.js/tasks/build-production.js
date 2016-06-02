var gulp         = require('gulp');
var gulpSequence = require('gulp-sequence');
var childProcess = require('child_process');
var config       = require('../config');

// pull in stop.js to stop currently running server of this type
var stopPrevious = require(config.root + '/server/stop');

// retrieve serverType from command line args
var serverType = ['dev','qa','prod'].indexOf(process.argv[2]) !== -1 ? process.argv[2] : process.env.NODE_ENV;

// pid file creation command, to be run after previous one is stopped
var cmd = 'echo ' + process.pid + ' > .pid' + serverType;

gulp.task('build:production', (cb) =>{
	console.log ( "build production!" , serverType );
  //stop previous dev/qa/prod process
  stopPrevious(serverType, () =>
    childProcess.exec(cmd, (err, stdout) => { // create new pid file
      if(err) throw err;
      else gulpSequence('clean', 'fonts', 'images', 'compass', 'mongo', 'webpack:production', 'html', cb);	
    })
  )}
);
