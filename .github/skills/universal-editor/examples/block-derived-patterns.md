# Block-Derived UE Patterns

These patterns are extracted from repo implementations. Full JSON snapshots live in [reference/](reference/) (same content as `blocks/<name>/_<name>.json` in the app repo).

## Accordion ([reference/accordion.json](reference/accordion.json))

- Pattern: block + block-item with nested authorable content.
- Field highlights:
  - `text` for heading/title.
  - `richtext` for panel content.
  - `select` for `classes` mode.
- Filter highlights:
  - Parent filter enforces min/max item counts.
  - Item filter allows nested components (`text`, `image`, `button`, `title`, `card`).

## Cards ([reference/cards.json](reference/cards.json))

- Pattern: block + item with fixed fields and strong conditional authoring.
- Field highlights:
  - `select` (`type`, `card-image-type`, `cta variant`).
  - `text` with validation constraints.
  - `richtext` for descriptions.
  - `reference` for image.
  - `aem-content` for CTA URLs.
  - `boolean` for toggling CTA section.
- Conditional highlights:
  - Branching between image and pictogram fields.
  - CTA subfields shown only when `show-cta` is true.

## Action Card ([reference/action-card.json](reference/action-card.json))

- Pattern: block + item where item is single-level (no nested child components).
- Field highlights:
  - `aem-content` for supporting link URL.
  - `reference` for required image.
  - `text` and `richtext` with validation.
  - `select` for `type`, `card-type`, and `classes`.
- Filter highlights:
  - Parent filter with min/max.
  - Item filter empty (`components: []`).

## Tap Tiles ([reference/tap-tiles.json](reference/tap-tiles.json))

- Pattern: block + item for icon-linked tiles.
- Field highlights:
  - `multiselect` for icon manifest integration.
  - `aem-content` for link destination.
  - `select` for block type and `classes` mode.
- Filter highlights:
  - Parent min/max item guardrails.

## Big Numbers ([reference/big-numbers.json](reference/big-numbers.json))

- Pattern: block + item with many optional branches and validations.
- Field highlights:
  - `boolean` toggles dependent rate fields.
  - `text` and `richtext` for labels/rates/descriptions.
  - `select` for display type and `classes` mode.
- Conditional highlights:
  - Second rate group shown only when `show-second-rate` is true.
- Filter highlights:
  - Item count constraints with custom guidance in error messages.

## Build-Any-Block Heuristic

1. Start with parent/child pattern decision.
2. Choose field components by authoring intent.
3. Add validation close to each field.
4. Add `condition` only where dependencies exist.
5. Set filters last and verify min/max + allowed children.
6. Run `npm run build:json` and validate merged output.
