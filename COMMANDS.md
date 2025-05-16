# Memory Bank Command Guide

This guide provides all the commands you can use to interact with the Memory Bank system. Each command triggers specific workflows and validations to ensure project quality and consistency.

## 🚀 Quick Start Commands

| Command | Description |
|---------|-------------|
| `VAN` | Initialize project or start VAN mode |
| `VAN QA` | Run technical validation |
| `PLAN` | Switch to planning mode |
| `CREATIVE` | Switch to creative mode |
| `BUILD` | Switch to build mode (requires QA validation) |
| `QA` | Run QA validation (available anytime) |

## 🎨 Creative Mode Commands

Use these commands when in CREATIVE mode to manage different design phases:

| Command | Purpose |
|---------|----------|
| `CREATIVE UI` | Start UI/UX design phase |
| `CREATIVE ARCH` | Start architecture design phase |
| `CREATIVE DATA` | Start data model design phase |
| `CREATIVE ALGO` | Start algorithm design phase |

## 📋 Planning Mode Commands

Different planning approaches based on task complexity:

| Command | Use Case |
|---------|----------|
| `PLAN L1` | Level 1 - Quick Bug Fix planning |
| `PLAN L2` | Level 2 - Enhancement planning |
| `PLAN L3` | Level 3 - Feature planning |
| `PLAN L4` | Level 4 - System planning |

## 📊 Status & Progress Commands

Monitor and track project progress:

| Command | Function |
|---------|----------|
| `STATUS` | Check current mode and progress |
| `TASKS` | View task list |
| `PROGRESS` | View progress report |

## 🔄 Transition Commands

Navigate between modes and phases:

| Command | Action |
|---------|--------|
| `NEXT` | Move to next recommended mode |
| `BACK` | Return to previous mode |
| `COMPLETE` | Mark current phase as complete |

## 📝 Documentation Commands

Manage project documentation:

| Command | Purpose |
|---------|----------|
| `DOC CREATE` | Create new documentation |
| `DOC UPDATE` | Update existing documentation |
| `DOC VIEW` | View documentation |

## 🔍 Important Notes

1. Commands are case-insensitive (`VAN` or `van` both work)
2. The `QA` command can be used at any time to validate current state
3. Always wait for confirmation before proceeding to next command
4. Use `STATUS` command if unsure about current state

## 🚦 Mode Transitions

```mermaid
graph TD
    VAN[VAN Mode] --> Complexity{Complexity Level?}
    Complexity -->|L1| BUILD[BUILD Mode]
    Complexity -->|L2-L4| PLAN[PLAN Mode]
    PLAN --> CREATIVE[CREATIVE Mode]
    CREATIVE --> BUILD
    BUILD --> QA[QA Mode]
```

## ⚠️ Validation Requirements

- `BUILD` mode requires successful QA validation
- Each mode transition triggers automatic state verification
- Failed validations must be resolved before proceeding
- Use `VAN QA` to explicitly run technical validation

## 📁 Memory Bank Structure

The Memory Bank system maintains the following structure:

```
memory-bank/
├── creative/         # Design decisions and creative phase docs
├── reflection/       # Task reflections and learnings
├── technical/        # Technical documentation
├── testing/         # Test plans and results
├── tasks.md         # Task tracking
├── activeContext.md # Current state and context
├── progress.md      # Progress tracking
└── projectbrief.md  # Project overview
```

## 🔄 Command Flow Example

1. Start new task:
   ```
   VAN
   ```

2. Plan implementation:
   ```
   PLAN L2
   ```

3. Design phase:
   ```
   CREATIVE UI
   ```

4. Validate implementation:
   ```
   VAN QA
   ```

5. Start implementation:
   ```
   BUILD
   ```

## 🚫 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| QA validation fails | Use `VAN QA` to see detailed error report |
| Unsure of next step | Use `STATUS` to check current state |
| Need to change modes | Use appropriate mode command (`PLAN`, `CREATIVE`, etc.) |
| Documentation needed | Use `DOC CREATE` or `DOC UPDATE` |

## 🎯 Best Practices

1. Always start with `VAN` for new tasks
2. Run `QA` regularly to catch issues early
3. Keep documentation updated using `DOC UPDATE`
4. Use `STATUS` when unsure about current state
5. Complete each phase before moving to next

Remember: The Memory Bank system is designed to ensure quality and consistency throughout the development process. Following these commands and workflows helps maintain project integrity and documentation standards. 