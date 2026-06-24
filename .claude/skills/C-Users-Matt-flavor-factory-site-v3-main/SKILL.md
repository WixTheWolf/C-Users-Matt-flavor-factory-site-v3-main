```markdown
# C-Users-Matt-flavor-factory-site-v3-main Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the development patterns and conventions used in the `C-Users-Matt-flavor-factory-site-v3-main` JavaScript codebase. It covers file naming, import/export styles, commit message habits, and testing patterns to help you contribute consistently and efficiently.

## Coding Conventions

### File Naming
- Use **camelCase** for file names.
  - Example: `userProfile.js`, `flavorList.js`

### Import Style
- Use **relative imports** to reference other files.
  - Example:
    ```javascript
    import { getUser } from './userProfile';
    ```

### Export Style
- Use **named exports** for functions, constants, and components.
  - Example:
    ```javascript
    // In flavorList.js
    export function getFlavors() { ... }
    export const FLAVOR_TYPES = ['sweet', 'savory'];
    ```

### Commit Messages
- Commit messages are **freeform** (no strict prefix), with an average length of 54 characters.
  - Example: `Add new flavor selection component`

## Workflows

### Adding a New Feature
**Trigger:** When you want to introduce a new functionality.
**Command:** `/add-feature`

1. Create a new file using camelCase naming.
2. Implement the feature using named exports.
3. Import any dependencies using relative paths.
4. Write a corresponding test file (`*.test.js`).
5. Commit your changes with a clear, descriptive message.

### Fixing a Bug
**Trigger:** When you need to resolve a defect.
**Command:** `/fix-bug`

1. Locate the relevant file(s) using camelCase naming.
2. Make the necessary code changes.
3. Update or add tests as needed.
4. Commit with a message describing the fix.

### Refactoring Code
**Trigger:** When improving code structure without changing behavior.
**Command:** `/refactor`

1. Identify code to refactor (e.g., improve naming, modularize).
2. Apply changes, maintaining camelCase and named exports.
3. Ensure all imports remain relative.
4. Run tests to verify no regressions.
5. Commit with a message summarizing the refactor.

## Testing Patterns

- Test files use the `*.test.*` naming pattern.
  - Example: `flavorList.test.js`
- The testing framework is **unknown**, but tests should be colocated with or near the code they cover.
- Write tests for all new features and bug fixes.

  ```javascript
  // Example: flavorList.test.js
  import { getFlavors } from './flavorList';

  test('returns all available flavors', () => {
    expect(getFlavors()).toContain('sweet');
  });
  ```

## Commands
| Command        | Purpose                                 |
|----------------|-----------------------------------------|
| /add-feature   | Start workflow for adding a new feature |
| /fix-bug       | Start workflow for fixing a bug         |
| /refactor      | Start workflow for refactoring code     |
```
