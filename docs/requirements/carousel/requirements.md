# Block: carousel

> **Source**: No Confluence page provided. All requirements derived from Figma design files.  
> **Figma file key**: `WXBZsxyNrHkyGDg0FWIS1g`  
> **Extracted**: 2026-04-15

---

## Requirements

The carousel block is a full-width, horizontally-scrolling hero-banner carousel. Each slide fills the full width of the block with a gradient background and centered text (heading + sub-heading). Navigation is provided by prev/next chevron buttons and a pagination dot indicator.

The block must support:
- A configurable number of slides (tested at 2, 3, and 5 in Figma)
- Slide backgrounds that are either a **solid colour, a CSS gradient, or a background image** — all three are valid authored inputs
- Light and dark variants
- Keyboard and screen-reader accessible navigation
- Manual-only navigation (no auto-advance, no timer)
- Integration with the shared `scripts/utility/carousel.js` utility

---

## Block Dialogue (Authoring)

> No Confluence link provided. Requirements inferred from Figma design.

Authors create one slide per row in the Word/Docs table. Each slide row has four cells:

| Column 1 | Column 2 | Column 3 | Column 4 |
|----------|----------|----------|----------|
| Slide title | Slide sub-heading | Link (href + text) | Background (image or colour) |

- **Column 3** — a hyperlink: the link text becomes the CTA label; the href is the destination. Optional; omit or leave blank for slides with no CTA.
- **Column 4** — either an authored image element (AEM delivers an `<img>`) or a plain-text CSS colour/gradient string (e.g. `#002855` or `linear-gradient(...)`). If absent, a default palette gradient is applied by index.

### Authored HTML Shape

```
| Carousel          |                              |              |         |
|-------------------|------------------------------|--------------|----------|
| Home Loans        | Competitive rates from 5.99% | Learn more   | [image]  |
| Credit Cards      | Earn rewards on every purchase | Apply now  | #D4AF37  |
| Insurance         | Comprehensive protection     |              | #008B8B  |
```

---

## Fields

| Field | Required | Type | Constraints | Description |
|-------|----------|------|-------------|-------------|
| `title` | Yes | text | Max ~60 chars (single line) | Slide heading (`<h2>`), centered. 30px bold. |
| `description` | No | text | Max ~80 chars (single line) | Slide sub-heading, centered. 18px regular. |
| `link` | No | link | href + visible text | CTA link rendered below sub-heading. Omit cell or leave blank for no CTA. |
| `background` | No | image \| text | `<img>` element or CSS colour/gradient string | Slide background. Image: `object-fit: cover`. Colour: hex or `linear-gradient(...)`. If absent, a default brand-gradient palette is applied by slide index. |

---

## Block UI

### Slide (GBCarousel item)

- **Height**: `176px`
- **Border-radius**: `12px`
- **Overflow**: hidden (clips overflowing slides)
- **Background**: solid colour, linear gradient, or background image (`object-fit: cover`, `object-position: center`). See Slide Backgrounds below.
- **Content layout**: flex column, gap `16px`, padding `48px top` and `48px horizontal`
- **Title**: `<h2>`, `30px / 36px line-height`, Inter Bold, `text-align: center`. Text colour is contrast-computed against the slide background: white (`#ffffff`) when the background is dark; `#002855` (navy) when the background is light. The computation uses WCAG 4.5:1 minimum contrast ratio against the dominant background colour.
- **Description**: `18px / 28px line-height`, Inter Regular, `text-align: center`. Same contrast-computed colour as title.
- **Link/CTA** (optional): rendered as a styled `<a>` button below the description, centered. Inherits contrast-computed text colour or uses an inverse filled style — final treatment to be confirmed during build review.

### Pagination dots

- Positioned below the slide container (`top: 192px` from the carousel container, i.e. 16px below the 176px slide)
- Horizontally centered
- Gap between dots: `8px`
- **Active dot**: pill shape, `32px × 8px`, `border-radius: 9999px`
  - Light mode: `#002855`
  - Dark mode: `#e8c968`
- **Inactive dot**: circle, `8px × 8px`, `border-radius: 9999px`
  - Light mode: `#d1d5dc`
  - Dark mode: `rgba(148, 163, 184, 0.3)`

