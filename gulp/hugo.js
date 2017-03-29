import cp from 'child_process';
import { Writable } from 'stream';
import gutil from 'gulp-util';

function truncate(str, length = 100, end = '...') {
  if (str.length < length) return str;
  return `${str.substring(0, length - end.length)}${end}`;
}

class Stream extends Writable {
  _write(chunk, encoding, cb) { // eslint-disable-line class-methods-use-this
    const lines = chunk.toString()
      .split('\n')
      .filter(line => line !== '')
      .map((line) => {
        const regEx = /(\d{2,}(\/|:)\d{2,}(\/|:)\d{2,})/;
        const words = line.split(' ');
        const head = words[0];
        const tail = words
          .slice(1)
          .filter(str => !regEx.test(str))
          .join(' ');

        let newHead = gutil.colors.grey(`  ${head}`);
        if (head === 'INFO') newHead = gutil.colors.yellow(`  ${head}`);
        if (head === 'WARN') newHead = gutil.colors.red(`  ${head}`);
        if (head === 'Started' || head === 'Built') newHead = gutil.colors.white(`\n   ${head}`);

        let newTail = gutil.colors.grey(tail);
        if (head === 'Started' || head === 'Built') newTail = gutil.colors.white(tail);

        return truncate(`${newHead} ${newTail}`) + '\n'; // eslint-disable-line prefer-template
      });

    gutil.log('\n', ...lines);
    cb();
  }
}

export default function hugo(browserSync, options = [], bin = 'hugo') {
  const args = ['-d', '../dist', '-s', 'site', '-v', ...options];

  const ret = (done) => {
    gutil.log('[hugo]', 'Running hugo\n\n');
    const child = cp.spawn(bin, args, { stdio: [null, 'pipe', 'inherit'] });
    child.stdout.pipe(new Stream());

    child.on('close', (code) => {
      if (code === 0) {
        browserSync.reload();
        done();
      } else {
        const err = new Error(`Hugo build failed 😰 (with code ${code})`);
        browserSync.notify(err);
        done(err);
      }
    });
  };

  Object.defineProperty(ret, 'name', { value: 'hugo' });
  return ret;
}
