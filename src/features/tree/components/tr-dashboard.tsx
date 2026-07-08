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
  GitBranch,
  Settings,
  ShieldCheck,
  TrendingUp,
  Activity,
  Calculator,
  Layers,
  Sliders,
  FolderOpen,
  Info
} from "lucide-react";

interface TrToolItem {
  id: string;
  title: string;
  description: string;
  category: "Traversals" | "Algorithms" | "Set Structures";
  difficulty: "Easy" | "Medium" | "Hard";
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  timeComplexity: string;
}

const TR_TOOLS: TrToolItem[] = [
  {
    id: "binary-tree",
    title: "Tree Traversals",
    description: "Explore preorder, inorder, postorder, and level-order traversal lists.",
    category: "Traversals",
    difficulty: "Easy",
    href: "/tree/binary-tree",
    icon: GitBranch,
    timeComplexity: "O(N)",
  },
  {
    id: "bst",
    title: "Binary Search Tree",
    description: "Insert, delete, and lookup keys dynamically in binary search hierarchies.",
    category: "Algorithms",
    difficulty: "Easy",
    href: "/tree/bst",
    icon: Settings,
    timeComplexity: "O(log N)",
  },
  {
    id: "avl",
    title: "AVL Tree",
    description: "Build self-balancing binary search trees using LL, RR, LR, and RL rotations.",
    category: "Algorithms",
    difficulty: "Hard",
    href: "/tree/avl",
    icon: ShieldCheck,
    timeComplexity: "O(log N)",
  },
  {
    id: "heap",
    title: "Binary Heap",
    description: "Interact with Min/Max heaps, monitoring point insertions and bubble swap steps.",
    category: "Algorithms",
    difficulty: "Easy",
    href: "/tree/heap",
    icon: TrendingUp,
    timeComplexity: "O(log N)",
  },
  {
    id: "segment-tree",
    title: "Segment Tree",
    description: "Query range sums and apply point updates over contiguous segment splits.",
    category: "Algorithms",
    difficulty: "Medium",
    href: "/tree/segment-tree",
    icon: Activity,
    timeComplexity: "O(log N)",
  },
  {
    id: "lazy-segment-tree",
    title: "Lazy Segment Tree",
    description: "Apply logarithmic range additions and trace deferred tag propagation steps.",
    category: "Algorithms",
    difficulty: "Hard",
    href: "/tree/lazy-segment-tree",
    icon: Sliders,
    timeComplexity: "O(log N)",
  },
  {
    id: "fenwick",
    title: "Fenwick Tree",
    description: "Compute prefix sums using LSB bitwise operations and point updates.",
    category: "Algorithms",
    difficulty: "Medium",
    href: "/tree/fenwick",
    icon: Calculator,
    timeComplexity: "O(log N)",
  },
  {
    id: "trie",
    title: "Trie (Prefix Tree)",
    description: "Insert, delete, and trace string prefixes dynamically in char trees.",
    category: "Set Structures",
    difficulty: "Medium",
    href: "/tree/trie",
    icon: FolderOpen,
    timeComplexity: "O(L)",
  },
  {
    id: "lca",
    title: "Lowest Common Ancestor",
    description: "Query lowest common ancestors on trees using binary lifting tables.",
    category: "Algorithms",
    difficulty: "Medium",
    href: "/tree/lca",
    icon: Layers,
    timeComplexity: "O(log N)",
  },
  {
    id: "euler-tour",
    title: "Euler Tour DFS",
    description: "Flatten tree hierarchies into 1D arrays with subtree entry/exit times.",
    category: "Traversals",
    difficulty: "Easy",
    href: "/tree/euler-tour",
    icon: Info,
    timeComplexity: "O(N)",
  },
  {
    id: "diameter",
    title: "Tree Diameter",
    description: "Compute maximum path lengths in tree networks utilizing dual DFS sweeps.",
    category: "Algorithms",
    difficulty: "Easy",
    href: "/tree/diameter",
    icon: TrendingUp,
    timeComplexity: "O(N)",
  },
  {
    id: "centroid",
    title: "Centroid Decomposition",
    description: "Decompose tree topologies recursively into logarithmic height centroid trees.",
    category: "Algorithms",
    difficulty: "Hard",
    href: "/tree/centroid",
    icon: Layers,
    timeComplexity: "O(N log N)",
  },
];

const CATEGORIES = ["All", "Traversals", "Algorithms", "Set Structures"];

export function TrDashboard() {
  const { toast } = useToast();
  const [search, setSearch] = React.useState("");
  const [selectedCat, setSelectedCat] = React.useState("All");
  const [favorites, setFavorites] = React.useState<string[]>([]);
  const [recent, setRecent] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const savedFavs = localStorage.getItem("cpkit_tr_favorites");
      if (savedFavs) {
        try { setFavorites(JSON.parse(savedFavs)); } catch {}
      }

      const savedRec = localStorage.getItem("cpkit_tr_recent");
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
        description: "Removed from pinned slots.",
        variant: "info",
      });
    } else {
      nextFavs = [...favorites, id];
      toast({
        title: "Pinned to Favorites",
        description: "Pinned to favorites dashboard slots.",
        variant: "success",
      });
    }
    setFavorites(nextFavs);
    localStorage.setItem("cpkit_tr_favorites", JSON.stringify(nextFavs));
  };

  const handleOpenTool = (id: string) => {
    const nextRecents = [id, ...recent.filter((r) => r !== id)].slice(0, 5);
    setRecent(nextRecents);
    localStorage.setItem("cpkit_tr_recent", JSON.stringify(nextRecents));
  };

  const filteredTools = React.useMemo(() => {
    return TR_TOOLS.filter((tool) => {
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
    return TR_TOOLS.filter((tool) => recent.includes(tool.id));
  }, [recent]);

  return (
    <div className="space-y-6 text-left">
      {/* Header section */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-border/10 pb-4">
        <div className="space-y-1 font-sans">
          <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
            Tree Laboratory (TR)
          </h1>
          <p className="text-xs text-muted-foreground">
            Visualize DFS preorder, inorder, and postorder traversals, query segment tree interval splits, update Fenwick prefix ranges, find LCA binary liftings, and calculate tree diameter bounds.
          </p>
        </div>

        <div className="w-full md:max-w-xs">
          <Input
            placeholder="Search tree tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="h-4 w-4 text-muted-foreground" />}
            className="h-9"
          />
        </div>
      </div>

      {/* Category Filters */}
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

      {/* Recently Used */}
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
          {selectedCat} Tree Utilities ({filteredTools.length})
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
              No tree tools match your search bounds.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
