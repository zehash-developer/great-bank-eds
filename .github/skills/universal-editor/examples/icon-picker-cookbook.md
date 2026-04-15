# UE Icon Picker Cookbook

Use these patterns when a requirement mentions icons, pictograms, or tab/feature icons.

## Preferred Pattern: Picker-Backed Icon Selection

Use a manifest-backed `multiselect` field for icon selection.

```json
{
  "component": "multiselect",
  "name": "icon",
  "value": "",
  "label": "Icon",
  "valueType": "string",
  "description": "Select a GEL filled icon for this item",
  "required": true,
  "options": [
    { "...": "./_filled-icons.json" }
  ]
}
```

Source patterns:

- [reference/feature-list.json](reference/feature-list.json)
- [reference/information-panel.json](reference/information-panel.json)
- [reference/tab.json](reference/tab.json)
- [reference/tap-tiles.json](reference/tap-tiles.json)

## Conditional Icon Field (Variant-Driven)

Use conditional rendering if only specific variants should expose an icon.

```json
{
  "component": "multiselect",
  "name": "icon",
  "value": "",
  "label": "Icon",
  "valueType": "string",
  "options": [
    { "...": "./_filled-icons.json" }
  ],
  "condition": {
    "or": [
      { "===": [{ "var": "classes" }, "white-with-icons"] },
      { "===": [{ "var": "classes" }, "grey-with-icons"] }
    ]
  }
}
```

Related source pattern:

- [reference/tab.json](reference/tab.json) (with-icons variants)

## Legacy Pattern: Free-Text Icon Name

Some existing blocks use free-text for icon/pictogram names:

```json
{
  "component": "text",
  "name": "pictogram",
  "label": "Pictogram (Icon)",
  "valueType": "string"
}
```

Source pattern:

- [reference/cards.json](reference/cards.json)

Prefer the picker-backed pattern for new implementations.

## Implementation Notes

- Keep `name` aligned with block JS expectations (commonly `icon` or `pictogram`).
- Reuse generated icon models: [reference/_filled-icons.json](reference/_filled-icons.json) ships with this skill; in the Westpac app they are produced under `models/generated/` at build time.
- If icon is optional, set `required` to `false` and keep the empty default value.
- If icon visibility depends on another field, model with JsonLogic `condition`.
