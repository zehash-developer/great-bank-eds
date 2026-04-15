# SCSS Styling Checklist

- Align spacing and colors with **Figma** (`get_design_context`) and requirements.
- Use `spacing()` where it matches Figma px; otherwise use `rem`/`px` from the spec.
- Expose repeated values as `var(--...)` in block or shared SCSS; **define new variables** when Figma introduces a value not yet modeled.
- Keep selectors scoped under the block class.
- Follow mobile-first breakpoint usage.
- Verify focus states and contrast remain compliant.
