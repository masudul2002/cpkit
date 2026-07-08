# CPKit

> Everything a Competitive Programmer Needs — In One Place.

CPKit is an open-source Competitive Programming Toolkit designed to boost contest performance. It packages file parsers, test case stress testers, edge case generators, visualizers, references, and optimized library scripts into a single workspace.

The project features a modern, minimal, and developer-friendly UI inspired by Linear, Raycast, and Vercel.

---

## 🛠️ Feature Roadmap

To ensure a clean and modular architecture, features are isolated and lazy-loaded. Below is the active development status of planned modules:

### 🟢 Available Foundation
- **Contest Utilities (v0.2.0)**: Standard calculators, base conversion utilities, logical bit calculators, Roman-dec conversions, expression parsers, and searchable ASCII tables. See the [Contest Utilities Feature Docs](docs/features/contest-utilities.md) for full descriptions.
- **Debug Tools (v0.3.0)**: Compare brute-force outputs, run diff validations (line/character diffs, whitespace check), scan duplicate frequencies, evaluate sort order, shuffle array test inputs, and estimate container memory usages. See the [Debug Tools Feature Docs](docs/features/debug-tools.md) for full descriptions.
- **Test Generator (v0.4.0)**: Generate random integers, arrays, strings, matrix grids, permutations, graphs, tree topologies, queries, intervals, coordinates, preconfigured edge cases, custom constraint sets, and batch collections. See the [Test Generator Feature Docs](docs/features/test-generator.md) for full descriptions.
- **Number Theory & Bits (v0.5.0)**: Verify primality, run prime sieves (Eratosthenes, Segmented range), decompose prime factorizations, compute divisor structures, solve GCD/LCM, Extended Euclid, modular exponentiation/inverses, Euler phi, Möbius values, CRT systems, Gray codes, prefix/range XORs, and bitwise logic operations. See the [Number Theory Feature Docs](docs/features/number-theory.md) for full descriptions.
- **String Laboratory (v0.6.0)**: Analyze character frequencies, test palindromes, reverse segments/words/lines, generate left/right cyclic rotations, check anagram distributions, perform naive substring match highlights, calculate prefix functions (pi tables) and Z-arrays with interactive trace logs, compute polynomial rolling hashes, solve Edit Distance and Longest Common Subsequence (LCS) with dynamic programming tables, search longest palindromic substrings, sort suffix arrays, and query Aho-Corasick multi-pattern trie placeholders. See the [String Laboratory Feature Docs](docs/features/string-laboratory.md) for full descriptions.
- **Matrix Laboratory (v0.7.0)**: Construct random, binary, identity, sparse, or weighted matrices, compute square/rectangular transpositions, rotate elements cyclically, multiply matrices with shape validations and cell calculations steps, generate diagonal matrices, compute 2D prefix sums for O(1) range queries, evaluate fast matrix binary exponentiations, calculate scalar determinants, determine rank via Gaussian elimination, traverse grids spirally/diagonally/zigzag, run interactive BFS/DFS grid traversals, flood fill paint regions, and execute pathfinder animations. See the [Matrix Laboratory Feature Docs](docs/features/matrix.md) for full descriptions.
- **Graph Laboratory (v0.8.0)**: Build graphs interactively (add/delete/move/rename vertices, connect weighted/directed/undirected edges on SVG canvas), trace BFS/DFS queues and stacks, solve Dijkstra shortest paths, run Bellman-Ford cycle detections, compute Floyd-Warshall distance matrices, run Kahn topological sorts, construct Prim/Kruskal Minimum Spanning Trees, union disjoint sets in DSU trees, verify bipartite two-colorings, detect critical bridges and articulation points, extract Kosaraju SCC components, and audit densities, DAGs, Trees, and adjacency mappings. See the [Graph Laboratory Feature Docs](docs/features/graph.md) for full descriptions.
- **Tree Laboratory (v0.9.0)**: Visualize preorder, inorder, postorder, and level-order traversals recursively, run key insertions/deletions on BST and self-balancing AVL trees, bubble heapify heaps, query Segment Trees and Lazy Segment Tree ranges, compute Fenwick prefix sums using bitwise LSB operations, check Trie prefixes, query Lowest Common Ancestor (LCA) binary liftings, flatten trees to 1D Euler Tour arrays, find tree diameters, and decompose topologies using Centroid Decomposition. See the [Tree Laboratory Feature Docs](docs/features/tree.md) for full descriptions.
- **Dynamic Programming Studio (v1.0.0)**: Run interactive 2D profit matrices checks for 0/1 Knapsack, evaluate minimum coins and ways calculations for Coin Change, trace highlighted backtracking paths in LCS and Edit Distance, calculate Matrix Chain Multiplication optimal parenthesizations, solve Subset Sum and Equal Partition feasibility, audit rod cutting profits, trace recursion calls in Memoization, fill bottom-up arrays in Tabulation, compare original vs optimized memory spaces, and reference advanced Digit DP, Tree DP, Bitmask DP, and TSP coming soon placeholders. See the [Dynamic Programming Feature Docs](docs/features/dynamic-programming.md) for full descriptions.
- **Greedy Studio (v1.1.0)**: Run sorted activity compatible task timelines for Activity Selection and Interval Scheduling, calculate fractional item allocations in Fractional Knapsack, sequence jobs on deadlines slots, route train arrivals/departures in Minimum Platforms, merge overlapping segments in Merge Intervals, construct Huffman prefix trees, simulate local greedy coin failure cases, trace circular tank sweeps in Gas Station, merge priority queue files optimal patterns, and balance processor makespans in Load Balancing. See the [Greedy Feature Docs](docs/features/greedy.md) for full descriptions.
- **Search & Sorting Laboratory (v1.2.0)**: Run pointer sweeps in Linear Search, logarithmic interval splits in Binary Search, find lower and upper bounds, partition ternary search ranges, evaluate Book Allocation feasibility in Binary Search on Answer, animate comparisons and swaps in Bubble, Selection, Insertion, Merge, Quick, and Heap Sort, compute frequencies in Counting Sort, sort digit places in Radix Sort, distribute range buckets in Bucket Sort, benchmark sorting speeds, and test custom comparators stability. See the [Search & Sorting Feature Docs](docs/features/search-sorting.md) for full descriptions.
- **Geometry Laboratory (v1.3.0)**: Calculate point distances (Euclidean 2D/3D, Manhattan, Chebyshev), check point orientation turns (CW, CCW, Collinear), compute vector cross and dot products, solve line and segment intersections, animate Graham Scan convex hulls, compute Shoelace polygon areas and perimeters, check circles and triangles centroid/area/type detection, test Ray Casting point in polygon containments, and apply coordinate translation/rotation matrices. See the [Geometry Laboratory Feature Docs](docs/features/geometry.md) for full descriptions.
- **Quick Reference Center (v1.4.0)**: Search STL references, complexities tables, bit manipulation operations, modular arithmetic equations, graph/tree/DP/greedy algorithm cheatsheets, copyable C++/Python/Java/Go/Rust CP templates, and compiler optimization flags. See the [Quick Reference Feature Docs](docs/features/reference.md) for full descriptions.
- **Quality, Refactoring & Production Readiness (v1.5.0)**: Added global error boundaries, custom not found pages, dynamic robots/sitemap scripts, PWA configurations manifest, GitHub Actions CI compilation checks, developer and contributor guides, design systems, and security policies.
- **Contest Workspace (v2.0.0)**: Resizable multi-panel layout boards containing contest countdown clocks, local problems boards (Estimated vs Actual durations, status tags), persistent scratchpad markdown records, Focus Mode distraction-free panels, and embedded quick calculations tools. See the [Contest Workspace Feature Docs](docs/features/contest-workspace.md) for full descriptions.
- **Practice Workspace (v2.1.0)**: Resizable and collapsible practicing panel layouts filterable by problem collections, with custom dry-run code input console executions, typography size parameters, and persistent individual problem notes. See the [Practice Workspace Feature Docs](docs/features/practice-workspace.md) for full descriptions.
- **User Experience Modules (v2.2.0)**: Interactive global settings (themes, accent highlights, and configurations imports/exports), bookmarks favorites board, clearable recent activity logs list, and integrated help center FAQ guidelines. See the [User Experience Feature Docs](docs/features/platform.md) for full descriptions.
- **Brand Identity & Logo System (v1.6.0)**: Created official CPKit vector SVG logos, monogram icons, color configurations, and design spacing guidelines guidelines. See the [Brand guidelines Feature Docs](docs/features/brand-guidelines.md) for full descriptions.
- **Core Platform Experience (v1.6.0)**: Overhauled settings dashboards, bookmarks favorites panels, clearable history tracking list, help FAQ index sheets, release change logs, and bug reporting portals. See the [Platform Experience Feature Docs](docs/features/platform.md) for full descriptions.
- **Responsive Layout Shell**: Collapsible workspace sidebar and header search links.
- **Interactive Command Palette**: Global quick-actions launcher (triggered via `Cmd/Ctrl + K`) supporting theme cycling and route links.
- **Tailwind Design System**: Global styling tokens, layout containers, custom scroll views, responsive dividers, and modal boxes.