### Navigation buttons (prev/next)

- Size: `40px × 40px` (light) / `~41.3px` (dark — includes border)
- Shape: circle (`border-radius: 9999px`)
- Vertically centered within the 176px slide: `top: 80px` from carousel top (= (176 − 40) / 2 ≈ 68px but Figma shows 80px — likely from the carousel wrapper with 24px difference)
- Horizontally: prev at `left: 16px`, next at `right: 16px`
- **Light mode**: background `rgba(255, 255, 255, 0.9)`, box-shadow `0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.1)`
- **Dark mode**: background `rgba(17, 24, 39, 0.9)`, border `1px solid #334155`, no drop shadow
- Icon: chevron SVG (left/right arrows), `24px × 24px`, centered in the button

### Overall carousel container

- `border-radius: 12px` on the slide viewport
- `overflow: hidden` clips slides during scroll

---

## Slide Backgrounds

### Image slides

When column 4 contains an `<img>` element, the image is used as the slide background:
- `background-image: url(...)`, `background-size: cover`, `background-position: center`
- The text overlay (title, description, CTA) sits above the image; an optional semi-transparent scrim may be needed to ensure contrast.
- Text colour is still contrast-computed — use the average/dominant colour of the image's centre region, or fall back to always applying a scrim + white text when an image is present.

### Colour / gradient slides

When column 4 contains a colour string or is absent, a gradient background is applied. The block cycles through the brand palette below when no explicit colour is provided.

| Index | Gradient (left → right) | Notes |
|-------|-------------------------|-------|
| 0 | `#002855` → `#003D7A` | Navy — white text |
| 1 | `#D4AF37` → `#E8C968` | Gold — navy text (computed) |
| 2 | `#008B8B` → `#20B2AA` | Teal — white text |
| 3 | `#0066CC` → `#3399FF` | Blue — white text |
| 4 | `#10B981` → `#34D399` | Green — white text |
| 5 | `#8B5CF6` → `#A78BFA` | Purple — white text |
| 6 | `#F59E0B` → `#FBBF24` | Amber — contrast-computed |
| 7 | `#EC4899` → `#F472B6` | Pink — white text |

> Text colour for each gradient is **contrast-computed** at runtime using the midpoint colour of the gradient stop range. If WCAG 4.5:1 is met by white, use white; otherwise use `#002855`. Palette cycles (index % 8) when there are more slides than entries.

---

## Variants

| Variant | CSS Class | Description |
|---------|-----------|-------------|
| Default (light) | _(none)_ | White page background, navy active dot, white nav buttons |
| Dark | `dark` | `#111827` page background, gold active dot, dark nav buttons with border |

### Variant Behavior

- `dark`: applied to the section or block container. Swaps pagination dot colours, nav button backgrounds, and text colours as described above.

---

## Annotations and States

### Carousel States

| State | Description |
|-------|-------------|
| **Slide 1 active** | First dot is wide (32×8px pill); all others are 8×8px circles |
| **Slide N active** | Nth dot is wide pill; all others are circles |
| **Transition** | Slides scroll horizontally (CSS scroll snap or JS-driven) |
| **Prev disabled** | On first slide — prev button is **visually disabled** (`aria-disabled="true"`, reduced opacity, `cursor: not-allowed`). Button stays in the DOM and remains focusable for accessibility. |
| **Next disabled** | On last slide — same disabled treatment as prev. |

> Navigation is **manual only**. No auto-advance, no timer, no autoplay.

### Slide count variations (Figma)

| Variation | Slide count | Notes |
|-----------|-------------|-------|
| Variation 1 | 3 slides | Navy, Gold, Teal |
| Variation 2 | 5 slides | Blue, Green, Purple, Amber, Pink |
| Variation 3 | 2 slides | Navy-Teal, Gold |

---

## Accessibility

### ARIA Pattern

- [x] Live region or roledescription for carousel

### Keyboard Navigation

- [x] Tab to reach prev/next buttons
- [x] Enter/Space to activate prev/next
- [x] Arrow keys for slide navigation (optional enhancement)
- [x] Home/End to jump to first/last slide (recommended)

### Heading Levels

- Slide title: **`<h2>`** — confirmed.

### Screen Reader Requirements

