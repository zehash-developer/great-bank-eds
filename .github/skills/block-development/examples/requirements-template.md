<!-- Portable copy for `.github/skills` bundles. In the Westpac app repo, keep in sync with `docs/requirements/_template.md`. -->

# Block: {block-name}

Replace `{block-name}` with your actual block name (e.g., `accordion`, `banner`, `cards`).

## Authored HTML Shape

Describe the Word/Docs table structure that authors will use. This is what AEM delivers as raw HTML.

### Example Structure

| Column 1 | Column 2 | Column 3 (optional) |
|----------|----------|---------------------|
| Title    | Content  | CTA                 |

### Notes

- Each row becomes a block item
- Each cell becomes a data field
- Optional columns should be clearly marked

---

## Fields

Define all fields that the block will extract from the authored HTML.

| Field | Required | Type | Constraints | Description |
|-------|----------|------|-------------|-------------|
| title | Yes | text | Max 100 chars | The title/heading for the item |
| content | Yes | richtext | - | Main content area (supports HTML) |
| cta | No | link | - | Optional call-to-action link |

### Field Types

- `text` — Plain text (use `textContent` in extractData)
- `richtext` — HTML content (use `innerHTML` in extractData)
- `link` — Anchor tag (extract href and text)
- `image` — Image element (extract src, alt, etc.)

---

## Variants

List all CSS class variants the block supports.

| Variant | CSS Class | Description |
|---------|-----------|-------------|
| Hero | `hero` | Full-width background image variant |
| Compact | `compact` | Reduced padding variant |
| Dark | `dark` | Dark mode (always include this) |

### Variant Behavior

Describe how each variant changes the block's appearance or behavior.

---

## Accessibility

Define accessibility requirements for this block.

### ARIA Pattern

- [ ] None (static content)
- [ ] Accordion (expand/collapse panels)
- [ ] Tabs (tabbed interface)
- [ ] Other: _______________

### Keyboard Navigation

- [ ] Standard (Tab/Shift+Tab only)
- [ ] Arrow keys (ArrowUp/ArrowDown/ArrowLeft/ArrowRight)
- [ ] Home/End keys
- [ ] Enter/Space activation

### Heading Levels

Specify the heading level used in this block:

- Block title uses: `<h2>` / `<h3>` / other: _______________
- Item titles use: `<h3>` / `<h4>` / other: _______________

### Screen Reader Requirements

- [ ] All images have descriptive alt text
- [ ] Decorative elements have `aria-hidden="true"`
- [ ] Dynamic content updates announced with `aria-live`
- [ ] Focus management required for: _______________

---

## Design Reference

- **Figma Link**: [Add Figma design link here]
- **Design Notes**: Any specific design requirements or constraints

---

## Example: Accordion Block

For reference, here's how the accordion block is structured:

### Authored HTML Shape

| Title | Content |
|-------|---------|
| FAQ 1 | Answer 1 with details... |
| FAQ 2 | Answer 2 with details... |

### Fields

| Field | Required | Type | Constraints |
|-------|----------|------|-------------|
| title | Yes | richtext | - |
| content | Yes | richtext | - |

### Variants

| Variant | CSS Class | Description |
|---------|-----------|-------------|
| Lego | `lego` | Side panel with brand colors |
| Tabcordion | `tabcordion` | Tabs on desktop, accordion on mobile |
| Dark | `dark` | Dark mode |

### Accessibility

- ARIA Pattern: Accordion
- Keyboard Navigation: Arrow keys, Home/End, Enter/Space
- Heading Levels: Item titles use semantic headings from content
