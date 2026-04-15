# Block: step-accordion

**Source:** Figma only (no Confluence page provided)
**Figma file:** `WXBZsxyNrHkyGDg0FWIS1g` — Great Bank Design Files

---

## Requirements

### Overview

The Step Accordion block presents a numbered, sequential list of collapsible steps — combining a visual timeline/stepper with accordion expand/collapse behaviour. It is suited for onboarding flows, process guides, and how-to content. Steps are displayed as an ordered list; each step has a trigger (step label) that expands a description panel and optionally reveals a contextual image alongside the list.

The first item is open by default. Only one panel is open at a time (single-expand).

### Variants

| Variant | CSS class | Description |
|---------|-----------|-------------|
| Default (light) | _(none)_ | White/light background, dark text |
| Dark | `dark` | Dark navy background, light text |

### CTA types

| CTA Type | Author value | Description |
|----------|-------------|-------------|
| None | `none` | No CTA section below the steps |
| Single | `single` | One primary text link button below the steps |
| Dual | `dual` | Two icon+label card links side by side below the steps |

### Item count

The block must support any number of step items (content-driven). Figma provides multiple variant frames showing different step counts as examples.

---

## Block Dialogue

Not provided (no Confluence source).

---

## Block UI

### Anatomy

The block is composed of three main zones:

1. **Block header** — `<h2>` heading above the steps.
2. **Content area** — two-column layout:
   - **Step list (left column):** `<ol>` of step items, each with:
     - A **timeline dot** and **connector line** (vertical timeline visual).
     - A **trigger button** (`step-accordion-trigger`) showing the step label.
     - A **panel** (`step-accordion-panel`) containing the step description (rich text).
   - **Image area (right column):** `step-accordion-image` — shows the image associated with the currently active step. Hidden when no image is available.
3. **CTA section** — below the content area (conditional, one of: none, single, dual).

### Step item structure

```
<li class="step-accordion-item">
  <div class="step-accordion-dot-container">
    <span class="step-accordion-timeline" aria-hidden="true">
      <span class="step-accordion-dot"></span>
      <span class="step-accordion-connector"></span>
    </span>
    <div class="step-accordion-item-content">
      <button class="step-accordion-trigger" aria-expanded="true|false" aria-controls="panel-{n}">
        <span class="step-accordion-label">{label}</span>
      </button>
      <div id="panel-{n}" class="step-accordion-panel" role="region" aria-labelledby="step-{n}" [hidden]>
        <div class="step-accordion-panel-inner">
          <div class="step-accordion-description">{richtext content}</div>
        </div>
      </div>
    </div>
  </div>
  <template class="step-accordion-image-template">{optional img}</template>
</li>
```

### Single CTA structure

```
<div class="step-accordion-cta step-accordion-cta-single">
  <a class="button tertiary" href="{url}">{label}</a>
</div>
```

### Dual CTA structure

Two `step-accordion-cta-card` links side by side, each with:
- Optional GEL outlined icon (left)
- Label + optional description text
- `gel-icon-arrow-forward-circle-outlined` icon (right, always present)

---

## Annotations and States

| State | Visual change |
|-------|--------------|
| Collapsed (default for steps 2+) | Panel hidden (`hidden` attribute), trigger `aria-expanded="false"` |
| Expanded (active, step 1 by default) | Panel visible, `is-open` class, trigger `aria-expanded="true"` |
| Dot – active | Filled/highlighted step dot on timeline |
| Dot – inactive | Outline/muted step dot |
| Image area | Changes to the image from the currently active step's `<template>` |
| Re-click active item | No action (already expanded; guard against re-animation) |

---

## Accessibility

- ARIA accordion/disclosure pattern: `<button>` trigger with `aria-expanded="true|false"` and `aria-controls` pointing to the panel `id`.
- Panel: `role="region"`, `aria-labelledby` pointing to the trigger `id`, hidden via `hidden` attribute.
- Timeline/dot/connector spans: `aria-hidden="true"` (decorative).
- Keyboard: `Tab` to move between triggers; `Enter`/`Space` to activate.
- Image area: `aria-hidden="true"` (decorative / duplicates content inside description).
- UE authoring mode: all panels expanded so content is editable in Universal Editor.
- GEL icons in CTAs: `aria-hidden="true"`.

---

## Design Tokens and Theming

> **Note:** Exact values to be confirmed from Figma MCP `get_design_context` when available. Values below are indicative based on the Great Bank design system and related blocks.

### Light mode (confirmed from `get_design_context`)

