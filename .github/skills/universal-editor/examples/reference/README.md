# Reference UE JSON snapshots

Vendored `_*.json`-style models for blocks used as **Universal Editor reference examples** in this skill. Spreads use manifests **in this same folder** (`./_filled-icons.json`, `./_outlined-icons.json`) so the skills bundle does not depend on `models/generated/` paths.

Adaptive Form, embed-adaptive-form, and fragment UE models are **not** included here; use the application repository’s `blocks/` definitions for those.

**Index:** see [block-catalog.md](../../../block-catalog.md) for summaries and links to paired JS files.

## Block model files

| File | Notes |
| --- | --- |
| `accordion.json` | Nested child components in item filter |
| `action-card.json` | Single-level items |
| `big-numbers.json` | Tabs / rates |
| `cards.json` | Conditionals, CTA toggles |
| `collapsible.json` | Single collapsible |
| `columns.json` | Column layout |
| `feature-list.json` | Icon + features |
| `important-to-know.json` | Callout |
| `information-card.json` | Info card |
| `information-panel.json` | Banner panel + icon |
| `page-header.json` | Page header |
| `step-accordion.json` | Steps; uses `./_outlined-icons.json` |
| `tab.json` | Tabs + icon |
| `table.json` | Data table |
| `tap-tiles.json` | Tiles + icon multiselect |
| `video.json` | Video block |

## Generated manifests (merged via `...` spread)

| File | Used by |
| --- | --- |
| `_filled-icons.json` | Most icon pickers |
| `_outlined-icons.json` | `step-accordion.json` |

## Maintenance

When updating from the **application** repository, copy from `blocks/<name>/_<name>.json`, then:

1. Point any `../../models/generated/_filled-icons.json` spread to `./_filled-icons.json`.
2. Point any `../../models/generated/_outlined-icons.json` spread to `./_outlined-icons.json`.
3. Run `npm run build:json` in the app repo (not in the skills folder) to validate merged output after pasting back.
