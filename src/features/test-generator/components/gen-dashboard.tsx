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
  Hash,
  ListCollapse,
  Type,
  Grid3X3,
  Shuffle,
  GitBranch,
  Network,
  HelpCircle,
  TrendingUp,
  Compass,
  Zap,
  Sliders,
  FolderSync
} from "lucide-react";

interface GeneratorItem {
  id: string;
  title: string;
  description: string;
  category: "Integers" | "Arrays" | "Strings" | "Matrices" | "Graphs" | "Queries" | "Intervals" | "Geometry" | "Verification" | "Batch";
  difficulty: "Easy" | "Medium" | "Hard";
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  status: "Ready" | "Beta";
}

const GENERATORS: GeneratorItem[] = [
  {
    id: "random-integer",
    title: "Random Integer",
    description: "Generate lists of single or quantity-grouped integers inside limits.",
    category: "Integers",
    difficulty: "Easy",
    href: "/test-generator/random-integer",
    icon: Hash,
    status: "Ready",
  },
  {
    id: "random-array",
    title: "Random Array",
    description: "Generate N-length arrays with sort order constraints and separations.",
    category: "Arrays",
    difficulty: "Easy",
    href: "/test-generator/random-array",
    icon: ListCollapse,
    status: "Ready",
  },
  {
    id: "random-string",
    title: "Random String",
    description: "Generate character strings matching standard or custom pool inputs.",
    category: "Strings",
    difficulty: "Easy",
    href: "/test-generator/random-string",
    icon: Type,
    status: "Ready",
  },
  {
    id: "random-matrix",
    title: "Random Matrix",
    description: "Generate 2D binary, sparse, identity, or custom matrix grids.",
    category: "Matrices",
    difficulty: "Easy",
    href: "/test-generator/random-matrix",
    icon: Grid3X3,
    status: "Ready",
  },
  {
    id: "random-permutation",
    title: "Random Permutation",
    description: "Shuffle arrays from 1 to N to verify uniqueness checks.",
    category: "Arrays",
    difficulty: "Easy",
    href: "/test-generator/random-permutation",
    icon: Shuffle,
    status: "Ready",
  },
  {
    id: "random-graph",
    title: "Random Graph",
    description: "Generate directed/undirected edge lists or connected DAGs.",
    category: "Graphs",
    difficulty: "Medium",
    href: "/test-generator/random-graph",
    icon: Network,
    status: "Ready",
  },
  {
    id: "random-tree",
    title: "Random Tree",
    description: "Generate binary, general, or weighted vertex tree structures.",
    category: "Graphs",
    difficulty: "Medium",
    href: "/test-generator/random-tree",
    icon: GitBranch,
    status: "Ready",
  },
  {
    id: "random-queries",
    title: "Random Queries",
    description: "Generate point, range, and update queries for data structures.",
    category: "Queries",
    difficulty: "Easy",
    href: "/test-generator/random-query",
    icon: HelpCircle,
    status: "Ready",
  },
  {
    id: "random-interval",
    title: "Random Interval",
    description: "Generate standard, nested, or completely disjoint [L, R] intervals.",
    category: "Intervals",
    difficulty: "Easy",
    href: "/test-generator/random-interval",
    icon: TrendingUp,
    status: "Ready",
  },
  {
    id: "coordinate-generator",
    title: "Coordinate Generator",
    description: "Generate 2D/3D coordinate tuples in integer or decimal formats.",
    category: "Geometry",
    difficulty: "Easy",
    href: "/test-generator/coordinate-generator",
    icon: Compass,
    status: "Ready",
  },
  {
    id: "edge-case-generator",
    title: "Edge Case Generator",
    description: "Produce minimal, maximal, overflow, or duplicate boundary items.",
    category: "Verification",
    difficulty: "Medium",
    href: "/test-generator/edge-case-generator",
    icon: Zap,
    status: "Ready",
  },
  {
    id: "constraint-builder",
    title: "Constraint Builder",
    description: "Define compound structures, dimensions, and custom densities.",
    category: "Verification",
    difficulty: "Hard",
    href: "/test-generator/constraint-builder",
    icon: Sliders,
    status: "Ready",
  },
  {
    id: "batch-generator",
    title: "Batch Generator",
    description: "Create directories of multiple test cases for stress tests.",
    category: "Batch",
    difficulty: "Hard",
    href: "/test-generator/batch-generator",
    icon: FolderSync,
    status: "Ready",
  },
];

const CATEGORIES = [
  "All",
  "Integers",
  "Arrays",
  "Strings",
  "Matrices",
  "Graphs",
  "Queries",
  "Intervals",
  "Geometry",
  "Verification",
  "Batch",
];

export function GenDashboard() {
  const { toast } = useToast();
  const [search, setSearch] = React.useState("");
  const [selectedCat, setSelectedCat] = React.useState("All");
  const [favorites, setFavorites] = React.useState<string[]>([]);
  const [recent, setRecent] = React.useState<string[]>([]);

  // Load configuration from local storage
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const savedFavs = localStorage.getItem("cpkit_gen_favorites");
      if (savedFavs) {
        try { setFavorites(JSON.parse(savedFavs)); } catch {}
      }

      const savedRec = localStorage.getItem("cpkit_gen_recent");
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
        description: "Generator removed from pined slots.",
        variant: "info",
      });
    } else {
      nextFavs = [...favorites, id];
      toast({
        title: "Pinned to Favorites",
        description: "Generator pinned to your favorites dashboard view.",
        variant: "success",
      });
    }
    setFavorites(nextFavs);
    localStorage.setItem("cpkit_gen_favorites", JSON.stringify(nextFavs));
  };

  const handleOpenGenerator = (id: string) => {
    // Add to recent list
    const nextRecents = [id, ...recent.filter((r) => r !== id)].slice(0, 5);
    setRecent(nextRecents);
    localStorage.setItem("cpkit_gen_recent", JSON.stringify(nextRecents));
  };

  const filteredGenerators = React.useMemo(() => {
    return GENERATORS.filter((gen) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        gen.title.toLowerCase().includes(q) ||
        gen.description.toLowerCase().includes(q) ||
        gen.category.toLowerCase().includes(q);

      const matchCat = selectedCat === "All" || gen.category === selectedCat;

      return matchSearch && matchCat;
    });
  }, [search, selectedCat]);

  const recentList = React.useMemo(() => {
    return GENERATORS.filter((gen) => recent.includes(gen.id));
  }, [recent]);

  return (
    <div className="space-y-6 text-left">
      {/* Header section */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-border/10 pb-4">
        <div className="space-y-1 font-sans">
          <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
            Test Generator
          </h1>
          <p className="text-xs text-muted-foreground">
            Construct random datasets, edge cases, DAGs, coordinate maps, or batch stress-tests.
          </p>
        </div>

        <div className="w-full md:max-w-xs">
          <Input
            placeholder="Search generators..."
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
        <div className="space-y-3">
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
                  onClick={() => handleOpenGenerator(tool.id)}
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

      {/* Grid of generators */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {selectedCat} Generators ({filteredGenerators.length})
        </h3>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGenerators.length > 0 ? (
            filteredGenerators.map((tool) => {
              const isFav = favorites.includes(tool.id);
              const Icon = tool.icon;

              return (
                <Link
                  href={tool.href}
                  key={tool.id}
                  onClick={() => handleOpenGenerator(tool.id)}
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
                          {tool.status === "Beta" && (
                            <Badge variant="warning" className="text-[8px]">Beta</Badge>
                          )}
                        </span>
                        <span className="flex items-center gap-1 font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          Open Generator
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
              No generators match your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
