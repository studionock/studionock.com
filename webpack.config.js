const { join } = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const env = process.env.NODE_ENV || 'development';

const common = {
  context: join(__dirname, 'src'),
  entry: {
    app: ['./js/app'],
  },
  output: {
    path: join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js',
    sourceMapFilename: '[name].map',
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
  ],
};

let config;
switch (env) {
  case 'production':
    config = merge(common, {
      devtool: 'cheap-module-source-map',
      plugins: [
        new webpack.LoaderOptionsPlugin({
          minimize: true,
          debug: false,
        }),
        new webpack.optimize.UglifyJsPlugin({
          beautify: false,
          mangle: { screw_ie8: true, keep_fnames: true },
          compress: { screw_ie8: true },
          comments: false,
          warnings: false,
        }),
      ],
    });
    break;

  default:
    config = merge(common, {
      devtool: 'cheap-eval-source-map',
    });
    break;
}

module.exports = config;
