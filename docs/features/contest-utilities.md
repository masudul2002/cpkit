# Contest Utilities (CU) Feature Documentation

CPKit Contest Utilities (CU) provides competitive programmers with essential numerical calculators, character search sheets, memory overflow analyzers, and math evaluators.

---

## 🛠️ Implemented Utilities

### 1. Fast Calculator
- **Route**: `/contest-utilities/calculator`
- **Features**: 
  - Standard floating arithmetic operations: `+`, `-`, `*`, `/`, `%` modulo.
  - Bracket grouping for custom priority.
  - Full keyboard mapping capturing numeric keys, backspace, clear keys.
  - Persistent operational logs saved to localStorage.
- **Complexities**:
  - **Time**: $O(N)$ where $N$ is expression string length.
  - **Space**: $O(N)$ for evaluation stack frames.

### 2. Base Converter
- **Route**: `/contest-utilities/base-converter`
- **Features**:
  - Convert values between Binary (Base 2), Octal (Base 8), Decimal (Base 10), and Hexadecimal (Base 16).
  - Bidirectional real-time conversion.
  - Input character validation checks.
- **Complexities**:
  - **Time**: $O(\log N)$ base conversions.
  - **Space**: $O(1)$ stack values.

### 3. Binary Calculator
- **Route**: `/contest-utilities/binary-calculator`
- **Features**:
  - Supports standard bitwise operations: `AND`, `OR`, `XOR`, `NOT`, and bitwise shifts (`<<`, `>>`).
  - Hides single operand input labels dynamically for single value operators (`NOT`).
  - Provides outputs in Decimal, Binary, and Hexadecimal formats.
- **Complexities**:
  - **Time**: $O(1)$ JS bit operations.
  - **Space**: $O(1)$.

### 4. ASCII Reference Table
- **Route**: `/contest-utilities/ascii-table`
- **Features**:
  - Searchable list mapping codes `0` through `127`.
  - Lists descriptions for non-printable control keys (e.g. NUL, LF, TAB, ESC).
  - Copy shortcuts mapping character values to clipboard.
- **Complexities**:
  - **Time**: $O(1)$ query search lookups.
  - **Space**: $O(1)$.

### 5. Roman Numeral Converter
- **Route**: `/contest-utilities/roman-converter`
- **Features**:
  - Translate Roman numeral inputs to decimal values and vice versa.
  - Restricts range values strictly to $1 \le N \le 3999$.
  - Enforces standard subtraction format syntax validation.
- **Complexities**:
  - **Time**: $O(N)$ where $N$ is Roman characters size.
  - **Space**: $O(1)$ memory constraints.

### 6. Expression Evaluator
- **Route**: `/contest-utilities/expression-evaluator`
- **Features**:
  - Parses compound mathematical equations securely.
  - Verifies bracket balancing before executing code.
  - Displays token splits (operators vs. numbers) dynamically.
- **Complexities**:
  - **Time**: $O(N)$ parse checks.
  - **Space**: $O(N)$ token lists.

### 7. Big Integer Calculator
- **Route**: `/contest-utilities/bigint-calculator`
- **Features**:
  - Bypasses standard double precision IEEE 754 limits using JS `BigInt`.
  - Supports basic operations alongside powers (`**`) and comparisons (`<`, `<=`, `==`, `!=`, `>`, `>=`).
  - Restricts exponent ranges to prevent browser locks.
- **Complexities**:
  - **Time**: $O(N)$ for multiplication/division lengths.
  - **Space**: $O(N)$ representation limits.

### 8. Overflow Checker
- **Route**: `/contest-utilities/overflow-checker`
- **Features**:
  - Evaluates integer sizes against primitive C++ data frames (`int8`, `uint8`, `int16`, `uint16`, `int32`, `uint32`, `int64`, `uint64`).
  - Lists C++ alias names (e.g. `long long` for `int64`).
  - Renders visual check/cross status badges showing bounds fit statuses.
- **Complexities**:
  - **Time**: $O(1)$ bounds check limits.
  - **Space**: $O(1)$ values.
