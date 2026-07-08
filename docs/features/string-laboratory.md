# String Laboratory (ST) Feature Documentation

CPKit String Laboratory (ST) provides competitive programmers with interactive tools for string matching, alignment, sorting, hashing, and sequence comparison, alongside educational walkthrough examples, complexity analysis, and CP tips.

---

## 🛠️ Implemented String Tools

### 1. Character Frequency Counter
- **Route**: `/string-laboratory/frequency-counter`
- **Features**: Counts total, unique, and duplicate character frequencies, rendering a sorted distribution table.
- **Complexities**:
  - **Time**: $O(N \log U)$
  - **Space**: $O(U)$

### 2. Palindrome Checker
- **Route**: `/string-laboratory/palindrome`
- **Features**: Verifies palindromes with case-sensitivity, spacing, and punctuation filters, and highlights character mismatch index positions.
- **Complexities**:
  - **Time**: $O(N)$
  - **Space**: $O(N)$

### 3. Reverse String
- **Route**: `/string-laboratory/reverse`
- **Features**: Reverses characters, space-separated words, or newlined text lines in a multiline editor.
- **Complexities**:
  - **Time**: $O(N)$
  - **Space**: $O(N)$

### 4. String Rotation
- **Route**: `/string-laboratory/rotation`
- **Features**: Generates left/right cyclic character shifts and checks if string B is a cyclic rotation of string A.
- **Complexities**:
  - **Time**: $O(N)$
  - **Space**: $O(N)$

### 5. Anagram Checker
- **Route**: `/string-laboratory/anagram`
- **Features**: Compares two strings, highlights frequency differences, and audits character distributions side-by-side.
- **Complexities**:
  - **Time**: $O(N + M)$
  - **Space**: $O(U)$

### 6. Substring Search
- **Route**: `/string-laboratory/substring-search`
- **Features**: Performs naive substring matching, returns offset lists, and highlights match indexes.
- **Complexities**:
  - **Time**: $O(N \cdot M)$
  - **Space**: $O(1)$

### 7. Prefix Function (KMP)
- **Route**: `/string-laboratory/prefix-function`
- **Features**: Generates the proper prefix-suffix matching table ($\pi$ array) and outputs step-by-step loop traces.
- **Complexities**:
  - **Time**: $O(N)$
  - **Space**: $O(N)$

### 8. Z Function
- **Route**: `/string-laboratory/z-function`
- **Features**: Generates Z-array values (longest common prefix of S and suffixes S[i..N-1]) using active search windows $[l, r]$.
- **Complexities**:
  - **Time**: $O(N)$
  - **Space**: $O(N)$

### 9. Rolling Hash
- **Route**: `/string-laboratory/rolling-hash`
- **Features**: Computes polynomial rolling hashes using adjustable prime bases and modulus limits, auditing for hash collisions.
- **Complexities**:
  - **Time**: $O(N)$
  - **Space**: $O(1)$

### 10. Edit Distance (Levenshtein)
- **Route**: `/string-laboratory/edit-distance`
- **Features**: Calculates minimum insertions, deletions, and substitutions to transform string A to B, drawing the complete DP table grid.
- **Complexities**:
  - **Time**: $O(N \cdot M)$
  - **Space**: $O(N \cdot M)$

### 11. Longest Common Prefix
- **Route**: `/string-laboratory/longest-common-prefix`
- **Features**: Computes the longest shared prefix among multiple strings, highlighting common slices.
- **Complexities**:
  - **Time**: $O(S)$ where $S$ is sum of lengths.
  - **Space**: $O(1)$

### 12. Longest Common Subsequence
- **Route**: `/string-laboratory/longest-common-subsequence`
- **Features**: Solves the longest common subsequence between two strings, rendering the DP table and highlighting the backtrack path.
- **Complexities**:
  - **Time**: $O(N \cdot M)$
  - **Space**: $O(N \cdot M)$

### 13. Longest Palindromic Substring
- **Route**: `/string-laboratory/longest-palindrome`
- **Features**: Finds the longest contiguous palindromic substring using center expansion scans, highlighting the match span.
- **Complexities**:
  - **Time**: $O(N^2)$
  - **Space**: $O(1)$

### 14. Suffix Array
- **Route**: `/string-laboratory/suffix-array`
- **Features**: Sorts all suffixes lexicographically, displaying suffix indexes, start offsets, and suffix string rows.
- **Complexities**:
  - **Time**: $O(N^2 \log N)$
  - **Space**: $O(N^2)$

### 15. Aho-Corasick Trie
- **Route**: `/string-laboratory/aho-corasick`
- **Features**: Multi-pattern suffix automaton placeholder (Coming Soon).
