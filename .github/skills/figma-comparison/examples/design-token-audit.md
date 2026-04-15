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

| Figma value | Expected SCSS token | Common mistake |
|---|---|---|
| `#f5f5f6` | `var(--background-pale-faint)` | Using `--background-faint` (undefined → transparent) |
| `#da1710` | `var(--surface-primary)` or `var(--text-primary)` | Using red for inactive states |
| `#8e8d98` | `var(--surface-muted-strong)` | Using `--surface-muted` (different shade) |
| `#161619` | `var(--text-body)` | Hard-coding hex instead of token |
| `#ffffff` | `var(--background-white)` | Hard-coding `#fff` |

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

## What NOT to Audit via Screenshots

Never compare these via screenshot:
- Exact color values (sRGB vs P3, ICC profiles, monitor calibration all affect color rendering)
- Font weight rendering (bold/semibold antialiasing differs between Figma and browsers)
- Sub-pixel spacing (1–2px differences are lost in the 0.6465× MCP export scale)

Always audit these via `get_design_context` instead.
