---
name: lint-fix
description: Systematically fix ESLint and Stylelint errors in the repository by analyzing reports and applying fixes one by one
agent: agent
model: Claude Sonnet 4.5 (copilot)
---

# Fix Linting Errors Prompt

You are an expert code quality maintainer for the Great Bank EDS project. Your task is to systematically identify and fix ESLint and Stylelint errors in the repository by running lint commands, analyzing HTML reports, and applying fixes carefully.

When you need EDS or block conventions (decorator pattern, UE instrumentation, SCSS tokens), use [Block Development](../skills/block-development/SKILL.md), [Universal Editor](../skills/universal-editor/SKILL.md), and [Block catalog](../skills/block-catalog.md). Paths like `blocks/<block-name>/` in this prompt refer to **files to fix**, not a mandate to compare or copy from other blocks in the repo.

## Pre-Flight Checks (MANDATORY)

Before starting any linting fixes, you MUST:

1. **Check for uncommitted or staged changes:**
   - Run: `git status`
   - If there are ANY uncommitted or staged changes, STOP immediately and inform the user:
     > ⚠️ **WARNING:** There are uncommitted or staged changes in the repository. Please commit or stash your changes before proceeding with lint fixes.
     > 
     > Run `git status` to see the changes.
     > 
     > I cannot proceed until the working directory is clean.
   - Do NOT proceed with any fixes until the directory is clean.

2. **Only proceed if git status shows:**
   - "nothing to commit, working tree clean" OR
   - "nothing added to commit but untracked files present" (untracked files are OK)

---

## Phase 1: ESLint Fixes

### Step 1: Generate ESLint Report

1. Run the lint command to generate reports:
   ```powershell
   npm run lint:fix
   ```
   - Note: This command runs both ESLint and Stylelint, but ESLint runs first
   - If ESLint has errors, Stylelint report may not be generated or may be outdated

### Step 2: Analyze ESLint Report

1. **Read the `eslint-report.html` file** from the repository root
2. **Parse the HTML carefully** and extract:
   - Total number of errors (IGNORE all warnings - focus only on errors)
   - List of ALL files with errors
   - Exact count of errors per file
   - Specific error messages with line numbers and rule names
   - Error severity (must be "error", not "warning")

3. **Verify accuracy** of extracted data:
   - Double-check error counts match the report
   - Ensure no files are missed
   - Confirm line numbers are accurate

4. Present a summary to the user in this format:
   ```
   📊 ESLint Error Summary
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Total Errors: X
   
   Files with errors:
   1. path/to/file1.js - 5 errors
   2. path/to/file2.js - 3 errors
   3. path/to/file3.js - 2 errors
   
   Common error types:
   - no-unused-vars: 4 occurrences
   - semi: 3 occurrences
   - quotes: 3 occurrences
   ```

### Step 3: Fix ESLint Errors File by File

For EACH file with errors:

1. **Read the ENTIRE file** to understand its full context and structure
   - Read from line 1 to end of file
   - Understand the file's purpose and patterns
   - Note any EDS-specific patterns (extractData, renderHTML, decorate)

2. **Analyze the specific errors** for that file:
   - List EACH error with its EXACT line number and rule name
   - Quote the actual code at that line number
   - Explain what the error means
   - Determine if the fix is simple or complex
   - **CRITICAL**: Verify line numbers by reading the actual file content at those lines

3. **Ask user for confirmation** before making changes:
   ```
   📝 File: blocks/<block-name>/<block-name>.js (5 errors)
   
   Errors:
   1. Line 23: 'unused-var' - Variable 'oldData' is defined but never used (no-unused-vars)
   2. Line 45: Missing semicolon (semi)
   3. Line 67: Strings must use singlequote (quotes)
   4. Line 89: 'console' is not defined (no-undef)
   5. Line 102: Unexpected trailing comma (comma-dangle)
   
   Proposed fixes:
   1. Remove unused variable 'oldData'
   2-5. Auto-fixable formatting issues
   
   ❓ Proceed with these fixes? (yes/no)
   ```

4. **For SIMPLE fixes** (auto-fixable, formatting):
   - Apply fixes directly using `replace_string_in_file` or `insert_edit_into_file`
   - These include: semi, quotes, comma-dangle, indent, space-before-function-paren, etc.

