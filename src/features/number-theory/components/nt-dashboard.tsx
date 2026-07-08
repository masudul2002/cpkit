"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import {
  Search,
  Star,
  ArrowRight,
  ShieldCheck,
  Layers,
  ListCollapse,
  Binary,
  Divide,
  GitCommit,
  Calculator,
  TrendingUp,
  RotateCcw,
  HelpCircle,
  Sliders,
  Columns,
  Cpu,
  Shuffle,
  Zap
} from "lucide-react";

interface NtToolItem {
  id: string;
  title: string;
  description: string;
  category: "Primes" | "Decomposition" | "Operators" | "Modulus" | "Functions" | "Bits";
  difficulty: "Easy" | "Medium" | "Hard";
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  timeComplexity: string;
}

const NT_TOOLS: NtToolItem[] = [
  {
    id: "prime-checker",
    title: "Prime Checker",
    description: "Verify if a number is prime or composite, locate nearest primes, and check prime factors.",
    category: "Primes",
    difficulty: "Easy",
    href: "/number-theory/prime-checker",
    icon: ShieldCheck,
    timeComplexity: "O(sqrt(N))",
  },
  {
    id: "sieve",
    title: "Sieve of Eratosthenes",
    description: "Generate all prime numbers up to a specified limit N using Eratosthenes sieve algorithm.",
    category: "Primes",
    difficulty: "Easy",
    href: "/number-theory/sieve",
    icon: Layers,
    timeComplexity: "O(N log log N)",
  },
  {
    id: "segmented-sieve",
    title: "Segmented Sieve",
    description: "Generate prime numbers within a range [L, R] using optimized segmented intervals.",
    category: "Primes",
    difficulty: "Medium",
    href: "/number-theory/segmented-sieve",
    icon: ListCollapse,
    timeComplexity: "O(R - L + 1)",
  },
  {
    id: "factorization",
    title: "Prime Factorization",
    description: "Decompose a positive integer N into its constituent prime factor exponents representation.",
    category: "Decomposition",
    difficulty: "Easy",
    href: "/number-theory/factorization",
    icon: Binary,
    timeComplexity: "O(sqrt(N))",
  },
  {
    id: "divisors",
    title: "Divisors Calculator",
    description: "Compute all divisors, their total count, and their summation for N.",
    category: "Decomposition",
    difficulty: "Easy",
    href: "/number-theory/divisors",
    icon: Divide,
    timeComplexity: "O(sqrt(N))",
  },
  {
    id: "gcd-lcm",
    title: "GCD & LCM Calculator",
    description: "Compute Greatest Common Divisor and Least Common Multiple for a set of values.",
    category: "Operators",
    difficulty: "Easy",
    href: "/number-theory/gcd-lcm",
    icon: GitCommit,
    timeComplexity: "O(log N)",
  },
  {
    id: "extended-euclid",
    title: "Extended Euclidean Solver",
    description: "Compute Greatest Common Divisor and Bézout coefficients (x, y) satisfying Diophantine relations.",
    category: "Operators",
    difficulty: "Medium",
    href: "/number-theory/extended-euclid",
    icon: Calculator,
    timeComplexity: "O(log N)",
  },
  {
    id: "modular-exponentiation",
    title: "Modular Exponentiation",
    description: "Compute modular powers (A^B) % M in logarithmic time steps.",
    category: "Operators",
    difficulty: "Easy",
    href: "/number-theory/modular-exponentiation",
    icon: TrendingUp,
    timeComplexity: "O(log B)",
  },
  {
    id: "modular-inverse",
    title: "Modular Inverse Solver",
    description: "Calculate modular multiplicative inverses using Extended Euclid or Fermat's Little Theorem.",
    category: "Modulus",
    difficulty: "Medium",
    href: "/number-theory/modular-inverse",
    icon: RotateCcw,
    timeComplexity: "O(log M)",
  },
  {
    id: "euler-phi",
    title: "Euler Totient Solver",
    description: "Compute Euler's Totient function φ(N) values and expand prime products.",
    category: "Functions",
    difficulty: "Medium",
    href: "/number-theory/euler-phi",
    icon: HelpCircle,
    timeComplexity: "O(sqrt(N))",
  },
  {
    id: "mobius",
    title: "Möbius Function Solver",
    description: "Compute Möbius μ(N) values and determine square-free prime counts.",
    category: "Functions",
    difficulty: "Medium",
    href: "/number-theory/mobius",
    icon: Sliders,
    timeComplexity: "O(sqrt(N))",
  },
  {
    id: "crt",
    title: "Chinese Remainder Theorem",
    description: "Solve systems of simultaneous congruences for pairwise coprime moduli.",
    category: "Modulus",
    difficulty: "Hard",
    href: "/number-theory/crt",
    icon: Columns,
    timeComplexity: "O(K log M)",
  },
  {
    id: "bitwise-playground",
    title: "Bitwise Playground",
    description: "Analyze logical AND, OR, XOR, NOT, and shift operations in decimal, hexadecimal, and binary configurations.",
    category: "Bits",
    difficulty: "Easy",
    href: "/number-theory/bitwise-playground",
    icon: Cpu,
    timeComplexity: "O(1)",
  },
  {
    id: "gray-code",
    title: "Gray Code Generator",
    description: "Convert standard binary values to reflected Gray code values bidirectionally.",
    category: "Bits",
    difficulty: "Easy",
    href: "/number-theory/gray-code",
    icon: Shuffle,
    timeComplexity: "O(log N)",
  },
  {
    id: "xor-playground",
    title: "XOR Playground",
    description: "Compute array prefix XORs, range XORs, and evaluate O(1) integer range XOR cycles.",
    category: "Bits",
    difficulty: "Easy",
    href: "/number-theory/xor-playground",
    icon: Zap,
    timeComplexity: "O(1) / O(N)",
  },
];

