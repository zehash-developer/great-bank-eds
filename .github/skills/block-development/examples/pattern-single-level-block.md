# Pattern: Single-Level Block Items (Action Card Style)

Use this when each item is fully represented by fixed fields and does not host nested child components.

## Structure

- Block extracts block-level fields and item rows.
- Render builds complete item markup from extracted values.
- Decorate moves instrumentation from authored rows to rendered items.
- No container setup for nested child insertion inside each item.

## Key Implementation Notes

1. Keep authored row references in extracted item objects.
2. Render full item markup from item field values (text, richtext, image, URL).
3. After render, map rendered items by index and call `moveInstrumentation`.
4. Bind interactions and initialize behavior only after render.

## Minimal Pseudocode

```javascript
const data = extractData(block); // includes data.items[n].row
block.innerHTML = renderHTML(data);

const renderedItems = block.querySelectorAll('.action-card-item');
data.items.forEach((item, index) => {
  if (renderedItems[index] && item.row) {
    moveInstrumentation(item.row, renderedItems[index]);
  }
});
```

Reference: [reference/action-card.js](reference/action-card.js)
