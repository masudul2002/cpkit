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
  Network,
  GitBranch,
  Navigation,
  Activity,
  Calculator,
  Layers,
  TrendingUp,
  Sliders,
  Settings,
  Scissors,
  Bookmark,
  Share2,
  FolderOpen
} from "lucide-react";

interface GrToolItem {
  id: string;
  title: string;
  description: string;
  category: "Traversal" | "Shortest Path" | "Spanning Tree" | "Properties" | "Set Structures";
  difficulty: "Easy" | "Medium" | "Hard";
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  timeComplexity: string;
}

const GR_TOOLS: GrToolItem[] = [
  {
    id: "bfs",
    title: "BFS Traversal",
    description: "Explore unweighted graph vertices layer-by-layer using FIFO queues.",
    category: "Traversal",
    difficulty: "Easy",
    href: "/graph/bfs",
    icon: Network,
    timeComplexity: "O(V + E)",
  },
  {
    id: "dfs",
    title: "DFS Traversal",
    description: "Visualize recursive depth-first graph traversals tracing parent paths.",
    category: "Traversal",
    difficulty: "Easy",
    href: "/graph/dfs",
    icon: GitBranch,
    timeComplexity: "O(V + E)",
  },
  {
    id: "dijkstra",
    title: "Dijkstra Solver",
    description: "Compute single-source shortest paths on weighted graphs with non-negative edge costs.",
    category: "Shortest Path",
    difficulty: "Medium",
    href: "/graph/dijkstra",
    icon: Navigation,
    timeComplexity: "O(E log V)",
  },
  {
    id: "bellman-ford",
    title: "Bellman-Ford Solver",
    description: "Compute single-source shortest paths and detect negative cycle structures.",
    category: "Shortest Path",
    difficulty: "Medium",
    href: "/graph/bellman-ford",
    icon: Activity,
    timeComplexity: "O(V * E)",
  },
  {
    id: "floyd-warshall",
    title: "Floyd-Warshall Matrix",
    description: "Calculate all-pairs shortest paths on weighted graphs using intermediate sweeps.",
    category: "Shortest Path",
    difficulty: "Medium",
    href: "/graph/floyd-warshall",
    icon: Calculator,
    timeComplexity: "O(V^3)",
  },
  {
    id: "topological-sort",
    title: "Topological Sort",
    description: "Linear dependency ordering of Directed Acyclic Graphs (DAGs) using Kahn's algorithm.",
    category: "Traversal",
    difficulty: "Medium",
    href: "/graph/topological-sort",
    icon: Layers,
    timeComplexity: "O(V + E)",
  },
  {
    id: "prim",
    title: "Prim's MST",
    description: "Construct a Minimum Spanning Tree greedily connecting closest neighbors.",
    category: "Spanning Tree",
    difficulty: "Medium",
    href: "/graph/prim",
    icon: TrendingUp,
    timeComplexity: "O(E log V)",
  },
  {
    id: "kruskal",
    title: "Kruskal's MST",
    description: "Construct a Minimum Spanning Tree by sorting edges and joining components with DSU.",
    category: "Spanning Tree",
    difficulty: "Medium",
    href: "/graph/kruskal",
    icon: Sliders,
    timeComplexity: "O(E log V)",
  },
  {
    id: "union-find",
    title: "DSU / Union-Find",
    description: "Maintain partition of sets dynamically using union-by-rank and trace representatives.",
    category: "Set Structures",
    difficulty: "Easy",
    href: "/graph/union-find",
    icon: Settings,
    timeComplexity: "O(α(N))",
  },
  {
    id: "bipartite",
    title: "Bipartite Checker",
    description: "Verify bipartite properties by trying to two-color the graph nodes.",
    category: "Properties",
    difficulty: "Easy",
    href: "/graph/bipartite",
    icon: Bookmark,
    timeComplexity: "O(V + E)",
  },
  {
    id: "bridges",
    title: "Critical Bridges",
    description: "Detect critical bridge edges whose deletion disconnects the undirected graph.",
    category: "Properties",
    difficulty: "Medium",
    href: "/graph/bridges",
    icon: Scissors,
    timeComplexity: "O(V + E)",
  },
  {
    id: "articulation",
    title: "Articulation Points",
    description: "Identify critical cut-nodes whose deletion disconnects the undirected graph.",
    category: "Properties",
    difficulty: "Medium",
    href: "/graph/articulation",
    icon: Share2,
    timeComplexity: "O(V + E)",
  },
  {
    id: "scc",
    title: "Kosaraju SCC",
    description: "Extract strongly connected components (SCC) on directed graphs using dual DFS.",
    category: "Traversal",
    difficulty: "Medium",
    href: "/graph/scc",
    icon: FolderOpen,
    timeComplexity: "O(V + E)",
  },
  {
    id: "graph-properties",
    title: "Graph Properties",
    description: "Analyze graph statistics including degrees, density, connected components, cycles, DAG, and tree indicators.",
    category: "Properties",
    difficulty: "Easy",
    href: "/graph/graph-properties",
    icon: Calculator,
    timeComplexity: "O(V + E)",
  },
];

const CATEGORIES = [
  "All",
  "Traversal",
  "Shortest Path",
  "Spanning Tree",
  "Properties",
  "Set Structures",
];

export function GrDashboard() {
  const { toast } = useToast();
  const [search, setSearch] = React.useState("");
  const [selectedCat, setSelectedCat] = React.useState("All");
  const [favorites, setFavorites] = React.useState<string[]>([]);
  const [recent, setRecent] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const savedFavs = localStorage.getItem("cpkit_gr_favorites");
      if (savedFavs) {
        try { setFavorites(JSON.parse(savedFavs)); } catch {}
      }

      const savedRec = localStorage.getItem("cpkit_gr_recent");
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
    localStorage.setItem("cpkit_gr_favorites", JSON.stringify(nextFavs));
  };

  const handleOpenTool = (id: string) => {
    const nextRecents = [id, ...recent.filter((r) => r !== id)].slice(0, 5);
    setRecent(nextRecents);
    localStorage.setItem("cpkit_gr_recent", JSON.stringify(nextRecents));
  };

  const filteredTools = React.useMemo(() => {
    return GR_TOOLS.filter((tool) => {
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
    return GR_TOOLS.filter((tool) => recent.includes(tool.id));
  }, [recent]);

  return (
    <div className="space-y-6 text-left">
      {/* Header section */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-border/10 pb-4">
        <div className="space-y-1 font-sans">
          <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
            Graph Laboratory (GR)
          </h1>
          <p className="text-xs text-muted-foreground">
            Explore topological properties, run Kahn's topological sorts, compute Kruskal MST paths, find cut vertices, and trace single-source shortest paths on weighted layouts.
          </p>
        </div>

        <div className="w-full md:max-w-xs">
          <Input
            placeholder="Search graph tools..."
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
          {selectedCat} Graph Utilities ({filteredTools.length})
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
              No graph tools match your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
