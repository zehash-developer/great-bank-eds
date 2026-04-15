# Component: buttons

> **Source**: No Confluence page provided. All requirements derived from Figma design files.  
> **Figma file key**: `WXBZsxyNrHkyGDg0FWIS1g`  
> **Extracted**: 2026-04-15  
> **Nature**: Shared UI component — **not an EDS block**. SCSS lives in `styles/components/_buttons.scss`. No `blocks/buttons/` directory.

---

## Requirements

Buttons are a shared, reusable UI component used across all blocks and page regions. They are not EDS blocks and do not use the `decorate()` lifecycle. They are styled via `styles/components/_buttons.scss` (compiled through the existing `scss:build` pipeline) and the mixin file `styles/mixins/_buttons.scss`.

Authors apply button styles by adding the `button` class (plus a variant and size modifier) to any `<a>` or `<button>` element. Blocks that render CTAs are responsible for appending the correct classes in their own `decorate()` functions.

The component must support:

- Four **variants**: `primary`, `secondary`, `outline`, `ghost`
- Five **sizes**: `xs`, `sm`, `md`, `lg`, `xl`
- Optional **leading icon** (icon before label) and **trailing icon** (icon after label)
- Light and dark theme (dark applied via `data-theme="dark"` on an ancestor, per the existing GEL token system)
- Full-width modifier (`btn-block`)
- Storybook stories (`buttons.stories.js`) for all variants × sizes, and icon examples

---

## Confluence

Not provided.

---

## Block Dialogue (Authoring)

Not applicable — buttons are not authored as a block. They are programmatically constructed by block `decorate()` functions or rendered as part of rich-text content.

---

## Rendering / Markup Requirements

Buttons are rendered as:

```html
<!-- Filled button (primary / secondary) -->
<a class="button primary lg" href="/path">Label</a>

<!-- Outline button -->
<a class="button outline lg" href="/path">Label</a>

<!-- Ghost button -->
<a class="button ghost lg" href="/path">Label</a>

<!-- Icon leading -->
<a class="button primary md" href="/path">
  <span class="button-icon button-icon--leading" aria-hidden="true"><!-- svg / gel icon --></span>
  Label
</a>

<!-- Icon trailing -->
<a class="button primary md" href="/path">
  Label
  <span class="button-icon button-icon--trailing" aria-hidden="true"><!-- svg / gel icon --></span>
</a>

<!-- Full-width -->
<a class="button primary lg btn-block" href="/path">Label</a>
```

Container for grouped buttons:

```html
<div class="button-container">
  <a class="button primary md" href="#">Primary</a>
  <a class="button outline md" href="#">Outline</a>
</div>
```

---

## Variants

| Variant class | Figma name        | Description                                                         |
| ------------- | ----------------- | ------------------------------------------------------------------- |
| `primary`     | Primary Variant   | Solid filled, brand primary colour                                  |
| `secondary`   | Secondary Variant | Muted filled, body-text coloured label                              |
| `outline`     | Outline Variant   | No fill, 2px border, coloured label — **new, not in existing SCSS** |
| `ghost`       | Ghost Variant     | No fill, no border, body-text coloured label — subtle inline action |

### Variant token values

#### Light theme (default)

| Variant     | Background  | Text      | Border              |
| ----------- | ----------- | --------- | ------------------- |
| `primary`   | `#002855`   | `#ffffff` | none                |
| `secondary` | `#f3f4f6`   | `#101828` | none                |
| `outline`   | transparent | `#002855` | 2px solid `#002855` |
| `ghost`     | transparent | `#364153` | none                |

#### Dark theme (`data-theme="dark"` on ancestor)

| Variant     | Background  | Text      | Border              |
| ----------- | ----------- | --------- | ------------------- |
| `primary`   | `#e8c968`   | `#0a0f1a` | none                |
| `secondary` | `#1e293b`   | `#f1f5f9` | none                |
| `outline`   | transparent | `#e8c968` | 2px solid `#e8c968` |
| `ghost`     | transparent | `#f1f5f9` | none                |

---

## Sizes

