# Pattern: Block With Item Children (Accordion Style)

Use this when each item can contain nested authored components (for example text, image, button, card).

## Structure

- Block extracts block-level fields and item rows.
- Render creates item shells.
- Decorate moves authored markup and UE instrumentation into the new shell.
- Item container attributes are set so UE can insert nested child components.

## Key Implementation Notes

1. Keep authored row references during extraction so instrumentation can be moved later.
2. After rendering, call `moveInstrumentation(authoredRow, renderedItem)` per item.
3. Move authored title/content nodes into rendered targets and preserve instrumentation.
4. Mark item wrappers as UE containers and attach item filter.
5. If needed, move author-added direct children into an inner content target after render.

## Minimal Pseudocode

```javascript
const data = extractData(block); // includes data.items[n].row
block.innerHTML = renderHTML(data);

const renderedItems = [...block.querySelectorAll('.accordion-item')];
renderedItems.forEach((item, index) => {
  const authoredRow = data.items[index]?.row;
  if (!authoredRow) return;

  moveInstrumentation(authoredRow, item);
  // Move authored title/content markup into rendered targets.
  // Move instrumentation from authored cells to rendered title/content nodes.
});

setContainerOnItems(renderedItems, 'accordion-item');
```

Reference: [reference/accordion.js](reference/accordion.js)
