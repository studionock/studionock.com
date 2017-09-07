/* eslint-disable import/no-extraneous-dependencies */
const cp = require('child_process');
const path = require('path');
const gutil = require('gulp-util');

const PLUGIN_NAME = 'gulp-hugo';

const filterMessages = containing => message => {
  const lines = message.split('\n');
  return lines.filter(str =>
    str.toLowerCase().includes(containing.toLowerCase()),
  );
};

const filterNone = filterMessages('');
const filterWarnings = filterMessages('WARN');
const filterErrors = filterMessages('ERROR');

const formatOutput = messages =>
  messages
    .map(msg => {
      if (msg.toLowerCase().includes('warn')) return gutil.colors.yellow(msg);
      if (msg.toLowerCase().includes('error')) return gutil.colors.red(msg);
      return msg;
    })
    .join('\n  ');

const constructArgs = opts => {
  const flags = {
    buildDrafts: ['-D'],
    buildExpired: ['-E'],
    buildFuture: ['-F'],
    dest: ['-d', path.resolve(opts.dest || 'dist')],
    src: ['-s', path.resolve(opts.src || '')],
  };

  return Object.keys(opts).reduce((acc, key) => {
    if (!opts[key] || !flags[key]) return acc;
    return [...acc, ...flags[key], '-v'];
  }, []);
};

module.exports = (opts = {}) => {
  const processArgs = constructArgs(opts);

  return new Promise((resolve, reject) => {
    const hugoProcess = cp.spawn(opts.bin || 'hugo', processArgs);

    let all = [];
    let warnings = [];
    let errors = [];

    hugoProcess.stdout.on('data', data => {
      const str = data.toString();

      all = [...all, ...filterNone(str)];
      warnings = [...warnings, ...filterWarnings(str)];
      errors = [...errors, ...filterErrors(str)];
    });

    hugoProcess.on('close', code => {
      if (code === 0) {
        if (opts.verbose && !opts.warningsOnly)
          gutil.log(PLUGIN_NAME, '\n  ', formatOutput(all));
        if (opts.warningsOnly)
          gutil.log(PLUGIN_NAME, '\n  ', formatOutput(warnings));
        return resolve();
      }
      const err = formatOutput(errors);

      if (!opts.noThrow) return reject(new gutil.PluginError(PLUGIN_NAME, err));

      gutil.log(PLUGIN_NAME, '\n  ', err);
      return resolve();
    });
  });
};
