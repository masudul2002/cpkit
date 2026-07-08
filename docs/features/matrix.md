# Matrix Laboratory (MX) Feature Documentation

CPKit Matrix Laboratory (MX) provides competitive programmers with interactive tools for matrix algebra, transformations, traversals, and pathfinding animations, alongside educational notes and complexity breakdowns.

---

## 🛠️ Implemented Matrix Tools

### 1. Matrix Generator
- **Route**: `/matrix/matrix-generator`
- **Features**: Generates random (1-9), binary (0 or 1), identity diagonal, sparse (mostly 0s), or large weighted (1-99) matrices.
- **Complexities**:
  - **Time**: $O(R \cdot C)$
  - **Space**: $O(R \cdot C)$

### 2. Matrix Transpose
- **Route**: `/matrix/transpose`
- **Features**: Flips a matrix over its main diagonal, supporting square or rectangular input matrices.
- **Complexities**:
  - **Time**: $O(R \cdot C)$
  - **Space**: $O(R \cdot C)$

### 3. Matrix Rotation
- **Route**: `/matrix/rotation`
- **Features**: Rotates matrices cyclically by 90°, 180°, or 270° in clockwise or counter-clockwise directions.
- **Complexities**:
  - **Time**: $O(R \cdot C)$
  - **Space**: $O(R \cdot C)$

### 4. Matrix Multiplication
- **Route**: `/matrix/multiplication`
- **Features**: Computes matrix product $C = A \times B$ with shape validation and traces element dot-product trace logs.
- **Complexities**:
  - **Time**: $O(R_A \cdot C_A \cdot C_B)$
  - **Space**: $O(R_A \cdot C_B)$

### 5. Identity & Diagonal Generator
- **Route**: `/matrix/identity`
- **Features**: Generates identity matrices or custom diagonal matrices with specific diagonal parameters.
- **Complexities**:
  - **Time**: $O(N^2)$
  - **Space**: $O(N^2)$

### 6. Prefix Sum Matrix
- **Route**: `/matrix/prefix-sum`
- **Features**: Computes 2D prefix sums and supports range query coordinate previews.
- **Complexities**:
  - **Time**: $O(R \cdot C)$ build, $O(1)$ query
  - **Space**: $O(R \cdot C)$ prefix grid

### 7. Matrix Exponentiation
- **Route**: `/matrix/matrix-power`
- **Features**: Computes fast binary exponentiation $A^K$ in logarithmic power steps on square matrices.
- **Complexities**:
  - **Time**: $O(N^3 \log K)$
  - **Space**: $O(N^2)$

### 8. Matrix Determinant
- **Route**: `/matrix/determinant`
- **Features**: Computes determinants for $2 \times 2$ and $3 \times 3$ matrices.
- **Complexities**:
  - **Time**: $O(1)$ for $N \le 3$, $O(N^3)$ via Gaussian
  - **Space**: $O(1)$

### 9. Matrix Rank
- **Route**: `/matrix/rank`
- **Features**: Computes matrix ranks using Gaussian row reduction steps.
- **Complexities**:
  - **Time**: $O(R^2 \cdot C)$
  - **Space**: $O(R \cdot C)$

### 10. Spiral Traversal
- **Route**: `/matrix/spiral`
- **Features**: Sweeps matrix values in a winding clockwise or counter-clockwise spiral, highlighting indexes.
- **Complexities**:
  - **Time**: $O(R \cdot C)$
  - **Space**: $O(R \cdot C)$

### 11. Diagonal Traversal
- **Route**: `/matrix/diagonal`
- **Features**: Traverses along primary, anti-diagonal, or 2D zigzag path lines.
- **Complexities**:
  - **Time**: $O(R \cdot C)$
  - **Space**: $O(R \cdot C)$

### 12. Grid BFS Traversal
- **Route**: `/matrix/grid-bfs`
- **Features**: Interactive grid editor supporting walls, starting/target pins, queue logs, and BFS path animations.
- **Complexities**:
  - **Time**: $O(R \cdot C)$
  - **Space**: $O(R \cdot C)$

### 13. Grid DFS Traversal
- **Route**: `/matrix/grid-dfs`
- **Features**: Interactive grid traversal simulating depth-first recursive paths.
- **Complexities**:
  - **Time**: $O(R \cdot C)$
  - **Space**: $O(R \cdot C)$

### 14. Flood Fill Paint
- **Route**: `/matrix/flood-fill`
- **Features**: Paint tool canvas allowing cell fills and showing connected components count.
- **Complexities**:
  - **Time**: $O(R \cdot C)$
  - **Space**: $O(R \cdot C)$

### 15. Pathfinding Grid
- **Route**: `/matrix/pathfinding`
- **Features**: BFS shortest-path solver with Dijkstra/A* roadmap placeholders.
- **Complexities**:
  - **Time**: $O(R \cdot C \log(R \cdot C))$ / $O(R \cdot C)$
  - **Space**: $O(R \cdot C)$
