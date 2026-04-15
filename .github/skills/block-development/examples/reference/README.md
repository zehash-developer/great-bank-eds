# Reference block JavaScript snapshots

Vendored main block scripts (and Storybook-only files where there is no UE model) for use as **implementation reference** when the skills folder is copied standalone.

**Index:** see [block-catalog.md](../../../block-catalog.md) for summaries and links to paired UE JSON.

| File | Role |
| --- | --- |
| `accordion.js` | Nested items, `moveInstrumentation` |
| `action-card.js` | Single-level items, carousel |
| `big-numbers.js` | Rates / tabs |
| `block-header.stories.js` | Shared header pattern (Storybook) |
| `breadcrumbs.js` | Breadcrumbs |
| `button.stories.js` | GEL button showcase (Storybook) |
| `cards.js` | Card grid + carousel |
| `collapsible.js` | Collapsible |
| `columns.js` | Columns layout |
| `embed-adaptive-form.js` | Embed |
| `feature-list.js` | Feature list |
| `footer.js` | Footer chrome |
| `header.js` | Header chrome |
| `important-to-know.js` | Callout |
| `information-card.js` | Info card |
| `information-panel.js` | Panel |
| `step-accordion.js` | Step accordion |
| `tab.js` | Tabs |
| `table.js` | Table |
| `tap-tiles.js` | Tap tiles + carousel options |
| `video.js` | Video |

Imports inside these files still reference `scripts/`, `styles/`, etc., as in the Westpac repo—adjust paths when you reuse code outside that layout.
