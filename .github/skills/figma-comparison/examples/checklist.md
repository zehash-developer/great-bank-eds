# Figma Comparison Checklist

Use this checklist when running the Figma → Storybook comparison workflow for a block.

## Setup

- [ ] Figma MCP is running (check `http://127.0.0.1:3845/mcp` is reachable)
- [ ] Storybook is running on `http://localhost:6006`
- [ ] `FigmaMatch` story exists with `layout: 'fullscreen'` and container override
- [ ] Block images saved to `images/<block-name>-*.png` and referenced via `/filename.png` in mocks
- [ ] `images/` folder is in `.storybook/main.js` `staticDirs` and in `.gitignore`
- [ ] All SCSS edits are in `blocks/<name>/<name>.scss` (NOT the generated `.css` file)

## Token Audit (via `get_design_context`)

- [ ] Background color matches correct token (e.g. `--background-pale-faint`)
- [ ] Active/primary color token correct (`--surface-primary` / `--text-primary` for active states only)
- [ ] Inactive/muted colors use muted tokens (not `--surface-primary`)
- [ ] Heading font-size matches Figma (override `.block-heading` global if needed)
- [ ] Body/description font-size explicit at `1rem` if 16px is required (global body is 18px)
- [ ] Line-heights match Figma values
- [ ] All gap/padding/margin values match Figma spacing (convert px → `spacing(N)` where N = px ÷ 6)
- [ ] Border-radius values match Figma
- [ ] Icon sizes match Figma (typically 24×24px)

## Layout Audit (via screenshot comparison)

- [ ] Run `npm run figma:compare` — baseline mismatch recorded
- [ ] Open `tools/compare-output/composite.png` — red areas identified
- [ ] Structural issues resolved (element positions, widths, heights)
- [ ] CTA / footer sections render outside accordion/list if that's how Figma shows them
- [ ] Image dimensions and `object-fit` match Figma (check `height`, `object-fit: contain` vs `cover`)
- [ ] Content alignment matches Figma (`align-items: center` vs `stretch` etc.)
- [ ] Storybook container override working (no `max-width: 1200px` clipping the story)
- [ ] Mismatch ≤ 2% (remaining diff is font anti-aliasing at scale difference — acceptable)

## SCSS Pipeline

- [ ] `npm run scss:build` run after all SCSS changes
- [ ] No edits made directly to `.css` files
- [ ] Storybook restarted if `staticDirs` was changed in `main.js`
