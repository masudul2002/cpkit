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
- **Responsive Layout Shell**: Collapsible workspace sidebar and header search links.
- **Interactive Command Palette**: Global quick-actions launcher (triggered via `Cmd/Ctrl + K`) supporting theme cycling and route links.
- **Tailwind Design System**: Global styling tokens, layout containers, custom scroll views, responsive dividers, and modal boxes.

### 🟡 Planned Modules (Phase 2 & 3)
- **Contest Scrapers**: Parse test inputs from Codeforces, AtCoder, etc.
- **Quick Reference**: Formula cheatsheets and fast I/O macros.

### 🔵 Future Library Extensions (Phase 4)
- **Strings**: KMP matching, Trie structures, Z-Array, and Suffix automatons.
- **Matrix**: Exponentiation and Gaussian elimination.
- **Graph & Tree**: LCA, Segment Trees, shortest paths, and max flows.
- **Dynamic Programming**: Classic patterns and bitmask optimizations.
- **Greedy**: Optimization structures and scheduling.
- **Geometry**: Convex hulls and segment intersections.

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