const CATEGORIES = [
  "All",
  "Primes",
  "Decomposition",
  "Operators",
  "Modulus",
  "Functions",
  "Bits",
];

export function NtDashboard() {
  const { toast } = useToast();
  const [search, setSearch] = React.useState("");
  const [selectedCat, setSelectedCat] = React.useState("All");
  const [favorites, setFavorites] = React.useState<string[]>([]);
  const [recent, setRecent] = React.useState<string[]>([]);

  // Load configuration from local storage
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const savedFavs = localStorage.getItem("cpkit_nt_favorites");
      if (savedFavs) {
        try { setFavorites(JSON.parse(savedFavs)); } catch {}
      }

      const savedRec = localStorage.getItem("cpkit_nt_recent");
      if (savedRec) {
        try { setRecent(JSON.parse(savedRec)); } catch {}
      }
    }
  }, []);

  const toggleFavorite = (id: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    let nextFavs: string[];
    if (favorites.includes(id)) {
      nextFavs = favorites.filter((f) => f !== id);
      toast({
        title: "Unpinned from Favorites",
        description: "Tool removed from pinned slots.",
        variant: "info",
      });
    } else {
      nextFavs = [...favorites, id];
      toast({
        title: "Pinned to Favorites",
        description: "Tool pinned to your favorites dashboard view.",
        variant: "success",
      });
    }
    setFavorites(nextFavs);
    localStorage.setItem("cpkit_nt_favorites", JSON.stringify(nextFavs));
  };

  const handleOpenTool = (id: string) => {
    // Add to recent list
    const nextRecents = [id, ...recent.filter((r) => r !== id)].slice(0, 5);
    setRecent(nextRecents);
    localStorage.setItem("cpkit_nt_recent", JSON.stringify(nextRecents));
  };

  const filteredTools = React.useMemo(() => {
    return NT_TOOLS.filter((tool) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        tool.title.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q);

      const matchCat = selectedCat === "All" || tool.category === selectedCat;

      return matchSearch && matchCat;
    });
  }, [search, selectedCat]);

  const recentList = React.useMemo(() => {
    return NT_TOOLS.filter((tool) => recent.includes(tool.id));
  }, [recent]);

  return (
    <div className="space-y-6 text-left">
      {/* Header section */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-border/10 pb-4">
        <div className="space-y-1 font-sans">
          <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
            Number Theory & Bits
          </h1>
          <p className="text-xs text-muted-foreground">
            Analyze prime sieves, modular inverses, totient expansions, gray-code bits, and Diophantine solvers.
          </p>
        </div>

        <div className="w-full md:max-w-xs">
          <Input
            placeholder="Search mathematics tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="h-4 w-4 text-muted-foreground" />}
            className="h-9"
          />
        </div>
      </div>

      {/* Category Pills Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin select-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border ${
              selectedCat === cat
                ? "bg-primary border-primary text-primary-foreground shadow-xs"
                : "bg-muted/10 border-border/45 text-muted-foreground hover:bg-accent/40"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Recently Used Section */}
      {recentList.length > 0 && selectedCat === "All" && !search && (
        <div className="space-y-3 font-sans">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Recently Used
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentList.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  href={tool.href}
                  key={tool.id}
                  onClick={() => handleOpenTool(tool.id)}
                  className="group block cursor-pointer"
                >
                  <div className="p-3 border border-border/40 rounded-xl bg-card/45 hover:bg-accent/15 transition-all flex items-center gap-3">
                    <div className="p-2 rounded bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-foreground">{tool.title}</h4>
                      <p className="text-[10px] text-muted-foreground">{tool.category}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Grid of tools */}
      <div className="space-y-3 pt-2 font-sans">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {selectedCat} Mathematics ({filteredTools.length})
        </h3>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool) => {
              const isFav = favorites.includes(tool.id);
              const Icon = tool.icon;

              return (
                <Link
                  href={tool.href}
                  key={tool.id}
                  onClick={() => handleOpenTool(tool.id)}
                  className="group block cursor-pointer font-sans"
                >
                  <Card className="border-border/40 hover:border-primary/50 bg-card/65 hover:bg-accent/15 transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-0.5 relative flex flex-col h-full min-h-[160px]">
                    <CardHeader className="pb-2 flex flex-row items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                          <Icon className="h-4 w-4" />
                        </div>
                        <Badge variant="primary" className="text-[8px] uppercase tracking-wider">
                          {tool.category}
                        </Badge>
                      </div>

                      <button
                        onClick={(e) => toggleFavorite(tool.id, e)}
                        className="p-1 rounded text-muted-foreground/45 hover:text-amber-500 transition-colors"
                        title={isFav ? "Unpin Favorite" : "Pin Favorite"}
                      >
                        <Star className={`h-3.5 w-3.5 ${isFav ? "fill-amber-500 text-amber-500" : ""}`} />
                      </button>
                    </CardHeader>
                    <CardContent className="pt-2 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <CardTitle className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                          {tool.title}
                        </CardTitle>
                        <CardDescription className="text-[11px] leading-relaxed line-clamp-2">
                          {tool.description}
                        </CardDescription>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-muted-foreground/60 border-t border-border/5 pt-2">
                        <span className="flex items-center gap-1.5">
                          <Badge variant="secondary" className="text-[8px]">{tool.difficulty}</Badge>
                          <Badge variant="primary" className="font-mono text-[8px]">{tool.timeComplexity}</Badge>
                        </span>
                        <span className="flex items-center gap-1 font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          Open Tool
                          <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full py-16 text-center text-xs text-muted-foreground border border-dashed border-border/50 rounded-xl">
              No mathematics tools match your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
