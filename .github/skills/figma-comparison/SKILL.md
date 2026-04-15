---
name: figma-comparison
description: Validate a Storybook story against Figma design using screenshot layout comparison and design token audit, iterating until pixel-perfect.
argument-hint: '[block name] [figma-node-id]'
---

# Figma → Storybook Comparison

Use this skill after Storybook stories are ready to validate and iterate toward a pixel-perfect implementation of a Figma design.

## Two-Tool Methodology

**Never use screenshots to validate colors, font weights, or spacing values.** Screenshots vary by color space (sRGB vs Display P3/AdobeRGB), monitor calibration, and OS-level font anti-aliasing. Use the two-tool approach:

| Tool | Validates |
|---|---|
| `figma-get_design_context` on the Figma node | Colors (exact token values), font sizes, font weights, line-heights, spacing, border-radius, gap — anything measurable |
| `npm run figma:compare` (Playwright + pixelmatch) | Structural layout: element positions, widths, heights, grid alignment, visual structure |

## Workflow

1. **Create a `FigmaMatch` story** — a dedicated full-width story that overrides the Storybook container so it matches the Figma frame's viewport exactly (see `examples/figmamatch-story-pattern.md`).
2. **Download Figma images** — use `figma-get_screenshot` on image nodes to warm the MCP asset cache, then download to `images/<block-name>-<descriptor>.png`. Reference via `/filename.png` in mocks. Storybook serves `images/` as a static directory.
3. **Get the Figma baseline** — run `npm run figma:compare -- --story-id=<id> --figma-node-id=<node>` to produce `tools/compare-output/composite.png` (Figma | Storybook | Diff side-by-side) and `diff.png`.
4. **Audit design tokens** — call `figma-get_design_context` on the main Figma node and cross-check each value against the SCSS source (`blocks/<name>/<name>.scss`). Fix any mismatches first before re-running the screenshot comparison.
5. **Iterate on layout** — inspect red areas in `diff.png`, fix in SCSS, run `npm run scss:build`, re-run `figma:compare`. Repeat until mismatch is ≤ 2%.
6. **Accept the ~2% floor** — Figma MCP exports screenshots at ~0.65× scale while Storybook renders at 1×. Different scale → different font anti-aliasing. This ~2% is not a real layout error; it is the physics of cross-tool screenshot comparison.

## SCSS Pipeline Rule

**Never edit `.css` files directly.** The `storybook` npm script runs `scss:build` on every restart, regenerating all CSS from SCSS sources. All fixes must go into `blocks/<name>/<name>.scss`.

## Images Folder

- Save Figma images to `images/<block-name>-<descriptor>.png` (gitignored).
- Storybook serves `images/` via `staticDirs` in `.storybook/main.js` — files are available at `/<filename>.png`.
- Only mock files (`*.mocks.js`) and stories (`*.stories.js`) should reference these paths.
- Re-download if missing: call `figma-get_screenshot` on the original node, then fetch from `http://localhost:3845/assets/<hash>.png`.

## Common Traps

| Trap | Fix |
|---|---|
| `--background-faint` is undefined → transparent | Use `--background-pale-faint` for light muted backgrounds |
| `.block-header` global adds `margin-bottom: 24px` | Override with `margin-bottom: 0` on the block's header element |
| `.block-heading` global sets `font-size: 27px` | Override explicitly in block SCSS if Figma uses a different size |
| Global `body` font is 18px, not 16px | Add explicit `font-size: 1rem` on description/content elements |
| CTA / footer section visually separated in Figma | Render it **outside** the accordion `<ol>` in JS, not inside a panel |
| Storybook container adds `max-width: 1200px; padding: 24px` | Override via `requestAnimationFrame` in the `FigmaMatch` story (see pattern) |
| MCP image asset URLs expire when MCP restarts | Save to `images/` folder; never use `localhost:3845/assets/` in committed mocks |

## Design Token Reference (WBC brand)

- Spacing grid: `spacing(N)` = `N × 0.375rem` (1 unit = 6px)
- Breakpoints: `sm`=768px, `md`=992px, `lg`=1200px, `xl`=1584px
- `--background-pale-faint` = `#f5f5f6` (light page/section backgrounds)
- `--surface-primary` = `#da1710` (brand red — active states, NOT inactive backgrounds)
- `--surface-muted-strong` = `#8e8d98` (dividers, connectors)
- `--text-primary` = `#da1710` (red text — active labels)
- `--text-body` = `#161619` (default body text)
- `--background-white` = `#ffffff`

## Running the Comparison Tool

```bash
# First run — fetches fresh Figma reference and saves it
npm run figma:compare -- --story-id=blocks-<name>--figma-match --figma-node-id=<node-id>

# Subsequent runs — reuse cached Figma reference
npm run figma:compare -- --story-id=blocks-<name>--figma-match

# Custom viewport
npm run figma:compare -- --story-id=... --figma-node-id=... --viewport-width=1584 --viewport-height=886
```

Output files (all gitignored under `tools/compare-output/`):
- `figma-reference.png` — cached Figma screenshot
- `storybook-actual.png` — latest Storybook screenshot
- `diff.png` — red = mismatch, orange = anti-aliasing
- `composite.png` — Figma | Storybook | Diff side-by-side

## Reference

- Skill package: [SKILL.md](./SKILL.md)
- Repo source of truth: [agents.md](../../../agents.md)
- Comparison tool source: [tools/figma-storybook-compare.js](../../../tools/figma-storybook-compare.js)

## Resources

- Checklist: [examples/checklist.md](examples/checklist.md)
- FigmaMatch story pattern: [examples/figmamatch-story-pattern.md](examples/figmamatch-story-pattern.md)
- Design token audit guide: [examples/design-token-audit.md](examples/design-token-audit.md)
