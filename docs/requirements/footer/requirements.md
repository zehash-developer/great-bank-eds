# Block: footer

> **Confluence source:** Not provided  
> **Figma source:** Great Bank Design Files — `WXBZsxyNrHkyGDg0FWIS1g`  
> Nodes extracted: `4:2395` (light), `5:4263` (dark)

---

## Requirements

### Overview

The `footer` is a site-wide block that renders at the bottom of every page. It contains:

1. **Brand area** — Great Bank logo, tagline, and social media icon links
2. **Navigation columns** — Three labelled link columns (Products, Support, About), each with up to 6 links
3. **Legal bar** — Bottom strip with legal page links on the left and copyright notice on the right

The footer supports **light** (default) and **dark** variants via a CSS class on the block.

---

## Block Dialogue

_Not provided via Confluence. Derived entirely from Figma._

---

## Block UI

### Light Mode (node 4:2395)

- Full-width footer, `background: #f9fafb`, top border `1px solid #e5e7eb`
- Brand column (left ~38%): logo mark + "GREAT BANK" wordmark, two-line tagline, row of 5 social icon circles
- Three nav columns (right ~62%): Products | Support | About — each with a bold heading and 6 links below
- Legal bar: white background (`#ffffff`), top border `1px solid #e5e7eb`, legal links left, copyright right

### Dark Mode (node 5:4263)

- `background: #111827`, top border `1px solid #334155`
- Logo wordmark changes to `#d4af37` (gold)
- Social icon containers: `#1e293b` (dark navy)
- Nav headings: `#f1f5f9`; links: `#94a3b8`
- Legal bar: `background: #0a0f1a`, border `1px solid #334155`, text `#94a3b8`

---

## Annotations and States

| State / Element       | Light                     | Dark                      |
|-----------------------|---------------------------|---------------------------|
| Footer background     | `#f9fafb`                 | `#111827`                 |
| Top border            | `1px solid #e5e7eb`       | `1px solid #334155`       |
| Logo wordmark         | `#002855`                 | `#d4af37`                 |
| Tagline text          | `#4a5565`                 | `#94a3b8`                 |
| Social icon bg        | `#e5e7eb`                 | `#1e293b`                 |
| Nav column heading    | `#101828`                 | `#f1f5f9`                 |
| Nav link text         | `#4a5565`                 | `#94a3b8`                 |
| Legal bar background  | `#ffffff`                 | `#0a0f1a`                 |
| Legal bar border      | `1px solid #e5e7eb`       | `1px solid #334155`       |
| Legal link text       | `#4a5565`                 | `#94a3b8`                 |
| Copyright text        | `#4a5565`                 | `#94a3b8`                 |

**Link hover state:** Not specified in Figma — implement standard underline on hover (consistent with EDS patterns).

---

## Accessibility

- Footer must be wrapped in `<footer>` landmark element
- Nav columns must each be a `<nav>` with an `aria-label` matching the column heading (e.g. `aria-label="Products"`)
- Social icon links must have descriptive `aria-label` (e.g. `aria-label="Follow us on Facebook"`)
- Legal links must be in a `<nav aria-label="Legal">`
- Copyright is static text, no ARIA needed
- All links must be `<a>` elements with visible text or `aria-label`
- Keyboard: Tab through all links in DOM order; no skip link required within the footer itself

---

## Design Tokens and Theming

### Typography

| Element             | Font               | Size | Weight | Line-height | 
|---------------------|--------------------|------|--------|-------------|
| Logo wordmark       | Inter Bold         | 16px | 700    | normal      |
| Tagline             | Inter Regular      | 14px | 400    | 20px        |
| Nav column heading  | Inter Medium       | 18px | 500    | 27px        |
| Nav links           | Inter Regular      | 14px | 400    | 20px        |
| Legal links         | Inter Regular      | 14px | 400    | 20px        |
| Copyright           | Inter Regular      | 14px | 400    | 20px        |

### Spacing (normalized from Figma values)

