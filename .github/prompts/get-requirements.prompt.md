---
name: get-requirements
description: Extract requirements from Confluence and Figma into a requirements file
argument-hint: 'block-name confluence-link'
---

Follow all rules in `/agents.md` and `.github/instructions/copilot-instructions.md`.
If there is any conflict, `/agents.md` wins.

Use this prompt as:

`get-requirements <block-name> <confluence-link>`

## Objective

Pull down all requirements for a block by:

1. Extracting requirements from the provided Confluence page.
2. Creating and populating `docs/requirements/<block-name>/requirements.md` with Confluence information before any Figma extraction.
3. Extracting design context from all linked Figma files (design context only, no screenshots).
4. Normalizing and validating the requirements.

Once complete, run `build-block <block-name>` to scaffold the block.

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
   - GEL Tokens (incl. Dark Mode)
   - MVP Browsers and Devices
   - User interaction and design specs
   - Technical specs/SOPs
   - Questions/Decisions
   - Signoffs and approvals
   - Related documents
7. Do not drop content. If a section is missing, add a heading and mark it as `Not provided`.

## Phase 2: Figma Design Context Extraction

1. Find all Figma links in the Confluence content.
2. Process Figma links in sequential batches with a maximum of 3 parallel Figma connector calls at a time.
3. Wait for the current batch of 3 (or fewer) calls to finish before starting the next batch.
4. For each link, use the Figma connector to extract design context.
5. Do not use screenshots.
6. Append organized design context under a dedicated section in `docs/requirements/<block-name>/requirements.md`.
7. For each Figma source, include:
   - Source URL
   - Key component anatomy
   - States and variants
   - Spacing/layout behavior
   - Typography/tokens
   - Interaction notes

## Phase 3: Normalize And Validate Requirements

1. Review `docs/requirements/<block-name>/requirements.md` for structure, duplicates, and contradictions.
2. Normalize into clear subsections:
   - Authoring requirements
   - Rendering/markup requirements
   - Accessibility requirements
   - Variant/state matrix
   - Validation rules
   - Open questions
3. If critical requirements are ambiguous or contradictory, stop and ask targeted questions before proceeding.

## Output Summary

Provide a concise summary containing:

1. Confluence sections extracted.
2. Figma links processed.
3. Requirements file path created.
4. Any open questions requiring user decision before building.