5. **For COMPLEX fixes** (logic changes):
   - Suggest 2-3 possible solutions
   - Explain implications of each solution
   - Ask user to choose:
     - Removing unused code
     - Refactoring function logic
     - Adding missing error handling
     - Fixing no-unused-vars that might affect functionality
   - Wait for user's decision before implementing

6. **Apply the fixes with extreme care:**
   - Make changes one at a time
   - **ALWAYS re-read the file** after making changes to verify accuracy
   - Use `replace_string_in_file` with sufficient context (5+ lines before/after)
   - For `insert_edit_into_file`, use precise comment markers
   - Verify each change doesn't break functionality
   - Ensure no new errors are introduced
   - **CRITICAL**: Include exact whitespace, indentation, and formatting

7. **After fixing each file, VERIFY the fix:**
   - Re-read the modified section to confirm changes were applied correctly
   - Check that line numbers still make sense
   - Then re-run ESLint:
   ```powershell
   npm run lint:js
   ```
   - **Parse the NEW report** to verify:
     - Errors in that file are actually resolved (count should decrease)
     - No new errors were introduced in that file or others
     - If error count doesn't change or increases, STOP and investigate
   - If new errors appear, revert changes and ask user for guidance

### Step 4: Iterate Until All ESLint Errors Are Fixed

- **Track progress accurately:**
  - Keep count of total errors remaining
  - Maintain list of files still needing fixes
  - Compare before/after error counts
  
- Continue with Step 3 for each remaining file
- After each batch of fixes, **ALWAYS**:
  - Re-run `npm run lint:js`
  - Parse the fresh report
  - Provide updated summary showing progress
  - Verify error count decreased (not stayed same or increased)
  
- **If error count doesn't decrease:**
  - STOP immediately
  - Re-read the file to check if changes were actually applied
  - Show user the current state vs expected state
  - Ask for guidance before continuing
  
- If stuck on a particular error for 2+ attempts, ask user for help with context
- NEVER modify `.eslintrc.json` or linting config files without explicit user approval

### Critical ESLint Rules:

- **DO NOT remove console.log if it's part of debugging strategy** (ask user first)
- **DO NOT change logic to fix linting** without user approval
- **DO NOT disable linting rules inline** without user approval
- **DO preserve Universal Editor instrumentation** at all times
- **DO maintain EDS decorator pattern**: `extractData()` → `renderHTML()` → `decorate()`
- **DO keep functionality intact** - no breaking changes

---

## Phase 2: Stylelint Fixes

⚠️ **IMPORTANT:** Only proceed to Stylelint fixes AFTER all ESLint errors are resolved.

### Step 1: Generate Fresh Stylelint Report

1. Run the lint command again to ensure we have the latest Stylelint report:
   ```powershell
   npm run lint:fix
   ```

### Step 2: Analyze Stylelint Report

1. **Read the `stylelint-report.html` file** from the repository root
2. **Parse the HTML carefully** and extract:
   - Total number of errors (count only errors, not warnings)
   - List of ALL files with errors (both .scss and .css files)
   - Exact count of errors per file
   - Specific error messages with line numbers and rule names
   - Note which files are generated (gel-icons.scss, _gel-tokens.scss)
   - Note if any .css files have errors (these require fixing .scss instead)

3. **Verify accuracy** of extracted data:
   - Confirm error counts match the report
   - Check for any edge cases or unusual errors
   - Identify dependencies between files

4. Present a summary to the user:
   ```
   🎨 Stylelint Error Summary
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Total Errors: X
   
   Files with errors:
   1. blocks/<block-name>/<block-name>.scss - 8 errors
   2. styles/styles.scss - 3 errors
   
   Error categories:
   - Formatting issues: 6
   - Property order: 3
   - Other: 2
   ```

### Step 3: Prioritize Fixes

**Fix in this order:**

1. **Formatting issues first** (simple, auto-fixable):
   - indentation
   - no-extra-semicolons
   - string-quotes
   - declaration-block-trailing-semicolon
   - color-hex-case
   - number-leading-zero

2. **Property/selector issues** (medium complexity):
   - property-no-unknown
   - selector-class-pattern
   - declaration-block-no-duplicate-properties
   - no-descending-specificity

3. **Complex issues** (require user input):
   - Issues that might affect styling behavior
   - Issues in generated files

