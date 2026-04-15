# Conditional Rendering Cookbook

Use `condition` on dependent fields so authors only see relevant inputs.

## Pattern 1: Boolean toggle controls related fields

```json
{
  "component": "boolean",
  "name": "show-cta",
  "label": "Show CTA",
  "valueType": "boolean"
},
{
  "component": "text",
  "name": "cta1-label",
  "label": "CTA 1 Label",
  "valueType": "string",
  "condition": {
    "==": [{ "var": "show-cta" }, true]
  }
}
```

Source pattern: [reference/cards.json](reference/cards.json)

## Pattern 2: Select controls component type branch

```json
{
  "component": "select",
  "name": "card-image-type",
  "label": "Card Image Type",
  "options": [
    { "name": "Image", "value": "image" },
    { "name": "Pictogram", "value": "pictogram" }
  ]
},
{
  "component": "reference",
  "name": "image",
  "label": "Image",
  "condition": {
    "===": [{ "var": "card-image-type" }, "image"]
  }
},
{
  "component": "text",
  "name": "pictogram",
  "label": "Pictogram",
  "condition": {
    "===": [{ "var": "card-image-type" }, "pictogram"]
  }
}
```

Source pattern: [reference/cards.json](reference/cards.json)

## Pattern 3: Optional second section

```json
{
  "component": "boolean",
  "name": "show-second-rate",
  "label": "Show Second Rate",
  "value": false
},
{
  "component": "text",
  "name": "rate-2",
  "label": "Rate 2",
  "condition": {
    "===": [{ "var": "show-second-rate" }, true]
  }
}
```

Source pattern: [reference/big-numbers.json](reference/big-numbers.json)

## Pattern 4: Multi-condition dependency with and

```json
{
  "component": "text",
  "name": "secondary-cta-label",
  "label": "Secondary CTA Label",
  "condition": {
    "and": [
      { "===": [{ "var": "show-cta" }, true] },
      { "===": [{ "var": "type" }, "white" ] }
    ]
  }
}
```

## Pattern 5: Alternative branches with or

```json
{
  "component": "richtext",
  "name": "legal-copy",
  "label": "Legal Copy",
  "condition": {
    "or": [
      { "===": [{ "var": "type" }, "Tabs"] },
      { "===": [{ "var": "classes" }, "dark"] }
    ]
  }
}
```

## Rules

- Define controlling fields before dependent fields.
- Keep condition expressions simple and readable.
- Match operator style consistently (`==` or `===`) in a file.
- Combine conditions only when a business rule truly requires it.
- Provide clear labels/descriptions so hidden fields are understandable when shown.