- [x] Prev/next buttons have accessible labels (`aria-label="Previous slide"`, `aria-label="Next slide"`)
- [x] Pagination dots: each dot has `aria-label="Slide N of M"` or similar
- [x] Active slide announced: `aria-live="polite"` or `aria-roledescription="carousel"` on container
- [x] Decorative gradient backgrounds have no alt text
- [x] Prev/next icon SVGs are `aria-hidden="true"` with button text provided via `aria-label`

---

## Design Reference

### Figma Links

| Figma URL | Node ID | Variant |
|-----------|---------|---------|
| https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=5-5196&m=dev | `5:5196` | Light mode |
| https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=5-5296&m=dev | `5:5296` | Dark mode |

---

## Figma Design Context

### Light Mode (node `5:5196`)

- **Outer container**: `background: #ffffff`, `border: 2px solid #e2e8f0`, `border-radius: 12px`
- **Section label text**: `color: #0f172a`, `font: 30px/36px Inter Bold`
- **Variation heading text**: `color: #0f172a`, `font: 20px/28px Inter Bold`

#### Spacing measurements

| Property | Value |
|----------|-------|
| Container padding (left) | `32px` |
| Slide height | `176px` |
| Slide border-radius | `12px` |
| Slide content padding-top | `48px` |
| Slide content padding-horizontal | `48px` |
| Gap between title and subtitle | `16px` |
| Pagination dot strip top | `192px` (16px below slide) |
| Pagination dot gap | `8px` |
| Active dot size | `32px × 8px` (pill) |
| Inactive dot size | `8px × 8px` (circle) |
| Nav button size | `40px × 40px` |
| Nav button left offset | `16px` |
| Nav button right offset | `16px` |
| Nav button top | `80px` |

#### Typography

| Element | Font | Size | Line Height | Weight | Color |
|---------|------|------|-------------|--------|-------|
| Slide title | Inter | 30px | 36px | Bold | `#ffffff` (or `#002855` on gold) |
| Slide description | Inter | 18px | 28px | Regular | `#ffffff` (or `#002855` on gold) |

### Dark Mode (node `5:5296`)

Identical layout and spacing to light mode. **Key differences:**

| Property | Light Value | Dark Value |
|----------|-------------|------------|
| Outer background | `#ffffff` | `#111827` |
| Outer border | `#e2e8f0` | `#334155` |
| Section text | `#0f172a` | `#f1f5f9` |
| Active dot | `#002855` | `#e8c968` |
| Inactive dot | `#d1d5dc` | `rgba(148, 163, 184, 0.3)` |
| Nav button bg | `rgba(255,255,255,0.9)` | `rgba(17,24,39,0.9)` |
| Nav button border | none | `1px solid #334155` |
| Nav button shadow | `0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.1)` | none |

---

## Figma Visual Reference Matrix

> Note: Each frame shows **multiple states in one image** (3 variations × 1 active-slide state each). Do not treat these as pixel-perfect single-slide targets. Compare slide-by-slide.

| Figma URL | Node ID | Screenshot file | Purpose |
|-----------|---------|-----------------|---------|
| https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=5-5196 | `5:5196` | `figma/node-5-5196-carousel-light.png` | Light mode — all 3 variations on white background |
| https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=5-5296 | `5:5296` | `figma/node-5-5296-carousel-dark.png` | Dark mode — all 3 variations on dark background |

> **Screenshot status**: Screenshots were captured via Figma MCP `get_screenshot` on 2026-04-15 and are visible in the session that created these requirements. PNG files must be saved to `figma/` before running `review-block`. Run `get_screenshot` again in a new Copilot session and save the bytes to the paths listed above. See `figma/README.md`.

---

## Authoring Requirements

- Authors create one row per slide in the table block.
- Each row has: **title** (cell 1), **description** (cell 2, optional), **link** (cell 3, optional), **background** (cell 4, optional — image or colour string).
- When cell 4 contains an image, it is used as the slide background image.
- When cell 4 contains a plain-text colour/gradient string, it is applied as the background.
- When cell 4 is absent or empty, the block applies a brand gradient from the default palette using the slide's zero-based index (cycling).
- The block renders slides in authored order.
- Authors can add 2–N slides; carousel activation follows the shared utility thresholds.
- No auto-advance: carousel only moves on explicit user interaction (prev/next buttons or pagination dots).

