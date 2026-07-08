# Contributing to CPKit

Thank you for your interest in contributing to CPKit! We want to make contributing to this project as easy and transparent as possible, whether it's reporting bugs, requesting new features, or submitting code changes.

---

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please report any violations or inappropriate behavior to MD. Masudul Hasan at `23240442@sstu.ac.bd`.

---

## How Can I Contribute?

### 1. Reporting Bugs
- Search existing issues to verify the bug hasn't been reported yet.
- Open a new issue using our **Bug Report** template.
- Provide a clear description, reproduction steps, expected vs. actual outcomes, and context logs.

### 2. Requesting Features
- Open a new issue using the **Feature Request** template.
- Describe the competitive programming utility or visualizer you would like to see, why it is helpful, and how it should interact.

### 3. Submitting Code Changes
For developers looking to write code for CPKit, please follow our development workflow below.

---

## Development Workflow

### Branch Naming Conventions
Always create a branch off of `main` for your work. Keep branches scoped and named using the following prefixes:
- `feat/feature-name` — for new tools, references, or features.
- `fix/bug-description` — for fixing compiler or layout issues.
- `docs/doc-topic` — for updating README, roadmap, or design system guides.
- `refactor/refactor-topic` — for improving performance or structure without changing functionality.

### Commit Messages
We follow the **Conventional Commits** specification. Commit messages must be structured as follows:
`<type>(<scope>): <short description>`

Common types:
- `feat`: A new user-facing component or tool.
- `fix`: A bug fix.
- `docs`: Documentation updates.
- `style`: Formatting, missing semi-colons, no code change.
- `refactor`: Refactoring code to improve structural quality.
- `test`: Adding missing tests.

*Example:*
`feat(ui): add sliding SegmentedControl component`

### Pull Request Lifecycle
1. Fork the repository and clone it locally.
2. Create a new branch matching our branch conventions.
3. Write clean, accessible, and self-documenting code.
4. Run `npm run build` locally to verify that TypeScript compilation and linter configurations pass without warnings.
5. Push to your fork and submit a Pull Request (PR) to the `main` branch.
6. A maintainer will review your PR and merge it once approved.

---

## Coding Standards

1. **Type Safety**: Write pure TypeScript. Avoid `any` declarations; declare explicit interfaces.
2. **Design Tokens**: Do not use hardcoded HSL/HEX values. Leverage CSS variable tokens (e.g., `text-primary`, `bg-card`) to ensure light/dark mode compatibility.
3. **Feature Isolation**: Features under `src/features/[feature-name]` must remain isolated. No feature should import logic directly from another feature folder.
4. **Reusable UI Elements**: Prioritize atomic design. If creating widgets like buttons, dialogs, or inputs, add/refactor them in `src/components/ui/`.
