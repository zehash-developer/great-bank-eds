# Design Token Audit Guide

Use `figma-get_design_context` to extract exact values from a Figma node, then compare systematically against the SCSS source.

## Running the Audit

Call `figma-get_design_context` on the top-level Figma node for the block. This returns:

- Color tokens (as hex values and/or design token names)
- Typography: font-family, font-size, font-weight, line-height
- Spacing: padding, margin, gap values in px
- Layout: flex/grid direction, align-items, justify-content
- Sizes: fixed widths, heights, border-radius
- Component states (active, inactive, hover, disabled)

## Systematic Comparison

For each value returned by `get_design_context`, locate the matching property in `blocks/<name>/<name>.scss` and verify:

### Colors

For each color from `get_design_context` (hex or Figma variable):

1. Add or reuse a **CSS custom property** in the block SCSS (or a shared `styles/` partial), e.g. `--my-block-surface: #f5f5f6;`, and use `color: var(--my-block-surface)` / `background: var(...)` in rules.
2. **If no variable exists yet**, define it from the Figma value — do not map to an unrelated legacy token name.
3. Prefer named variables over repeating the same hex in many selectors.
4. Common mistake: using a variable that does not match the current Figma node — always reconcile against the latest `get_design_context` output.

### Typography

```
Figma: font-size 30px, weight Bold, line-height 1.2
SCSS:  font-size: spacing(5) ?  ← wrong, use px or rem directly for headings
       font-size: 1.875rem      ← correct (30px ÷ 16 = 1.875rem)
       line-height: 1.2          ← correct
```

Global traps:
- `.block-heading` sets `font-size: 27px` globally — override if Figma uses a different size
- `body` is `18px` — any element inheriting body will be 18px, not 16px. Add `font-size: 1rem` for 16px.

### Spacing

Convert Figma px values to `spacing(N)` where `N = px ÷ 6`:

| Figma px | spacing() | rem |
|---|---|---|
| 6px | spacing(1) | 0.375rem |
| 12px | spacing(2) | 0.75rem |
| 18px | spacing(3) | 1.125rem |
| 24px | spacing(4) | 1.5rem |
| 48px | spacing(8) | 3rem |
| 72px | spacing(12) | 4.5rem |
| 96px | spacing(16) | 6rem |

### Layout Structure

Check whether Figma shows a section **outside** a list/accordion vs **inside** an item's panel. CTA rows, footer rows, and summary sections are commonly shown as separate siblings to the main content list in Figma. If so, render them outside the `<ol>` or list container in JS.

## What screenshots (`get_screenshot`) are for

**Use `get_screenshot` liberally** — it is the best way to judge **look and feel**: composition, balance, hierarchy, and whether the built component “matches the frame.” Compare the PNG side-by-side with Storybook (or your preview) while iterating. Save copies under your project’s requirements or `images/` folder so reviews have a stable visual baseline.

## What NOT to infer from screenshot pixels alone

Do not use eyedropper / pixel sampling on screenshots for **authoritative** values — export scale and color space still skew raw pixels:

- Exact hex color values (use `get_design_context`)
- Font weight / sub-pixel spacing for SCSS literals (use `get_design_context`)

**Workflow:** use **`get_screenshot`** for “does it look right?” and **`get_design_context`** for “what number do I put in SCSS?”
