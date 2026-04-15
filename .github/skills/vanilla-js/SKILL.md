---
name: vanilla-js
description: Implement EDS block behavior using vanilla JavaScript patterns for safe DOM updates, scoped events, and maintainable interaction logic.
argument-hint: '[file path] [behavior]'
---

# Vanilla JavaScript

Use this skill for DOM and behavior implementation without external JS frameworks.

## Workflow

1. Keep all behavior scoped to the block root.
2. Use event delegation where it reduces handler complexity.
3. Clean up listeners during rerender/replacement flows.
4. Keep utility helpers small and intention-revealing.

## Reference

- Skill package: [SKILL.md](./SKILL.md)
- Repo source of truth: [agents.md](../../../agents.md)

## Resources

- Checklist: [examples/checklist.md](./examples/checklist.md)
- Example delegation: [examples/event-delegation-example.js](./examples/event-delegation-example.js)
