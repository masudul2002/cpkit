export interface RefRecord {
  id: string;
  category: "STL Containers" | "Bitwise & Math" | "Cheatsheets" | "Templates & Compilers";
  title: string;
  subtitle: string;
  description: string;
  syntax?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  codeSnippet?: string;
  mistakes?: string[];
  tips?: string[];
}

export const REF_DATA: RefRecord[] = [
  // STL CONTAINERS
  {
    id: "vector",
    category: "STL Containers",
    title: "std::vector",
    subtitle: "Dynamic Array",
    description: "A sequence container that encapsulates dynamic size arrays.",
    syntax: "#include <vector>\nstd::vector<int> vec;",
    timeComplexity: "Access: O(1) | Insert/Delete End: O(1) amortized | Insert/Delete Middle: O(N)",
    spaceComplexity: "O(N) linear space layout",
    codeSnippet: `// Example vector usage
#include <vector>
#include <iostream>

int main() {
    std::vector<int> v = {1, 2, 3};
    v.push_back(4); // Insert at end
    std::cout << v[2] << " Size: " << v.size();
    return 0;
}`,
    mistakes: [
      "Accessing out-of-bounds indexes (vec[i] does not perform boundary checks; use vec.at(i) to throw error).",
      "Repeatedly inserting at the front of a vector (takes O(N) time; use std::deque instead)."
    ],
    tips: [
      "Use vec.reserve(N) before inserting elements to prevent expensive memory reallocations!"
    ]
  },
  {
    id: "pbds",
    category: "STL Containers",
    title: "Policy-Based Data Structures (PBDS)",
    subtitle: "Ordered Set / Multiset",
    description: "Extended set data structures providing index-based queries (find_by_order & order_of_key).",
    syntax: `#include <ext/pb_ds/assoc_container.hpp>
#include <ext/pb_ds/tree_policy.hpp>
using namespace __gnu_pbds;
typedef tree<int, null_type, std::less<int>, rb_tree_tag, tree_order_statistics_node_update> ordered_set;`,
    timeComplexity: "Search/Insert: O(log N) | find_by_order: O(log N) | order_of_key: O(log N)",
    spaceComplexity: "O(N)",
    codeSnippet: `// Example PBDS Ordered Set usage
#include <ext/pb_ds/assoc_container.hpp>
#include <ext/pb_ds/tree_policy.hpp>
#include <iostream>

using namespace __gnu_pbds;
typedef tree<int, null_type, std::less<int>, rb_tree_tag, tree_order_statistics_node_update> ordered_set;

int main() {
    ordered_set s;
    s.insert(1);
    s.insert(4);
    s.insert(8);
    // Find index of element 4 (returns 1)
    std::cout << "Index of 4: " << s.order_of_key(4) << "\\n";
    // Find element at index 2 (returns 8)
    std::cout << "Element at index 2: " << *s.find_by_order(2) << "\\n";
    return 0;
}`,
    mistakes: [
      "Forgetting RB tree namespaces headers causing compile errors in local compilers.",
      "Using std::less_equal for ordered multisets (breaks erase functions; map elements to pairs {value, unique_id} instead)."
    ],
    tips: [
      "Use PBDS ordered set when you need to query how many elements are strictly smaller than a value in log(N) time!"
    ]
  },

  // BITWISE & MATH
  {
    id: "bitwise-tricks",
    category: "Bitwise & Math",
    title: "Bit Manipulation",
    subtitle: "Bitwise Operators & Tricks",
    description: "Operations directly adjusting binary bits for state flags representation.",
    syntax: "// Common operations:\n(x & (1 << i)) // check i-th bit\n(x | (1 << i)) // set i-th bit\n(x ^ (1 << i)) // toggle i-th bit\n(x & ~(1 << i)) // clear i-th bit",
    timeComplexity: "All operations: O(1) clock cycle CPU execution",
    spaceComplexity: "O(1)",
    codeSnippet: `// Useful bitwise checks
#include <iostream>

int main() {
    int x = 12; // 1100 in binary
    
    // Check if power of two
    bool isPowerOfTwo = x && !(x & (x - 1));
    
    // Built-in popcount (counts set bits)
    int setBitsCount = __builtin_popcount(x);
    
    std::cout << "Popcount: " << setBitsCount << "\\n";
    return 0;
}`,
    mistakes: [
      "Operator precedence issues (e.g. x & 1 == 0 parses as x & (1 == 0); always wrap bitwise checks in parentheses: (x & 1) == 0)."
    ],
    tips: [
      "x & -x isolates the lowest set bit (LSB) of a number, which is the core property of Fenwick Trees!"
    ]
  },
  {
    id: "modular-arithmetic",
    category: "Bitwise & Math",
    title: "Modular Arithmetic",
    subtitle: "Modulo Arithmetic Rules",
    description: "Mathematical operations within residue fields preventing overflows.",
    syntax: "(A + B) % M = ((A % M) + (B % M)) % M\n(A - B) % M = ((A % M) - (B % M) + M) % M\n(A * B) % M = ((A % M) * (B % M)) % M",
    timeComplexity: "Addition/Multiplication: O(1) | Division Inverse: O(log M)",
    spaceComplexity: "O(1)",
    codeSnippet: `// Modular exponentiation & Modular Inverse
#include <iostream>

long long power(long long base, long long exp, long long mod) {
    long long res = 1;
    base %= mod;
    while (exp > 0) {
        if (exp % 2 == 1) res = (res * base) % mod;
        base = (base * base) % mod;
        exp /= 2;
    }
    return res;
}

// Fermat's Little Theorem: inverse of A modulo prime M is A^(M-2)
long long modInverse(long long n, long long prime) {
    return power(n, prime - 2, prime);
}`,
    mistakes: [
      "Performing modulo division directly as (A / B) % M (always multiply by the modular inverse of B modulo M instead)."
    ],
    tips: [
      "Ensure modulo calculations are inside positive boundaries: (val % M + M) % M to resolve negative residue values!"
    ]
  },

  // CHEATSHEETS
  {
    id: "graph-cheatsheet",
    category: "Cheatsheets",
    title: "Graph Algorithms",
    subtitle: "Complexities & Properties",
    description: "Traversal, shortest paths, spanning trees, and connectivity algorithms summary.",
    timeComplexity: "Dijkstra: O(E log V) | Bellman-Ford: O(V*E) | Floyd-Warshall: O(V^3) | Kruskal: O(E log E)",
    spaceComplexity: "O(V + E) adjacency lists representation",
    codeSnippet: `// Dijkstra Shortest Path structure
#include <vector>
#include <queue>

struct Edge { int to, weight; };
void dijkstra(int src, const std::vector<std::vector<Edge>>& adj, std::vector<int>& dist) {
    std::priority_queue<std::pair<int, int>, std::vector<std::pair<int, int>>, std::greater<>> pq;
    dist[src] = 0;
    pq.push({0, src});
    while(!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;
        for (auto& edge : adj[u]) {
            if (dist[u] + edge.weight < dist[edge.to]) {
                dist[edge.to] = dist[u] + edge.weight;
                pq.push({dist[edge.to], edge.to});
            }
        }
    }
}`,
    mistakes: [
      "Using Dijkstra on graphs containing negative weight edges (leads to infinite loop or incorrect results; use Bellman-Ford instead)."
    ]
  },

  // TEMPLATES & COMPILERS
  {
    id: "cpp-template",
    category: "Templates & Compilers",
    title: "C++ CP Template",
    subtitle: "Fast IO & Snippets template",
    description: "Clean competitive programming template containing fast I/O and common namespaces.",
    codeSnippet: `#include <bits/stdc++.h>
using namespace std;

// Speedup Fast I/O
void fast_io() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
}

void solve() {
    // Problem logic goes here
}

int main() {
    fast_io();
    int t = 1;
    cin >> t;
    while(t--) {
        solve();
    }
    return 0;
}`,
    tips: [
      "Never use std::endl inside loops (causes output buffers flushes; use '\\n' instead to prevent TLE errors)!"
    ]
  },
  {
    id: "compiler-flags",
    category: "Templates & Compilers",
    title: "C++ Compiler Flags",
    subtitle: "g++ & clang++ commands",
    description: "Common compiler optimization and warning compilation flags.",
    syntax: "g++ -O3 -Wall -Wextra -std=c++17 solution.cpp -o solution",
    codeSnippet: `# Optimization Flags
-O3                # Enable high-level optimization parameters
-Ofast              # Enable aggressive optimizations (violates strict IEEE compliance)

# Warnings & Debugging
-Wall -Wextra       # Enable all standard warning checkers
-fsanitize=address  # Enable address boundary sanitizers (detects segmentation faults)
-fsanitize=undefined # Detects undefined behaviors (overflows, divisions by zero)`,
  }
];
export const COMPLEXITY_DATA = [
  { n: 10, o1: 1, oLogN: 3, oN: 10, oNLogN: 33, oNSq: 100, oTwoN: 1024, oFactorial: 3628800 },
  { n: 20, o1: 1, oLogN: 4, oN: 20, oNLogN: 86, oNSq: 400, oTwoN: 1048576, oFactorial: 2.43e18 },
  { n: 50, o1: 1, oLogN: 6, oN: 50, oNLogN: 282, oNSq: 2500, oTwoN: 1.12e15, oFactorial: 3.04e64 },
  { n: 100, o1: 1, oLogN: 7, oN: 100, oNLogN: 664, oNSq: 10000, oTwoN: 1.26e30, oFactorial: 9.33e157 },
];
