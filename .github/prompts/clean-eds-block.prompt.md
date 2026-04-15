---
name: clean-eds-block
description: Clean up the existing EDS block code by removing any unused code, comments, and console logs, and ensuring it follows best practices for readability and maintainability.
argument-hint: 'block-name'
agent: agent
model: Claude Sonnet 4.5 (copilot)
---

# Clean EDS Block Prompt (Improved)

You are an expert EDS block maintainer. Your task is to clean up the code for **one** named block. **Always use the block name provided as the argument for all actions. Never use a previously passed block name. Always match exact block name**

For EDS patterns and conventions (decorator flow, UE instrumentation, accessibility), follow [Block Development](../skills/block-development/SKILL.md), [Universal Editor](../skills/universal-editor/SKILL.md), and [Block catalog](../skills/block-catalog.md). Do **not** use other folders under `blocks/` as informal reference implementations—only touch the target block’s files.

## Instructions

1. **Locate the block folder** for that single block (path `blocks/<block-name>/`) matching the block name argument provided in the current request.
   - If the block does not exist, prompt the user:
     > Block '<block-name>' not found in blocks/. Please check the name and try again.

2. **Scan all code files in the block folder** (`.js`, `.scss`, `.css`, `.mocks.js`, `.stories.js`) and identify cleanups needed:
   - **Unused code:**
     - Commented-out code blocks
     - Unused imports
     - Unused variables and functions (that are not exported or part of the public API)
     - Dead code paths (unreachable code)
   - **All `console.log` statements** (should be removed completely, not commented out)
   - **Unnecessary comments:**
     - Obvious comments that restate what the code does
     - Outdated TODO comments
     - Keep comments that explain complex business logic or non-obvious behavior
   - **Code that doesn't follow EDS best practices:**
     - Non-descriptive function and variable names
     - Violations of the EDS decorator pattern: bake flow (`bakeBlockLevel` / `bakeXToDataset`) → `extractXDataFromBlock` → `renderHTML` → `decorate`
     - Event listeners not scoped to the block root element
     - Global side effects

3. **Present findings to user for confirmation:**
   - For each file with changes, show:
     - File name
     - Type of change (e.g., "Remove console.log", "Remove unused import", "Remove commented code")
     - Code snippet showing the exact lines to be removed or modified (with 2-3 lines of context)
   - Format as a numbered list so user can select which changes to apply
   - Wait for user confirmation before proceeding
   - Example format:
     ```
     Found 5 cleanups in accordion.js:
     1. Remove console.log at line 45:
        ```
        const data = extractData(block);
        console.log('Accordion data:', data);
        return renderHTML(data);
        ```
     2. Remove unused import at line 3:
        ```
        import { debounce } from '../../scripts/scripts.js';
        ```
     ```

4. **Apply only the user-confirmed changes:**
   - Make only the edits the user approved
- **Ensure code follows EDS best practices:**
    - Use descriptive function and variable names
    - Follow the EDS decorator pattern: bake flow (`bakeBlockLevel` / `bakeXToDataset`) → `extractXDataFromBlock` → `renderHTML` → `decorate`
    - Do not remove bake/extract/write functions used by the bake flow
     - Scope all event listeners to the block root element
     - **Never remove Universal Editor instrumentation**
     - **Never modify or remove accessibility features** (ARIA attributes, semantic HTML, keyboard handlers)
   - **Ensure all code is formatted** according to repository Prettier configuration
   - **Do not introduce bugs or break existing functionality**
   - **Do not change the block's public API or UE configuration**

5. **After applying changes, verify the block:**
   - Run `get_errors` tool to check for Javascript/ESLint issues in the cleaned files
   - Fix any errors introduced by the cleanup before proceeding
   - Confirm no new errors exist compared to pre-cleanup state
   - Verify that:
     - Code passes ESLint and Prettier checks
     - Block remains visually and functionally unchanged (if Storybook is available)
     - All required accessibility and UE instrumentation is retained

6. **Provide a summary of changes made:**
   - List files modified
   - Summarize what was removed (e.g., "Removed 15 console.log statements, 3 unused imports")
   - Note any issues that require manual review

## Guardrails

- If any required code, instrumentation, or accessibility feature would be removed, STOP and prompt the user for clarification.
- If the block name is not provided or invalid, STOP and prompt the user.
- Never modify code outside the specified block folder.
- If uncertain whether code is unused (e.g., potentially used by external consumers), STOP and ask the user.

## What NOT to Remove

- Exported functions (may be used by other blocks or external code)
- Universal Editor data attributes (`data-aue-*`)
- ARIA attributes and accessibility features
- Event listeners that provide core functionality
- Comments explaining complex business logic
- Configuration objects (even if they appear unused)