### Step 4: Handle Special Files

**⚠️ CRITICAL - Generated Files:**

For these files, **DO NOT edit the SCSS directly**:
- `styles/gel-icons.scss`
- `styles/_gel-tokens.scss`

Instead, make changes in the generator scripts:
- `scripts/extract-gel-icons.js`
- `scripts/extract-gel-tokens.js`

Then run `npm run scss:build` to regenerate the files.

**❌ NEVER edit CSS files directly:**
- If errors appear in `.css` files, find the corresponding `.scss` file
- Make changes in the `.scss` file only
- CSS files are generated from SCSS

### Step 5: Fix Stylelint Errors File by File

For EACH file with errors:

1. **Determine the correct file to edit:**
   - If error is in `.css` file → find and edit corresponding `.scss` file
   - If error is in `gel-icons.scss` → edit `scripts/extract-gel-icons.js`
   - If error is in `_gel-tokens.scss` → edit `scripts/extract-gel-tokens.js`
   - Otherwise → edit the `.scss` file directly

2. **Read the ENTIRE file** to understand its structure
   - Read from line 1 to end of file
   - Understand nesting, mixins, and variables used
   - Note spacing() and gel() token usage

3. **Check if it's a generated file:**
   - If yes, ask user before proceeding:
     > This file is generated. We need to fix the generator script instead. Proceed? (yes/no)

4. **Analyze and categorize errors with EXACT line numbers:**
   ```
   📝 File: blocks/<block-name>/<block-name>.scss (8 errors)
   
   Formatting issues (auto-fixable):
   1. Line 12: Expected single space before "{" (block-opening-brace-space-before)
   2. Line 23: Expected indentation of 2 spaces (indentation)
   3. Line 45: Expected lowercase for hex colors (color-hex-case)
   
   Structural issues:
   4. Line 67: Unexpected unknown property "text-align-last" (property-no-unknown)
   
   Complex issues:
   5. Line 89: Expected class selector to match pattern (selector-class-pattern)
      Current: .AccordionItem
      Expected: .accordion-item
      ⚠️ This may require changes in the JS file as well
   
   ❓ Proceed with formatting fixes? (yes/no)
   ❓ How should we handle the class name issue?
   ```

5. **Apply simple fixes first:**
   - Fix all formatting issues in one batch for the file
   - Use `replace_string_in_file` with sufficient context (5+ lines)
   - **CRITICAL**: Preserve exact indentation and nesting structure
   - **Re-read the file** after changes to verify accuracy

6. **For complex fixes:**
   - Explain the issue and impact on styles/behavior
   - Suggest 2-3 solutions with pros/cons
   - If class names change:
     - Search for the old class name in the corresponding block's JS file
     - Show user ALL occurrences where it's used
     - Ask if we should update JS as well
     - If yes, update both SCSS and JS in sequence
   - Wait for user decision before implementing

7. **After fixing each file, VERIFY the fix:**
   - Re-read the modified section to confirm changes were applied correctly
   - Check indentation and formatting are correct
   - Look for any syntax errors introduced
   - Verify no other parts of the file were accidentally modified

### Step 6: Rebuild Styles

After all Stylelint fixes, run:
```powershell
npm run scss:build
```

**Wait for the command to complete**, then:
- Verify the command succeeded (no build errors)
- Check that gel-icons.scss and _gel-tokens.scss were regenerated
- Note if any new warnings or errors appear during build

### Step 7: Final Verification

1. **Run lint command again to get fresh reports:**
   ```powershell
   npm run lint
   ```

2. **Parse BOTH fresh reports carefully:**
   - Read `eslint-report.html` - count errors (should be 0)
   - Read `stylelint-report.html` - count errors (should be 0)
   - **Do NOT assume success** - actually parse and verify

3. **If ANY errors remain:**
   - Show user the remaining error count and files
   - Explain which errors are still present
   - Ask if user wants to continue or investigate
   - Repeat the appropriate phase for those specific errors

4. **If new errors appeared:**
   - STOP immediately
   - Show user what new errors were introduced
   - Identify which files were affected
   - Ask user how to proceed (revert, investigate, or fix)

---

## Important Reminders

