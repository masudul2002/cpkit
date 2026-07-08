# Greedy Studio (GD) Feature Documentation

CPKit Greedy Studio (GD) provides interactive visualizers for interval schedulers, commodity density knapsacks, priority queue optimal merges, and greedy coin limitations simulations.

---

## 🛠️ Implemented Greedy Tools

### 1. Activity Selection
- **Route**: `/greedy/activity-selection`
- **Features**: Sorts activities by finish times, selecting the maximum compatible subset.
- **Complexities**:
  - **Time**: $O(N \log N)$
  - **Space**: $O(N)$

### 2. Fractional Knapsack
- **Route**: `/greedy/fractional-knapsack`
- **Features**: Maximizes knapsack profits by sorting item value-to-weight densities fractionally.
- **Complexities**:
  - **Time**: $O(N \log N)$
  - **Space**: $O(N)$

### 3. Job Sequencing
- **Route**: `/greedy/job-sequencing`
- **Features**: Schedules jobs in deadline slots greedily using descending profit sorting.
- **Complexities**:
  - **Time**: $O(N^2)$
  - **Space**: $O(\text{MaxDeadline})$

### 4. Minimum Platforms
- **Route**: `/greedy/minimum-platform`
- **Features**: Calculates parallel platform tracks needed at any instant in a schedule.
- **Complexities**:
  - **Time**: $O(N \log N)$
  - **Space**: $O(N)$

### 5. Interval Scheduling
- **Route**: `/greedy/interval-scheduling`
- **Features**: Greedily selects maximum compatible interval ranges.
- **Complexities**:
  - **Time**: $O(N \log N)$
  - **Space**: $O(N)$

### 6. Merge Intervals
- **Route**: `/greedy/interval-merging`
- **Features**: Merges overlapping 1D segments by sorting starts.
- **Complexities**:
  - **Time**: $O(N \log N)$
  - **Space**: $O(N)$

### 7. Huffman Coding
- **Route**: `/greedy/huffman`
- **Features**: Builds prefix trees and computes compression ratios vs 8-bit ASCII.
- **Complexities**:
  - **Time**: $O(N \log N)$
  - **Space**: $O(N)$

### 8. Coin Greedy
- **Route**: `/greedy/coin-greedy`
- **Features**: Simulates greedy coin change making, highlighting optimal vs suboptimal non-canonical coin cases.
- **Complexities**:
  - **Time**: $O(\text{CoinsCount})$
  - **Space**: $O(1)$

### 9. Gas Station
- **Route**: `/greedy/gas-station`
- **Features**: Finds circular start index that maintains positive gas tank sweeps.
- **Complexities**:
  - **Time**: $O(N)$
  - **Space**: $O(1)$

### 10. Optimal Merge Pattern
- **Route**: `/greedy/optimal-merge`
- **Features**: Merges smallest files pairwise using priority queues.
- **Complexities**:
  - **Time**: $O(N \log N)$
  - **Space**: $O(N)$

### 11. Load Balancing
- **Route**: `/greedy/load-balancing`
- **Features**: Graham's LPT heuristic assigning load tasks to minimum load bins.
- **Complexities**:
  - **Time**: $O(N \log N)$
  - **Space**: $O(M)$
