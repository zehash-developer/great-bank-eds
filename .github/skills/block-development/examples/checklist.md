# Block Development Checklist

- Use required lifecycle: `extractData()` -> `renderHTML()` -> `decorate()`.
- Keep DOM mutation inside `decorate()` only.
- Scope event listeners to the block root.
- Preserve UE instrumentation when moving nodes.
- Keep optional fields resilient in extraction and rendering.
- Confirm no side effects outside the block boundary.
- **List markers**: When the block renders any `<ul>` or `<li>`, check the Figma design (`get_screenshot` / `get_design_context`). Figma designs almost never show bullet dots. If absent, the block SCSS must set `list-style: none; padding: 0; margin: 0` on the list and ensure no `li::after` or `li::before` pseudo-element dots leak in from global styles.
