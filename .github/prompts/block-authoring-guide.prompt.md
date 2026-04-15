---
name: block-authoring-guide
description: Generate a markdown authoring guide for an EDS block based on its _block.json model and Universal Editor conventions
argument-hint: 'block-name'
---

Follow all rules in `/agents.md` and `.github/instructions/copilot-instructions.md`.
If there is any conflict, `/agents.md` wins.

Use this prompt as:

`block-authoring-guide <block-name>`

## Required References

Before generating, you MUST read and apply conventions from these skill files. Open each file and use its content to inform the output:

1. [Universal Editor Skill](../skills/universal-editor/SKILL.md) — field types, patterns, conditional rendering, and block composition
2. [Field Type Cookbook](../skills/universal-editor/examples/field-type-cookbook.md) — canonical snippets and authoring notes per field type
3. [Conditional Rendering Cookbook](../skills/universal-editor/examples/conditional-rendering-cookbook.md) — condition patterns and rules

Do NOT skip reading these files — the field type mapping, condition syntax, and composition pattern rules all come from them.

## Objective

Read the block model JSON at `blocks/<block-name>/_<block-name>.json` and generate a clear, author-friendly markdown guide at `blocks/<block-name>/<block-name>-authoring-guide.md` (always lowercase kebab-case) that explains how to configure the block in the Universal Editor.

## Steps

### 1. Read the block sources

Open and read the following files from `blocks/<block-name>/`:

1. **`_<block-name>.json`** (required) — the UE model containing three sections:
   - **definitions** — the block and block-item component definitions (resource types, templates)
   - **models** — the field schemas for the block and its items
   - **filters** — rules for which child components are allowed and min/max counts
2. **`<block-name>.js`** (if present) — the block's JavaScript implementation. Skim the `decorate()`, `extractData()`, and `renderHTML()` functions to understand the block's runtime behavior (e.g. expand/collapse, keyboard navigation, carousel integration).
3. **`<block-name>.stories.js`** (if present) — Storybook stories. Review story names and mock variations to understand supported visual states and authoring scenarios.

If `_<block-name>.json` does not exist, **stop and tell the user**. The `.js` and `.stories.js` files are optional — use them when available to enrich the overview.

### 2. Identify the block composition pattern

Using the [Universal Editor Skill](../skills/universal-editor/SKILL.md) pattern selection rules, determine which pattern the block uses and note it in the overview:

- **Nested child components** — block-items contain freeform authored content via child component filters (e.g. accordion, where items accept text, image, button children)
- **Single-level item modeling** — block-items are fully described by fixed fields with no nested children (e.g. action-card)

### 3. Generate `blocks/<block-name>/<block-name>-authoring-guide.md`

**File naming rule:** The output filename MUST be all lowercase kebab-case — e.g. `accordion-authoring-guide.md`, never `ACCORDION-AUTHORING-GUIDE.md` or `Accordion-Authoring-Guide.md`.

Before writing, check for an existing file with different casing. On Windows, a direct rename between cases silently fails. Use a **two-step rename** via a temp name:

```
Rename-Item "<old-cased-file>" "<block-name>-authoring-guide.tmp.md"
Rename-Item "<block-name>-authoring-guide.tmp.md" "<block-name>-authoring-guide.md"
```

If no existing file is found, create the file directly with the lowercase name.

Create (or overwrite) a markdown file with the following structure:

---

#### Header

```markdown
# <Block Title> — Authoring Guide

> Auto-generated from `_<block-name>.json`. Do not edit manually — re-run
> `block-authoring-guide <block-name>` to regenerate.
```

#### Overview section

Write 3–5 sentences describing:

- What the block does and how it behaves (based on the JSON definition, the JS implementation, and the Storybook story variants)
- Key interactions or behaviors observed in the JS (e.g. expand/collapse, keyboard navigation, carousel scrolling, lazy loading)
- Which **composition pattern** it uses (nested children or single-level items)
- How many items can be added (from filter min/max if present)
- Which visual variants are available (from story names and the `classes`/`type` fields)

#### Block-level settings section

For each field in the **block-level model** (the model whose `id` matches the block name), document using a table:

