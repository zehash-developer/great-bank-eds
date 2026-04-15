import { moveInstrumentation } from '../../scripts/scripts.js';
import {
  initializeCarousel,
  renderCarouselContainer,
} from '../../scripts/utility/carousel.js';

function renderItems(items) {
  return items
    .map(
      (item) => `
        <li class="carousel-item sample-item">
          <h3>${item.title}</h3>
        </li>
      `,
    )
    .join('');
}

export default function decorate(block) {
  if (block.querySelector('.sample-block-container')) {
    return;
  }

  const items = [...block.children].map((row) => ({
    title: row.textContent.trim(),
    row,
  }));

  block.innerHTML = renderCarouselContainer('sample', renderItems(items));

  const renderedItems = block.querySelectorAll('.sample-item');
  items.forEach((item, index) => {
    if (renderedItems[index] && item.row) {
      moveInstrumentation(item.row, renderedItems[index]);
    }
  });

  requestAnimationFrame(() => {
    initializeCarousel(block, items.length, {
      isStacked: false,
      equalizeHeights: false,
    });
  });
}
