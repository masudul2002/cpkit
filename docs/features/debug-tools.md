# Debug Tools (DBG) Feature Documentation

CPKit Debug Tools (DBG) provides competitive programmers with essential testing utilities, line-by-line diff engines, character mismatch indicators, sorting checkers, shufflers, input format validators, and memory estimators.

---

## 🛠️ Implemented Utilities

### 1. Output Comparer
- **Route**: `/debug-tools/output-comparer`
- **Features**: 
  - Compare expected output with received outputs line by line.
  - Option to ignore trailing newlines (`\n`) and carriage returns (`\r`).
  - Summarizes comparison with color-coded verdict banners (Matches vs Mismatches).
- **Complexities**:
  - **Time**: $O(N)$ where $N$ is text character size.
  - **Space**: $O(N)$ line splits.

### 2. Line Difference Checker
- **Route**: `/debug-tools/line-diff`
- **Features**:
  - Highlights precise differences: Correct, Missing, Extra, or Changed.
  - Includes checkboxes to filter and focus on specific difference statuses (e.g. "Only show Changed lines").
- **Complexities**:
  - **Time**: $O(N)$ where $N$ is lines count.
  - **Space**: $O(N)$ lines storage.

### 3. Character Difference Locator
- **Route**: `/debug-tools/character-diff`
- **Features**:
  - Scans character by character to pinpoint the first mismatch.
  - Reports 1-based character index, line number, column position, and ASCII codes.
- **Complexities**:
  - **Time**: $O(N)$ character scanning.
  - **Space**: $O(1)$ memory.

### 4. Frequency Comparator
- **Route**: `/debug-tools/frequency-compare`
- **Features**:
  - Tokenizes datasets as integers, words, or characters.
  - Counts occurrence frequencies and contrasts them between two inputs (Dataset A vs Dataset B).
- **Complexities**:
  - **Time**: $O(N \log N)$ map sorting.
  - **Space**: $O(N)$ maps memory.

### 5. Sort Checker
- **Route**: `/debug-tools/sort-checker`
- **Features**:
  - Validates sort constraints: Ascending, Descending, Strict (unique), and Non-strict (duplicates allowed).
  - Highlights the 1-based index and value of the first breaking element.
- **Complexities**:
  - **Time**: $O(N)$ array elements scan.
  - **Space**: $O(1)$ registers.

### 6. Duplicate Finder
- **Route**: `/debug-tools/duplicate-finder`
- **Features**:
  - Locates duplicates inside a list of items.
  - Outputs value, frequency count, and a list of all occurrence indices.
- **Complexities**:
  - **Time**: $O(N)$ mapping scan.
  - **Space**: $O(N)$ map storage.

### 7. Array Shuffler
- **Route**: `/debug-tools/shuffle-array`
- **Features**:
  - Randomizes elements list using the Fisher-Yates (Knuth) shuffle algorithm.
  - Supports deterministic seeded generation using a Linear Congruential Generator (LCG).
- **Complexities**:
  - **Time**: $O(N)$ swap passes.
  - **Space**: $O(N)$ array duplicate.

### 8. Whitespace Checker
- **Route**: `/debug-tools/whitespace-checker`
- **Features**:
  - Scans for layout formatting errors (trailing spaces, tabs, mixed spaces/tabs, consecutive blank lines).
  - Helps resolve Presentation Errors (PE) on picky judges.
- **Complexities**:
  - **Time**: $O(N)$ lines scan.
  - **Space**: $O(N)$ warnings storage.

### 9. Input Validator
- **Route**: `/debug-tools/input-validator`
- **Features**:
  - Validates formatting types (Integers, Floats, Strings, 1D Arrays, 2D Matrices).
  - Checks sizes ($N$, $M$) and constraints bounds (Min/Max values).
- **Complexities**:
  - **Time**: $O(N)$ elements scan.
  - **Space**: $O(1)$ memory.

### 10. Stress Test (MVP)
- **Route**: `/debug-tools/stress-test`
- **Features**:
  - Simulates stress-testing comparator runs.
  - Allows pasting test case inputs alongside brute-force and optimized outputs.
  - Provides a drafting layout for random generator script writing.
- **Complexities**:
  - **Time**: $O(N)$ comparison.
  - **Space**: $O(N)$ lines diffs.

### 11. Memory Estimator
- **Route**: `/debug-tools/memory-estimator`
- **Features**:
  - Calculates heap footprint in Megabytes (MB) for C++ containers (`vector`, `vector<vector>`, `string`, `int`, etc.).
  - Alerts users visually when estimated allocation exceeds platform memory limits (128MB, 256MB, 512MB, 1024MB).
- **Complexities**:
  - **Time**: $O(1)$ estimation math.
  - **Space**: $O(1)$.
