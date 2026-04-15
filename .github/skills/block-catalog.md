# Block catalog (skills bundle)

All **source snapshots** below live **only** under `.github/skills/`. Copy the whole `.github/skills` tree into any project; you do not need this repository’s `blocks/` folder to read these files.

When implementing in the **Westpac app**, production sources remain under `blocks/<name>/` in that repo—sync changes from there into this catalog when blocks evolve.

| Block | Summary | Patterns | Universal Editor model | Block JavaScript / stories |
| --- | --- | --- | --- | --- |
| `accordion` | Expand/collapse panels; items can host nested authored components. | `nested-items`, `accordion`, `richtext` | [accordion.json](universal-editor/examples/reference/accordion.json) | [accordion.js](block-development/examples/reference/accordion.js) |
| `action-card` | Promotional cards with image, heading, link; shared carousel at higher counts. | `single-level-items`, `carousel`, `reference-image` | [action-card.json](universal-editor/examples/reference/action-card.json) | [action-card.js](block-development/examples/reference/action-card.js) |
| `big-numbers` | Rates/metrics with optional tabs and multiple rate rows per item. | `block-items`, `tabs`, `validation-heavy` | [big-numbers.json](universal-editor/examples/reference/big-numbers.json) | [big-numbers.js](block-development/examples/reference/big-numbers.js) |
| `block-header` | Reusable heading pattern for Storybook and composed UIs (not a standalone UE block here). | `presentation`, `block-header`, `storybook` | — | [block-header.stories.js](block-development/examples/reference/block-header.stories.js) |
| `breadcrumbs` | Breadcrumb navigation from authored content. | `navigation`, `document-based` | — | [breadcrumbs.js](block-development/examples/reference/breadcrumbs.js) |
| `button` | GEL button variant/size showcase for Storybook. | `storybook`, `presentation` | — | [button.stories.js](block-development/examples/reference/button.stories.js) |
| `cards` | Card grid with image/pictogram, CTAs, carousel. | `single-level-items`, `carousel`, `conditional-fields` | [cards.json](universal-editor/examples/reference/cards.json) | [cards.js](block-development/examples/reference/cards.js) |
| `collapsible` | Single expandable/collapsible region. | `collapsible`, `single-section` | [collapsible.json](universal-editor/examples/reference/collapsible.json) | [collapsible.js](block-development/examples/reference/collapsible.js) |
| `columns` | Responsive column layout wrapper. | `layout`, `columns` | [columns.json](universal-editor/examples/reference/columns.json) | [columns.js](block-development/examples/reference/columns.js) |
| `embed-adaptive-form` | Embeds an Adaptive Form from AEM. | `embed`, `adaptive-form` | — | [embed-adaptive-form.js](block-development/examples/reference/embed-adaptive-form.js) |
| `feature-list` | Feature list with GEL icon per item and optional link. | `single-level-items`, `icon-picker` | [feature-list.json](universal-editor/examples/reference/feature-list.json) | [feature-list.js](block-development/examples/reference/feature-list.js) |
| `footer` | Site footer chrome. | `chrome`, `layout` | — | [footer.js](block-development/examples/reference/footer.js) |
| `form` | Adaptive Form runtime (rules, fields, wizard, etc.). UE models and JS live in the application repo (`blocks/form/`). | `form-runtime`, `adaptive-form`, `validation` | — | — |
| `fragment` | AEM content/experience fragment reference. | `fragment`, `reference` | — | — |
| `header` | Site header chrome. | `chrome`, `navigation` | — | [header.js](block-development/examples/reference/header.js) |
| `important-to-know` | “Important to know” callout strip. | `callout`, `richtext` | [important-to-know.json](universal-editor/examples/reference/important-to-know.json) | [important-to-know.js](block-development/examples/reference/important-to-know.js) |
| `information-card` | Compact informational card. | `card`, `single-level` | [information-card.json](universal-editor/examples/reference/information-card.json) | [information-card.js](block-development/examples/reference/information-card.js) |
| `information-panel` | Banner panel with icon, dismiss, CTA. | `icon-picker`, `dismissible` | [information-panel.json](universal-editor/examples/reference/information-panel.json) | [information-panel.js](block-development/examples/reference/information-panel.js) |
| `page-header` | Page title region for article-like pages. | `page-chrome`, `heading` | [page-header.json](universal-editor/examples/reference/page-header.json) | — |
| `step-accordion` | Numbered step accordion. | `nested-items`, `accordion`, `steps` | [step-accordion.json](universal-editor/examples/reference/step-accordion.json) | [step-accordion.js](block-development/examples/reference/step-accordion.js) |
| `tab` | Tabbed panels with optional tab icons. | `tabs`, `icon-picker` | [tab.json](universal-editor/examples/reference/tab.json) | [tab.js](block-development/examples/reference/tab.js) |
| `table` | Responsive data table. | `table`, `a11y` | [table.json](universal-editor/examples/reference/table.json) | [table.js](block-development/examples/reference/table.js) |
| `tap-tiles` | Linked tiles with icon and URL; custom carousel thresholds. | `single-level-items`, `carousel`, `icon-picker` | [tap-tiles.json](universal-editor/examples/reference/tap-tiles.json) | [tap-tiles.js](block-development/examples/reference/tap-tiles.js) |
| `video` | Video with poster/transcript and items. | `media`, `video` | [video.json](universal-editor/examples/reference/video.json) | [video.js](block-development/examples/reference/video.js) |

Links are relative to **this file** (`.github/skills/block-catalog.md`).

## Shared UE manifests (skills)

- [universal-editor/examples/reference/_filled-icons.json](universal-editor/examples/reference/_filled-icons.json) — GEL filled icons (merged into models via spread).
- [universal-editor/examples/reference/_outlined-icons.json](universal-editor/examples/reference/_outlined-icons.json) — outlined icons (e.g. step-accordion).

## Carousel utility (related)

Blocks that use the shared carousel also have copies under [carousel-usage/examples/reference/](carousel-usage/examples/reference/) (`carousel.js`, SCSS, and some overlapping block JS).

## Maintenance

1. After changing a block in the **application** `blocks/<name>/`, refresh the matching files under `universal-editor/examples/reference/` and `block-development/examples/reference/`, then update this table if filenames change.
2. Re-copy icon manifests from `models/generated/` when icons change.
3. New block: add a row and vendored files before merging.
