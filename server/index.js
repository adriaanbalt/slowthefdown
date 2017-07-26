
require('babel-core/register');

      //Express and Express middlewares
const express = require('express'),
      path = require('path'), // handles smooth joining of file paths (inserts slashes where needed, prevents double slashes)
      logger = require('morgan'),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      compression = require('compression'),
      cors = require('cors');

      // Webpack imports
      // webpack = require('webpack'),
      // config = require('../gulpfile.js/config/webpack-dev')("dev"),
      // webpackDevMiddleware = require('webpack-dev-middleware'),
      // webpackHotMiddleware = require('webpack-hot-middleware');

!module.parent && runExpress();


function runExpress(callback, proxyPort){
  

  // Express needs to be instantiated, it's possible to run multiple Express instances in the same node app and have them listen on different ports
  var app = express();


  // Runs React-hot-loader via our webpack dev configuration if in dev mode
  // if (process.env.NODE_ENV !== 'production') {
  //   const compiler = webpack(config);
  //   app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath })); // noInfo flag prevents webpacks (verbose) default console logs and only logs errors and warnings
  //   app.use(webpackHotMiddleware(compiler));
  // }


  // Request parsing middleware
  app.use(bodyParser.json()); // allows request body parsing
  app.use(bodyParser.urlencoded({ extended: false })); // allows request query string parsing, extended : false means query string values cannot contain JSON (must be simple key-value)
  app.use(cookieParser()); // allows cookie parsing (cookies are simple key value stores in the browser)


  // Allow CORS (this allows you to serve assets, images for example, from other domains)
  app.use(cors());


  // gzips (technically compresses with zlib) responses to HTTP requests
  app.use(compression());


  // app root folder path
  const root = path.resolve(__dirname, '..');  // __dirname is a global variable available in any file and refers to that file's directory path


  // used to set favicon (little image next to page title in browser tab)
  // app.use(favicon(path.join(root, 'public', 'favicon.ico')));


  // Set static folder
  app.use(express.static(path.join(root, 'public')));


  // Log requests to console
  if(process.env.NODE_ENV !== 'production')
    app.use(logger('dev'));

    // Bring in Auth routes from auth folder (must feed in app as middlewares are added at this step)
    require(path.join(root, 'server', 'auth'))(app);
    
  // console.log ( 'process.env.MONGODB_URI' , process.env.MONGODB_URI );
  // const startDbPromise = require(path.join(root,'db'))(process.env.MONGODB_URI);
  // startDbPromise.then(() => {
    // Bring in API routes from crud folder
    app.use('/api', require(path.join(root, 'server', 'apiRoutes'))); //// Note that we do not need to specify "index.js" inside of the "crud" folder, if file is unspecified "index.js" is default when folder is required


    // Serve index.html from root
    app.get('/*', (req, res, next) => res.sendFile('/index.html', {
      root: path.join(root, 'public')
    }));

    // catch 404 and forward to error handler
    app.use((req, res, next) => {
      const err = new Error('Not Found');
      err.status = 404;
      next(err);
    });

    // Handle route errors
    app.use((err, req, res, next) => {
      console.error(err); // log to back end console
      res.status(err.status || 500);
      res.send(err.message); // send error message text to front end
    });

    app.on('listening', ( e ) => {
        console.log('ok, server is running', e);
    });

    // Launch server on port
    // app.listen(serverPort, (err, res) => err ?
    //   handleError(err) :
    //   console.log(`app served on port ${serverPort}`));
  // })
  // .catch(err => console.log(err));


    // Launch server
    app.listen(proxyPort, (err, res) =>
      err ?
        !console.log(err) && process.kill() :
        callback && callback() || console.log(`app served on port ${ proxyPort }`));


  // Note that I can define "handleError" down here and use it above, this is because "declarations" are hoisted in Javascript (can only be done with functions created with this syntax though)
  // function handleError(err){
  //   console.log ( 'err', err.code, err );
  //   switch (err.code) {
  //     case 'EACCES':
  //       console.error(`port ${serverPort} requires elevated privileges`);
  //       process.exit(1);
  //       break;
  //     case 'EADDRINUSE':
  //       console.error(`port ${serverPort} is already in use`);
  //       process.exit(1);
  //       break;
  //     default:
  //       console.log(err);
  //       process.exit(1);
  //   }
  // }
  
}

module.exports = runExpress;
