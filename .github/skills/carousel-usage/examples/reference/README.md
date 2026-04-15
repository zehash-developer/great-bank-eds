# Reference carousel integration snapshots

These files are **reference copies** so this skill does not rely on live `blocks/` or `scripts/` paths in every consumer repo.

| File | Role |
| --- | --- |
| `carousel.js` | Shared utility (import from `scripts/utility/carousel.js` in-repo; **this copy** imports `./shared-debounce.js` so the skill folder is self-contained) |
| `shared-debounce.js` | `debounce` helper required by `carousel.js` when not using the full `shared.js` |
| `_carousel.scss` | Shared carousel layout styles |
| `_block-padding.scss` | Padding mixin used with carousel blocks |
| `cards.js` | Default thresholds + `equalizeHeights` |
| `action-card.js` | Same pattern with block-specific card markup |
| `tap-tiles.js` | Custom `carouselThresholds` / `carouselItemSpans` |

**In the main repo**, production code lives under `scripts/`, `styles/`, and `blocks/`. When you vendor only this skill folder, use the copies here as the canonical examples.
