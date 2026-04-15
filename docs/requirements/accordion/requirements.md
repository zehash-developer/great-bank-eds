# Block: accordion

**Source:** Figma only (no Confluence page provided)
**Figma file:** `WXBZsxyNrHkyGDg0FWIS1g` — Great Bank Design Files

---

## Requirements

### Overview

The Accordion block presents a list of collapsible question-and-answer items for use in FAQ and informational content sections. Each item has a trigger row (question text + chevron icon) that expands/collapses the answer panel. All items are collapsed by default.

### Variants

| Variant | CSS class | Description |
|---------|-----------|-------------|
| Default (light) | _(none)_ | White background, dark text, light borders |
| Dark | `dark` | Dark navy background (`#111827`), light text, dark borders |

### Item count

The design shows three content variations:

| Variation label | Item count | Representative use case |
|-----------------|-----------|------------------------|
| Variation 1 | 3 items | Short FAQ |
| Variation 2 | 5 items | Full FAQ |
| Variation 3 | 2 items | Simple FAQ |

The block must support any number of items (content-driven), not just these example counts.

---

## Block Dialogue

Not provided (no Confluence source).

---

## Block UI

### Anatomy

Each accordion item consists of:

1. **Trigger row** — full-width button containing:
   - **Question text** (left-aligned)
   - **Chevron icon** (right-aligned, 20×20 px, rotates on expand)
2. **Answer panel** — hidden by default; revealed on trigger activation

### Trigger row measurements (from Figma)

