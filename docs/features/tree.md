# Tree Laboratory (TR) Feature Documentation

CPKit Tree Laboratory (TR) provides competitive programmers with interactive tools for hierarchical tree visualization, segment tree range sum/min checks, binary lifting LCA tables, Euler tours, and centroid tree decompositions.

---

## 🛠️ Implemented Tree Tools

### 1. Tree Traversals
- **Route**: `/tree/binary-tree`
- **Features**: Traces DFS pre-order, in-order, post-order, and BFS level-order sequences.
- **Complexities**:
  - **Time**: $O(N)$
  - **Space**: $O(N)$

### 2. Binary Search Tree (BST)
- **Route**: `/tree/bst`
- **Features**: Interactive insertions, deletions, and key lookups.
- **Complexities**:
  - **Time**: $O(\log N)$ average / $O(N)$ worst case
  - **Space**: $O(N)$

### 3. AVL Tree
- **Route**: `/tree/avl`
- **Features**: Self-balancing BST using automatic LL, RR, LR, and RL rotations.
- **Complexities**:
  - **Time**: $O(\log N)$ guaranteed
  - **Space**: $O(N)$

### 4. Binary Heap
- **Route**: `/tree/heap`
- **Features**: Min/Max heap modes, flat 1D array mirroring, and bubble heapify steps.
- **Complexities**:
  - **Time**: $O(\log N)$ operations / $O(1)$ top access
  - **Space**: $O(N)$

### 5. Segment Tree
- **Route**: `/tree/segment-tree`
- **Features**: Query range sums and apply point updates over segment bounds.
- **Complexities**:
  - **Time**: $O(\log N)$ query & updates
  - **Space**: $O(N)$

### 6. Lazy Segment Tree
- **Route**: `/tree/lazy-segment-tree`
- **Features**: Apply range additions and trace deferred tag propagation.
- **Complexities**:
  - **Time**: $O(\log N)$ lazy query & updates
  - **Space**: $O(N)$

### 7. Fenwick Tree
- **Route**: `/tree/fenwick`
- **Features**: Prefix sum calculations and point updates using bitwise LSB operations.
- **Complexities**:
  - **Time**: $O(\log N)$ query & updates
  - **Space**: $O(N)$

### 8. Trie (Prefix Tree)
- **Route**: `/tree/trie`
- **Features**: Inserts words and traces prefix lookups.
- **Complexities**:
  - **Time**: $O(L)$ length of word
  - **Space**: $O(N \cdot \Sigma)$ alphabet size $\Sigma$

### 9. Lowest Common Ancestor (LCA)
- **Route**: `/tree/lca`
- **Features**: Queries lowest common ancestors using binary lifting tables.
- **Complexities**:
  - **Time**: $O(N \log N)$ prep / $O(\log N)$ query
  - **Space**: $O(N \log N)$

### 10. Euler Tour DFS
- **Route**: `/tree/euler-tour`
- **Features**: Flatten tree structures to 1D arrays with subtree entry/exit times.
- **Complexities**:
  - **Time**: $O(N)$
  - **Space**: $O(N)$

### 11. Tree Diameter
- **Route**: `/tree/diameter`
- **Features**: Calculates maximum path lengths using dual DFS sweeps.
- **Complexities**:
  - **Time**: $O(N)$
  - **Space**: $O(N)$

### 12. Centroid Decomposition
- **Route**: `/tree/centroid`
- **Features**: Decomposes tree topologies recursively into centroid trees.
- **Complexities**:
  - **Time**: $O(N \log N)$
  - **Space**: $O(N)$