## Rendering / Markup Requirements

- Use `renderCarouselContainer` and `initializeCarousel` from `scripts/utility/carousel.js`.
- Each slide must be a `.carousel-item` with block-prefixed class.
- The slide container (`.carousel-list`) must `overflow: hidden` and support horizontal scrolling.
- Pagination dots must be rendered as `<button>` elements for keyboard accessibility.
- Prev/next buttons must be `<button>` elements with `aria-label`.
- Slide backgrounds applied via `style` attribute: `background-image` for images (`object-fit: cover`) or gradient/colour strings.
- Text colour is **contrast-computed per slide** at render time: compute relative luminance of the dominant background colour (midpoint of gradient, or average of image if detectable); apply white text if contrast ≥ 4.5:1, otherwise apply `#002855`.
- For image slides where dominant colour is not reliably computable, apply a semi-transparent dark scrim and white text as the safe fallback.
- Each slide renders: `<h2>` title, optional `<p>` description, optional `<a>` CTA link.
- Text content must be placed in structured HTML, not flat text nodes.
- No autoplay or timer is implemented.

## Accessibility Requirements

- All interactive controls (`<button>`) are keyboard reachable via Tab.
- Active slide communicated via `aria-live="polite"` or equivalent ARIA carousel pattern.
- Prev/next icon buttons have `aria-label="Previous slide"` / `aria-label="Next slide"`.
- When a nav button is on a boundary (first/last slide), it has `aria-disabled="true"` and `opacity` reduction — it is **not removed from the DOM**.
- Pagination dot buttons have `aria-label="Go to slide N"` and `aria-current="true"` on the active dot.
- Slide content in each item accessible to screen readers when active (not `aria-hidden` while off-screen unless focus is also managed).
- CTA links within slides are standard `<a>` elements; they are tabbable and announced with link text.

## Variant / State Matrix

| Variant | Active dot color | Inactive dot | Nav button bg | Nav button border |
|---------|----------------|--------------|-----------|----|
| light (default) | `#002855` | `#d1d5dc` | `rgba(255,255,255,0.9)` + shadow | none |
| dark | `#e8c968` | `rgba(148,163,184,0.3)` | `rgba(17,24,39,0.9)` | `1px solid #334155` |

## Validation Rules

- Minimum 1 slide required.
- Title is required per slide; description, link, and background are all optional.
- If description is absent, omit the `<p>` element (do not render an empty tag).
- If link is absent, omit the `<a>` element.
- If background is absent, apply the default palette gradient by slide index.
- Maximum slide count is unconstrained in design; shared utility handles breakpoint thresholds.
- No autoplay logic is permitted — carousel must not move without explicit user gesture.

---

## Decisions Log

| # | Question | Decision |
|---|----------|----------|
| 1 | Slide background authoring | Authors provide an image (cell 4) OR a colour/gradient string (cell 4). Absent cell = default palette gradient applied by index. Both solid colours and images are supported. |
| 2 | Prev/Next disabled state | Buttons stay visible and in the DOM. At boundary slides they are **visually disabled**: `aria-disabled="true"`, reduced opacity, `cursor: not-allowed`. No hiding. |
| 3 | Heading level | Slide title is **`<h2>`**. |
| 4 | Text colour on coloured backgrounds | **Contrast-computed** at render time using WCAG relative luminance. White text if contrast ≥ 4.5:1, otherwise `#002855`. Image slides fall back to scrim + white. |
| 5 | Auto-advance | **No auto-advance, no timer.** Manual navigation only. |
| 6 | CTA / link per slide | Each slide has **title, subtitle (description), and link** — all authorable. Link is optional per slide. |

## Open Questions

_All questions from initial extraction have been resolved. None outstanding._

---

## Related Documents

- [Carousel Usage Skill](.github/skills/carousel-usage/SKILL.md)
- [Carousel Guide](.github/skills/carousel-usage/examples/CAROUSEL_GUIDE.md)
- [Block Development Skill](.github/skills/block-development/SKILL.md)
- `styles/components/_carousel.scss` — shared carousel SCSS
- `scripts/utility/carousel.js` — shared carousel utility
