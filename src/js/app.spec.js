import test from 'tape';
import app from './app';

test('App()', (t) => {
  const should = 'Should return greeting';
  const actual = app('me');
  const expected = 'Hello me!';

  t.equal(actual, expected, should);
  t.end();
});
