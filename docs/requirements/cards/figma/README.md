# Cards — Figma Screenshot Inventory

**Figma file:** `WXBZsxyNrHkyGDg0FWIS1g` — Great Bank Design Files

---

## Light mode — node `17:6`

Three card variants side-by-side: Transaction Account (2 CTAs), Home Loans (1 CTA), Credit Cards (1 CTA).

![Cards light mode](light-mode.png)

**Key observations:**
- White card backgrounds (`#ffffff`) on a light frame
- Gold-tinted icon containers (`rgba(212,175,55,0.1)`)
- Navy pill badges with gold-tinted background
- Gold subtitle text (`#d4af37`)
- Muted grey description text (`#4a5565`)
- Navy primary button (`#002855`); navy outline button for second CTA

---

## Dark mode — node `22:372`

Same three cards rendered in dark theme.

![Cards dark mode](dark-mode.png)

**Key observations:**
- Dark card backgrounds (`#111827`) with `#334155` borders
- Gold-light tinted icon containers (`rgba(232,201,104,0.1)`)
- Gold-light (`#e8c968`) pill badge text on matching tinted background
- Near-white title text (`#f1f5f9`)
- Gold-light subtitle text (`#e8c968`)
- Slate description text (`#94a3b8`)
- Gold-light primary button (`#e8c968`) with near-black text (`#0a0f1a`) — inverted vs light mode
- Gold-light outline button border and text

---

## Differences between light and dark

| Element | Light | Dark |
|---------|-------|------|
| Card background | `#ffffff` | `#111827` |
| Card border | `#e5e7eb` | `#334155` |
| Icon container tint | `rgba(212,175,55,0.1)` | `rgba(232,201,104,0.1)` |
| Badge text | `#002855` | `#e8c968` |
| Title text | `#101828` | `#f1f5f9` |
| Subtitle text | `#d4af37` | `#e8c968` |
| Description text | `#4a5565` | `#94a3b8` |
| Primary button bg | `#002855` | `#e8c968` |
| Primary button text | `#ffffff` | `#0a0f1a` |
| Outline button border | `#002855` | `#e8c968` |
| Outline button text | `#002855` | `#e8c968` |

---

## Screenshot capture instructions

To regenerate screenshots for comparison:

1. Run `npm run storybook` and navigate to the Cards stories.
2. Use the Figma MCP tool `get_screenshot` with:
   - fileKey: `WXBZsxyNrHkyGDg0FWIS1g`
   - nodeId: `17:6` (light) or `22:372` (dark)
3. Run `npm run figma:compare` after implementation for automated diff.