| Column          | Source                                                 |
| --------------- | ------------------------------------------------------ |
| **Field**       | `field.label`                                          |
| **Type**        | Human-readable UE field type (see mapping below)       |
| **Required**    | `field.required` (Yes / No)                            |
| **Default**     | `field.default` or `field.value` if set, otherwise "—" |
| **Description** | `field.description`                                    |

##### UE field type mapping

Use these human-readable descriptions based on the [Field Type Cookbook](../skills/universal-editor/examples/field-type-cookbook.md):

| `component` value         | Display as                           |
| ------------------------- | ------------------------------------ |
| `text`                    | Text input                           |
| `textarea`                | Multi-line text                      |
| `richtext`                | Rich text editor                     |
| `reference`               | Asset / image picker                 |
| `aem-content`             | Content / link picker                |
| `select`                  | Dropdown select                      |
| `multiselect`             | Multi-select picker                  |
| `boolean`                 | Toggle (Yes/No)                      |
| `number`                  | Number input                         |
| `radio-group`             | Radio button group                   |
| `checkbox-group`          | Checkbox group                       |
| `date-time`               | Date/time picker                     |
| `tab`                     | _(Tab separator — see Tabs section)_ |
| `container`               | Field group (collapsible)            |
| `aem-tag`                 | AEM tag picker                       |
| `aem-content-fragment`    | Content Fragment picker              |
| `aem-experience-fragment` | Experience Fragment picker           |

##### Select / multiselect options

If the field is a `select` or `multiselect`, add a sub-section listing all options:

```markdown
**Options:**
| Label | Value |
|---|---|
| <option.name> | `<option.value>` |
```

If options reference an external manifest (e.g. `"...": "../../models/generated/_filled-icons.json"`), note that options are dynamically loaded from the icon manifest and link to the source.

##### Validation rules

If the field has `validation`, document each rule in a list:

- **Min length:** `validation.minLength`
- **Max length:** `validation.maxLength`
- **Pattern:** `validation.pattern` (explain in plain English what the pattern enforces)
- **Number min/max:** `validation.numberMin` / `validation.numberMax`
- **Root path:** `validation.rootPath` (for `reference` and `aem-content` fields)
- **Error message:** `validation.customErrorMsg`

##### Conditional visibility

If the field has a `condition`, document it using the patterns from the [Conditional Rendering Cookbook](../skills/universal-editor/examples/conditional-rendering-cookbook.md):

```markdown
> **Visible when:** `<controlling-field-label>` is set to `<value>`.
```

For multi-condition fields (`and`/`or`), list all conditions:

```markdown
> **Visible when ALL of:**
>
> - `<field-1-label>` is `<value>`
> - `<field-2-label>` is `<value>`
```

#### Tabs section (if present)

If any fields use `component: "tab"`, document the tab structure:

```markdown
## Editor Tabs

The authoring panel is organized into the following tabs:

| Tab         | Fields                                          |
| ----------- | ----------------------------------------------- |
| <tab.label> | <comma-separated list of fields under this tab> |
```

#### Containers section (if present)

If any fields use `component: "container"`, document the grouped fields:

```markdown
### <container.label>

_Collapsible: Yes/No_

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| ...   | ...  | ...      | ...         |
```

#### Block-item settings section

For each **block-item model** (models whose `id` contains `-item` or is referenced by a block-item definition), repeat the same field documentation as above under a sub-heading:

```markdown
## <Item Title> Fields
```

Include the same detail: field table, select options, validation, conditions, tabs, and containers.

#### Block Structure, Filtering & Nesting section

This section documents the full authoring hierarchy. Parse it from the `definitions` and `filters` arrays in the JSON file. EDS blocks follow a tiered structure:

```
Block (parent container)
  └── Block Item (repeated child)
        └── (Optional) Nested content components
```

##### Step A — Document the definition hierarchy

List each definition and its role. Show the mapping between definitions, models, and filters:

```markdown
## Block Structure

| Definition              | Role            | Model            | Filter            |
| ----------------------- | --------------- | ---------------- | ----------------- |
| <definition.title>      | Parent block    | <template.model> | <template.filter> |
| <item-definition.title> | Repeatable item | <template.model> | <template.filter> |
```