| Token | Value | Source |
|-------|-------|--------|
| Background (page) | `#ffffff` | Figma node 28:1000 |
| Step card background (inactive) | `#f9fafb` | Figma node 28:1000 |
| Step card background (active/expanded) | `#ffffff` | Figma node 28:1000 |
| Step card border (inactive) | `#e5e7eb` | Figma node 28:1000 |
| Step card border (active) | `#d4af37` (2px) | Figma node 28:1000 |
| Step card shadow (active) | `0px 10px 15px rgba(0,0,0,0.1), 0px 4px 6px rgba(0,0,0,0.1)` | Figma node 28:1000 |
| Step label – active title text | `#002855` | Figma node 28:1000 |
| Step label – inactive title text | `#101828` | Figma node 28:1000 |
| Step subtitle/meta text | `#4a5565` | Figma node 28:1000 |
| Panel description text | `#364153` | Figma node 28:1000 |
| Panel inner background | `#f9fafb` | Figma node 28:1000 |
| Connector line | `#d1d5dc` (2px wide) | Figma node 28:1051 |
| Step dot – inactive | `#e5e5e5` bg, `#ffffff` border (4px) | Figma node 28:1093 |
| Step dot – active | `#d4af37` bg, `#ffffff` border (4.8px) | Figma node 28:1093 |
| Step dot number – inactive | `#4a5565` | Figma node 28:1093 |
| Step dot number – active | `#002855` | Figma node 28:1093 |
| Page-level heading | `#0f172a` | Figma node 28:1000 |

### Dark mode (confirmed from `get_design_context` node 28:2860)

| Token | Value | Source |
|-------|-------|--------|
| Background (page) | `#0a0f1a` (implied from borders) | Figma node 28:2860 |
| Step card background (inactive) | `rgba(17,24,39,0.5)` | Figma node 28:2860 |
| Step card background (active/expanded) | `#111827` | Figma node 28:2860 |
| Step card border (inactive) | `#334155` (0.667px) | Figma node 28:2860 |
| Step card border (active) | `#e8c968` (2px) | Figma node 28:2860 |
| Step card shadow (active) | `0px 10px 15px rgba(0,0,0,0.1), 0px 4px 6px rgba(0,0,0,0.1)` | Figma node 28:2860 |
| Step label – active title text | `#e8c968` | Figma node 28:2860 |
| Step label – inactive title text | `#f1f5f9` | Figma node 28:2860 |
| Step subtitle/meta text | `#94a3b8` | Figma node 28:2860 |
| Panel description text | `#94a3b8` | Figma node 28:2860 |
| Panel inner background | `rgba(30,41,59,0.5)` | Figma node 28:2860 |
| Connector line | `#334155` (2px wide) | Figma node 28:2860 |
| Step dot – inactive | `#334155` bg, `#0a0f1a` border (4px) | Figma node 28:2860 |
| Step dot – active | `#e8c968` bg, `#0a0f1a` border (4.8px) | Figma node 28:2860 |
| Step dot number – inactive | `#94a3b8` | Figma node 28:2860 |
| Step dot number – active | `#0a0f1a` | Figma node 28:2860 |

### Typography (confirmed from `get_design_context`)

| Element | Font | Weight | Size | Line height |
|---------|------|--------|------|-------------|
| Frame/section title (design-time only) | Inter | Bold 700 | 20px | 28px |
| Step title (active) | Inter | Bold 700 | 18px | 27px |
| Step title (inactive) | Inter | Bold 700 | 18px | 27px |
| Step subtitle/meta | Inter | Medium 500 | 14px | 20px |
| Panel description | Inter | Regular 400 | 16px | 24px |

---

## Browsers and Devices

Not provided. Apply standard Great Bank EDS browser/device support.

---

## User Interaction and Design Specs

- **Single-expand:** Only one step panel is open at a time. Clicking a new step closes the current one and opens the new one.
- **First-open default:** Step 1 is expanded on load.
- **Image swap:** The right-hand image changes when the active step changes (loaded from the `<template>` of each `<li>`).
- **Re-click guard:** Clicking the already-active trigger does nothing (prevents double-animation).
- **No keyboard arrow navigation** between steps — only Tab + Enter/Space.
- **UE authoring mode:** All panels expanded (class `adobe-ue-edit` on `<html>`), no image swap logic active.

---

## Technical Specs / SOPs