| Property | Value |
|----------|-------|
| Height (collapsed) | 56 px (inner) / ~57.33 px with border |
| Padding (horizontal) | 24 px |
| Padding (vertical) | 16 px |
| Border radius | 8 px |
| Border width | 1 px (0.667 px at Figma's 0.65× scale) |
| Gap between items | 8 px |

### Layout / spacing

- Container left padding: 32 px (Figma frame inset — map to block padding via `spacing()`)
- Variation section gap: 16 px (between heading and item list)

---

## Annotations and States

| State | Visual change |
|-------|--------------|
| Collapsed (default) | Chevron points down; answer panel hidden |
| Expanded | Chevron rotates (points up); answer panel visible |
| Focus | Standard keyboard focus ring on trigger |
| Hover | Not explicitly annotated in Figma (apply standard interactive hover) |

---

## Accessibility

- ARIA disclosure pattern: `<button>` trigger with `aria-expanded="true|false"` and `aria-controls` pointing to the panel `id`.
- Panel uses `id` matching `aria-controls`; hidden via `hidden` attribute or `display: none` when collapsed.
- Keyboard: `Tab` to navigate between triggers, `Enter`/`Space` to toggle.
- Chevron icon is decorative — `aria-hidden="true"`.
- Question text is the accessible label of the button (no additional `aria-label` needed if text is descriptive).
- Do NOT use the WAI-ARIA `role="region"` pattern unless items warrant landmarks; the simpler disclosure button pattern is preferred.

---

## Design Tokens and Theming

### Light mode (node `5:5043`)

| Token | Value |
|-------|-------|
| Background (frame) | `#ffffff` |
| Background (item) | `#ffffff` |
| Border (item) | `#e5e7eb` |
| Text (question) | `#101828` |
| Text (heading) | `#0f172a` |
| Frame border | `#e2e8f0` |

### Dark mode (node `5:5119`)

| Token | Value |
|-------|-------|
| Background (frame) | `#111827` |
| Background (item) | `#111827` |
| Border (item) | `#334155` |
| Text (question) | `#f1f5f9` |
| Text (heading) | `#f1f5f9` |
| Frame border | `#334155` |

### Typography

| Element | Font | Weight | Size | Line height |
|---------|------|--------|------|-------------|
| Page title (h2) | Inter | Bold (700) | 30 px | 36 px |
| Variation heading (h3) | Inter | Bold (700) | 20 px | 28 px |
| Question text | Inter | Medium (500) | 16 px | 24 px |

---

## Browsers and Devices

Not provided. Apply standard Great Bank EDS browser/device support.

---

## User Interaction and Design Specs

- Single-expand or multi-expand behaviour is **not explicitly specified** in Figma — default to **multi-expand** (multiple items can be open simultaneously) unless otherwise confirmed.
- Expand/collapse animation is not specified — use CSS `height` transition or `details`/`summary` native if appropriate.
- The chevron icon is the only visual indicator of state — must rotate on expand.

---

## Technical Specs / SOPs

- Block name: `accordion`
- EDS decorator pattern: `decorate(block)` entry point
- Each authored row = one accordion item (question in col 1, answer in col 2)
- Dark variant applied via block option class `dark` (author adds `accordion dark` in document)
- Icon: chevron-down from GEL icons (see [Icon Usage skill](../../../.github/skills/icon-usage/SKILL.md))

---

## Questions / Decisions

1. **Single vs multi-expand:** Figma does not specify. Defaulting to multi-expand — confirm with design/product.
2. **Expand animation:** Not specified. Propose simple CSS height transition — confirm with design.
3. **Hover state:** Not annotated. Propose subtle background tint on hover — confirm with design.
4. **Answer panel content:** Figma only shows collapsed state. Confirm expected content types (plain text, rich text, links).
5. **Default open item:** Not specified. Defaulting to all closed — confirm with design/product.

---

## Signoffs and Approvals

Not provided.

---

## Related Documents

- Figma: [Light mode — node 5:5043](https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=5-5043&m=dev)
- Figma: [Dark mode — node 5:5119](https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=5-5119&m=dev)

---

## Figma Design Context

### Node `5:5043` — Light Mode

- **fileKey:** `WXBZsxyNrHkyGDg0FWIS1g`
- **nodeId:** `5:5043`
- **Screenshot:** `figma/node-5-5043-accordion-light.png` _(captured via Figma MCP `get_screenshot`)_

#### Component anatomy (light)

- Outer frame: white background, 2 px border `#e2e8f0`, 12 px border-radius
- Each accordion item: white bg, 1 px border `#e5e7eb`, 8 px border-radius
- Trigger row: `flex; justify-content: space-between; align-items: center`
- Icon: 20×20 px chevron, decorative

#### All question text examples (light)

- Variation 1 (3 items): "How do I open an account?", "What are the fees for a transaction account?", "How do I apply for a home loan?"
- Variation 2 (5 items): "What documents do I need to open an account?", "Can I access my account online?", "Are there any monthly account fees?", "How long does it take to process a home loan application?", "Is my money protected?"
- Variation 3 (2 items): "What are your customer service hours?", "Do you offer business banking?"

---

### Node `5:5119` — Dark Mode

- **fileKey:** `WXBZsxyNrHkyGDg0FWIS1g`
- **nodeId:** `5:5119`
- **Screenshot:** `figma/node-5-5119-accordion-dark.png` _(captured via Figma MCP `get_screenshot`)_

#### Component anatomy (dark)

- Outer frame: `#111827` background, 2 px border `#334155`, 12 px border-radius
- Each accordion item: `#111827` bg, 1 px border `#334155`, 8 px border-radius
- Typography: same Inter stack, all text switches to `#f1f5f9`
- Icon: same 20×20 px chevron (assumed inverted/light version)

#### Token differences (dark vs light)

| Property | Light | Dark |
|----------|-------|------|
| Background | `#ffffff` | `#111827` |
| Item border | `#e5e7eb` | `#334155` |
| Text | `#101828` / `#0f172a` | `#f1f5f9` |
| Frame border | `#e2e8f0` | `#334155` |

---

## Figma Visual Reference Matrix

| Figma URL | Node ID | Screenshot file | Purpose |
|-----------|---------|-----------------|---------|
| [Light mode](https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=5-5043&m=dev) | `5:5043` | `figma/node-5-5043-accordion-light.png` | All collapsed states, light theme — 3 variations (3, 5, 2 items) in one frame |
| [Dark mode](https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=5-5119&m=dev) | `5:5119` | `figma/node-5-5119-accordion-dark.png` | All collapsed states, dark theme — 3 variations (3, 5, 2 items) in one frame |

> **Note:** Both frames document multiple item-count variations in a single image (all items collapsed). Do not treat either as a single pixel-perfect per-item target during `review-block` — compare overall layout, density, and theming.

---

## Normalized Requirements

### Authoring requirements

- Author creates a table block named `accordion` (or `accordion dark` for dark variant)
- Each row = one accordion item
  - Column 1: question text (plain text)
  - Column 2: answer content (rich text — supports paragraphs, links, lists)
- Any number of rows is valid

### Rendering / markup requirements

- Block renders a `<dl>` or `<ul>` list of items, or a series of `<div>` wrappers — confirm semantic pattern with [Semantic HTML skill](../../../.github/skills/semantic-html/SKILL.md)
- Each item wraps a `<button>` trigger and an answer panel (`<div>`)
- Trigger: `<button aria-expanded="false" aria-controls="accordion-panel-{n}">`
- Panel: `<div id="accordion-panel-{n}" hidden>`
- Chevron icon injected via JS (GEL icon, `aria-hidden="true"`)
- `dark` class on block element drives all dark-mode overrides via SCSS

### Accessibility requirements

- Keyboard: `Tab` focuses trigger buttons; `Enter`/`Space` toggles
- `aria-expanded` toggled on each interaction
- Panel `hidden` attribute toggled (not `display:none` via class alone — use the attribute directly for AT compatibility)
- Chevron `aria-hidden="true"`
- No focus trap; focus stays on trigger after toggle

### Variant / state matrix

| State | `aria-expanded` | Panel | Chevron |
|-------|----------------|-------|---------|
| Collapsed | `"false"` | `hidden` | Pointing down |
| Expanded | `"true"` | Visible | Pointing up (rotated 180°) |

### Validation rules

- Every item must have non-empty question text
- Answer panel content may be empty (edge case — no error, just blank panel)
- Block requires at least 1 row

### Open questions

1. Single vs multi-expand behaviour
2. Expand/collapse animation spec
3. Hover state token
4. Expanded state visual (Figma only shows collapsed)
5. Default open item (assumed: none)