### Size dimensions (from Figma)

Figma button sizes use a **6px base grid**. Heights for filled variants (no border):

| Size class | Figma name  | Height | Horiz padding | Font size | Line height |
| ---------- | ----------- | ------ | ------------- | --------- | ----------- |
| `xs`       | Extra Small | 28px   | 12px          | 12px      | 16px        |
| `sm`       | Small       | 36px   | 16px          | 14px      | 20px        |
| `md`       | Medium      | 44px   | 24px          | 16px      | 24px        |
| `lg`       | Large       | 52px   | 32px          | 18px      | 28px        |
| `xl`       | Extra Large | 60px   | 40px          | 20px      | 28px        |

Outline variant dimensions (border-box, 2px border adds 4px to visual height):

| Size class | Visual height | Horiz padding |
| ---------- | ------------- | ------------- |
| `xs`       | 32px          | 14px          |
| `sm`       | 40px          | 18px          |
| `md`       | 48px          | 26px          |
| `lg`       | 56px          | 34px          |
| `xl`       | 64px          | 42px          |

### Sizing discrepancies with existing SCSS

> **Open question / decision needed.** The existing `_buttons.scss` uses different heights and the `button-variant` mixin uses different size tokens. The implementation phase must choose one of:
>
> - **Option A**: Update all existing height and padding values in the mixin to match Figma exactly.
> - **Option B**: Keep existing mixin values and add only the missing `xs` size and `outline`/`ghost` variants.

| Size | Existing height | Figma height | Delta |
| ---- | --------------- | ------------ | ----- |
| `sm` | 30px (1.875rem) | 36px         | +6px  |
| `md` | 36px (2.25rem)  | 44px         | +8px  |
| `lg` | 42px (2.625rem) | 52px         | +10px |
| `xl` | 48px (3rem)     | 60px         | +12px |
| `xs` | — (missing)     | 28px         | new   |

---

## Icons

- Icon size: **18×18px**
- Icon placement: leading (before label) or trailing (after label)
- Icon wrapper class: `button-icon` with `button-icon--leading` or `button-icon--trailing` modifier
- The icon wrapper must carry `aria-hidden="true"`
- Spacing between icon and label: **8px** (gap)
- Figma examples show icons on `primary` and `outline` variants (any variant should support icons via the modifier classes)

---

## Accessibility Requirements

- `<a>` buttons must have a meaningful visible label or `aria-label` if icon-only
- No icon-only buttons in Figma — all shown examples include a text label
- Decorative icons carry `aria-hidden="true"`
- Focus ring must be visible on keyboard navigation (use `--border-focus` CSS custom property)
- Color contrast: all variant/theme combinations must meet WCAG 2.1 AA (4.5:1 for small text)
  - Primary light: `#ffffff` on `#002855` — ✅ passes (high contrast)
  - Primary dark: `#0a0f1a` on `#e8c968` — ✅ passes
  - Ghost light: `#364153` on white — verify contrast at each size
- `<button>` elements must have `type="button"` (or appropriate type) to avoid accidental form submissions if wrapped in a `<form>`

---

## States

| State    | Behaviour                                                                                   |
| -------- | ------------------------------------------------------------------------------------------- |
| Default  | As per variant/theme token table above                                                      |
| Hover    | Background lightens (primary/secondary) or darkens — use `color-mix()` as in existing mixin |
| Focus    | Visible focus ring via `--border-focus` outline                                             |
| Disabled | `opacity: 0.5`, `cursor: not-allowed`, `pointer-events: none`                               |
| Active   | Slight scale or brightness shift (confirm during build)                                     |

---

## Full-width Modifier

- Class: `btn-block`
- Effect: `width: 100%`
- Responsive: at `sm` breakpoint, reverts to `width: auto` (matches existing mixin pattern)

---

## SCSS Location

- **Component styles**: `styles/components/_buttons.scss`
- **Mixin**: `styles/mixins/_buttons.scss`
- **Do not create** `blocks/buttons/` — this is a shared component, not an EDS block.

### Gaps to fill in existing SCSS

