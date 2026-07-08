# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-07-08

### Added
- Completed **Contest Utilities (CU)** module containing 8 essential CP tools:
  - Standard Calculator evaluating math functions and percentages.
  - Base Converter displaying binary, octal, decimal, and hex conversions in real-time.
  - Binary Calculator computing bitwise AND, OR, XOR, NOT, and shift operations.
  - Searchable ASCII Table mapping control and printable characters.
  - Bidirectional Roman Numerals translator.
  - Safe algebraic Expression Evaluator.
  - Big Integer Calculator supporting large values using native JS BigInt.
  - C++ primitive types Integer Overflow Checker.
- Shared utilities dashboard routing to all sub-tools.
- Re-routed sidebar navigation maps from `/contest-utils` to `/contest-utilities`.

---

## [0.1.0] - 2026-07-08

### Added
- Complete project foundation setup using Next.js App Router, TypeScript, and Tailwind CSS v4.
- Double-layout system shell: full-bleed Marketing Landing Page (`/`) and Sidebar-enabled Workspace (`/dashboard`).
- Global search trigger and `Cmd+K` Command Palette dialog with keyboard controls (arrows/Enter) and theme togglers.
- Complete atomized Design System components under `src/components/ui/`:
  - `Button` variants and `Input`/`Textarea` fields.
  - `Card` components and visual data `StatCard` blocks.
  - Page, section, and side-by-side workspace `Containers`.
  - Semantic `Badge` levels and dismissible `Chip` tags.
  - Fading dialog modals (`Dialog`) and sliding `Tabs` indicators.
  - Switch toggles, customized checkboxes, selects, and dropdown menus.
  - Loaders (`Spinner`), progress bars, and pulse skeletons.
  - Status indicators (`Alert`), blank states (`EmptyState`), and retry blocks (`ErrorState`).
  - Context toast triggers (`ToastProvider` & `useToast` hooks).
  - Divider lines and height-limited scroll viewports.
- Interactive showcase playground route `/design-system` for quick component review.
- Initialized open-source repository documentation: LICENSE, CONTRIBUTING.md, ROADMAP.md, SECURITY.md, SUPPORT.md, and GitHub templates.
