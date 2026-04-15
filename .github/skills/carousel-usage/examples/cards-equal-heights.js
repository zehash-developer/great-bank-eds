import {
  initializeCarousel,
  renderCarouselContainer,
} from '../../scripts/utility/carousel.js';

export function renderCardCarousel(cards) {
  const cardsHTML = cards
    .map(
      (card) => `
        <li class="carousel-item card-item">
          <h3 class="card-title">${card.title}</h3>
          <p class="card-description">${card.description || ''}</p>
        </li>
      `,
    )
    .join('');

  return renderCarouselContainer('card', cardsHTML, { isStacked: false });
}

export function initCardCarousel(block, totalCards) {
  requestAnimationFrame(() => {
    initializeCarousel(block, totalCards, {
      isStacked: false,
      equalizeHeights: true,
    });
  });
}
