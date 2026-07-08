# Test Generator (GEN) Feature Documentation

CPKit Test Generator (GEN) provides competitive programmers with structured utilities to generate high-quality test inputs (integers, arrays, strings, matrices, permutations, graphs, trees, queries, intervals, coordinates, edge cases, custom constraints, and batch files).

---

## 🛠️ Implemented Generators

### 1. Random Integer
- **Route**: `/test-generator/random-integer`
- **Options**: Min/Max bounds, quantity counts, negative value filters, hash-set uniqueness, and sorting.
- **Complexities**:
  - **Time**: $O(K \log K)$ where $K$ is quantity.
  - **Space**: $O(K)$ buffer size.

### 2. Random Array
- **Route**: `/test-generator/random-array`
- **Options**: Array length (N), min/max value bounds, duplicates, sorted, shuffles, and space/comma/newline separators.
- **Complexities**:
  - **Time**: $O(N)$ elements count.
  - **Space**: $O(N)$.

### 3. Random String
- **Route**: `/test-generator/random-string`
- **Options**: Fixed/random length ranges, letter checkboxes (lowercase, uppercase, digits, symbols), and custom charsets.
- **Complexities**:
  - **Time**: $O(N)$ characters.
  - **Space**: $O(N)$.

### 4. Random Matrix
- **Route**: `/test-generator/random-matrix`
- **Options**: Rows (N), columns (M), standard integer values, binary (0/1), sparse matrix (with density probability), and identity.
- **Complexities**:
  - **Time**: $O(N \times M)$ grid cells.
  - **Space**: $O(N \times M)$.

### 5. Random Permutation
- **Route**: `/test-generator/random-permutation`
- **Options**: Permutation length (N), 0-indexed ($0 \ldots N-1$) vs 1-indexed ($1 \ldots N$), and custom spacing formats.
- **Complexities**:
  - **Time**: $O(N)$ shuffles.
  - **Space**: $O(N)$.

### 6. Random Graph
- **Route**: `/test-generator/random-graph`
- **Options**: Nodes (N), edges (M), directed/undirected, weighted bounds, connected (ensures spanning tree first), and DAG topologies.
- **Complexities**:
  - **Time**: $O(N + M)$ edge mappings.
  - **Space**: $O(N + M)$.

### 7. Random Tree
- **Route**: `/test-generator/random-tree`
- **Options**: Nodes (N), binary (max 2 children degree) vs general tree, weights bounds, and randomized root label shuffles.
- **Complexities**:
  - **Time**: $O(N)$ node connects.
  - **Space**: $O(N)$.

### 8. Random Queries
- **Route**: `/test-generator/random-query`
- **Options**: Query count (Q), array limits (N), point updates, range queries, numeric keys (`1 L R`), or text keys (`Q L R`).
- **Complexities**:
  - **Time**: $O(Q)$ query lists.
  - **Space**: $O(Q)$.

### 9. Random Interval
- **Route**: `/test-generator/random-interval`
- **Options**: Quantity (Q), max range bounds (N), standard overlapping, disjoint (zero overlap coordinates), or nested intervals.
- **Complexities**:
  - **Time**: $O(Q \log Q)$ sorted points.
  - **Space**: $O(Q)$.

### 10. Coordinate Generator
- **Route**: `/test-generator/coordinate-generator`
- **Options**: Point count (Q), 2D (X, Y) vs 3D (X, Y, Z), integer values, floating-point decimals, and precision scales.
- **Complexities**:
  - **Time**: $O(Q)$ tuples.
  - **Space**: $O(Q)$.

### 11. Edge Case Generator
- **Route**: `/test-generator/edge-case-generator`
- **Options**: Preconfigured structures (integers, arrays, strings, graphs) matched to corner styles (min, max, overflows, duplicates, alternating, reversed).
- **Complexities**:
  - **Time**: $O(N)$ size.
  - **Space**: $O(N)$.

### 12. Constraint Builder
- **Route**: `/test-generator/constraint-builder`
- **Options**: Configures compound test templates like `(N, M) + Array + Queries` or `Matrix Grid` using customizable cell densities.
- **Complexities**:
  - **Time**: $O(N + M)$ generation.
  - **Space**: $O(N + M)$.

### 13. Batch Generator
- **Route**: `/test-generator/batch-generator`
- **Options**: Generates batch collections (10, 50, 100, 1000 files) with a sidebar inspector preview. Includes a mock ZIP download placeholder.
- **Complexities**:
  - **Time**: $O(Cases \times N)$.
  - **Space**: $O(Cases \times N)$.
