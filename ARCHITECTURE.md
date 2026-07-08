# CPKit Application Architecture

This document describes the module structure, directory routing, and design guidelines for the CPKit open-source project.

---

## 📂 Directory Layout

CPKit follows a modular, feature-first structure:

```
src/
├── app/                  # Next.js App Router routing entry points
├── components/           # Global UI components (sidebar, footer, layout shell)
├── features/             # Sub-feature modular directories
│   ├── contest-utilities/
│   ├── debug-tools/
│   ├── test-generator/
│   ├── number-theory/
│   ├── string-laboratory/
│   ├── matrix/
│   ├── graph/
│   ├── tree/
│   ├── dynamic-programming/
│   ├── greedy/
│   ├── search/
│   └── geometry/
└── constants/            # Navigation configurations
```

### Feature Modular Structure
Each directory under `src/features/[feature-name]/` contains:
- `components/` — Specific dashboard interfaces.
- `shared/` — Reusable layouts (`Layout`, `Header`, `EducationalPanel`).
- `tools/` — Specific algorithm playgrounds.
- `visualization/` — Specific SVG grid coordinates or canvas layout drawings.

---

## ⚙️ Design Parameters

1. **State Invariance**: Component logic should calculate math equations directly in state registers.
2. **Snappy Visualizations**: Canvas elements are drawn dynamically using SVG coordinate scaling.
3. **Frictionless Lookups**: Constants files map all cheatsheets to allow offline search runs.
