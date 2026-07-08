# Dynamic Programming Studio (DP) Feature Documentation

CPKit Dynamic Programming Studio (DP) provides interactive visualizers for classic dynamic programming subproblem grids, space-optimized 1D state sweeps, and recursive memoization tracer logs.

---

## 🛠️ Implemented DP Tools

### 1. 0/1 Knapsack
- **Route**: `/dynamic-programming/knapsack`
- **Features**: Traces maximum item subset selection values in a 2D profit weight table, backtracking selected items.
- **Complexities**:
  - **Time**: $O(N \cdot W)$
  - **Space**: $O(N \cdot W)$

### 2. Coin Change
- **Route**: `/dynamic-programming/coin-change`
- **Features**: Traces minimum coins count needed to make a sum and total unique ways to make a change amount.
- **Complexities**:
  - **Time**: $O(N \cdot \text{Amount})$
  - **Space**: $O(N \cdot \text{Amount})$ / $O(\text{Amount})$ optimized

### 3. LCS Subsequence
- **Route**: `/dynamic-programming/lcs`
- **Features**: Solves the Longest Common Subsequence of two strings, highlighting matching diagonal paths.
- **Complexities**:
  - **Time**: $O(N \cdot M)$
  - **Space**: $O(N \cdot M)$

### 4. LIS Sequence
- **Route**: `/dynamic-programming/lis`
- **Features**: Traces the Longest Increasing Subsequence length and parent index backtracking elements.
- **Complexities**:
  - **Time**: $O(N^2)$
  - **Space**: $O(N)$

### 5. Edit Distance
- **Route**: `/dynamic-programming/edit-distance`
- **Features**: Computes min edit operations (insert, delete, replace) required to match strings.
- **Complexities**:
  - **Time**: $O(N \cdot M)$
  - **Space**: $O(N \cdot M)$

### 6. Matrix Chain Multiplication
- **Route**: `/dynamic-programming/matrix-chain`
- **Features**: Minimizes scalar multiplication operations by finding optimal bracket partition splits.
- **Complexities**:
  - **Time**: $O(N^3)$
  - **Space**: $O(N^2)$

### 7. Subset Sum
- **Route**: `/dynamic-programming/subset-sum`
- **Features**: Solves Subset Sum feasibility, displaying boolean possibility grids.
- **Complexities**:
  - **Time**: $O(N \cdot S)$
  - **Space**: $O(N \cdot S)$

### 8. Rod Cutting
- **Route**: `/dynamic-programming/rod-cutting`
- **Features**: Optimizes cuts of length segments to maximize total selling values.
- **Complexities**:
  - **Time**: $O(N^2)$
  - **Space**: $O(N)$

### 9. Partition Problem
- **Route**: `/dynamic-programming/partition`
- **Features**: Splits sets into equal-sum disjoint parts using Subset Sum.
- **Complexities**:
  - **Time**: $O(N \cdot S)$
  - **Space**: $O(N \cdot S)$

### 10. Memoization Playground
- **Route**: `/dynamic-programming/memoization`
- **Features**: Traces top-down recursion trees, tracking memoization cache hits.
- **Complexities**:
  - **Time**: $O(N)$
  - **Space**: $O(N)$

### 11. Tabulation Playground
- **Route**: `/dynamic-programming/tabulation`
- **Features**: Fills 1D arrays iteratively using bottom-up loops.
- **Complexities**:
  - **Time**: $O(N)$
  - **Space**: $O(N)$

### 12. Space Optimization
- **Route**: `/dynamic-programming/space-optimization`
- **Features**: Compares O(N * S) 2D grid spaces vs O(S) 1D optimized rows.
- **Complexities**:
  - **Time**: $O(N \cdot S)$
  - **Space**: $O(S)$

---

## 🏛️ Advanced DP Architecture (Coming Soon)
- **Digit DP** (`/dynamic-programming/digit-dp`): For range properties count queries.
- **Tree DP** (`/dynamic-programming/tree-dp`): Solving states over tree subtrees.
- **Bitmask DP** (`/dynamic-programming/bitmask-dp`): Matching state permutations using binary bit integer masks.
- **Travelling Salesman** (`/dynamic-programming/tsp`): Solving minimum cost cycles.
