/* eslint-disable no-param-reassign */
import {
  addClass,
  removeClass,
  hasClass,
  getOuterHeight,
  onDocumentReady,
} from '../utils';

const activateImg = img => addClass(img, 'active');
const deacticateImg = img => removeClass(img, 'active');

const getImages = imgs => {
  const current = Array.prototype.find.call(imgs, i => hasClass(i, 'active'));
  const next = current.nextElementSibling;
  const prev = current.previousElementSibling;

  return {
    current: current || imgs[0],
    next: next || imgs[0],
    prev: prev || imgs[imgs.length - 1],
  };
};

const handleClick = (imgs, container, back) => () => {
  const { current, prev, next } = getImages(imgs);
  const el = back ? prev : next;

  deacticateImg(current);
  activateImg(el);

  container.style.height = `${getOuterHeight(el)}px`;
};

const initializeSlide = container => {
  const imgs = container.querySelectorAll('img');
  const buttonLeft = container.querySelector('.slideshowbtn-left');
  const buttonRight = container.querySelector('.slideshowbtn-right');

  const initialHeight = getOuterHeight(imgs[0]);
  container.style.height = `${initialHeight}px`;

  activateImg(imgs[0]);

  buttonRight.addEventListener('click', handleClick(imgs, container, false));
  buttonLeft.addEventListener('click', handleClick(imgs, container, true));
};

export default function slideshow() {
  onDocumentReady(() => {
    const slideshows = document.querySelectorAll('.slideshow');
    Array.prototype.forEach.call(slideshows, initializeSlide);
  });
}
