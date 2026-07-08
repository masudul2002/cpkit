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

## 🛠️ Phase 2: Contest Utilities, Debugging, Generators, Math, Strings, Matrices & Graphs (Current Release - v0.8.0)
*Goal: Integrate active calculators, references, debugging helpers, data generators, mathematics utilities, string laboratories, matrix workspaces, and graph canvases.*

- [x] **Contest Utilities (v0.2.0)**: Complete 8 essential sub-tools (arithmetic, base conversions, logical operations, ASCII sheets, Roman translation, expression parsing, BigInt math, overflow bounds check).
- [x] **Debug Tools (v0.3.0)**: Complete 11 essential sub-tools (Output Comparer, Line Diff, Character Diff, Frequency Comparator, Sort Checker, Duplicate Finder, Array Shuffler, Whitespace Checker, Input Validator, Stress Test Comparator, Memory Estimator).
- [x] **Test Generator (v0.4.0)**: Complete 13 essential generators (Random Integer, Array, String, Matrix, Permutation, Graph, Tree, Queries, Intervals, Coordinates, Edge Cases, Custom Constraints, Batch Cases).
- [x] **Number Theory & Bits (v0.5.0)**: Complete 15 math and bits utilities (Prime Checker, Sieve, Segmented Sieve, Factorization, Divisors, GCD/LCM, Extended Euclid, Modular Exponentiation, Modular Inverse, Euler Phi, Möbius, Chinese Remainder Theorem, Bitwise Playground, Gray Code, XOR Playground).
- [x] **String Laboratory (v0.6.0)**: Complete 15 string matching and DP utilities (Character Frequency, Palindrome Checker, Reverse, Rotation, Anagram, Substring Search, Prefix Function, Z Function, Rolling Hash, Edit Distance, LCP, LCS, Longest Palindrome, Suffix Array, Aho-Corasick placeholder).
- [x] **Matrix Laboratory (v0.7.0)**: Complete 15 matrix, grid, and pathfinding utilities (Matrix Generator, Transpose, Rotation, Multiplication, Identity/Diagonal, 2D Prefix Sum, Exponentiation, Determinants, Rank, Spiral/Diagonal sweeps, Grid BFS/DFS animations, Flood Fill paint component, and Pathfinding animations).
- [x] **Graph Laboratory (v0.8.0)**: Complete 14 graph, traversal, shortest path, spanning tree, and connectivity utilities (BFS/DFS, Dijkstra, Bellman-Ford, Floyd-Warshall matrix, Topological Sort, Prim/Kruskal MST, DSU forest, Bipartite coloring, Critical Bridges, Articulation Points, Kosaraju SCC, and topological graph properties).
- [ ] **Contest Scrapers**:
  - [ ] Problem scrapers/parsers (Codeforces, AtCoder, CodeChef) to auto-download test case inputs/outputs.
  - [ ] Workspace template auto-generators supporting custom user macros.

---

## 📊 Phase 3: Algorithmic Visualizers (Upcoming)
*Goal: Help programmers visualize complex algorithms step-by-step.*

- [ ] **Algorithmic Visualizers**:
  - [ ] Graph search visualizer (BFS/DFS tree builders).
  - [ ] Shortest path visualizer (Dijkstra, Bellman-Ford step-by-step executions).
- [ ] **Quick Reference**:
  - [ ] Complexity charts, fast I/O optimizations, and template cheatsheets.

---

## 📚 Phase 4: Algorithmic Libraries (Future Extensions)
*Goal: Package highly-optimized, copy-pasteable reference code for classic CP topics.*

- [ ] **Tree**: LCA, Segment Trees, Fenwick, Centroid Decomposition.
- [ ] **Dynamic Programming**: Classic patterns, bitmask optimization, digit DP, and Convex Hull Trick.
- [ ] **Greedy**: Interval scheduling, exchange argument references.
- [ ] **Geometry**: Convex hull solvers, line intersection checks.
