/* eslint-disable */
import nockSlider from 'nock-slider';
import rafScheduler from 'raf-schd';
import { getOuterHeight } from '../utils';

const createListener = slideContainer =>
  rafScheduler(imgEl => {
    const height = getOuterHeight(imgEl);
    slideContainer.style.height = `${height}px`;
  });

export default async function initSlider() {
  try {
    const images = window.images ? JSON.parse(window.images) : null;
    const slideContainer = document.querySelector('.slideshow-container');

    if (images && slideContainer) {
      const btnPrev = document.querySelector('.slideshowbtn-left');
      const btnNext = document.querySelector('.slideshowbtn-right');

      const onSlideEnd = createListener(slideContainer);

      await nockSlider(slideContainer, images, {
        btnPrev,
        btnNext,
        onSlideEnd,
      });
    }
  } catch (error) {
    console.error(error);
  }
}