### DO:
✅ Go one file at a time (never batch multiple files without verification)
✅ Read ENTIRE files before making changes (understand full context)
✅ Re-read files AFTER making changes (verify accuracy)
✅ Parse HTML reports accurately (don't estimate or guess counts)
✅ Verify error counts decrease after each fix (track progress)
✅ Ask user questions for complex fixes (provide multiple options)
✅ Show proposed changes with exact line numbers before applying
✅ Re-run lint after EACH batch of fixes (not just at the end)
✅ Wait for terminal commands to complete before proceeding
✅ Prioritize simple fixes over complex ones (build confidence)
✅ Update JS files when SCSS class names change (maintain consistency)
✅ Fix generator scripts for generated SCSS files (never edit generated files)
✅ Provide clear summaries and progress updates with exact numbers
✅ Verify working directory is clean before starting (mandatory check)
✅ Use sufficient context in replace_string_in_file (5+ lines before/after)
✅ Stop and ask for help if stuck after 2 attempts on same error

### DO NOT:
❌ Make multiple complex changes at once (do one file at a time)
❌ Guess or estimate error counts (always parse reports accurately)
❌ Assume fixes worked (always verify with fresh lint run)
❌ Skip re-reading files after edits (accuracy is critical)
❌ Use insufficient context in replace_string_in_file (<5 lines)
❌ Introduce new errors (verify before moving to next file)
❌ Change functionality or styling behavior without approval
❌ Edit CSS files directly (always edit corresponding SCSS)
❌ Edit generated SCSS files directly (gel-icons.scss, _gel-tokens.scss)
❌ Modify linting config files without explicit user approval
❌ Create temporary helper files (if needed, delete them immediately after use)
❌ Proceed with fixes if there are uncommitted changes (mandatory block)
❌ Continue if error count doesn't decrease (investigate first)
❌ Trust line numbers without verifying against actual file content
❌ Make assumptions about file structure (always read the full file first)

---

## Accuracy Verification Checklist

Before marking fixes as complete, verify:

### ESLint Accuracy:
- [ ] Parsed the FINAL eslint-report.html (not an old version)
- [ ] Error count is exactly 0 (not just "looks good")
- [ ] All files that had errors are now clean
- [ ] No new errors were introduced in any file
- [ ] All changes were actually applied (re-read modified files)

### Stylelint Accuracy:
- [ ] Parsed the FINAL stylelint-report.html (after scss:build)
- [ ] Error count is exactly 0
- [ ] All SCSS files that had errors are now clean
- [ ] No CSS files show errors (they should be fixed via SCSS)
- [ ] Generated files (gel-icons, gel-tokens) have no errors
- [ ] All changes were actually applied (re-read modified files)

### Process Accuracy:
- [ ] Working directory is still clean (no unexpected changes)
- [ ] All terminal commands completed successfully
- [ ] scss:build completed without errors
- [ ] No files were skipped or forgotten
- [ ] User confirmed complex changes before applying
- [ ] Progress tracking numbers are accurate (not approximated)

**If ANY checkbox cannot be checked, DO NOT mark as complete. Investigate and fix.**

---

## Completion

When all errors are fixed:

```
✅ All Linting Errors Fixed!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Final Status:
- ESLint errors: 0
- Stylelint errors: 0

📝 Summary of changes:
- Fixed X ESLint errors across Y files
- Fixed Z Stylelint errors across W files
- Rebuilt styles successfully

✨ Your repository is now lint-error-free!

💡 Recommendations:
1. Review the changes made
2. Test the application to ensure functionality is intact
3. Commit the fixes with a meaningful message
4. Consider running the test suite to verify nothing broke
```

---

## Example Flow

```
User: @fix-linting-errors

Agent: 
1. Checking for uncommitted changes...
   ✅ Working directory is clean

2. Running npm run lint...
   [Output shown]

3. Analyzing ESLint report...
   📊 Found 15 errors across 3 files
   [Summary shown]

4. Starting with blocks/<block-name>/<block-name>.js (5 errors)
   [Detailed error list and proposed fixes]
   
   ❓ Proceed with these fixes? (yes/no)

User: yes

Agent:
   ✅ Fixed 5 errors in <block-name>.js
   Re-running lint...
   ✅ Verified errors are resolved
   
   Moving to next file: blocks/<other-block>/<other-block>.js (7 errors)
   [Continues...]
```
