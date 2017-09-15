import nockSlider from 'nock-slider'; // eslint-disable-line
import rafScheduler from 'raf-schd';
import { getOuterHeight } from '../utils';

const createListener = slideContainer =>
  rafScheduler(imgEl => {
    const height = getOuterHeight(imgEl);
    slideContainer.style.height = `${height}px`; // eslint-disable-line
  });

export default function initSlider() {
  try {
    const images = window.images ? JSON.parse(window.images) : null;
    const slideContainer = document.querySelector('.slideshow-container');

    if (images && slideContainer) {
      const btnPrevious = document.querySelector('.slideshowbtn-left');
      const btnNext = document.querySelector('.slideshowbtn-right');

      const onSlideEnd = createListener(slideContainer);

      const slider = nockSlider(slideContainer, images, {
        transitionDuration: 500,
        btnPrevious,
        btnNext,
        onSlideEnd,
      });

      window.addEventListener('keydown', event => {
        const { keyCode } = event;
        if (keyCode === 37 || keyCode === 39) event.preventDefault();
        if (keyCode === 37) slider.previous();
        if (keyCode === 39) slider.next();
      });
    }
  } catch (error) {
    console.error(error);
  }
}