- Block name: `step-accordion`
- EDS decorator pattern: `extractData()` → `renderHTML()` → `decorate()` with UE instrumentation (`moveInstrumentation`).
- Authored rows:
  - Row 0: heading (single cell)
  - Rows 1..N (before item rows): block-level CTA fields (ctaType, singleLabel, singleUrl, dualIcon1, dualLabel1, dualDescription1, dualUrl1, dualIcon2, dualLabel2, dualDescription2, dualUrl2) — only present if CTA type ≠ none.
  - Item rows (3 cells each): `label | description (richtext) | image`
- Dark variant: block option class `dark` (author adds `step-accordion dark` in document).
- UE model id: `step-accordion`; item model id: `step-accordion-item`; filter: `step-accordion`.
- Shared utility imports: `getCellHTML`, `getCellImage`, `getCellText`, `getCellUrl`, `getFirstCell`, `renderBlockHeader` from `scripts/utility/shared.js`.

---

## Questions / Decisions

1. **Exact spacing/padding values:** Confirmed from Figma. Card content: `pl-[80px]` (80px left padding). Trigger padding: `16px`. Subtitle gap: `4px`. Step gap: `16px` between items. Panel inner padding: `16px` top + sides.
2. **Timeline dot size and shape:** ✅ Confirmed. Active: 48px circle (scaled to 57.6px when active), `#d4af37` bg, 4–4.8px white border. Inactive: 48px, `#e5e5e5` bg, 4px white border. Positioned at left=0, centered vertically on trigger.
3. **Connector line style:** ✅ Confirmed. Solid, 2px wide, `#d1d5dc` (light) / `#334155` (dark), left=24px (center of dot), top=32px from top.
4. **Node 28:1051 — "Another variant":** ✅ Identified: 3-step Account Opening Journey variant (light mode, connector line visible).
5. **Node 28:1093 — "Another variant":** ✅ Identified: 5-step Investment Advice Process (light mode, **canonical dot reference**).
6. **Node 28:1172 — Unlabeled:** ✅ Identified: 4th variation — Credit Card Application (3 steps, short content, last step active).
7. **Expand/collapse animation:** Not specified in Figma. Propose CSS `max-height` + `opacity` transition — confirm with design.
8. **Hover state on trigger:** Not in any Figma frame. Propose subtle `#f3f4f6` background tint — confirm.
9. **Image area on mobile:** No mobile Figma frame provided. The existing requirements describe a two-column layout — confirm collapse behavior (stack or image hidden).
10. **Dual CTA icon set:** Uses `_outlined-icons.json` (not filled). Confirm with design.
11. **Dot visibility rule:** Figma frames 28:1000 and 28:1051 do NOT show numbered dot circles (no dot element visible). Frame 28:1093 does show them. Is the dot always visible or conditional on author config?
12. **Step subtitle (meta) line:** Figma 28:1172 shows steps without a subtitle line. Is the subtitle optional per-step, or only present when authored?

---

## Signoffs and Approvals

Not provided.

---

## Related Documents

- Figma (Light — node 28:1000): [https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=28-1000](https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=28-1000&t=8rsgwSfwrIHKOiwV-4)
- Figma (Another variant — node 28:1051): [https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=28-1051](https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=28-1051&t=8rsgwSfwrIHKOiwV-4)
- Figma (Another variant — node 28:1093): [https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=28-1093](https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=28-1093&t=8rsgwSfwrIHKOiwV-4)
- Figma (node 28:1172): [https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=28-1172](https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=28-1172&t=8rsgwSfwrIHKOiwV-4)
- Figma (Dark mode — node 28:2860): [https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=28-2860](https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=28-2860&t=8rsgwSfwrIHKOiwV-4)
- Block catalog entry: [step-accordion](../../../.github/skills/block-catalog.md)
- Reference JS: [step-accordion.js](../../../.github/skills/block-development/examples/reference/step-accordion.js)
- UE model: [step-accordion.json](../../../.github/skills/universal-editor/examples/reference/step-accordion.json)

---

## Figma Design Context

> **Status:** Figma MCP extraction **complete**. All 5 nodes processed via `get_design_context` + `get_screenshot`. Screenshots saved to `docs/requirements/step-accordion/figma/`. Design tokens confirmed — see Design Tokens and Theming section.

### Node `28:1000` — Light Mode — Variation 1: Home Loan Application Process (4 Steps)

