# Number Theory & Bits (NT) Feature Documentation

CPKit Number Theory & Bits (NT) provides competitive programmers with essential mathematical tools (prime checkers, sieves, factorizations, divisors, Diophantine solvers, modular arithmetic calculators, gray-code bits, and XOR prefix playground tools) alongside educational walkthrough logs and formulas.

---

## 🛠️ Implemented Mathematical Tools

### 1. Prime Checker
- **Route**: `/number-theory/prime-checker`
- **Features**: Checks primality up to $10^9$ using $6k \pm 1$ optimized trial division, locates nearest primes, and lists prime factor products.
- **Complexities**:
  - **Time**: $O(\sqrt{N})$
  - **Space**: $O(1)$

### 2. Sieve of Eratosthenes
- **Route**: `/number-theory/sieve`
- **Features**: Generates all prime numbers up to a specified limit $N$ (up to $100,000$) and lists primes count.
- **Complexities**:
  - **Time**: $O(N \log \log N)$
  - **Space**: $O(N)$

### 3. Segmented Sieve
- **Route**: `/number-theory/segmented-sieve`
- **Features**: Generates prime numbers in range $[L, R]$ where $R - L \le 100,000$ and $R \le 10^9$.
- **Complexities**:
  - **Time**: $O((R - L + 1) \log \log R + \sqrt{R} \log \log \sqrt{R})$
  - **Space**: $O(R - L + 1)$

### 4. Prime Factorization
- **Route**: `/number-theory/factorization`
- **Features**: Decomposes positive integers into prime factor power products, counts distinct primes, and calculates exponent sums.
- **Complexities**:
  - **Time**: $O(\sqrt{N})$
  - **Space**: $O(\log N)$

### 5. Divisors Calculator
- **Route**: `/number-theory/divisors`
- **Features**: Computes all divisors, returns a sorted divisor array, counts divisor quantities, and calculates the sum of divisors.
- **Complexities**:
  - **Time**: $O(\sqrt{N})$
  - **Space**: $O(\sqrt{N})$

### 6. GCD & LCM Calculator
- **Route**: `/number-theory/gcd-lcm`
- **Features**: Computes GCD and LCM for multiple space-separated integers, showing step-by-step resolution logs.
- **Complexities**:
  - **Time**: $O(K \log(\min(A, B)))$ where $K$ is integer count.
  - **Space**: $O(1)$

### 7. Extended Euclidean Solver
- **Route**: `/number-theory/extended-euclid`
- **Features**: Computes GCD and Bézout coefficients $(x, y)$ satisfying Bézout's identity: $ax + by = \gcd(a, b)$.
- **Complexities**:
  - **Time**: $O(\log(\min(A, B)))$
  - **Space**: $O(\log(\min(A, B)))$ recursion stack.

### 8. Modular Exponentiation
- **Route**: `/number-theory/modular-exponentiation`
- **Features**: Computes modular powers $(A^B) \pmod M$ using binary exponentiation, outputting step-by-step squaring and multiplying logs.
- **Complexities**:
  - **Time**: $O(\log B)$
  - **Space**: $O(1)$

### 9. Modular Inverse Solver
- **Route**: `/number-theory/modular-inverse`
- **Features**: Calculates modular multiplicative inverse $A^{-1} \pmod M$ using Extended Euclid or Fermat's Little Theorem.
- **Complexities**:
  - **Time**: $O(\log M)$
  - **Space**: $O(\log M)$

### 10. Euler Totient Solver
- **Route**: `/number-theory/euler-phi`
- **Features**: Computes Euler Totient function $\phi(N)$ (counting coprime integers up to $N$) and details product expansion fractions.
- **Complexities**:
  - **Time**: $O(\sqrt{N})$
  - **Space**: $O(\log N)$

### 11. Möbius Function Solver
- **Route**: `/number-theory/mobius`
- **Features**: Computes Möbius $\mu(N)$ values ($1$, $-1$, or $0$) based on square-free status and prime factor counts.
- **Complexities**:
  - **Time**: $O(\sqrt{N})$
  - **Space**: $O(1)$

### 12. Chinese Remainder Theorem
- **Route**: `/number-theory/crt`
- **Features**: Solves systems of simultaneous congruences $x \equiv a_i \pmod{m_i}$ for pairwise coprime moduli.
- **Complexities**:
  - **Time**: $O(K \log M)$ where $K$ is equations count.
  - **Space**: $O(K)$

### 13. Bitwise Playground
- **Route**: `/number-theory/bitwise-playground`
- **Features**: Live bitwise calculations (AND, OR, XOR, NOT, left/right shifts) displaying side-by-side decimal, hex, and binary grids.
- **Complexities**:
  - **Time**: $O(1)$
  - **Space**: $O(1)$

### 14. Gray Code Generator
- **Route**: `/number-theory/gray-code`
- **Features**: Converts standard decimal integers to reflected binary Gray code values bidirectionally.
- **Complexities**:
  - **Time**: $O(\log N)$
  - **Space**: $O(1)$

### 15. XOR Playground
- **Route**: `/number-theory/xor-playground`
- **Features**: Computes prefix XOR arrays, range XOR queries, and evaluates $O(1)$ range XORs of sequential integers.
- **Complexities**:
  - **Time**: $O(1)$ / $O(N)$ prefix array scans.
  - **Space**: $O(1)$ / $O(N)$.