### 🟡 Planned Modules (Phase 2 & 3)
- **Contest Scrapers**: Parse test inputs from Codeforces, AtCoder, etc.

### 🔵 Future Library Extensions (Phase 4)

---

## 💻 Tech Stack

- **Frontend**: Next.js (App Router, Turbopack), TypeScript, Tailwind CSS v4, Framer Motion, Lucide Icons, Zustand, React Hook Form
- **Backend (Future)**: Node.js, Express, PostgreSQL, Prisma ORM, Redis
- **Hosting**: Vercel

---

## 📂 Project Directory Structure

```text
src/
├── app/                  # Next.js App Router (pages and layouts)
├── components/           # Shared UI and structural layout components
│   └── ui/               # Reusable atomic design system elements
├── constants/            # Static navigation variables
├── features/             # Isolated feature spaces (Contest-utils, debug, etc.)
├── hooks/                # Custom React hooks
├── lib/                  # Layout state store and merges
├── styles/               # CSS variables and tailwind properties
└── utils/                # Helper scripts
docs/                     # Design system guidelines and roadmap
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/masudul2002/CPKit.git
   cd CPKit
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the local development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🤝 Contributing

We welcome contributions from competitive programmers and web developers alike! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on branch naming conventions, Conventional Commit formatting, and pull request workflows.

---

## 👨‍💻 About the Developer

**MD. Masudul Hasan**
- 🎓 Computer Science & Engineering Student
- 🏫 Sunamganj Science and Technology University
- 💼 Computer Club Treasurer
- 🏆 Competitive Programmer & Open Source Contributor

**Links**:
- [Portfolio](https://www.masudulhasan.me)
- [GitHub](https://github.com/masudul2002)
- [LinkedIn](https://www.linkedin.com/in/masudul2002)
- [Codeforces Profile](https://codeforces.com/profile/masudul2002)
- 📧 [Email](mailto:23240442@sstu.ac.bd)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
