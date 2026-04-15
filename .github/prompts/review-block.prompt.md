---
name: review-block
description: Validate an EDS block implementation against Figma designs
argument-hint: 'block-name'
---

Follow all rules in `/agents.md` and `.github/instructions/copilot-instructions.md`.
If there is any conflict, `/agents.md` wins.

## Pattern and reference sources

When judging whether markup or UE structure is correct, prefer [Block Development](../skills/block-development/SKILL.md), [Universal Editor](../skills/universal-editor/SKILL.md), and [Block catalog](../skills/block-catalog.md) over comparing to arbitrary other blocks in `blocks/`. Edit only `blocks/<block-name>/` for the block under review.

Use this prompt as:

`review-block <block-name>`

## Objective

Validate the block implementation at `blocks/<block-name>/` against the Figma designs referenced in `docs/requirements/<block-name>/requirements.md` and iterate toward pixel-perfect output.

**Preflight:** Read `docs/requirements/<block-name>/requirements.md` to locate Figma links, the **Figma visual reference matrix**, and every file under `docs/requirements/<block-name>/figma/` before proceeding.

**Dual baseline (mandatory):** Review must validate against **both** (1) **saved requirement-phase screenshots** in `docs/requirements/<block-name>/figma/` and (2) **live Figma data** via MCP / compare tooling. If requirement screenshots are missing, run `get-requirements` capture steps (`get_screenshot` per target node) and update `requirements.md` before relying solely on fresh MCP fetches — otherwise build and review phases are not comparable.

## Required References

- [Block catalog](../skills/block-catalog.md)
- [Block Development](../skills/block-development/SKILL.md)
- [Universal Editor](../skills/universal-editor/SKILL.md)
- [Figma Comparison](../skills/figma-comparison/SKILL.md)

---

## Phase 6: Figma Comparison

Use the [Figma Comparison skill](../skills/figma-comparison/SKILL.md) to validate the implementation against Figma and iterate toward pixel-perfect output.

### Requirement screenshots vs automated compare

1. **Load every saved PNG** from `docs/requirements/<block-name>/figma/` and compare mentally (or side-by-side with Storybook) to the current implementation. This catches drift from the agreed baseline that `get_design_context` alone might not explain.
2. **Then** run **`npm run figma:compare`** / batch compare against the same Figma node IDs as in the matrix. The composite (`Figma | Storybook | Diff`) should align with what you see when holding the requirement screenshot next to Storybook.
3. If automated mismatch is low but the **requirement screenshot** still looks wrong versus Storybook, trust the written baseline: re-fetch `get_screenshot` or `get_design_context` for that node, update the saved PNG if the design changed, and fix SCSS/JS.
4. Keep using the rules below: **`get_screenshot`** for look-and-feel, **`get_design_context`** for measurable values (never infer exact hex/spacing from eyedropper on rasters alone).

### Figma MCP tools (mandatory)

- **`get_screenshot`** — **Encouraged** for exact **look and feel**: composition, hierarchy, and side-by-side checks against Storybook. Re-fetch when the design or implementation changes. Persist PNGs per requirements workflow.
- **`get_design_context`** — Validates **numeric** styling: colors, font sizes, weights, spacing, border-radius (use API output, not screenshot pixel sampling).
- **`npm run figma:compare`** — Automated layout diff (positions, widths, heights, alignment); produces composite/diff images.

---

## The Review Loop

Work through issues in strict priority order: **layout → functionality → colors**. Never fix colors before layout is correct — color fixes may be invalidated by later layout changes.

### 1. Layout (fix first)

Layout means alignments, element dimensions, positions, and spacing. A 10px padding difference can cause 20% pixel mismatch — fix these first.

**Steps:**

1. **Create Storybook stories per Figma node** — one story per Figma node ID, named `FigmaNode<id>`, with:
   - `layout: 'fullscreen'`
   - Viewport dimensions matching the Figma frame (`w`, `h`)
   - `requestAnimationFrame` to apply UI state (open panels, expanded items, etc.)
   - The story must reproduce the exact Figma state (open panels, active items, etc.)

2. **Batch baseline comparison** — with Storybook running, run all stories at once:
   ```bash
   node tools/batch-figma-compare.mjs
   ```
   This saves mismatch % to `tools/compare-output/batch-results.json` and individual composites to `tools/compare-output/<nodeId>/`.

