# UE Field Type Cookbook

Use these snippets as starting points when building block models.

## text

```json
{
  "component": "text",
  "name": "heading",
  "label": "Heading",
  "valueType": "string",
  "required": true,
  "validation": {
    "minLength": 1,
    "maxLength": 60,
    "pattern": "^[^\\s].*$",
    "customErrorMsg": "Heading is required and must be between 1 and 60 characters"
  }
}
```

Source pattern: [reference/action-card.json](reference/action-card.json)

## textarea

```json
{
  "component": "textarea",
  "name": "summary",
  "label": "Summary",
  "valueType": "string"
}
```

## richtext

```json
{
  "component": "richtext",
  "name": "description",
  "label": "Description",
  "valueType": "string"
}
```

Source pattern: [reference/cards.json](reference/cards.json)

## reference (image/asset picker)

```json
{
  "component": "reference",
  "name": "image",
  "label": "Image",
  "valueType": "string",
  "required": true
}
```

Source pattern: [reference/action-card.json](reference/action-card.json)

## aem-content (page/content/link picker)

```json
{
  "component": "aem-content",
  "name": "supporting-link-url",
  "label": "Hyperlink",
  "description": "Provide navigation URL",
  "valueType": "string",
  "validation": {
    "rootPath": "/content"
  }
}
```

Source pattern: [reference/action-card.json](reference/action-card.json)

## select

```json
{
  "component": "select",
  "name": "classes",
  "label": "Mode",
  "options": [
    { "name": "Light", "value": "" },
    { "name": "Dark", "value": "dark" }
  ]
}
```

Source pattern: all reviewed blocks

## multiselect

```json
{
  "component": "multiselect",
  "name": "icon",
  "label": "Icon",
  "valueType": "string",
  "options": [
    { "name": "None", "value": "" },
    { "...": "./_filled-icons.json" }
  ]
}
```

Source pattern: [reference/tap-tiles.json](reference/tap-tiles.json)

Icon guidance:

- When requirements mention icons, use this manifest-backed picker pattern.
- Prefer generated options from the icon manifest. In this skill bundle, use [reference/_filled-icons.json](reference/_filled-icons.json). In this repo, `build:json` merges `../../models/generated/_filled-icons.json` relative to each `blocks/<name>/_<name>.json`.
- Additional source patterns: [reference/feature-list.json](reference/feature-list.json), [reference/information-panel.json](reference/information-panel.json), [reference/tab.json](reference/tab.json).

## boolean

```json
{
  "component": "boolean",
  "name": "show-cta",
  "label": "Show CTA",
  "valueType": "boolean"
}
```

Source pattern: [reference/cards.json](reference/cards.json)

## number

```json
{
  "component": "number",
  "name": "max-items",
  "label": "Maximum Items",
  "valueType": "number",
  "validation": {
    "numberMin": 1,
    "numberMax": 12,
    "customErrorMsg": "Maximum items must be between 1 and 12"
  }
}
```

## radio-group

```json
{
  "component": "radio-group",
  "name": "layout",
  "label": "Layout",
  "valueType": "string",
  "options": [
    { "name": "Stacked", "value": "stacked" },
    { "name": "Split", "value": "split" }
  ]
}
```

## checkbox-group

```json
{
  "component": "checkbox-group",
  "name": "feature-flags",
  "label": "Feature Flags",
  "valueType": "string[]",
  "options": [
    { "name": "Show Badge", "value": "show-badge" },
    { "name": "Show Icon", "value": "show-icon" }
  ]
}
```

## date-time

```json
{
  "component": "date-time",
  "name": "expiry-date",
  "label": "Expiry Date",
  "valueType": "date",
  "displayFormat": "YYYY-MM-DD",
  "valueFormat": "YYYY-MM-DD"
}
```

## tab

```json
[
  { "component": "tab", "name": "content-tab", "label": "Content" },
  { "component": "text", "name": "heading", "label": "Heading", "valueType": "string" },
  { "component": "tab", "name": "settings-tab", "label": "Settings" },
  { "component": "select", "name": "classes", "label": "Mode", "options": [
    { "name": "Light", "value": "" },
    { "name": "Dark", "value": "dark" }
  ] }
]
```

## container

```json
{
  "component": "container",
  "name": "metadata",
  "label": "Metadata",
  "collapsible": true,
  "fields": [
    { "component": "text", "name": "eyebrow", "label": "Eyebrow", "valueType": "string" },
    { "component": "text", "name": "caption", "label": "Caption", "valueType": "string" }
  ]
}
```

## aem-tag

```json
{
  "component": "aem-tag",
  "name": "cq:tags",
  "label": "Tags",
  "valueType": "string"
}
```

## aem-content-fragment

```json
{
  "component": "aem-content-fragment",
  "name": "content-fragment",
  "label": "Content Fragment",
  "valueType": "string",
  "variationName": "contentFragmentVariation",
  "validation": {
    "rootPath": "/content/dam"
  }
}
```

## aem-experience-fragment

```json
{
  "component": "aem-experience-fragment",
  "name": "experience-fragment",
  "label": "Experience Fragment",
  "valueType": "string",
  "variationName": "experienceFragmentVariation",
  "validation": {
    "rootPath": "/content/experience-fragments"
  }
}
```

## Authoring Notes

- Prefer `text` for strict plain strings; use `richtext` where inline markup is required.
- Use `reference` for assets/images and `aem-content` for broader resource linking.
- Use `name: "classes"` for mode/variant class assignment.
- In plugin-backed UE schemas, avoid underscores in field names.