- **fileKey:** `WXBZsxyNrHkyGDg0FWIS1g`
- **nodeId:** `28:1000`
- **Screenshot:** `figma/node-28-1000-step-accordion-light.png` ✅ saved
- **Purpose:** Primary light-mode reference — 4-step accordion, step 1 expanded. No numbered dots (Variation 1 style — numbered step prefix in subtitle text only).
- **Key observations:** Active card has white bg + `#d4af37` 2px border + shadow. Inactive cards: `#f9fafb` bg + `#e5e7eb` border. Step list has no visible dot circles in Variation 1 — dot indicator not present in this design frame.
- **Panel height:** ~80px inner with 16px top/side padding.

### Node `28:1051` — Light Mode — Variation 2: Account Opening Journey (3 Steps)

- **fileKey:** `WXBZsxyNrHkyGDg0FWIS1g`
- **nodeId:** `28:1051`
- **Screenshot:** `figma/node-28-1051-step-accordion-variant-a.png` ✅ saved
- **Purpose:** 3-step light variant. Shows the vertical connector line (`#d1d5dc`, 2px). No numbered dot circles in this variation either — connector line is 684.5px tall positioned at left=24px from the container edge.

### Node `28:1093` — Light Mode — Variation 3: Investment Advice Process (5 Steps)

- **fileKey:** `WXBZsxyNrHkyGDg0FWIS1g`
- **nodeId:** `28:1093`
- **Screenshot:** `figma/node-28-1093-step-accordion-variant-b.png` ✅ saved
- **Purpose:** 5-step light variant **with numbered dot circles visible**. Step 2 (active) shows `#d4af37` filled circle (57.6px, border 4.8px `#ffffff`). Steps 1,3,4,5 (inactive) show `#e5e5e5` circle (48px, border 4px `#ffffff`). This is the definitive design reference for step numbering.
- **Key observations:** Dot circles absolutely positioned at left=0 on each step row. Card content area offset by `pl-[80px]` (80px padding-left). Connector line at left=24px.

### Node `28:1172` — Light Mode — Variation 4: Credit Card Application (3 Steps — Short Content)

- **fileKey:** `WXBZsxyNrHkyGDg0FWIS1g`
- **nodeId:** `28:1172`
- **Screenshot:** `figma/node-28-1172-step-accordion-variant-c.png` ✅ saved
- **Purpose:** 3-step light variant with short (single-line) description text in the expanded panel. Steps without a subtitle/meta line — only title. Demonstrates that subtitle line is optional.
- **Key observations:** Title-only rows are shorter (64.333px height vs 84.333px when subtitle present). Active step (step 3 here) uses `#d4af37` dot.

### Node `28:2860` — Dark Mode — Variation 1: Home Loan Application Process (4 Steps)

- **fileKey:** `WXBZsxyNrHkyGDg0FWIS1g`
- **nodeId:** `28:2860`
- **Screenshot:** `figma/node-28-2860-step-accordion-dark.png` ✅ saved
- **Purpose:** Dark mode counterpart to node `28:1000`, 4-step, step 1 active. Shows numbered dot circles. Active dot: `#e8c968` bg. Connector line: `#334155`. Cards: `rgba(17,24,39,0.5)` bg on inactive, `#111827` on active. Active border: `#e8c968`.

---

## Figma Visual Reference Matrix

| Figma URL | Node ID | Screenshot file | Purpose |
|-----------|---------|-----------------|---------|
| [Light mode](https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=28-1000&t=8rsgwSfwrIHKOiwV-4) | `28:1000` | `figma/node-28-1000-step-accordion-light.png` | ✅ Home Loan Application Process — 4 steps, light, step 1 active, no numbered dots |
| [Account Opening variant](https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=28-1051&t=8rsgwSfwrIHKOiwV-4) | `28:1051` | `figma/node-28-1051-step-accordion-variant-a.png` | ✅ Account Opening Journey — 3 steps, light, connector line visible, no dots |
| [Investment variant](https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=28-1093&t=8rsgwSfwrIHKOiwV-4) | `28:1093` | `figma/node-28-1093-step-accordion-variant-b.png` | ✅ Investment Advice Process — 5 steps, light, **numbered dot circles present** (canonical dot reference) |
| [Credit Card variant](https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=28-1172&t=8rsgwSfwrIHKOiwV-4) | `28:1172` | `figma/node-28-1172-step-accordion-variant-c.png` | ✅ Credit Card Application — 3 steps short content, light, step 3 active, some steps lack subtitle |
| [Dark mode](https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=28-2860&t=8rsgwSfwrIHKOiwV-4) | `28:2860` | `figma/node-28-2860-step-accordion-dark.png` | ✅ Home Loan Application Process — 4 steps, dark mode, step 1 active, numbered dots |