3. **Triage by mismatch %** — sort descending. Highest mismatch = biggest layout problem.

4. **Read composite images** — open `tools/compare-output/<nodeId>/composite.png` (Figma | Storybook | Diff). The diff panel shows red where pixels differ. Identify the pattern:
   - **Full-width red band** → element is wrong width or centred vs left-aligned
   - **Offset red area** → element is in the wrong position
   - **Thin red edges** → border/padding difference
   - **Red throughout** → wrong element entirely (functionality issue, not layout)

5. **Use pixel scanning when composite is unclear** — write a quick Node.js script using `pngjs` to sample RGB values at specific coordinates:
   ```js
   import { PNG } from 'pngjs';
   import fs from 'fs';
   const px = (img, x, y) => { const idx = (y * img.width + x) * 4; return `rgb(${img.data[idx]},${img.data[idx+1]},${img.data[idx+2]})`; };
   const png = PNG.sync.read(fs.readFileSync('tools/compare-output/<nodeId>/figma-reference.png'));
   ```
   Compare RGB values at the same coordinates in `figma-reference.png` vs `storybook-actual.png` to identify exact colour/position differences.

6. **Read `figma-get_design_context`** — for any panel or element with layout questions, call `figma-get_design_context` on the Figma node. The output includes Tailwind-style class names with exact pixel values (e.g. `w-[337px]`, `left-[0.07px]`, `py-[48px]`). These are the ground truth for layout values.

7. **Fix SCSS** — only ever edit `blocks/<block-name>/<block-name>.scss`, never the generated `.css`.

8. **Rebuild and re-compare**:
   ```bash
   npm run scss:build
   node tools/batch-figma-compare.mjs   # or single: npm run figma:compare -- --story-id=...
   ```

9. **Repeat until ≤ 2%** for each story. See known limits below.

### 2. Functionality (fix second)

Functionality means show/hide behaviour, interactive states, and per-viewport differences.

**What to check:**
- Are panels/drawers opening in the correct direction and at the correct size?
- Are elements visible at the correct breakpoints (e.g. hamburger only on mobile)?
- Are open/closed states applied correctly in the story?
- Does the mobile layout match the Figma at each mobile breakpoint?

**How to apply states in stories:**
Use `requestAnimationFrame` helpers in the story's `render` function to apply interactive states:
```js
requestAnimationFrame(() => applyL1OpenState(el, 0));       // desktop: open L1 panel
requestAnimationFrame(() => applyMobileL1OpenState(el, 0)); // mobile: open drawer + L1
requestAnimationFrame(() => applyPersonalBankOpenState(el)); // desktop: L1 + L2 open
```

### 3. Colors (fix last)

Only fix colors after layout and functionality are verified.

**How to audit colors:**
- Call `figma-get_design_context` — note hex values and any Figma variable names. Implement them as **SCSS/CSS variables** in `blocks/<block-name>/<block-name>.scss` or shared `styles/` partials. **If no variable exists for a Figma value, create one** instead of borrowing unrelated names.
- Use **`get_screenshot`** for overall color *appearance* vs Storybook; use **`get_design_context`** for exact hex/RGB values in SCSS (do not rely on eyedropper from raster alone).
- For any `var(--...)` used in the block, confirm it matches the current Figma node (re-read `get_design_context` after design updates).

---

## Known Limitations and Gotchas

### Scale difference (~0.65×)
Figma MCP exports screenshots at approximately 0.65× the node's actual pixel size. The compare tool scales Storybook screenshots down to match. This means:
- Thin borders (1px) may disappear after scaling → small irreducible mismatch (~2%)
- Font anti-aliasing differs between Figma's rasteriser and the browser at 0.65× scale
- Accept ~2% as the irreducible floor after all layout/functionality fixes

### Figma design state artifacts
Some Figma nodes show UI elements at `opacity: 0` (invisible) as a placeholder or variant state. If the reference shows blank white space where elements should be, check `figma-get_design_context` — elements with `opacity-0` in the Figma reference will always cause mismatch against a storybook that renders them visibly. This is not a CSS bug.

### Multi-state Figma frames (mobile)
Mobile Figma frames sometimes show multiple UI states stacked vertically within a single frame (e.g. default state at the top, drawer-open state at the bottom). A single Storybook story cannot match a multi-state frame. These nodes will have permanently high mismatch and should be treated as documentation, not comparison targets.

