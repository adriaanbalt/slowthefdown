const UglifyJSPlugin = require( 'uglifyjs-webpack-plugin' )

const merge = require( 'lodash/merge' )
require( 'dotenv' ).config({ silent: true })

const webpack = require( 'webpack' )
const path = require( 'path' )
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' )

const IS_PRODUCTION = process.env.NODE_ENV === 'production'
const siteJs = [ './scripts/site.js' ]

const defaultConfig = {
  devtool: IS_PRODUCTION ? false : 'source-map',
  entry: {

  },
  output: {
    path: __dirname,
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: { url: false },
            },
            {
              loader: 'less-loader',
            },
          ],
        }),
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': IS_PRODUCTION ? JSON.stringify( 'production' ) : JSON.stringify( 'development' ),
    }),
    new ExtractTextPlugin({
      filename: '[name].css',
    }),
  ],
}

if ( IS_PRODUCTION ) {
  defaultConfig.plugins.push(
    new UglifyJSPlugin({
      parallel: true,
      include: /\.js$/,
      exclude: /node_modules/,
      uglifyOptions: {
        mangle: {
          // reserved: exemptFunctionNames,
        },
        compress: {
          evaluate: true, // this needs to be true for dead code elimination to work
          unused: false, // this is needed to preserve Smartling translation directives
        },
        warnings: true,
      },
    })
  )
}

const createConfig = ( options ) => merge({}, defaultConfig, options )

module.exports = [
  createConfig({
    entry: {
      'dist/template-recommendation': siteJs,
      'build/assets/template-recommendation': './styles/template-recommendation.less'
    },
    output: {
      libraryTarget: 'commonjs2',
    },
  }),
]