| Token                     | Value   | Notes                                              |
|---------------------------|---------|----------------------------------------------------|
| Main content padding-top  | ~48px   | Space from footer top edge to content              |
| Main content padding-x    | ~48px   | Horizontal gutter (within max-width container)     |
| Brand col → nav gap       | ~48px   | Between brand area and first nav column            |
| Gap between nav columns   | ~24px   | Equal spacing between Products / Support / About   |
| Nav heading → first link  | 16px    | `gap` in flex column                               |
| Gap between nav links     | 12px    | `gap` in flex column                               |
| Social icon size          | 36px    | Circle diameter                                    |
| Social icon gap           | 16px    | Between social circles                             |
| Legal bar padding-top     | 24px    | Space above legal content strip                   |
| Legal bar padding-x       | same as main content |                                        |

### CSS Custom Properties (proposed)

```scss
.footer {
  --footer-bg:              #f9fafb;
  --footer-border:          #e5e7eb;
  --footer-logo-color:      #002855;
  --footer-tagline:         #4a5565;
  --footer-social-bg:       #e5e7eb;
  --footer-social-icon:     #4a5565;
  --footer-heading-color:   #101828;
  --footer-link-color:      #4a5565;
  --footer-legal-bg:        #ffffff;
  --footer-legal-border:    #e5e7eb;
  --footer-legal-text:      #4a5565;
}

.footer.dark {
  --footer-bg:              #111827;
  --footer-border:          #334155;
  --footer-logo-color:      #d4af37;
  --footer-tagline:         #94a3b8;
  --footer-social-bg:       #1e293b;
  --footer-social-icon:     #94a3b8;
  --footer-heading-color:   #f1f5f9;
  --footer-link-color:      #94a3b8;
  --footer-legal-bg:        #0a0f1a;
  --footer-legal-border:    #334155;
  --footer-legal-text:      #94a3b8;
}
```

---

## Authored HTML Shape

The footer in AEM EDS is a **fragment-based block** loaded from `/footer/footer.html` (or equivalent). Authors edit the footer document in the same way as any other page. The block receives pre-rendered HTML from the fragment loader.

### Expected authored table structure

| Column 1                          |
|-----------------------------------|
| Logo image (or logo placeholder)  |
| Tagline text                      |

| Social Links                                     |
|--------------------------------------------------|
| Link 1 (icon + aria-label) \| Link 2 \| ...     |

| Products heading | Support heading | About heading |
|------------------|-----------------|---------------|
| Link 1           | Link 1          | Link 1        |
| Link 2           | Link 2          | Link 2        |
| ...              | ...             | ...           |

| Legal links row                                               |
|--------------------------------------------------------------|
| Privacy Policy \| Terms of Use \| Accessibility \| Legal     |

| Copyright text                        |
|---------------------------------------|
| © 2026 Great Bank. All rights reserved. |

> **Note:** Exact authored shape will depend on the EDS footer fragment document structure. The decorator should be resilient to row order variations.

---

## Fields

| Field               | Required | Type      | Constraints      | Description                                  |
|---------------------|----------|-----------|------------------|----------------------------------------------|
| Logo                | Yes      | image     | —                | Great Bank logo image (SVG or PNG)           |
| Tagline             | No       | text      | Max 200 chars    | Brand tagline beneath logo                   |
| Social links        | No       | links     | Up to 8          | Social platform links with icon images       |
| Nav column heading  | Yes      | text      | Max 50 chars     | Column section heading (Products, etc.)      |
| Nav links           | Yes      | links     | 2–10 per column  | Navigation links within each column          |
| Legal links         | No       | links     | Up to 8          | Links in the legal bar (Privacy Policy etc.) |
| Copyright           | No       | text      | Max 100 chars    | Copyright notice text                        |

---

## Variants

| Variant | CSS Class | Description                   |
|---------|-----------|-------------------------------|
| Light   | (default) | Light grey background         |
| Dark    | `dark`    | Dark navy background + gold logo |

---

## Navigation Column Content (from Figma)

### Products
1. Transaction Accounts
2. Savings Accounts
3. Home Loans
4. Credit Cards
5. Personal Loans
6. Insurance

### Support
1. Help Centre
2. Contact Us
3. Find a Branch
4. Security Centre
5. Complaints
6. FAQs

### About
1. About Us
2. Careers
3. Media Centre
4. Investor Relations
5. Sustainability
6. Community

### Social Icons (5 icons, in order)
1. Facebook
2. Twitter / X
3. Instagram
4. LinkedIn
5. YouTube

### Legal Links
1. Privacy Policy
2. Terms of Use
3. Accessibility
4. Legal

---

## Layout Behaviour

