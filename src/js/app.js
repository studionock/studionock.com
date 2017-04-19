import balanceText from 'balance-text';

balanceText();

export default function app(who = 'world') {
  return `Hello ${who}!`;
}
