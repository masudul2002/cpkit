"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import {
  Search,
  Star,
  ArrowRight,
  Layers,
  ShoppingBag,
  Coins,
  FileText,
  TrendingUp,
  Scissors,
  Calculator,
  Grid,
  Info,
  GitBranch,
  Sliders
} from "lucide-react";

interface DpToolItem {
  id: string;
  title: string;
  description: string;
  category: "Classic DP" | "Playgrounds" | "Advanced DP";
  difficulty: "Easy" | "Medium" | "Hard";
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  timeComplexity: string;
  comingSoon?: boolean;
}

const DP_TOOLS: DpToolItem[] = [
  {
    id: "knapsack",
    title: "0/1 Knapsack",
    description: "Optimize item selection to maximize total profit under weight constraints.",
    category: "Classic DP",
    difficulty: "Medium",
    href: "/dynamic-programming/knapsack",
    icon: ShoppingBag,
    timeComplexity: "O(N * W)",
  },
  {
    id: "coin-change",
    title: "Coin Change",
    description: "Find min coins or total combinations to make a target amount.",
    category: "Classic DP",
    difficulty: "Medium",
    href: "/dynamic-programming/coin-change",
    icon: Coins,
    timeComplexity: "O(N * Amt)",
  },
  {
    id: "lcs",
    title: "LCS Subsequence",
    description: "Determine the longest subsequence shared across two string inputs.",
    category: "Classic DP",
    difficulty: "Medium",
    href: "/dynamic-programming/lcs",
    icon: FileText,
    timeComplexity: "O(N * M)",
  },
  {
    id: "lis",
    title: "LIS Sequence",
    description: "Identify the longest strictly increasing subsequence in an array.",
    category: "Classic DP",
    difficulty: "Medium",
    href: "/dynamic-programming/lis",
    icon: TrendingUp,
    timeComplexity: "O(N^2)",
  },
  {
    id: "edit-distance",
    title: "Edit Distance",
    description: "Determine min edits to align strings using insert, delete, and replace.",
    category: "Classic DP",
    difficulty: "Medium",
    href: "/dynamic-programming/edit-distance",
    icon: Scissors,
    timeComplexity: "O(N * M)",
  },
  {
    id: "matrix-chain",
    title: "Matrix Chain Multiplication",
    description: "Find optimal product ordering to minimize scalar multiplication operations.",
    category: "Classic DP",
    difficulty: "Hard",
    href: "/dynamic-programming/matrix-chain",
    icon: Calculator,
    timeComplexity: "O(N^3)",
  },
  {
    id: "subset-sum",
    title: "Subset Sum Solver",
    description: "Verify if elements can sum up exactly to a target sum.",
    category: "Classic DP",
    difficulty: "Medium",
    href: "/dynamic-programming/subset-sum",
    icon: Grid,
    timeComplexity: "O(N * S)",
  },
  {
    id: "rod-cutting",
    title: "Rod Cutting Solver",
    description: "Evaluate best pieces cuts to maximize selling profit values.",
    category: "Classic DP",
    difficulty: "Medium",
    href: "/dynamic-programming/rod-cutting",
    icon: Scissors,
    timeComplexity: "O(N^2)",
  },
  {
    id: "partition",
    title: "Partition Problem",
    description: "Determine if elements can be split into two equal-sum subsets.",
    category: "Classic DP",
    difficulty: "Medium",
    href: "/dynamic-programming/partition",
    icon: Grid,
    timeComplexity: "O(N * S)",
  },
  {
    id: "memoization",
    title: "Memoization Playground",
    description: "Trace recursive stack flows and check cache hit lookups.",
    category: "Playgrounds",
    difficulty: "Easy",
    href: "/dynamic-programming/memoization",
    icon: Info,
    timeComplexity: "O(N)",
  },
  {
    id: "tabulation",
    title: "Tabulation Playground",
    description: "Monitor bottom-up table updates and loop iterations.",
    category: "Playgrounds",
    difficulty: "Easy",
    href: "/dynamic-programming/tabulation",
    icon: Sliders,
    timeComplexity: "O(N)",
  },
  {
    id: "space-optimization",
    title: "Space Optimization",
    description: "Compare memory footprints of original 2D grids vs optimized 1D rows.",
    category: "Playgrounds",
    difficulty: "Hard",
    href: "/dynamic-programming/space-optimization",
    icon: Layers,
    timeComplexity: "O(S)",
  },
  {
    id: "digit-dp",
    title: "Digit DP Studio",
    description: "Count satisfying number ranges. (Coming Soon)",
    category: "Advanced DP",
    difficulty: "Hard",
    href: "/dynamic-programming/digit-dp",
    icon: Calculator,
    timeComplexity: "O(Len * Sum)",
    comingSoon: true,
  },
  {
    id: "tree-dp",
    title: "Tree DP Studio",
    description: "Compute subtree constraints recursively using DFS. (Coming Soon)",
    category: "Advanced DP",
    difficulty: "Hard",
    href: "/dynamic-programming/tree-dp",
    icon: GitBranch,
    timeComplexity: "O(N)",
    comingSoon: true,
  },
  {
    id: "bitmask-dp",
    title: "Bitmask DP Studio",
    description: "Solve state permutations using binary bit integer masks. (Coming Soon)",
    category: "Advanced DP",
    difficulty: "Hard",
    href: "/dynamic-programming/bitmask-dp",
    icon: Layers,
    timeComplexity: "O(2^N * N)",
    comingSoon: true,
  },
  {
    id: "tsp",
    title: "Travelling Salesman",
    description: "Solve minimum cost Hamiltonian tours. (Coming Soon)",
    category: "Advanced DP",
    difficulty: "Hard",
    href: "/dynamic-programming/tsp",
    icon: Sliders,
    timeComplexity: "O(2^N * N^2)",
    comingSoon: true,
  },
];

