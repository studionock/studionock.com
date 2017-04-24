import gulp from 'gulp';
import gutil from 'gulp-util';
import postcss from 'gulp-postcss';
import cssImport from 'postcss-import';
import cssnext from 'postcss-cssnext';
import cleanCss from 'gulp-clean-css';
import sourcemaps from 'gulp-sourcemaps';
import tape from 'gulp-tape';
import tap from 'tap-spec';
import del from 'del';
import BrowserSync from 'browser-sync';
import webpack from 'webpack';
import webpackConfig from './webpack.config';
import hugo from './gulp/hugo';

const PATHS = {
  dist: './dist',
  js: {
    src: './src/js/**/*.js',
    dest: './dist',
  },
  css: {
    src: './src/css/*.css',
    dest: './dist/css',
    maps: './maps',
    main: './src/css/main.css',
  },
  hugo: {
    src: './site/**/*',
  },
  clean: ['./dist/**/*'],
};

const browserSync = BrowserSync.create();
const hugoTask = hugo(browserSync, ['--buildDrafts']);

function clean() {
  return del(PATHS.clean);
}

function js(env = 'development') {
  const ret = (done) => {
    webpack(webpackConfig(env), (err, stats) => {
      if (err) throw new gutil.PluginError('webpack', err);
      gutil.log('[webpack]', stats.toString({ colors: true, progress: true }));
      browserSync.reload();
      done();
    });
  };

  Object.defineProperty(ret, 'name', { value: 'js' });
  return ret;
}

function css() {
  const postcssPlugins = [
    cssImport({ root: './src/css' }),
    cssnext(),
  ];

  return gulp.src(PATHS.css.src)
    .pipe(sourcemaps.init())
    .pipe(postcss(postcssPlugins))
    .pipe(cleanCss({ compatability: 'ie8' }))
    .pipe(sourcemaps.write(PATHS.css.maps))
    .pipe(gulp.dest(PATHS.css.dest))
    .pipe(browserSync.stream());
}

function server() {
  browserSync.init({
    server: {
      baseDir: PATHS.dist,
    },
  });

  gulp.watch(PATHS.js.src, js());
  gulp.watch(PATHS.css.src, css);
  gulp.watch(PATHS.hugo.src, hugoTask);
}

export function test() {
  return gulp.src('./src/js/**/*.spec.js')
    .pipe(tape({ reporter: tap() }));
}

export const build = gulp.series(
  clean,
  gulp.parallel(
    hugo(browserSync),
    css,
    js('production'),
  ),
);

export const buildPreview = gulp.series(
  clean,
  gulp.parallel(
    hugoTask,
    css,
    js('production'),
  ),
);

export const start = gulp.series(
  clean,
  gulp.parallel(
    hugoTask,
    css,
    js(),
  ),
  server,
);
