# Block Development Checklist

- Use required lifecycle: `extractData()` -> `renderHTML()` -> `decorate()`.
- Keep DOM mutation inside `decorate()` only.
- Scope event listeners to the block root.
- Preserve UE instrumentation when moving nodes.
- Keep optional fields resilient in extraction and rendering.
- Confirm no side effects outside the block boundary.
