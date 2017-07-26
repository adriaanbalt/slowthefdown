// webpack-dev-server -d --hot --config $npm_package_config_build_scripts_dir/webpack/webpack.config.js --watch --progress", 
const webpack = require('webpack')
const path = require('path')

const ROOT_PATH = path.join(__dirname, '../../' )
const NODE_MODULES_PATH = path.join(__dirname, '../../node_modules' )
const DIST_PATH = path.join(__dirname, '../../public' )
const SOURCE_PATH = path.join(__dirname, '../../source' )

const config = {
  entry: `${SOURCE_PATH}/index.js`,
  output: {
    path: DIST_PATH,
    filename: 'js/index.js'
  },
  resolve: {
    extensions: ['.js', '.json'],
    modules: [
      `${SOURCE_PATH}/scripts`,
      'node_modules'
    ],
    alias: {
      'node_modules': `${NODE_MODULES_PATH}`,
      'components': `${SOURCE_PATH}/components`,
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
    new webpack.DefinePlugin({
      '__PORT__': JSON.stringify(process.env.PORT),
      '__HEROKU__': JSON.stringify(process.env.HEROKU),
    }),
  ],
  devtool: ''
}

module.exports = config
