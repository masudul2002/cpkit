# Search & Sorting Laboratory (SR) Feature Documentation

CPKit Search & Sorting Laboratory (SR) provides interactive visualizers for searching and sorting algorithms, custom comparator rules, stable sorting DEMOs, and multi-algorithm benchmark reports.

---

## 🛠️ Implemented Tools

### 1. Searching Algorithms
- **Linear Search**: Scan elements sequentially.
  - **Route**: `/search/linear-search`
  - **Time**: $O(N)$ | **Space**: $O(1)$
- **Binary Search**: Logarithmically divide search spaces on sorted arrays.
  - **Route**: `/search/binary-search`
  - **Time**: $O(\log N)$ | **Space**: $O(1)$
- **Lower Bound**: Find the first element index greater than or equal to the target.
  - **Route**: `/search/lower-bound`
  - **Time**: $O(\log N)$ | **Space**: $O(1)$
- **Upper Bound**: Find the first element index strictly greater than the target.
  - **Route**: `/search/upper-bound`
  - **Time**: $O(\log N)$ | **Space**: $O(1)$
- **Ternary Search**: Divide search range into three parts.
  - **Route**: `/search/ternary-search`
  - **Time**: $O(\log_3 N)$ | **Space**: $O(1)$
- **Binary Search on Answer**: Find optimal feasibility limits.
  - **Route**: `/search/binary-search-answer`
  - **Time**: $O(N \log \text{Sum})$ | **Space**: $O(1)$

### 2. Sorting Algorithms
- **Bubble Sort**: Scan and swap adjacent unsorted elements.
  - **Route**: `/sorting/bubble-sort`
  - **Time**: $O(N^2)$ | **Space**: $O(1)$
- **Selection Sort**: Find the minimum element and swap it to the front.
  - **Route**: `/sorting/selection-sort`
  - **Time**: $O(N^2)$ | **Space**: $O(1)$
- **Insertion Sort**: Insert each element into its sorted prefix slot.
  - **Route**: `/sorting/insertion-sort`
  - **Time**: $O(N^2)$ | **Space**: $O(1)$
- **Merge Sort**: Divide-and-conquer recursive split and merge.
  - **Route**: `/sorting/merge-sort`
  - **Time**: $O(N \log N)$ | **Space**: $O(N)$
- **Quick Sort**: Partition elements around pivot keys recursively.
  - **Route**: `/sorting/quick-sort`
  - **Time**: $O(N \log N)$ | **Space**: $O(\log N)$
- **Heap Sort**: Represent array as a binary max heap, repeatedly extract max elements.
  - **Route**: `/sorting/heap-sort`
  - **Time**: $O(N \log N)$ | **Space**: $O(1)$
- **Counting Sort**: Non-comparison sorting using value frequencies counts lists.
  - **Route**: `/sorting/counting-sort`
  - **Time**: $O(N + K)$ | **Space**: $O(K)$
- **Radix Sort**: Sort integers digit-by-digit from LSD to MSD stably.
  - **Route**: `/sorting/radix-sort`
  - **Time**: $O(D \cdot (N + B))$ | **Space**: $O(N + B)$
- **Bucket Sort**: Distribute elements into range buckets, sort buckets, and gather.
  - **Route**: `/sorting/bucket-sort`
  - **Time**: $O(N + B)$ | **Space**: $O(N + B)$

### 3. Playgrounds & Benchmarks
- **Sorting Benchmark Tool**: Compare running time, comparisons, swaps, and memory overheads across algorithms.
  - **Route**: `/sorting/sort-benchmark`
- **Custom Comparator Playground**: Test stable sorting invariants and user-defined records comparators.
  - **Route**: `/sorting/custom-comparator`
