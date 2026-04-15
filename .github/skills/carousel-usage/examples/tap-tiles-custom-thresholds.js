import {
  initializeCarousel,
  renderCarouselContainer,
} from '../../scripts/utility/carousel.js';

export function renderTapTiles(tiles, stackTiles = false) {
  const tilesHTML = tiles
    .map(
      (tile) => `
        <li class="carousel-item tap-tiles-item">
          <a href="${tile.url}" class="tap-tiles-link">
            <span class="tap-tiles-label">${tile.label}</span>
          </a>
        </li>
      `,
    )
    .join('');

  return renderCarouselContainer('tap-tiles', tilesHTML, { isStacked: stackTiles });
}

export function initTapTilesCarousel(block, tileCount, stackTiles = false) {
  requestAnimationFrame(() => {
    initializeCarousel(block, tileCount, {
      isStacked: stackTiles,
      equalizeHeights: false,
      carouselThresholds: {
        xl: 7,
        lg: 7,
        md: 6,
        sm: 5,
        xsl: 3,
        xs: 3,
      },
      carouselItemSpans: {
        xl: 2,
        lg: 2,
        md: 2.4,
        sm: 3,
        xsl: 5.2,
        xs: 5.2,
      },
      canCarouselItemGrow: true,
    });
  });
}