> **Note:** All 5 screenshots captured via `get_screenshot` and saved to `docs/requirements/step-accordion/figma/`. Design context confirmed via `get_design_context` for all nodes.

---

## Normalized Requirements

### Authoring requirements

- Author creates a table block named `step-accordion` (or `step-accordion dark` for dark variant).
- **Row 0:** Single cell — block heading text.
- **Rows 1–N (optional, block-level CTA fields):** Single-cell rows in this order if ctaType is set:
  - ctaType (`none` / `single` / `dual`)
  - singleLabel (if single)
  - singleUrl (if single)
  - dualIconOne (if dual)
  - dualLabelOne (if dual)
  - dualDescriptionOne (if dual)
  - dualUrlOne (if dual)
  - dualIconTwo (if dual)
  - dualLabelTwo (if dual)
  - dualDescriptionTwo (if dual)
  - dualUrlTwo (if dual)
- **Item rows:** Three cells per row: `label | description (rich text) | image (optional)`.
- In Universal Editor, step items are authored as child block items (`step-accordion-item` model).

### Rendering / markup requirements

- `extractData()` separates block-level rows from item rows using `isItemRow()` heuristic.
- `renderHTML()` produces the full DOM string; `decorate()` replaces block content and rebinds events.
- `moveInstrumentation()` is called per item to preserve UE instrumentation after DOM replacement.
- The image column is optional per item — missing image = empty `<template>`. Image area is hidden when active step has no image.
- `dark` class on the block element drives all dark-mode token overrides via SCSS.
- In UE authoring mode (`adobe-ue-edit` on `<html>`), all panels are expanded to allow content editing.

### Accessibility requirements

- Keyboard: `Tab` to focus trigger buttons; `Enter`/`Space` to activate.
- `aria-expanded` toggled on each interaction.
- Panel `hidden` attribute toggled (not CSS `display:none` alone — AT requires the attribute).
- Timeline/decorative elements: `aria-hidden="true"`.
- Image area: `aria-hidden="true"`.
- Icon spans in CTA: `aria-hidden="true"`.
- Panel `role="region"` with `aria-labelledby` linking to the trigger `id`.

### Variant / state matrix

| State | aria-expanded | Panel | Item class | Image area |
|-------|--------------|-------|------------|-----------|
| Active (first by default) | `"true"` | Visible, `is-open` | `is-active` | Active step's image |
| Inactive | `"false"` | `hidden` | — | Not shown |
| UE authoring | `"true"` (all) | All visible | `is-active` (all) | n/a |

### Validation rules

- Every step item must have a non-empty `label` (items without a label are filtered out).
- Description may be empty (renders blank panel).
- Image is optional per item.
- Block must have a heading (required field in UE model).
- CTA type must be one of: `none`, `single`, `dual`.

### Open questions

1. ✅ **Figma spacing/padding values:** Confirmed via `get_design_context`. Card trigger padding 16px, step gap 16px, subtitle gap 4px, panel inner padding 16px, content area left offset 80px, dot circle left=0/top=16px.
2. ✅ **Timeline dot visual:** Active dot `#d4af37` bg (57.6px circle, 4.8px white border), inactive `#e5e5e5` bg (48px circle, 4px white border). Numbers: active `#002855`, inactive `#4a5565`.
3. ✅ **Connector line:** 2px wide solid, colour `#d1d5dc` (light) / `#334155` (dark), positioned left=24px top=32px, vertical running between dots.
4. ✅ **Node identification:** 28:1051 = Account Opening Journey (3 steps, no CTA); 28:1093 = Investment Advice Process (5 steps, with dots); 28:1172 = Credit Card Application (3 steps, short content, step 3 active).
5. **Mobile layout:** No mobile Figma frame provided. Existing requirements describe a two-column layout — confirm collapse behaviour (stack vertically or image hidden on small viewports).
6. **Expand/collapse animation:** Not specified in Figma. Propose CSS `max-height` + `opacity` transition — confirm with design.
7. **Hover state on trigger button:** Not in any Figma frame. Propose subtle `#f3f4f6` background tint — confirm with design.
8. ✅ **Connector line style:** Solid line, not dashed (confirmed from design context).
9. **Dot visibility rule:** Figma frames 28:1000 and 28:1051 do NOT show numbered dot circles. Frame 28:1093 does. Is the dot always visible or conditional on author config?
10. **Step subtitle (meta) line:** Figma 28:1172 shows steps without a subtitle line. Is the subtitle optional per-step, or only present when authored?