### Figma screenshot size variability
The Figma MCP `get_screenshot` tool returns screenshots at variable dimensions across calls (e.g. 1021×43 vs 1024×650 for the same desktop frame node). The compare tool handles this with a hybrid algorithm:
- **Extreme height difference (>5× ratio)**: scales each image proportionally to the smaller width, then crops the taller image to match the shorter image's proportional height. Prevents distorting a tall Figma frame into a few pixels to match a narrow Storybook viewport.
- **Similar heights (<5× ratio)**: legacy behavior — both images independently scaled to `min(w)×min(h)`. Used for mobile storyboard frames where both images have similar aspect ratios.

This means desktop 1584/1200px comparisons may show ~7-8% mismatch when the Figma MCP returns a full-frame screenshot (vs the ~1-2% achievable when it returns a cropped header-only screenshot). Re-running the comparison using the cached `figma-reference.png` (without `--figma-node-id`) will produce stable results without fetching a new screenshot.


At ≥992px, the L1 navigation panel is a **337px fixed-width side column** (`position: fixed; left: 0; width: 337px`), not full-width. The L2 sub-panel opens as a **second column** at `left: 337px; width: 338px`.

### Mobile drawer layout (Figma spec)
At <992px, the mobile navigation drawer is **full-screen** (`top: 0; width: 100vw; height: 100dvh`), covering the entire viewport including the header bar. Structure:
1. **Drawer header bar** (`height: 64px; background: #f3f4f6; justify-end`) — **close button only, no logo** — `px-[18px] py-[8px]`. There is NO logo in the mobile drawer header.
2. **Section pills row** — horizontal scrollable filter chips (`py-[24px] px-[18px]` at 375px, `px-[36px]` at 768px). Active: `bg-white border-2 border-text-body`. Inactive: `bg-white border-2 border-muted-soft`.
3. **L1 content** (`bg-[#f3f4f6] p-[24px]`) — nav items 18px semibold, `gap-[24px]` between items. No `.nav-l1-close` button on mobile.

**Figma mobile design (node 13261:11041 — "NAV L1 Sign in Collapsed"):**
- Full floating gradient overlay design (`nav-drawer-top`): `position: absolute; top: 0; h-[72px]; background: linear-gradient(#f3f4f6 65%, transparent)`
- Back button at x=24 (hidden at L1, `opacity-0`), visible when L2 open
- Close button at x=303
- Inner content: `padding-top: 72px; padding-bottom: 124px`
- Pills wrapper inside drawer: must have `flex: 0 0 auto` (override global `flex: 1 0 auto`) to prevent height collapse; explicit `background: #f3f4f6`
- Pill buttons: `font-size: 14px; line-height: 1` (Figma `leading-none`) — gives pill height 42px; if line-height inherits 1.5 the pill becomes 49px
- Active pill: border color from Figma (e.g. CSS variable with fallback hex from `get_design_context`)
- Sign-in slot: **hidden in drawer** (`.nav-drawer .nav-sign-in-slot { display: none }`); the floating sign-in design is implemented separately

**Flex layout debug tip for the pills wrapper:**
The global `.nav-l0-pills-wrapper` has `flex: 1 0 auto` (grows to fill parent) and `display: flex; align-items: stretch`. Inside the drawer flex-column, this causes the UL inside the wrapper to get `height: 0` (parent_height - padding = 0), which centers pills at the UL's position rather than inside the padding. Fix: add `flex: 0 0 auto` in the `.nav-drawer .nav-l0-pills-wrapper` override.

### CSS variables and Figma
Define and update variables from **Figma** (`get_design_context`). Inspect computed styles in the browser if needed. If the design adds a new color or spacing scale value, **add** the corresponding variable in SCSS — do not assume an external token dictionary.

### SCSS pipeline rule
Never edit `.css` files — they are regenerated from `.scss`. All fixes must be in `blocks/<block-name>/<block-name>.scss`, then run `npm run scss:build`.

---

## Output Summary

Provide a concise summary containing:

1. Figma links reviewed and **requirement screenshot files** (`docs/requirements/<block-name>/figma/`) checked against Storybook.
2. Final mismatch % per story group (from `figma:compare` / batch tooling).
3. Key layout/functionality/color fixes applied, including any updates to saved requirement screenshots when the Figma source changed.
4. Any remaining open questions or known-limitation mismatches.
