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
  Sliders,
  RefreshCw,
  RotateCw,
  X,
  Grid3X3,
  Layers,
  TrendingUp,
  Calculator,
  BarChart2,
  RotateCcw,
  Shuffle,
  Network,
  GitBranch,
  Droplet,
  Navigation
} from "lucide-react";

interface MxToolItem {
  id: string;
  title: string;
  description: string;
  category: "Creation" | "Operations" | "Algorithms" | "Grid Search";
  difficulty: "Easy" | "Medium" | "Hard";
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  timeComplexity: string;
  isPlaceholder?: boolean;
}

const MX_TOOLS: MxToolItem[] = [
  {
    id: "matrix-generator",
    title: "Matrix Generator",
    description: "Construct random, binary, identity, sparse, or weighted matrices with custom constraints.",
    category: "Creation",
    difficulty: "Easy",
    href: "/matrix/matrix-generator",
    icon: Sliders,
    timeComplexity: "O(R * C)",
  },
  {
    id: "transpose",
    title: "Matrix Transpose",
    description: "Flipped reflection of row and column indexes for square or rectangular matrices.",
    category: "Operations",
    difficulty: "Easy",
    href: "/matrix/transpose",
    icon: RefreshCw,
    timeComplexity: "O(R * C)",
  },
  {
    id: "rotation",
    title: "Matrix Rotation",
    description: "Rotate matrices cyclically by 90°, 180°, or 270° clockwise or counter-clockwise.",
    category: "Operations",
    difficulty: "Easy",
    href: "/matrix/rotation",
    icon: RotateCw,
    timeComplexity: "O(R * C)",
  },
  {
    id: "multiplication",
    title: "Matrix Multiplication",
    description: "Multiply matrix A by matrix B and trace the cell-by-cell dot products.",
    category: "Operations",
    difficulty: "Easy",
    href: "/matrix/multiplication",
    icon: X,
    timeComplexity: "O(R_A * C_A * C_B)",
  },
  {
    id: "identity",
    title: "Identity Matrix",
    description: "Construct identity matrices or custom diagonal matrices with specific diagonal parameters.",
    category: "Creation",
    difficulty: "Easy",
    href: "/matrix/identity",
    icon: Grid3X3,
    timeComplexity: "O(N^2)",
  },
  {
    id: "prefix-sum",
    title: "Prefix Sum Matrix",
    description: "Precompute subgrid sums for O(1) range queries and visualize regions.",
    category: "Algorithms",
    difficulty: "Medium",
    href: "/matrix/prefix-sum",
    icon: Layers,
    timeComplexity: "O(R * C) / O(1)",
  },
  {
    id: "matrix-power",
    title: "Matrix Exponentiation",
    description: "Raise a square matrix to the power K using fast binary exponentiation algorithms.",
    category: "Operations",
    difficulty: "Medium",
    href: "/matrix/matrix-power",
    icon: TrendingUp,
    timeComplexity: "O(N^3 log K)",
  },
  {
    id: "determinant",
    title: "Matrix Determinant",
    description: "Compute scalar determinants for square matrices of size 2x2 or 3x3.",
    category: "Operations",
    difficulty: "Easy",
    href: "/matrix/determinant",
    icon: Calculator,
    timeComplexity: "O(1) / O(N^3)",
  },
  {
    id: "rank",
    title: "Matrix Rank",
    description: "Determine the rank of square or rectangular matrices using Gaussian row reduction steps.",
    category: "Operations",
    difficulty: "Medium",
    href: "/matrix/rank",
    icon: BarChart2,
    timeComplexity: "O(R^2 * C)",
  },
  {
    id: "spiral",
    title: "Spiral Traversal",
    description: "Traverse square or rectangular matrices spirally clockwise or counter-clockwise.",
    category: "Algorithms",
    difficulty: "Easy",
    href: "/matrix/spiral",
    icon: RotateCcw,
    timeComplexity: "O(R * C)",
  },
  {
    id: "diagonal",
    title: "Diagonal Traversal",
    description: "Traverse square or rectangular matrices along primary, secondary, or zigzag diagonal lines.",
    category: "Algorithms",
    difficulty: "Easy",
    href: "/matrix/diagonal",
    icon: Shuffle,
    timeComplexity: "O(R * C)",
  },
  {
    id: "grid-bfs",
    title: "Grid BFS Traversal",
    description: "Visualize unweighted grid pathfinding layer-by-layer using FIFO queues.",
    category: "Grid Search",
    difficulty: "Medium",
    href: "/matrix/grid-bfs",
    icon: Network,
    timeComplexity: "O(R * C)",
  },
  {
    id: "grid-dfs",
    title: "Grid DFS Traversal",
    description: "Visualize grid depth-first search (DFS) recursion using backtracking.",
    category: "Grid Search",
    difficulty: "Medium",
    href: "/matrix/grid-dfs",
    icon: GitBranch,
    timeComplexity: "O(R * C)",
  },
  {
    id: "flood-fill",
    title: "Flood Fill Paint",
    description: "Interact with grid cells using a paint bucket tool to count connected components.",
    category: "Grid Search",
    difficulty: "Easy",
    href: "/matrix/flood-fill",
    icon: Droplet,
    timeComplexity: "O(R * C)",
  },
  {
    id: "pathfinding",
    title: "Pathfinding Grid",
    description: "Visualize shortest path searches using BFS, Dijkstra, or A* heuristic grids.",
    category: "Grid Search",
    difficulty: "Hard",
    href: "/matrix/pathfinding",
    icon: Navigation,
    timeComplexity: "O(R*C log(R*C))",
  },
];

const CATEGORIES = [
  "All",
  "Creation",
  "Operations",
  "Algorithms",
  "Grid Search",
];

export function MxDashboard() {
  const { toast } = useToast();
  const [search, setSearch] = React.useState("");
  const [selectedCat, setSelectedCat] = React.useState("All");
  const [favorites, setFavorites] = React.useState<string[]>([]);
  const [recent, setRecent] = React.useState<string[]>([]);

  // Load configuration from local storage
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const savedFavs = localStorage.getItem("cpkit_mx_favorites");
      if (savedFavs) {
        try { setFavorites(JSON.parse(savedFavs)); } catch {}
      }

      const savedRec = localStorage.getItem("cpkit_mx_recent");
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
    localStorage.setItem("cpkit_mx_favorites", JSON.stringify(nextFavs));
  };

  const handleOpenTool = (id: string) => {
    const nextRecents = [id, ...recent.filter((r) => r !== id)].slice(0, 5);
    setRecent(nextRecents);
    localStorage.setItem("cpkit_mx_recent", JSON.stringify(nextRecents));
  };

  const filteredTools = React.useMemo(() => {
    return MX_TOOLS.filter((tool) => {
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
    return MX_TOOLS.filter((tool) => recent.includes(tool.id));
  }, [recent]);

  return (
    <div className="space-y-6 text-left">
      {/* Header section */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-border/10 pb-4">
        <div className="space-y-1 font-sans">
          <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
            Matrix Laboratory (MX)
          </h1>
          <p className="text-xs text-muted-foreground">
            Analyze 2D prefix sums, run Gaussian eliminations, rotate grid elements, paint connected regions, and trace BFS pathfinders.
          </p>
        </div>

        <div className="w-full md:max-w-xs">
          <Input
            placeholder="Search matrix tools..."
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
          {selectedCat} Matrix Utilities ({filteredTools.length})
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
                        <CardTitle className="text-sm font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
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
              No matrix tools match your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
