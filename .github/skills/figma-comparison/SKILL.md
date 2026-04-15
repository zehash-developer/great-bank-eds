---
name: figma-comparison
description: Validate Storybook against Figma using get_screenshot (look-and-feel), get_design_context (measurable values), and figma:compare (layout diff).
argument-hint: '[block name] [figma-node-id]'
---

# Figma → Storybook Comparison

Use this skill after Storybook stories are ready to validate and iterate toward a pixel-perfect implementation of a Figma design.

## Figma MCP: screenshots + design context + compare

**`get_screenshot` is encouraged** for the **exact look and feel** of what you are building: overall composition, visual hierarchy, spacing “at a glance,” and side-by-side checks against Storybook. Call it for the main component node and any important variants or breakpoints. Persist PNGs (e.g. under `docs/requirements/<block>/figma/` or `images/`) so the team shares one visual baseline.

**`get_design_context`** is for **measurable** values: hex colors, px spacing, font-size/weight/line-height, radius, gap. Do not infer those by sampling pixels from a screenshot (color space and export scale skew eyedropper reads).

**`npm run figma:compare`** automates layout diffing (Figma vs Storybook raster).

| Tool | Use it for |
|---|---|
| `get_screenshot` | Look-and-feel, layout impression, “does it match the frame?” — **primary visual reference** |
| `get_design_context` | Numeric/token audit: colors, typography, spacing values in SCSS |
| `npm run figma:compare` | Pixel diff pipeline, regression tracking, composite/diff images |

Do **not** set `excludeScreenshot: true` on `get_design_context` unless the user explicitly wants to save context window space — default behavior should include the screenshot in the response when available.

## Workflow

1. **Create a `FigmaMatch` story** — a dedicated full-width story that overrides the Storybook container so it matches the Figma frame's viewport exactly (see `examples/figmamatch-story-pattern.md`).
2. **Capture visuals** — call **`get_screenshot`** on the component (and key variants). Download assets to `images/<block-name>-<descriptor>.png` or save under requirements `figma/` as needed. Reference via `/filename.png` in mocks. Storybook serves `images/` as a static directory.
3. **Get the Figma baseline** — run `npm run figma:compare -- --story-id=<id> --figma-node-id=<node>` to produce `tools/compare-output/composite.png` (Figma | Storybook | Diff side-by-side) and `diff.png`.
4. **Audit measurable values** — call `get_design_context` on the main Figma node and cross-check each value against the SCSS source (`blocks/<name>/<name>.scss`). Fix mismatches, then re-check look-and-feel with **`get_screenshot`** or `figma:compare`.
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
| A CSS variable is missing or wrong vs Figma | Define or update `var(--...)` in the block `.scss` or shared partials to match `get_design_context` |
| `.block-header` global adds `margin-bottom: 24px` | Override with `margin-bottom: 0` on the block's header element |
| `.block-heading` global sets `font-size: 27px` | Override explicitly in block SCSS if Figma uses a different size |
| Global `body` font is 18px, not 16px | Add explicit `font-size: 1rem` on description/content elements |
| CTA / footer section visually separated in Figma | Render it **outside** the accordion `<ol>` in JS, not inside a panel |
| Storybook container adds `max-width: 1200px; padding: 24px` | Override via `requestAnimationFrame` in the `FigmaMatch` story (see pattern) |
| MCP image asset URLs expire when MCP restarts | Save to `images/` folder; never use `localhost:3845/assets/` in committed mocks |

## Values from Figma (not a fixed palette)

- Read **hex, px, font, weight, radius, gap** from `figma-get_design_context` for the node you are shipping.
- **Spacing:** often map Figma px to `spacing(N)` where `N = px ÷ 6` (1 unit = 6px); use literal `rem`/`px` when the spec does not fit the grid.
- **Variables:** implement colors and reused numbers as SCSS variables or CSS custom properties. If Figma introduces a new value, **add** a variable in `blocks/<name>/<name>.scss` or `styles/` — do not rely on an external token package naming scheme.

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
