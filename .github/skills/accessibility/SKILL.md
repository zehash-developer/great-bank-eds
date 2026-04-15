---
name: accessibility
description: Apply accessibility requirements for EDS blocks, including semantic HTML, keyboard support, ARIA, and WCAG checks when building or reviewing components.
argument-hint: '[block path or scenario]'
---

# Accessibility

Use this skill when creating or reviewing EDS blocks for accessibility.

## When To Use

- Implementing new interactive UI in a block.
- Reviewing keyboard navigation and focus behavior.
- Validating ARIA usage and semantic structure.
- Preparing Storybook accessibility checks.

## Workflow

1. Identify all interactive controls and verify keyboard support.
2. Confirm semantic elements are used before adding ARIA.
3. Verify visible focus states and accessible names.
4. Check headings, landmarks, and reading order.
5. Validate against project requirements and WCAG targets.

## Reference

- Skill package: [SKILL.md](./SKILL.md)
- Repo source of truth: [agents.md](../../../agents.md)

## Resources

- Checklist: [examples/checklist.md](./examples/checklist.md)
- Example review format: [examples/a11y-review-template.md](./examples/a11y-review-template.md)
