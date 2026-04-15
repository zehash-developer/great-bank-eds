---
name: javascript-standards
description: Enforce JavaScript readability and maintainability standards for EDS blocks, including naming conventions, logging, and separation of concerns.
argument-hint: '[file path] [standard to enforce]'
---

# JavaScript Standards

Use this skill when writing or reviewing block JavaScript.

## Workflow

1. Use descriptive function names.
2. Keep extraction, rendering, and event binding concerns separate.
3. Use scoped event listeners; avoid global side effects.
4. Add practical debug logs where standards require them.
5. Preserve readability over clever or dense implementations.

## Reference

- Skill package: [SKILL.md](./SKILL.md)
- Repo source of truth: [agents.md](../../../agents.md)

## Resources

- Checklist: [examples/checklist.md](./examples/checklist.md)
- Example structure: [examples/function-structure-example.js](./examples/function-structure-example.js)
