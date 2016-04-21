var WebpackDevServer = require('webpack-dev-server'),
    config = require('../config/'),
    path = require('path'),
    gulp         = require('gulp'),
    logger       = require('../lib/compileLogger'),
    webpack      = require('webpack'),
    bluebird = require('bluebird');

gulp.task('webpack:development', (callback) => {

  var server = require(path.join(config.root, 'server')),
      serverPort = process.env.PORT,
      proxyPort = process.env.PORT - 1,
      // app = server.app,
      webpackConfig = require(path.join('..', 'config', 'webpack.config.development'))('dev'),
      webpackDevServer = new WebpackDevServer(webpack(webpackConfig), {
        publicPath: webpackConfig.output.publicPath,
        // contentBase: config.publicDirectory,
        hot: true,
        stats: {colors: true},
        historyApiFallback: true,
        proxy: {"*": `http://localhost:${proxyPort}/`}
      });

  // app.listenAsync = bluebird.promisify(app.listen);
  webpackDevServer.listenAsync = bluebird.promisify(webpackDevServer.listen);


  webpackDevServer.listenAsync(serverPort, 'localhost')
    .then((result) => {
      console.log(`Webpack Dev Server listening at localhost:${serverPort} (dev)`);
      // return app.listenAsync(serverPort);
      server(callback, proxyPort);
  // }).then((result)=>{
  //     console.log(`App is running on localhost:${serverPort} (dev)`);
  //     callback();
  }).catch((err) => console.log(err));
});
