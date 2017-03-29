import { join } from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';

export default function webpackConfig(env) {
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

  switch (env) {
    case 'production':
      return merge(common, {
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

    default:
      return merge(common, {
        devtool: 'cheap-eval-source-map',
      });
  }
}