- Footer is **full-width** (no max-width on the outer container)
- Inner content is constrained to the site's content max-width with horizontal padding
- Brand area and nav columns are in a **flex row** on tablet and above
- On mobile: brand area stacks above nav columns; nav columns stack vertically
- Legal bar is always **full-width**, with inner content flex row (links left, copyright right)
- On mobile: legal bar stacks — links above, copyright below

---

## Accessibility Requirements

- `<footer role="contentinfo">` — landmark for screen readers
- Logo image: `alt="Great Bank"` (or equivalent actual alt text)
- Social links: each `<a>` has `aria-label="Follow us on [Platform]"` 
- Nav columns: each is a `<nav aria-label="[Column Heading]">`
- Nav headings: rendered as `<h2>` or `<p>` — confirm with team; do not use `<h1>`
- Legal links: `<nav aria-label="Legal">`
- Skip link: not required within footer itself (handled at page level)
- Color contrast: all text combinations confirmed ≥ 4.5:1 in both light and dark modes

---

## Validation Rules

- Logo must be an image with non-empty `alt`
- Social links must have `aria-label` attributes
- At least one nav column must be present
- Legal bar copyright text should include current year

---

## Open Questions

1. **Logo treatment**: Is the logo an `<img>` referencing an SVG, or is it the GEL logo component? (The Figma shows a logo mark + wordmark; the GEL logomark may be a separate symbol to integrate using the icon-usage skill)
2. **Social icons**: Are these GEL icons or custom SVG paths? (Figma shows platform-specific icons as vector assets, not GEL icon font characters)
3. **Mobile breakpoint**: No mobile frame in Figma — confirm if single-column stacking of nav columns is correct, and whether the brand area always sits above or beside an abbreviated link list
4. **Dark mode trigger**: Is the `dark` class applied via the EDS section metadata authored in the footer document, or programmatically based on the page theme?
5. **Copyright year**: Should this be static text ("© 2026") or dynamically rendered using `new Date().getFullYear()`?
6. **Nav column count**: Is 3 columns fixed or can authors add/remove columns?

---

## Figma Visual Reference Matrix

| Figma URL | Node ID | Screenshot file | Purpose |
|-----------|---------|-----------------|---------|
| [Light mode](https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=4-2395) | `4:2395` | `figma/node-4-2395-footer-light.png` _(recapture with get_screenshot)_ | Default light footer — complete layout reference |
| [Dark mode](https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=5-4263) | `5:4263` | `figma/node-5-4263-footer-dark.png` _(recapture with get_screenshot)_ | Dark footer — color token reference |

> **Screenshot note:** Both frames were captured via `get_screenshot` during the requirements phase and reviewed in session. Full-frame PNG files require re-capture at build time using:
> ```
> mcp_figma_get_screenshot(fileKey="WXBZsxyNrHkyGDg0FWIS1g", nodeId="4:2395")
> mcp_figma_get_screenshot(fileKey="WXBZsxyNrHkyGDg0FWIS1g", nodeId="5:4263")
> ```

### Key visual observations from screenshots

**Light mode (4:2395):**
- Brand area occupies left ~38% of the content row; nav columns fill the remaining ~62%
- Logo mark (small icon) sits left of "GREAT BANK" text inline
- Tagline wraps at ~384px width, 2 lines
- Social icons are grey circles (no visible icon colour differentiation at this scale — use white icon on `#e5e7eb` bg)
- Nav headings have visible weight difference from link text
- Legal bar is distinctly whiter than the main footer body (`#ffffff` vs `#f9fafb`)

**Dark mode (5:4263):**
- Near-identical layout to light mode
- Logo "GREAT BANK" text is gold (`#d4af37`) — prominent brand differentiation
- Social icon circles are very dark navy (`#1e293b`) — barely visible against bg
- Nav headings are bright white (`#f1f5f9`), links are muted slate (`#94a3b8`)
- Legal bar is noticeably darker (`#0a0f1a`) than footer body (`#111827`)

---

## Related Documents

- [Block catalog](.github/skills/block-catalog.md)
- [Block development skill](.github/skills/block-development/SKILL.md)
- [Icon usage skill](.github/skills/icon-usage/SKILL.md)
- [SCSS styling skill](.github/skills/scss-styling/SKILL.md)
- [Accessibility skill](.github/skills/accessibility/SKILL.md)
