# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-07-08

### Added
- Completed **Dynamic Programming Studio (DP)** module containing 16 tools:
  - Reusable Dynamic Programming Table Grid with row/col labels and backtrack path highlighting.
  - 0/1 Knapsack Solver with interactive profit grids and selected item backtracking.
  - Coin Change Solver evaluating minimum coins and total unique combinations.
  - LCS Subsequence solver highlighting diagonal character matches.
  - LIS Sequence solver tracing lengths, parents list, and subsets.
  - Edit Distance solver rendering edit operations trace logs.
  - Matrix Chain Multiplication minimizing multiplications via interval splits.
  - Subset Sum Solver displaying boolean possibility grids.
  - Rod Cutting Solver maximizing profit segments sales values.
  - Partition Problem splitting disjoint equal subsets.
  - Memoization Playground tracing top-down recursion cache hits.
  - Tabulation Playground tracing bottom-up loop iterations.
  - Space Optimization comparing O(N * S) 2D tables vs O(S) 1D rows.
  - Coming Soon Advanced DP templates: Digit DP, Tree DP, Bitmask DP, and Travelling Salesman.
- Shared DP Studio layout components: `DpLayout`, `DpHeader`, and `EducationalPanel`.

---

## [0.9.0] - 2026-07-08

### Added
- Completed **Tree Laboratory (TR)** module containing 12 tools:
  - Interactive Tree Layout Canvas with DFS hierarchical node distributions.
  - Tree Traversals tracing preorder, inorder, postorder, and level-order lists.
  - Binary Search Tree (BST) point insertions, deletions, and lookup steps.
  - AVL Tree self-balancing rotations.
  - Binary Heap point insertions, deletions, array representation mirrors, and heapify swapping traces.
  - Segment Tree build, update, and range sum queries.
  - Lazy Segment Tree range additions and deferred lazy tag propagations.
  - Fenwick Tree prefix sum range queries and point updates.
  - Trie prefix character lookups and search matches.
  - Lowest Common Ancestor (LCA) binary lifting parent tables.
  - Euler Tour DFS entry and exit times flattening tree ranges.
  - Tree Diameter dual DFS sweeps.
  - Centroid Decomposition recursive centroid tree structures.
- Shared tree components: `TrLayout`, `TrHeader`, `EducationalPanel`, and `TreeCanvas`.

---

## [0.8.0] - 2026-07-08

### Added
- Completed **Graph Laboratory (GR)** module containing 14 tools:
  - Interactive SVG Graph Canvas editor with node dragging, edge weights, and directed/undirected configurations.
  - BFS Traversal tracing FIFO queue orders and unweighted layer distances.
  - DFS Traversal tracing recursive call stack exploration steps.
  - Dijkstra Solver tracing weighted greedy relaxations and parent paths.
  - Bellman-Ford Solver detecting negative weight cycles.
  - Floyd-Warshall Matrix computing all-pairs shortest paths.
  - Topological Sort running Kahn's in-degree queue algorithm.
  - Prim's MST constructing greedily grown spanning trees.
  - Kruskal's MST constructing sorted spanning edges via DSU.
  - DSU / Union-Find tracing representatives and rank balances dynamically.
  - Bipartite Checker two-coloring vertices and highlighting odd-cycle conflicts.
  - Critical Bridges detecting cut-edges.
  - Articulation Points detecting cut-vertices.
  - Kosaraju SCC grouping strongly connected subgraphs via dual DFS.
  - Graph Properties auditing densities, degree matrices, component sizes, cycle indicators, DAG and Tree checks.
- Shared graph components: `GrLayout`, `GrHeader`, `EducationalPanel`, and `GraphCanvas`.

---

## [0.7.0] - 2026-07-08

### Added
- Completed **Matrix Laboratory (MX)** module containing 15 tools:
  - Matrix Generator supporting random, binary, identity, sparse, and weighted grid formations.
  - Matrix Transpose swapping square or rectangular matrix rows and columns with live outputs.
  - Matrix Rotation pivoting values by 90°, 180°, or 270° clockwise or counter-clockwise.
  - Matrix Multiplication offering size validation audits and tracing element multiplication arithmetic formulas.
  - Identity Matrix creating custom diagonal arrays and identity templates.
  - Prefix Sum Matrix calculating 2D prefix sums supporting interactive query bounds queries.
  - Matrix Exponentiation calculating modular matrices fast power binary loops.
  - Determinant solving 2x2 and 3x3 expansion scalars.
  - Matrix Rank determining linearly independent rows via Gaussian reduction tracing logs.
  - Spiral Traversal tracing clockwise/counter-clockwise circular index sweeps.
  - Diagonal Traversal listing primary, anti-diagonal, and 2D zigzag paths.
  - Grid BFS illustrating unweighted grid searches using animated FIFO queues and wall builders.
  - Grid DFS tracing recursive reachability paths.
  - Flood Fill paint bucket tool labeling contiguous components.
  - Pathfinding Grid integrating BFS animations and Dijkstra/A* visualizer placeholders.
- Shared matrix components: `MxLayout`, `MxHeader`, `EducationalPanel`, `MatrixInput`, and `MatrixGrid`.

---

## [0.6.0] - 2026-07-08