Explain the relationship: the parent block contains items, and each item is configured via its own model fields.

##### Step B — Document parent-level filters (what items go inside the block)

For each filter whose `id` matches the block name, document:

```markdown
## Items Inside This Block

The **<block-title>** block accepts the following items:

| Allowed Item                            | Min                 | Max                 |
| --------------------------------------- | ------------------- | ------------------- |
| <component name from filter.components> | <filter.min or "—"> | <filter.max or "—"> |
```

If `minErrorMsg` or `maxErrorMsg` is provided, include them:

```markdown
> **Minimum:** <minErrorMsg>
> **Maximum:** <maxErrorMsg>
```

Explain in plain English what this means for the author, e.g.:

- "You must add at least 1 and at most 15 Accordion Items to an Accordion block."

##### Step C — Document item-level filters (what content goes inside each item)

For each filter whose `id` matches a block-item name (e.g. `accordion-item`), document the nested content components:

```markdown
## Content Inside Each <Item Title>

Authors can add the following content types inside each **<Item Title>**:

| Allowed Content Type |
| -------------------- |
| <component name>     |
```

If the filter's `components` array is **empty or missing**, state:

```markdown
> This item does not accept nested content. All item content is configured through the item fields above.
```

This is the key distinction between the two composition patterns:

- **Nested child components** — the item filter lists content types (text, image, button, etc.) that authors can freely add inside each item
- **Single-level items** — the item filter has no components, meaning all content comes from the item's model fields

##### Step D — Document cross-block embedding filters (if present)

Some blocks define filters that reference other block contexts, allowing the block to be nested inside other blocks' items. For each filter whose `id` does NOT match the current block or its items (e.g. a `columns-content` or `accordion-item` filter defined in a different block's JSON):

```markdown
## Cross-Block Embedding

This block can be placed inside other blocks:

| Target Context                       | This block appears as                          |
| ------------------------------------ | ---------------------------------------------- |
| <filter.id> (e.g. `accordion-item`)  | <block-title> can be nested inside <filter.id> |
| <filter.id> (e.g. `columns-content`) | <block-title> can be nested inside <filter.id> |
```

Explain that these filters **merge by ID** at runtime — if multiple block JSON files define the same filter ID, all their allowed components are combined.

If no cross-block filters exist, omit this section.

##### Step E — Document the complete nesting tree

Provide a visual tree diagram showing the full authoring hierarchy:

```markdown
## Nesting Overview

\`\`\`
<Block Title>
├── <Item Title> (×<min>–<max>)
│ ├── <Nested content type 1>
│ ├── <Nested content type 2>
│ └── ...
└── <Item Title> (×<min>–<max>)
└── ...
\`\`\`
```

For single-level blocks (no nested content):

```markdown
## Nesting Overview

\`\`\`
<Block Title>
├── <Item Title> (×<min>–<max>) — configured via fields only
└── <Item Title> (×<min>–<max>) — configured via fields only
\`\`\`
```

#### Authoring tips section

Add a practical tips section covering:

- **Required fields** — list all required fields by name so authors know what must be filled
- **Character limits** — summarize any minLength/maxLength constraints
- **Visual variants** — note which fields control appearance (e.g. `classes` field for dark/light mode, `type` field for background styles)
- **Conditional fields** — summarize which fields are hidden by default and what triggers them to appear
- **Icon fields** — if any field uses a manifest-backed multiselect for icons, note that icons are selected from a pre-defined list and cannot be entered as free text
- **Content guidelines** — note any `richtext` fields where authors can use inline markup vs `text` fields for plain strings only
- **Item count limits** — remind authors of min/max item constraints and the error messages they will see if violated
- **Nesting rules** — summarize what content types can be added inside each item, or clarify that items are field-only with no nested content
- **Cross-block usage** — if the block can be embedded inside other blocks (via cross-block filters), note where it can be placed

---

### 4. Confirm output

After writing the file, confirm to the user:

- The path of the generated file
- The composition pattern identified (nested children or single-level)
- A summary of how many block-level fields, item-level fields, conditional fields, and filters were documented
- The nesting tree (block → items → nested content types)
- Any cross-block embedding filters found
