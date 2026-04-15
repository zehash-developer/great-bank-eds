# SCSS Styling Checklist

- Align spacing and colors with **Figma** (`get_design_context`) and requirements.
- Use `spacing()` where it matches Figma px; otherwise use `rem`/`px` from the spec.
- Expose repeated values as `var(--...)` in block or shared SCSS; **define new variables** when Figma introduces a value not yet modeled.
- Keep selectors scoped under the block class.
- Follow mobile-first breakpoint usage.
- Verify focus states and contrast remain compliant.
- **List markers**: Check the Figma design for any `<ul>` or `<li>` elements. Figma designs typically omit bullet dots. If the design shows no markers, suppress them with `list-style: none` and `padding: 0` on the `ul`/`ol`, and add `list-style: none` (or `content: none`) on `li::before` / `li::after` if any global styles inject pseudo-element dots. Never assume browser-default list styling matches the design.