### Added
- Completed **String Laboratory (ST)** module containing 15 tools:
  - Character Frequency Counter parsing unique/duplicate characters and sorting frequencies.
  - Palindrome Checker validating mirror strings with case, spaces, and punctuation filters, and mismatch positions.
  - Reverse String supporting characters, words, and lines reversal inside a multiline editor.
  - String Rotation generating cyclic left/right shifts and validating rotations.
  - Anagram Checker comparing character frequency distributions side-by-side.
  - Substring Search highlighting naive pattern index occurrences.
  - Prefix Function (KMP) computing the proper prefix-suffix matching table (pi array) with step traces.
  - Z Function computing Z-array values using active search window intervals.
  - Rolling Hash calculating polynomial rolling checksums and warning on hash collisions.
  - Edit Distance (Levenshtein) drawing interactive dynamic programming grids.
  - Longest Common Prefix finding common starts for multiple strings.
  - Longest Common Subsequence (LCS) rendering DP tables and backtracking paths.
  - Longest Palindromic Substring returning start offset index and length.
  - Suffix Array lexicographically sorting suffix indices.
  - Aho-Corasick Trie multi-pattern state machine roadmap placeholder.
- Shared string-laboratory components: `StLayout`, `StHeader`, and `EducationalPanel` with conceptual tabs.

---

## [0.5.0] - 2026-07-08

### Added
- Completed **Number Theory & Bits (NT)** module containing 15 mathematical tools:
  - Prime Checker checking primality, nearest primes, and prime factor products.
  - Sieve of Eratosthenes generating primes list up to N.
  - Segmented Sieve generating range [L, R] primes up to 10^9.
  - Prime Factorization decomposing integers into prime power exponents.
  - Divisors Calculator listing sorted divisors, count, and sums.
  - GCD & LCM computing greatest common divisors and least common multiples for multiple inputs.
  - Extended Euclidean Solver returning GCD and Bezout coefficients (x, y) satisfying ax + by = gcd.
  - Modular Exponentiation computing modular binary powers (A^B) % M with step traces.
  - Modular Inverse Solver solving A^-1 mod M using Extended Euclid or Fermat's Little Theorem.
  - Euler Totient Solver computing coprime counts phi(N).
  - Mobius Function Solver computing mobius mu(N) values.
  - Chinese Remainder Theorem solving systems of simultaneous congruences for coprime moduli.
  - Bitwise Playground displaying AND, OR, XOR, shifts in decimal, hex, and binary grids.
  - Gray Code Generator converting Binary <-> Gray code bidirectionally.
  - XOR Playground calculating array prefix XORs and O(1) integer range XOR cycles.
- Shared number-theory wrapper components: `NtLayout`, `NtHeader`, and `EducationalPanel` with conceptual tabs.

---

## [0.4.0] - 2026-07-08

### Added
- Completed **Test Generator (GEN)** module containing 13 data generators:
  - Random Integer with min/max, negative value filters, hash-set uniqueness, and sorting.
  - Random Array with N length, min/max values, duplicates, sorted, shuffles, and layout spacing.
  - Random String with fixed/random length ranges, character checkboxes, and custom charsets.
  - Random Matrix with binary, sparse (with density probability), and identity matrix styles.
  - Random Permutation with N size and 0-indexed vs 1-indexed.
  - Random Graph edge list generator supporting directed/undirected, weighted, connected, and DAGs.
  - Random Tree binary/general structure configurations, random roots, and edge weights.
  - Random Queries point updates, range queries, and numeric key formats.
  - Random Interval standard, nested, and disjoint [L, R] interval spans.
  - Coordinate Generator 2D and 3D floating point coordinates with decimal precision scales.
  - Edge Case Generator preconfigured corner values (min, max, overflows, duplicates, reversed).
  - Constraint Builder compound input configurations (N, M, cell density, matrices, query sets).
  - Batch Generator case collector directories (up to 1000 files) with ZIP download placeholders.
- Re-routed sidebar links from `/generator` to `/test-generator`.
- Shared generator wrapper components: `GeneratorLayout`, `GeneratorHeader`, and `PreviewPanel`.

---

## [0.3.0] - 2026-07-08

### Added
- Completed **Debug Tools (DBG)** module containing 11 essential debugging tools:
  - Output Comparer comparing expected against candidate output files with newline ignore options.
  - Line Difference highlighting correct, missing, extra, or modified lines with visibility toggles.
  - Character Difference pinpointing first mismatch character index, line number, column, and ASCII code.
  - Frequency Comparator contrast count occurrences for integers, characters, or words between datasets.
  - Sort Checker validating ascending/descending sorting strictly or non-strictly with index indicators.
  - Duplicate Finder scanning duplicate frequencies and index offsets.
  - Array Shuffler randomizing arrays using Fisher-Yates with LCG deterministic seeds.
  - Whitespace Checker scanning trailing spaces, tabs, mixed indents, and duplicate newlines.
  - Input Validator checking constraints limits for strings, vectors, and matrices.
  - Stress Test (MVP) comparison station matching outputs from brute force against optimized solvers.
  - Memory Estimator estimating heap footprint limits in MB for C++ variables and containers.
- Re-routed sidebar navigation maps from `/debug` to `/debug-tools`.
- Shared debug components: `DiffViewer`, `InputEditor` with row line numbers gutter, and `OutputViewer`.

---

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
