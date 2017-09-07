/* eslint-disable no-param-reassign */

export const addClass = (el, className) => {
  if ('classList' in el) el.classList.add(className);
  else el.className += ` ${className}`;
};

export const removeClass = (el, className) => {
  if ('classList' in el) el.classList.remove(className);
  else
    el.className = el.className.replace(
      new RegExp(`(^|\\b)${className.split(' ').join('|')}(\\b|$)`, 'gi'),
      ' ',
    );
};

export const hasClass = (el, className) => {
  if ('classList' in el) return el.classList.contains(className);
  return new RegExp(`(^| )${className}( |$)`, 'gi').test(el.className);
};

export const getOuterHeight = el => {
  const height = el.offsetHeight;
  const style = getComputedStyle(el);

  return (
    parseInt(style.marginTop, 10) + parseInt(style.marginBottom, 10) + height
  );
};

export const onDocumentReady = fn => {
  if (
    document.attachEvent
      ? document.readyState === 'complete'
      : document.readyState !== 'loading'
  ) {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
};
