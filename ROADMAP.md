# CPKit Project Roadmap

This document outlines the planned release cycles, milestones, and upcoming algorithm modules for CPKit.

---

## 🚀 Phase 1: Foundation & Design System (Current Release)
*Goal: Initialize a clean workspace and design system baseline.*

- [x] Bootstrapping Next.js App Router, TypeScript, and Tailwind CSS v4 configurations.
- [x] Complete Tailwind HSL design token structure for both Light and Dark modes.
- [x] Standard atomic component structures (buttons, inputs, cards, dialogs, progress bars, selects, dropdowns, scroll-areas).
- [x] Collaborative UI Navigation: Collapsible workspace sidebar, header search placeholders, and global command menu (`Cmd/Ctrl + K`).
- [x] High-performance, clean full-bleed Marketing Landing Page (`/`) and Coder Dashboard (`/dashboard`).
- [x] Launching GitHub open-source community guidelines, issue templates, PR rules, and MIT licensing.

---

## 🛠️ Phase 2: Contest Utilities & Debugging (Current Release - v0.2.0)
*Goal: Integrate active calculators, references, and debugging helpers.*

- [x] **Contest Utilities (CU)**: Complete 8 essential sub-tools (arithmetic, base conversions, logical operations, ASCII sheets, Roman translation, expression parsing, BigInt math, overflow bounds check).
- [ ] **Contest Scrapers**:
  - [ ] Problem scrapers/parsers (Codeforces, AtCoder, CodeChef) to auto-download test case inputs/outputs.
  - [ ] Workspace template auto-generators supporting custom user macros.
- [ ] **Debug Tools**:
  - [ ] Standard Stress Tester (comparing brute-force vs. optimized solution output using randomized inputs).
  - [ ] Diff Checker displaying inline output discrepancies.
  - [ ] Performance Estimator checking time and memory complexities.

---

## 📊 Phase 3: Test Generators & Visualizers (Upcoming)
*Goal: Help programmers create edge cases and visualize complex algorithms.*

- [ ] **Test Generator**:
  - [ ] Interactive UI to generate randomized datasets (Integers, Floats, Strings, Grids, Graphs, Trees).
  - [ ] Precision constraints settings (prime lists, DAGs, weights, bounds).
- [ ] **Algorithmic Visualizers**:
  - [ ] Graph search visualizer (BFS/DFS tree builders).
  - [ ] Shortest path visualizer (Dijkstra, Bellman-Ford step-by-step executions).
- [ ] **Quick Reference**:
  - [ ] Complexity charts, fast I/O optimizations, and template cheatsheets.

---

## 📚 Phase 4: Algorithmic Libraries (Future Extensions)
*Goal: Package highly-optimized, copy-pasteable reference code for classic CP topics.*

- [ ] **Strings**: KMP, Z-Algorithm, Trie, Manacher, Suffix structures.
- [ ] **Number Theory**: Prime Sieve, Modular Inverse, Combinatorics solvers.
- [ ] **Matrix**: Binary Matrix Exponentiation, Gaussian Elimination.
- [ ] **Graph & Tree**: LCA, Segment Trees, Fenwick, Centroid Decomposition, Max Flow, Bipartite matching.
- [ ] **Dynamic Programming**: Classic patterns, bitmask optimization, digit DP, and Convex Hull Trick.
- [ ] **Greedy**: Interval scheduling, exchange argument references.
- [ ] **Geometry**: Convex hull solvers, line intersection checks.
