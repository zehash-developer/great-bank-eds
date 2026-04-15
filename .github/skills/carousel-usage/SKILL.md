---
name: carousel-usage
description: Implement and configure shared carousel behavior in EDS blocks using scripts/utility/carousel.js, including thresholds, controls, and block-specific integration patterns.
argument-hint: '[block path] [carousel behavior]'
---

# Carousel Usage

Use this skill when adding or updating carousel behavior in block JavaScript.

The shared carousel utility switches between grid mode and carousel mode by item count and breakpoint. In this repo it lives at `scripts/utility/carousel.js` and is styled by shared carousel SCSS.

**Deep dive:** Architecture, HTML structure, full JS/SCSS examples, testing checklist, and troubleshooting are in **[examples/CAROUSEL_GUIDE.md](examples/CAROUSEL_GUIDE.md)** (merged from the former `agents/skills/carousel` guide).

## Portable bundle (copy to another project)

These files sit together under **[examples/reference/](examples/reference/)** so you can vendor the skill without the rest of the repo:

| File | Role |
| --- | --- |
| [reference/carousel.js](examples/reference/carousel.js) | Same logic as `scripts/utility/carousel.js`; imports `./shared-debounce.js` |
| [reference/shared-debounce.js](examples/reference/shared-debounce.js) | `debounce` only — replaces `shared.js` for standalone use |
| [reference/_carousel.scss](examples/reference/_carousel.scss) | Shared layout / scroll / mode styles |
| [reference/_block-padding.scss](examples/reference/_block-padding.scss) | Padding mixin |
| [reference/cards.js](examples/reference/cards.js), [reference/action-card.js](examples/reference/action-card.js), [reference/tap-tiles.js](examples/reference/tap-tiles.js) | Production integration examples |

See [examples/reference/README.md](examples/reference/README.md).

## When To Use

- A block needs responsive carousel activation by item count and breakpoint.
- A block should reuse shared carousel controls and scrolling behavior.
- You need custom thresholds (like tap-tiles) instead of defaults.
- You need equalized card heights in carousel and non-carousel modes.

## Core Pattern

1. Extract block data and item rows.
2. Render list items as `.carousel-item` entries.
3. Wrap items with `renderCarouselContainer(prefix, itemsHTML, options)`.
4. Move UE instrumentation from authored rows to rendered items.
5. Call `initializeCarousel(block, itemCount, options)` in `requestAnimationFrame`.

Follow the EDS lifecycle: `extractData()` → `renderHTML()` → `decorate()`, with DOM mutations only in `decorate()`.

## Required Markup Contract

The shared utility expects these hooks in the rendered output:

- `.carousel-block-container`
- `.carousel-list`
- `.carousel-scroll-prev`
- `.carousel-scroll-next`
- `.carousel-scrollbar-thumb`
- `.carousel-item` on each list item

Use **dual class naming** on carousel nodes: generic carousel classes (e.g. `.carousel-list`) plus block-specific classes (e.g. `.tap-tiles-list`).

## Shared Utility Contracts

Import from `scripts/utility/carousel.js` in the app repo:

- `renderCarouselContainer`
- `initializeCarousel`

`renderCarouselContainer(prefix, itemsHTML, options)`

- `prefix`: block class prefix, such as `cards` or `tap-tiles`
- `itemsHTML`: rendered `<li>` string, each with `.carousel-item`
- `options.isStacked`: force non-carousel grid behavior when true

`initializeCarousel(block, itemCount, options)`

- `itemCount`: number of carousel items
- `options.isStacked`: disable carousel mode
- `options.equalizeHeights`: align card heights
- `options.carouselThresholds`: custom breakpoint thresholds
- `options.carouselItemSpans`: custom width spans by breakpoint
- `options.canCarouselItemGrow`: allow items to grow beyond configured span

## Default Thresholds

Carousel mode activates when `itemCount >= threshold`.

| Breakpoint | Min width | Default threshold |
| --- | --- | --- |
| `xs` | `0` | `2` |
| `xsl` | `576` | `2` |
| `sm` | `768` | `3` |
| `md` | `992` | `3` |
| `lg` | `1200` | `4` |
| `xl` | `1584` | `5` |

## Default Item Spans

| Breakpoint | Default span |
| --- | --- |
| `xs` | `10` |
| `xsl` | `10` |
| `sm` | `5` |
| `md` | `4` |
| `lg` | `4` |
| `xl` | `3` |

## Integration Sequence

1. Extract authored rows and keep references needed for `moveInstrumentation`.
2. Build items as list entries with `.carousel-item`.
3. Render with `renderCarouselContainer(...)`.
4. Move instrumentation from source rows to rendered nodes.
5. Initialize in `requestAnimationFrame(...)`.

Typical defaults for card-like blocks:

```javascript
requestAnimationFrame(() => {
  initializeCarousel(block, itemCount, {
    isStacked: false,
    equalizeHeights: true,
  });
});
```

Typical custom setup for tap-tiles-like blocks:

```javascript
requestAnimationFrame(() => {
  initializeCarousel(block, itemCount, {
    isStacked,
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
```

## Reference Implementations

Snapshots in this skill package:

- Default thresholds + equalized heights: [examples/reference/cards.js](examples/reference/cards.js)
- Default thresholds + equalized heights + custom card styling: [examples/reference/action-card.js](examples/reference/action-card.js)
- Custom thresholds + optional stacked mode: [examples/reference/tap-tiles.js](examples/reference/tap-tiles.js)
- Shared utility: [examples/reference/carousel.js](examples/reference/carousel.js)

## Guardrails

1. Keep event listeners scoped via the shared utility and block render lifecycle.
2. Initialize only once per rendered block structure; guard re-decoration paths.
3. Use `requestAnimationFrame` before `initializeCarousel` so dimensions are stable.
4. Preserve UE instrumentation before carousel interaction starts.
5. Keep item count and threshold logic explicit.
6. Do not duplicate carousel controls or DOM hooks outside the shared utility.
7. Keep block CSS focused on visuals; rely on shared carousel styles for layout mechanics.

## Common Pitfalls

- Missing `.carousel-item` on list items breaks sizing and mode logic.
- Initializing before render completion causes wrong width/height calculations.
- Forgetting `moveInstrumentation(...)` breaks Universal Editor after re-render.
- Re-initializing without guarding decorate paths can create duplicate listeners.

## Reference

- Skill package: [SKILL.md](./SKILL.md)
- Full guide (architecture, examples, testing, troubleshooting): [examples/CAROUSEL_GUIDE.md](examples/CAROUSEL_GUIDE.md)
- Repo source of truth: [agents.md](../../../agents.md)

## Resources

- Reference library (utility, SCSS, block examples): [examples/reference/README.md](examples/reference/README.md)
- Checklist: [examples/checklist.md](examples/checklist.md)
- Shared utility integration: [examples/shared-utility-integration.js](examples/shared-utility-integration.js)
- Cards pattern (equal heights): [examples/cards-equal-heights.js](examples/cards-equal-heights.js)
- Tap tiles pattern (custom thresholds): [examples/tap-tiles-custom-thresholds.js](examples/tap-tiles-custom-thresholds.js)
