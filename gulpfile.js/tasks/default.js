var gulp = require('gulp'),
    config = require('../config');

//load environmental variables
if(!process.env.RUNNING_IN_HEROKU) require('dotenv').load({
  path: config.root + '.env'
});

// Development
if(['dev','qa','prod'].indexOf(process.argv[2]) === -1) {
  if(process.env.NODE_ENV !== 'prod') gulp.task('default', ['build:development']);
  else gulp.task('default', ['build:production'], () => console.log("prod up and running!"));
}

else {
  // Production added by running these strings after npm start
  gulp.task('dev', ['build:development'], () => console.log("dev running on port 3010"));
  gulp.task('qa', ['build:production'], () => console.log("qa up and running!"));
  gulp.task('prod', ['build:production'], () => console.log("prod up and running!"));
}