export function DpDashboard() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [favorites, setFavorites] = React.useState<string[]>([]);

  const handleFavoriteToggle = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const isFav = favorites.includes(id);
    if (isFav) {
      setFavorites(favorites.filter((favId) => favId !== id));
      toast({
        title: "Removed Favorite",
        description: "Removed from your bookmarks list.",
        variant: "info",
      });
    } else {
      setFavorites([...favorites, id]);
      toast({
        title: "Added Favorite",
        description: "Pinned to your favorites bookmarks.",
        variant: "success",
      });
    }
  };

  const filteredTools = DP_TOOLS.filter((tool) => {
    const matchesSearch =
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 font-sans text-left">
      {/* Search and Filters Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/10 pb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search DP algorithms, playgrounds, matrices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 w-full"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {["All", "Classic DP", "Playgrounds", "Advanced DP"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer border transition-all ${
                selectedCategory === cat
                  ? "bg-primary border-primary text-primary-foreground font-extrabold shadow-sm"
                  : "bg-background border-border/30 text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredTools.map((tool) => {
          const Icon = tool.icon;
          const isFav = favorites.includes(tool.id);

          return (
            <Link key={tool.id} href={tool.href} className="group">
              <Card className="h-full border-border/40 hover:border-primary/50 bg-card/65 hover:bg-card/90 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md cursor-pointer relative">
                {tool.comingSoon && (
                  <div className="absolute top-2 right-2 z-10">
                    <Badge variant="secondary" className="text-[8px] tracking-wide uppercase px-1.5 py-0">Coming Soon</Badge>
                  </div>
                )}
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-start justify-between">
                    <div className="p-2 border border-border/30 rounded-xl bg-muted/20 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    {!tool.comingSoon && (
                      <button
                        onClick={(e) => handleFavoriteToggle(tool.id, e)}
                        className="text-muted-foreground/45 hover:text-amber-500 transition-colors p-1"
                      >
                        <Star className={`h-4.5 w-4.5 ${isFav ? "fill-amber-500 text-amber-500" : ""}`} />
                      </button>
                    )}
                  </div>

                  <CardTitle className="text-sm font-bold text-foreground mt-4 flex items-center gap-1 group-hover:text-primary transition-colors">
                    {tool.title}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground line-clamp-2 mt-1 min-h-[32px]">
                    {tool.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-5 pt-0 border-t border-border/5 bg-muted/5 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1.5">
                    <Badge variant="secondary" className="text-[9px] font-mono px-1.5">{tool.timeComplexity}</Badge>
                    <Badge variant={tool.difficulty === "Easy" ? "success" : tool.difficulty === "Medium" ? "warning" : "primary"} className="text-[8px]">
                      {tool.difficulty}
                    </Badge>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Educational Section & Quick Resources */}
      <div className="grid gap-6 md:grid-cols-2 pt-6">
        <Card className="border-border/40 bg-card/65 shadow-xs">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-foreground uppercase tracking-wider text-muted-foreground">
              Dynamic Programming Foundations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs leading-relaxed text-foreground/80">
            <p>
              Dynamic Programming (DP) is a method for solving complex problems by breaking them down into simpler subproblems. It is applicable to problems exhibiting:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
              <li><strong className="text-foreground">Overlapping Subproblems</strong>: Subproblems are solved repeatedly.</li>
              <li><strong className="text-foreground">Optimal Substructure</strong>: Optimal solutions to subproblems build the global optimum.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/65 shadow-xs">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-foreground uppercase tracking-wider text-muted-foreground">
              Top-Down vs Bottom-Up
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs leading-relaxed text-foreground/80">
            <p>
              Choose your strategy depending on constraints:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
              <li><strong className="text-foreground">Memoization (Top-Down)</strong>: Natural recursion, computes only necessary reachable states.</li>
              <li><strong className="text-foreground">Tabulation (Bottom-Up)</strong>: Iterative tables loop sweeps, avoids recursion stack limits and enables space-optimization.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
