var childProcess = require('child_process');

// checks if the file is being called via npm run dev/qa/prod
var fromCommandLine = !module.parent;

// grab serverTypes specified via command line
if(fromCommandLine) var serverTypes = process.argv.slice(2);

function stop(serverType, cb) {

    console.log ( 'serverType', serverType );
    
    // make sure serverType is a registered type
    if(['dev','qa','prod'].indexOf(serverType) ===-1) throw Error("you're trying to stop a non-existent environment");

    // create kill command
    var cmd = "kill -9 `cat ./" + (fromCommandLine ? "sub-dir/" : "") + ".pid" + serverType + "`";

    // run kill command, log response if not in production
    childProcess.exec(cmd, function(err, stdout){
      if(err && fromCommandLine) console.log(serverType + " is not running");
      else if (fromCommandLine) console.log(serverType + " killed");
      if(cb) cb();
    });
}

// stop each serverType specified
if(fromCommandLine) serverTypes.map(function(val) {
  stop(val);
});

// export function for if it's not being run from command-line
module.exports = stop;
