// webpack-dev-server -d --hot --config $npm_package_config_build_scripts_dir/webpack/webpack.config.js --watch --progress", 
const webpack = require('webpack')
const path = require('path')

const ROOT_PATH = path.join(__dirname, '../../' )
const NODE_MODULES_PATH = path.join(__dirname, '../../node_modules' )
const DIST_PATH = path.join(__dirname, '../../public' )
const SOURCE_PATH = path.join(__dirname, '../../old' )
if(!process.env.RUNNING_IN_HEROKU) require('dotenv').load({
  path: ROOT_PATH + '.env'
});

const config = {
  entry: `${SOURCE_PATH}/index.js`,
  output: {
    path: DIST_PATH,
    filename: 'js/index.js'
  },
  resolve: {
    extensions: ['.js', '.json'],
    modules: [
      'node_modules'
    ],
    alias: {
      'node_modules': `${NODE_MODULES_PATH}`,
      'components': `${SOURCE_PATH}/components`,
      'styles': `${SOURCE_PATH}/styles`,
    }
  },
  module: {
    rules: [
      {
        test: /(\.js|\.jsx)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        }
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader"
          }, 
          {
            loader: "css-loader",
            options: { url: false }
          }, 
          {
            loader: "sass-loader"
          }, 
        ]
      }
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin()
  ],
  devServer: {
    contentBase: DIST_PATH,
    inline: true,
    publicPath: `http://localhost:${process.env.FRONT_PORT}`,
    port: process.env.FRONT_PORT,
    proxy: {
      '/api/**/*': {
        disableHostCheck: false,
        target: `http://localhost:${process.env.BACK_PORT}`,
        toProxy: true,
        changeOrigin: true
      }
    }
  },
  devtool: 'eval-source-map'
}

module.exports = config