1. **`outline` variant** — not present. Needs new `@if $variant == 'outline'` branch in `button-variant` mixin.
2. **`ghost` variant** — not present as a transparent button style. (Existing `tertiary` is a link/underline style — different from Figma Ghost which is a transparent block button.)
3. **`xs` size** — not present. Add `@else if $size == 'xs'` branch.
4. **Border radius** — existing: `5px`, Figma: `8px`. Decision required (see open questions).
5. **Dark theme** — variant colours already use CSS custom properties (`var(--surface-primary)` etc.) but `outline` and `ghost` colors need dark-theme mappings aligned to the Figma token values above.

---

## Storybook

Stories file location: to be determined. Options:

- `blocks/buttons/buttons.stories.js` (conventional per existing pattern, even though no block JS exists)
- Root-level `buttons.stories.js` (non-standard)

> **Recommendation**: Use `blocks/buttons/buttons.stories.js` so Storybook picks it up via its existing glob pattern. No `blocks/buttons/buttons.js` EDS block file is needed — the story renders the HTML directly.

Stories required:

- All 4 variants × 5 sizes (20 combinations) on light background
- All 4 variants × 5 sizes on dark background
- Icon leading + icon trailing examples (primary at md)
- `btn-block` modifier example
- `button-container` grouping example (2–3 buttons side by side)

---

## Variant/State Matrix

| Variant   | xs  | sm  | md  | lg  | xl  | Icon | Dark | Disabled |
| --------- | --- | --- | --- | --- | --- | ---- | ---- | -------- |
| primary   | ✅  | ✅  | ✅  | ✅  | ✅  | ✅   | ✅   | ✅       |
| secondary | ✅  | ✅  | ✅  | ✅  | ✅  | —    | ✅   | ✅       |
| outline   | ✅  | ✅  | ✅  | ✅  | ✅  | ✅   | ✅   | ✅       |
| ghost     | ✅  | ✅  | ✅  | ✅  | ✅  | —    | ✅   | ✅       |

---

## Figma Visual Reference Matrix

| Figma URL                                                                                        | Node ID  | Screenshot file                                   | Purpose                                                                          |
| ------------------------------------------------------------------------------------------------ | -------- | ------------------------------------------------- | -------------------------------------------------------------------------------- |
| https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=5-3024&m=dev | `5:3024` | `figma/node-5-3024-buttons-light.png` _(pending)_ | All variants × all sizes — light theme. Multi-state frame (one image shows all). |
| https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=5-4803&m=dev | `5:4803` | `figma/node-5-4803-buttons-dark.png` _(pending)_  | All variants × all sizes — dark theme. Multi-state frame (one image shows all).  |

> **Note**: Both frames are multi-state reference sheets (they show all variants/sizes together in one frame). Do not use pixel-perfect pixelmatch comparison against these frames — use them for visual hierarchy, colour, and density review only. For individual variant comparison, crop or use isolated story stories targeting a single variant output.

---

## Open Questions

1. **Size height values**: Should the existing button heights be updated to match Figma exactly (Option A), or should only the missing `xs` size and new variants be added while keeping existing heights (Option B)? This affects all blocks already using `button primary lg` etc.
2. **Border radius**: Figma specifies `8px`. Existing SCSS uses `5px`. Update globally or add a new CSS variable `--button-border-radius`?
3. **Stories file location**: `blocks/buttons/buttons.stories.js` vs another location. Confirm before build.
4. **`ghost` vs `tertiary`**: Are `ghost` and `tertiary` meant to coexist (ghost = transparent block button, tertiary = link/underline style), or should `tertiary` be renamed/removed?
5. **Disabled state**: Not shown in Figma. Confirm visual treatment (`opacity: 0.5`? `pointer-events: none`?).
6. **Focus ring style**: Not shown in Figma. Confirm use of `--border-focus` outline.

---

## Related Documents

- `styles/components/_buttons.scss` — existing component file
- `styles/mixins/_buttons.scss` — existing mixin
- `docs/requirements/buttons/figma/README.md` — Figma screenshot inventory
