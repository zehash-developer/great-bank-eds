---
name: get-requirements
description: Extract requirements from Confluence and Figma into a requirements file
argument-hint: 'block-name confluence-link'
---

Follow all rules in `/agents.md` and `.github/instructions/copilot-instructions.md`.
If there is any conflict, `/agents.md` wins.

## Pattern and reference sources

Do **not** use informal review of existing code under `blocks/` to infer requirements or EDS patterns. For block architecture and UE expectations, align with [Block Development](../skills/block-development/SKILL.md), [Universal Editor](../skills/universal-editor/SKILL.md), and [Block catalog](../skills/block-catalog.md).

Use this prompt as:

`get-requirements <block-name> <confluence-link>`

## Objective

Pull down all requirements for a block by:

1. Extracting requirements from the provided Confluence page.
2. Creating and populating `docs/requirements/<block-name>/requirements.md` with Confluence information before any Figma extraction.
3. Extracting **design context and screenshots** from all linked Figma files — both are mandatory for downstream build and review.
4. Normalizing and validating the requirements.

Once complete, run `build-block <block-name>` to scaffold the block.

## Required References

- [Block catalog](../skills/block-catalog.md)
- [Block Development](../skills/block-development/SKILL.md)
- [Universal Editor](../skills/universal-editor/SKILL.md)

## Phase 1: Confluence Requirements Extraction

1. Use the Confluence connector to load the provided `<confluence-link>`.
2. Immediately create `docs/requirements/<block-name>/requirements.md`.
3. Extract and write all Confluence requirements into the file before any Figma connector calls are made.
4. Use the following structure in `docs/requirements/<block-name>/requirements.md` (see [requirements-template.md](../skills/block-development/examples/requirements-template.md) for the portable section outline).
5. Treat these sections as expected defaults (if present):
   - Requirements
   - Block Dialogue
   - Block UI
   - Annotations and States
   - Accessibility
6. Also capture any additional sections if present, including:
   - Design tokens and theming (as stated in Confluence / Figma)
   - Browsers and devices (if specified)
   - User interaction and design specs
   - Technical specs/SOPs
   - Questions/Decisions
   - Signoffs and approvals
   - Related documents
7. Do not drop content. If a section is missing, add a heading and mark it as `Not provided`.

## Phase 2: Figma Design Context And Screenshot Extraction

**`get_screenshot` is encouraged** for the **exact look and feel** of each component or frame you will build — not only as an archive. Use it to confirm hierarchy, spacing balance, and visual parity with what authors will see in Figma.

Screenshots are **required**, not optional. `build-block` and `review-block` compare the implementation to these visuals; without saved references, layout regressions are likely.

1. Find all Figma links in the Confluence content (including node-specific URLs with `node-id=`).
2. Process Figma links in sequential batches with a maximum of 3 parallel Figma MCP calls at a time.
3. Wait for the current batch of 3 (or fewer) calls to finish before starting the next batch.
4. For **each distinct Figma node** (each `fileKey` + `node-id` you must implement or review), run **both**:
   - **`get_design_context`** — structured layout, tokens, typography, interaction hints, and default screenshot in the response when available.
   - **`get_screenshot`** — explicit full-node raster reference for side-by-side visual comparison during build and review. Use the same `fileKey` and `nodeId` as for design context (URL `node-id` uses hyphens; MCP expects colons, e.g. `5-5043` → `5:5043`).
5. **Persist screenshots to disk** under `docs/requirements/<block-name>/figma/`:
   - Filename pattern: `node-<nodeId-with-dashes>-<short-slug>.png` (e.g. `node-5-5043-accordion-light.png`). Replace `:` with `-` in the node id for filenames.
   - Save the image bytes from the MCP response (or fetch the provided asset URL before it expires). Do not rely on ephemeral MCP asset URLs alone in the markdown — the committed or saved file is the long-lived baseline.
6. Append organized design context **and** screenshot inventory under dedicated sections in `docs/requirements/<block-name>/requirements.md`.
7. For each Figma source, include:
   - Source URL
   - Parsed `fileKey` and `nodeId` (for reuse in `build-block` / `review-block`)
   - **Relative path** to the saved screenshot file under `docs/requirements/<block-name>/figma/`
   - Key component anatomy
   - States and variants
   - Spacing/layout behavior
   - Typography/tokens
   - Interaction notes
8. Add a **Figma visual reference matrix** (table) in `requirements.md`, for example:

   | Figma URL | Node ID | Screenshot file | Purpose (e.g. default / hover / mobile) |
   |-----------|---------|-------------------|----------------------------------------|

9. If a frame documents multiple states in one image, note that in the matrix so `review-block` can avoid treating it as a single pixel-perfect target (see Figma Comparison skill: multi-state frames).

## Phase 3: Normalize And Validate Requirements

1. Review `docs/requirements/<block-name>/requirements.md` for structure, duplicates, and contradictions.
2. Verify every Figma node listed in the visual reference matrix has a corresponding file on disk under `docs/requirements/<block-name>/figma/` (or explicitly mark as pending with reason).
3. Normalize into clear subsections:
   - Authoring requirements
   - Rendering/markup requirements
   - Accessibility requirements
   - Variant/state matrix
   - Validation rules
   - Open questions
4. If critical requirements are ambiguous or contradictory, stop and ask targeted questions before proceeding.

## Output Summary

Provide a concise summary containing:

1. Confluence sections extracted.
2. Figma links processed, with **count of `get_screenshot` captures** and paths under `docs/requirements/<block-name>/figma/`.
3. Requirements file path created.
4. Confirmation that the **Figma visual reference matrix** is populated for every implementation target node.
5. Any open questions requiring user decision before building.
