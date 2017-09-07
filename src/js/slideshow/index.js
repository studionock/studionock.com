/* eslint-disable no-param-reassign */

const outerHeight = el => {
  const height = el.offsetHeight;
  const style = getComputedStyle(el);

  return (
    parseInt(style.marginTop, 10) + parseInt(style.marginBottom, 10) + height
  );
};

const activateImg = img => img.classList.add('active');
const deacticateImg = img => img.classList.remove('active');

const getImages = imgs => {
  const current = Array.prototype.find.call(imgs, i =>
    i.classList.contains('active'),
  );
  const next = current.nextElementSibling;
  const prev = current.previousElementSibling;

  return {
    current: current || imgs[0],
    next: next || imgs[0],
    prev: prev || imgs[imgs.length - 1],
  };
};

const handleBtnRight = (imgs, container) => () => {
  const { current, next } = getImages(imgs);
  deacticateImg(current);
  activateImg(next);
  container.style.height = `${outerHeight(next)}px`;
};

const handleBtnLeft = (imgs, container) => () => {
  const { current, prev } = getImages(imgs);
  deacticateImg(current);
  activateImg(prev);
  container.style.height = `${outerHeight(prev)}px`;
};

const initializeSlide = container => {
  const imgs = container.querySelectorAll('img');
  const buttonLeft = container.querySelector('.slideshowbtn-left');
  const buttonRight = container.querySelector('.slideshowbtn-right');

  const initialHeight = outerHeight(imgs[0]);
  container.style.height = `${initialHeight}px`;

  activateImg(imgs[0]);

  buttonRight.addEventListener('click', handleBtnRight(imgs, container));
  buttonLeft.addEventListener('click', handleBtnLeft(imgs, container));
};

export default function slideshow() {
  window.onload = () => {
    const slideshows = document.querySelectorAll('.slideshow');
    slideshows.forEach(initializeSlide);
  };
}
