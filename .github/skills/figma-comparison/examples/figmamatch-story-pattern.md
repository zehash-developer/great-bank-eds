# FigmaMatch Story Pattern

Every block that goes through the Figma comparison workflow needs a dedicated `FigmaMatch` story. This story:

- Renders at the **exact viewport** of the Figma frame (typically 1584×886)
- Removes the Storybook container's `max-width: 1200px` and `padding: 24px` constraints
- Uses mock data that exactly matches the Figma content (same text, same images, same variants)

## Story File Addition

In `blocks/<name>/<name>.stories.js`, add alongside your other exports:

```js
import { figmaMatch } from './<name>.mocks.js';

export const FigmaMatch = {
  args: figmaMatch,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (story, context) => {
      // Override the global storybook-container that adds max-width: 1200px / padding: 24px.
      // The container is created by the outer decorator before this story mounts, so
      // requestAnimationFrame fires after DOM insertion and catches it reliably.
      requestAnimationFrame(() => {
        const container = document.querySelector('.storybook-container');
        if (container) container.style.cssText = 'padding: 0; max-width: none; margin: 0;';
      });
      return story(context);
    },
  ],
};
```

## Mock File Addition

In `blocks/<name>/<name>.mocks.js`, add a `figmaMatch` export that mirrors the Figma content exactly:

```js
export const figmaMatch = {
  // Mirror the exact heading, labels, descriptions, and variants shown in Figma.
  // Use local image paths (saved to images/ folder) — NOT ephemeral MCP URLs.
  heading: 'Exact heading from Figma',
  imageSrc: '/block-name-promo.png',   // served from images/ via Storybook staticDirs
  // ... all other fields matching Figma content
};
```

## Downloading Figma Images

When a Figma node contains images:

1. Call `figma-get_screenshot` on the image node to warm the MCP asset cache.
2. Fetch `http://localhost:3845/assets/<hash>.<ext>` and save to `images/<block-name>-<descriptor>.png`.
3. Confirm `images/` is in `.storybook/main.js` `staticDirs` (requires Storybook restart).
4. Reference in mocks as `/<block-name>-<descriptor>.png`.

```js
// .storybook/main.js — ensure this is present
staticDirs: ['../public', '../icons', '../images'],
```

```
# .gitignore — ensure this is present
/images/*
```

## Running the Comparison

With Storybook running on port 6006:

```bash
# Story ID format: blocks-<name>--figma-match (auto-generated from export name FigmaMatch)
npm run figma:compare -- \
  --story-id=blocks-<name>--figma-match \
  --figma-node-id=<figma-node-id> \
  --viewport-width=1584 \
  --viewport-height=886
```

Output is written to `tools/compare-output/`:
- `composite.png` — Figma | Storybook | Diff side-by-side (open this first)
- `diff.png` — red pixels = layout mismatch, orange = anti-aliasing
- `figma-reference.png` — cached; omit `--figma-node-id` on subsequent runs to reuse it

## Interpreting Results

| Mismatch % | Meaning |
|---|---|
| 0% | Pixel-perfect (rarely achieved due to font rendering) |
| < 2% | Acceptable — remaining diff is font anti-aliasing at different render scales |
| 2–5% | Minor layout issues — check dot positions, gaps, padding, image sizing |
| > 5% | Structural issues — check element structure, missing containers, wrong tokens |

Red areas in `diff.png` that cluster around:
- **Text lines** → font size, line-height, or font-family mismatch (audit via `get_design_context`)
- **Edges of containers** → padding, margin, or gap mismatch
- **Right column empty** → image not loading (check `images/` folder and `staticDirs`)
- **Horizontal offset** → connector/dot alignment, margin-left values
