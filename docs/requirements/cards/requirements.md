# Block: cards

**Source:** Figma only (no Confluence page provided)
**Figma file:** `WXBZsxyNrHkyGDg0FWIS1g` — Great Bank Design Files
**Figma nodes:** `17:6` (light mode variants), `22:372` (dark mode variants)

---

## Requirements

### Overview

The Cards block presents a horizontal row of product/service cards. Each card surfaces a product category with an icon, badge labels (tags), a title, a highlighted subtitle (e.g. rate or fee), a description, and one or two CTA buttons. The design shows three cards side by side; the block should support any number of cards (content-driven) and collapse to a single-column on mobile.

### Variants

| Variant         | CSS class | Description                                          |
| --------------- | --------- | ---------------------------------------------------- |
| Default (light) | _(none)_  | White cards on light background                      |
| Dark            | `dark`    | Dark (`#111827`) cards, gold-tinted text and buttons |

---

## Authored HTML Shape

Authors create the block as a multi-column Word/Docs table. Each **row** maps to one card.

| Cards        |                  |                     |                 |                               |                                   |
| ------------ | ---------------- | ------------------- | --------------- | ----------------------------- | --------------------------------- |
| [Icon image] | Popular, No Fees | Transaction Account | $0 monthly fees | Everyday banking made simple… | [Open Account](#) [Learn More](#) |

- **Cell 1** — Icon image (`<img>`, 24×24 within a 48×48 container)
- **Cell 2** — Badge labels: plain text, comma-separated (e.g. `Popular, No Fees`). Rendered as pill badges.
- **Cell 3** — Card title (plain text, rendered as `<h3>`)
- **Cell 4** — Highlighted subtitle (plain text, rendered as `<p class="card-subtitle">` in gold)
- **Cell 5** — Description (plain text or rich text, rendered as `<p class="card-description">`)
- **Cell 6** — CTA links (one or two `<a>` on separate lines; first link = primary button, second = outline button)

### Notes

- Cell 6 may contain one link (single primary CTA) or two links (primary + outline).
- Cell 2 may be empty (no tags shown).
- Cell 4 (subtitle) is optional — if empty, the gold highlight line is omitted.

---

## Fields

| Field       | Required | Type  | Constraints            | Description                                                            |
| ----------- | -------- | ----- | ---------------------- | ---------------------------------------------------------------------- |
| icon        | Yes      | image | 24×24 px display       | Product/category icon (displayed inside a 48×48 gold-tinted container) |
| tags        | No       | text  | Comma-separated labels | Badge labels rendered as pill tags below the icon                      |
| title       | Yes      | text  | Max ~60 chars          | Card heading (`<h3>`)                                                  |
| subtitle    | No       | text  | Max ~60 chars          | Highlighted line (gold text, e.g. rate or fee callout)                 |
| description | Yes      | text  | Max ~120 chars         | Supporting body copy                                                   |
| ctas        | Yes      | links | 1–2 links              | First link = primary button; second link (optional) = outline button   |

---

## Anatomy and Measurements (from Figma)

### Card container

| Property      | Light               | Dark                |
| ------------- | ------------------- | ------------------- |
| Background    | `#ffffff`           | `#111827`           |
| Border        | `1px solid #e5e7eb` | `1px solid #334155` |
| Border-radius | `12px`              | `12px`              |
| Padding       | `24px`              | `24px`              |

### Icon container

| Property           | Value                   |
| ------------------ | ----------------------- |
| Size               | 48×48 px                |
| Border-radius      | 8px                     |
| Background (light) | `rgba(212,175,55,0.1)`  |
| Background (dark)  | `rgba(232,201,104,0.1)` |
| Icon size          | 24×24 px                |

### Internal spacing stack

| Layer                    | Size                                            |
| ------------------------ | ----------------------------------------------- |
| Top padding → icon top   | 24 px                                           |
| Icon height              | 48 px                                           |
| Icon bottom → tags       | 16 px                                           |
| Tags row height          | 24 px                                           |
| Tags → title             | 12 px                                           |
| Title height             | 27 px (18 px / 1.5 lh)                          |
| Title → subtitle         | 8 px                                            |
| Subtitle height          | 20 px                                           |
| Subtitle → description   | 8 px                                            |
| Description height       | 20 px                                           |
| Description → buttons    | 16 px                                           |
| Buttons height           | 40 px (1–2 btn) / 36 px (1 btn only — see note) |
| Buttons → bottom padding | 24 px                                           |

> **Button height note:** The Figma design shows 40 px when the card has both primary and outline buttons (e.g. Transaction Account), and 36 px when a single primary button is shown. Map to `btn--md` (40 px) for two-button cards and `btn--sm` (36 px) for single-button cards — or use a consistent size and adjust in SCSS.

### Badge (tag) pills

| Property          | Light                  | Dark                    |
| ----------------- | ---------------------- | ----------------------- |
| Height            | 24 px                  | 24 px                   |
| Padding           | `4px 8px`              | `4px 8px`               |
| Background        | `rgba(212,175,55,0.1)` | `rgba(232,201,104,0.1)` |
| Border-radius     | `9999px` (pill)        | `9999px`                |
| Font size         | 12 px                  | 12 px                   |
| Font weight       | 400                    | 400                     |
| Text color        | `#002855` (navy)       | `#e8c968` (gold-light)  |
| Gap between pills | 8 px                   | 8 px                    |

### Typography

| Element             | Size            | Weight        | Color (light) | Color (dark) |
| ------------------- | --------------- | ------------- | ------------- | ------------ |
| Title (h3)          | 18 px           | 500 (medium)  | `#101828`     | `#f1f5f9`    |
| Subtitle            | 14 px           | 500 (medium)  | `#d4af37`     | `#e8c968`    |
| Description         | 14 px           | 400 (regular) | `#4a5565`     | `#94a3b8`    |
| Badge label         | 12 px           | 400 (regular) | `#002855`     | `#e8c968`    |
| Line-height (title) | 27 px (1.5×18)  | —             | —             | —            |
| Line-height (body)  | 20 px (1.43×14) | —             | —             | —            |

### Buttons

| Property      | Primary (light) | Outline (light)     | Primary (dark) | Outline (dark)      |
| ------------- | --------------- | ------------------- | -------------- | ------------------- |
| Background    | `#002855`       | transparent         | `#e8c968`      | transparent         |
| Border        | none            | `2px solid #002855` | none           | `2px solid #e8c968` |
| Text color    | `#ffffff`       | `#002855`           | `#0a0f1a`      | `#e8c968`           |
| Border-radius | 8 px            | 8 px                | 8 px           | 8 px                |
| Font size     | 14 px           | 14 px               | 14 px          | 14 px               |
| Font weight   | 500             | 500                 | 500            | 500                 |

Use existing `btn--primary` / `btn--outline` classes from `styles/components/_buttons.scss`.

---

## Example Card Instances (from Figma)

| #   | Title               | Tags               | Subtitle                    | Description                                                                       | CTAs                                         |
| --- | ------------------- | ------------------ | --------------------------- | --------------------------------------------------------------------------------- | -------------------------------------------- |
| 1   | Transaction Account | Popular, No Fees   | $0 monthly fees             | Everyday banking made simple with no monthly fees and unlimited transactions.     | Open Account (primary), Learn More (outline) |
| 2   | Home Loans          | Featured, Low Rate | From 5.99% p.a.             | Competitive rates and flexible repayment options to help you buy your dream home. | Apply Now (primary)                          |
| 3   | Credit Cards        | Rewards            | Up to 55 days interest free | Enjoy rewards, insurance and interest-free days on purchases.                     | Compare Cards (primary)                      |

---

## Layout

- **Desktop (≥ 768 px):** Cards displayed in a row with equal widths using CSS Grid `repeat(auto-fit, minmax(280px, 1fr))` or a fixed 3-column grid.
- **Mobile (< 768 px):** Horizontal scrolling carousel (use the shared `scripts/utility/carousel.js` utility).
- **Gap between cards:** 24 px.

---

## Design Tokens Mapping

Map Figma colours to existing `styles/_colors.scss` variables where possible:

| Figma value             | Token / variable                                                   |
| ----------------------- | ------------------------------------------------------------------ |
| `#002855`               | `var(--gb-navy)` / `var(--surface-primary)`                        |
| `#d4af37`               | `var(--gb-gold)`                                                   |
| `#e8c968`               | `var(--gb-gold-light)`                                             |
| `#111827`               | `var(--gb-grey-950)` (dark bg)                                     |
| `#e5e7eb`               | `var(--gb-grey-200)` (light border)                                |
| `#334155`               | `var(--gb-grey-700)` (dark border) — verify or add if missing      |
| `#101828`               | `var(--gb-grey-950)` (title text, near-black)                      |
| `#4a5565`               | `var(--gb-grey-600)` (description text) — verify or add if missing |
| `#94a3b8`               | `var(--gb-grey-400)` (dark description) — verify or add if missing |
| `#f1f5f9`               | `var(--gb-grey-50)` (dark title text) — verify or add if missing   |
| `rgba(212,175,55,0.1)`  | `color-mix(in srgb, var(--gb-gold) 10%, transparent)`              |
| `rgba(232,201,104,0.1)` | `color-mix(in srgb, var(--gb-gold-light) 10%, transparent)`        |

---

## Accessibility

### ARIA Pattern

- Static content (no keyboard interaction required beyond standard tab focus on buttons)
- Each card is a semantic unit — use `<article>` element

### Heading Levels

- Card title: `<h3>` (assumes block appears in a section with an `<h2>`)

### Screen Reader Requirements

- [ ] Icon images must have descriptive `alt` text (or `alt=""` if purely decorative, in which case the title conveys context)
- [ ] Badge tags are rendered as visible text — no additional ARIA needed
- [ ] CTA buttons must have accessible labels (link text is sufficient if descriptive)

### Keyboard Navigation

- Standard (Tab/Shift+Tab to reach CTA buttons only)
- No arrow-key navigation required

---

## Decisions

1. **Icon treatment:** Raster images from the authoring table (authors paste images directly).
2. **Mobile layout:** Horizontal scrolling carousel using `scripts/utility/carousel.js`.
3. **Card gap:** 24 px confirmed.
4. **Button sizing:** Consistent `md` size (40 px height) for all cards regardless of CTA count.
5. **Section background:** Yes — the block section gets a light tinted background (e.g. `--gb-grey-50`) in light mode; dark mode uses the section's dark background.

---

## Design Reference

- **Figma file:** `WXBZsxyNrHkyGDg0FWIS1g` — Great Bank Design Files
- **Light mode node:** `17:6`
- **Dark mode node:** `22:372`
- **Screenshots:** See `docs/requirements/cards/figma/README.md`
