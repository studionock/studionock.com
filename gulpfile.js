/* eslint-disable no-use-before-define */
const gulp = require('gulp');
const cp = require('child_process');
const gutil = require('gulp-util');
const postcss = require('gulp-postcss');
const cssImport = require('postcss-import');
const cssnext = require('postcss-cssnext');
const BrowserSync = require('browser-sync');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');

const browserSync = BrowserSync.create();
const hugoBin = 'hugo';
const defaultArgs = ['-d', '../dist', '-s', 'site', '-v'];

gulp.task('hugo', buildSite());
gulp.task('hugo-preview', buildSite(['--buildDrafts', '--buildFuture']));

gulp.task('build', ['css', 'js', 'hugo']);
gulp.task('build-preview', ['css', 'js', 'hugo-preview']);

gulp.task('css', () => (
  gulp.src('./src/css/*.css')
    .pipe(postcss([cssnext(), cssImport({ from: './src/css/main.css' })]))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream())
));

gulp.task('js', (cb) => {
  const myConfig = Object.assign({}, webpackConfig);

  webpack(myConfig, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString({
      colors: true,
      progress: true,
    }));
    browserSync.reload();
    cb();
  });
});

gulp.task('server', ['hugo', 'css', 'js'], () => {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
  });
  gulp.watch('./src/js/**/*.js', ['js']);
  gulp.watch('./src/css/**/*.css', ['css']);
  gulp.watch('./site/**/*', ['hugo']);
});

function buildSite(options = []) {
  const args = [...defaultArgs, ...options];

  return cb => cp.spawn(hugoBin, args, { stdio: 'inherit' })
    .on('close', (code) => {
      if (code === 0) {
        browserSync.reload();
        cb();
      } else {
        const err = new Error(`Hugo build failed 😰 (with code ${code})`);
        browserSync.notify(err);
        cb(err);
      }
    });
}
