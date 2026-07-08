# Graph Laboratory (GR) Feature Documentation

CPKit Graph Laboratory (GR) provides competitive programmers with interactive tools for graph editing, traversal animations, shortest paths calculations, minimum spanning tree (MST) builders, and topological classifications.

---

## 🛠️ Implemented Graph Tools

### 1. BFS Traversal
- **Route**: `/graph/bfs`
- **Features**: Traces visited node queue sequences and unweighted layer distances.
- **Complexities**:
  - **Time**: $O(V + E)$
  - **Space**: $O(V)$

### 2. DFS Traversal
- **Route**: `/graph/dfs`
- **Features**: Visualizes call stack frame orders recursively.
- **Complexities**:
  - **Time**: $O(V + E)$
  - **Space**: $O(V)$

### 3. Dijkstra Solver
- **Route**: `/graph/dijkstra`
- **Features**: Calculates single-source shortest paths on weighted layouts, relaxation logs, and shortest path tree highlighting.
- **Complexities**:
  - **Time**: $O(E \log V)$
  - **Space**: $O(V + E)$

### 4. Bellman-Ford Solver
- **Route**: `/graph/bellman-ford`
- **Features**: Traces relaxation steps and flags negative weight cycles.
- **Complexities**:
  - **Time**: $O(V \cdot E)$
  - **Space**: $O(V)$

### 5. Floyd-Warshall Matrix
- **Route**: `/graph/floyd-warshall`
- **Features**: Computes all-pairs shortest paths, displaying the final distance matrix.
- **Complexities**:
  - **Time**: $O(V^3)$
  - **Space**: $O(V^2)$

### 6. Topological Sort
- **Route**: `/graph/topological-sort`
- **Features**: Evaluates dependency sorting orders on DAGs using Kahn's algorithm.
- **Complexities**:
  - **Time**: $O(V + E)$
  - **Space**: $O(V)$

### 7. Prim's MST
- **Route**: `/graph/prim`
- **Features**: Builds Minimum Spanning Trees greedily by growing vertex components.
- **Complexities**:
  - **Time**: $O(E \log V)$
  - **Space**: $O(V)$

### 8. Kruskal's MST
- **Route**: `/graph/kruskal`
- **Features**: Sorts edges and connects components utilizing DSU cycles checks.
- **Complexities**:
  - **Time**: $O(E \log V)$
  - **Space**: $O(V)$

### 9. DSU / Union-Find
- **Route**: `/graph/union-find`
- **Features**: Visualizes parent sets representatives and rank balances dynamically.
- **Complexities**:
  - **Time**: $O(\alpha(N))$
  - **Space**: $O(N)$

### 10. Bipartite Checker
- **Route**: `/graph/bipartite`
- **Features**: Traces odd cycles or conflicts while two-coloring vertices.
- **Complexities**:
  - **Time**: $O(V + E)$
  - **Space**: $O(V)$

### 11. Critical Bridges
- **Route**: `/graph/bridges`
- **Features**: Computes lowest discovery times, highlighting cut-edges.
- **Complexities**:
  - **Time**: $O(V + E)$
  - **Space**: $O(V)$

### 12. Articulation Points
- **Route**: `/graph/articulation`
- **Features**: Traces critical articulation vertices whose removal disconnects components.
- **Complexities**:
  - **Time**: $O(V + E)$
  - **Space**: $O(V)$

### 13. Kosaraju SCC
- **Route**: `/graph/scc`
- **Features**: Groups strongly connected directed subgraphs using dual DFS passes.
- **Complexities**:
  - **Time**: $O(V + E)$
  - **Space**: $O(V + E)$

### 14. Graph Properties
- **Route**: `/graph/graph-properties`
- **Features**: Comprehensive audit of densities, degree matrices, component sizes, cycle indicators, DAG and Tree checks.
- **Complexities**:
  - **Time**: $O(V + E)$
  - **Space**: $O(V + E)$
