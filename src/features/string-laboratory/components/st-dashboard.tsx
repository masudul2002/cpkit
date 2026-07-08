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
  BarChart2,
  ShieldCheck,
  Shuffle,
  RefreshCw,
  GitCommit,
  ZoomIn,
  Binary,
  Cpu,
  Layers,
  Grid3X3,
  Sliders,
  Columns,
  TrendingUp,
  ListCollapse,
  Network
} from "lucide-react";

interface StToolItem {
  id: string;
  title: string;
  description: string;
  category: "Basic" | "Searching" | "Hashing" | "Algorithms" | "Dynamic Programming" | "Suffixes";
  difficulty: "Easy" | "Medium" | "Hard";
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  timeComplexity: string;
  isPlaceholder?: boolean;
}

const ST_TOOLS: StToolItem[] = [
  {
    id: "frequency-counter",
    title: "Character Frequency Counter",
    description: "Analyze total, unique, and duplicate character counts inside a given text string.",
    category: "Basic",
    difficulty: "Easy",
    href: "/string-laboratory/frequency-counter",
    icon: BarChart2,
    timeComplexity: "O(N log U)",
  },
  {
    id: "palindrome",
    title: "Palindrome Checker",
    description: "Verify if a word, phrase, or sentence is palindromic, supporting case and spacing configurations.",
    category: "Basic",
    difficulty: "Easy",
    href: "/string-laboratory/palindrome",
    icon: ShieldCheck,
    timeComplexity: "O(N)",
  },
  {
    id: "reverse",
    title: "Reverse String",
    description: "Invert character order, word sequences, or line structures within a multiline text bloc.",
    category: "Basic",
    difficulty: "Easy",
    href: "/string-laboratory/reverse",
    icon: Shuffle,
    timeComplexity: "O(N)",
  },
  {
    id: "rotation",
    title: "String Rotation",
    description: "Shift characters cyclically to the left or right, and validate if two strings are cyclic rotations of each other.",
    category: "Basic",
    difficulty: "Easy",
    href: "/string-laboratory/rotation",
    icon: RefreshCw,
    timeComplexity: "O(N)",
  },
  {
    id: "anagram",
    title: "Anagram Checker",
    description: "Verify if two strings are anagrams of each other and compare character frequency distribution side-by-side.",
    category: "Basic",
    difficulty: "Easy",
    href: "/string-laboratory/anagram",
    icon: GitCommit,
    timeComplexity: "O(N + M)",
  },
  {
    id: "substring-search",
    title: "Substring Search",
    description: "Locate character patterns inside text blocks using naive linear alignment scans.",
    category: "Searching",
    difficulty: "Easy",
    href: "/string-laboratory/substring-search",
    icon: ZoomIn,
    timeComplexity: "O(N * M)",
  },
  {
    id: "prefix-function",
    title: "Prefix Function (KMP)",
    description: "Compute the proper prefix-suffix matching table (pi array) and visualize index skips.",
    category: "Algorithms",
    difficulty: "Medium",
    href: "/string-laboratory/prefix-function",
    icon: Binary,
    timeComplexity: "O(N)",
  },
  {
    id: "z-function",
    title: "Z Function",
    description: "Compute longest common prefix matching lengths for all suffixes (Z-array) in linear time.",
    category: "Algorithms",
    difficulty: "Medium",
    href: "/string-laboratory/z-function",
    icon: Cpu,
    timeComplexity: "O(N)",
  },
  {
    id: "rolling-hash",
    title: "Rolling Hash",
    description: "Compute polynomial rolling checksum hashes of strings and audit for mathematical collisions.",
    category: "Hashing",
    difficulty: "Medium",
    href: "/string-laboratory/rolling-hash",
    icon: Layers,
    timeComplexity: "O(N)",
  },
  {
    id: "edit-distance",
    title: "Edit Distance (Levenshtein)",
    description: "Calculate the minimum character operations to transform string A to string B, drawing the complete DP table.",
    category: "Dynamic Programming",
    difficulty: "Medium",
    href: "/string-laboratory/edit-distance",
    icon: Grid3X3,
    timeComplexity: "O(N * M)",
  },
  {
    id: "longest-common-prefix",
    title: "Longest Common Prefix",
    description: "Find the longest shared prefix string among a set of multiple words.",
    category: "Algorithms",
    difficulty: "Easy",
    href: "/string-laboratory/longest-common-prefix",
    icon: Sliders,
    timeComplexity: "O(S)",
  },
  {
    id: "longest-common-subsequence",
    title: "Longest Common Subsequence",
    description: "Compute the longest common subsequence of two strings and trace the DP backtracking path.",
    category: "Dynamic Programming",
    difficulty: "Medium",
    href: "/string-laboratory/longest-common-subsequence",
    icon: Columns,
    timeComplexity: "O(N * M)",
  },
  {
    id: "longest-palindrome",
    title: "Longest Palindromic Substring",
    description: "Extract the longest palindromic substring, highlighting it inside the text sequence.",
    category: "Algorithms",
    difficulty: "Medium",
    href: "/string-laboratory/longest-palindrome",
    icon: TrendingUp,
    timeComplexity: "O(N^2)",
  },
  {
    id: "suffix-array",
    title: "Suffix Array",
    description: "Generate lexicographically sorted suffix tables for a text string and build suffix arrays.",
    category: "Suffixes",
    difficulty: "Hard",
    href: "/string-laboratory/suffix-array",
    icon: ListCollapse,
    timeComplexity: "O(N^2 log N)",
  },
  {
    id: "aho-corasick",
    title: "Aho-Corasick Trie",
    description: "Multi-pattern string search trie automaton matcher.",
    category: "Suffixes",
    difficulty: "Hard",
    href: "/string-laboratory/aho-corasick",
    icon: Network,
    timeComplexity: "O(N + M + K)",
    isPlaceholder: true,
  },
];

const CATEGORIES = [
  "All",
  "Basic",
  "Searching",
  "Hashing",
  "Algorithms",
  "Dynamic Programming",
  "Suffixes",
];

export function StDashboard() {
  const { toast } = useToast();
  const [search, setSearch] = React.useState("");
  const [selectedCat, setSelectedCat] = React.useState("All");
  const [favorites, setFavorites] = React.useState<string[]>([]);
  const [recent, setRecent] = React.useState<string[]>([]);

  // Load configuration from local storage
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const savedFavs = localStorage.getItem("cpkit_st_favorites");
      if (savedFavs) {
        try { setFavorites(JSON.parse(savedFavs)); } catch {}
      }

      const savedRec = localStorage.getItem("cpkit_st_recent");
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
    localStorage.setItem("cpkit_st_favorites", JSON.stringify(nextFavs));
  };

  const handleOpenTool = (id: string) => {
    const nextRecents = [id, ...recent.filter((r) => r !== id)].slice(0, 5);
    setRecent(nextRecents);
    localStorage.setItem("cpkit_st_recent", JSON.stringify(nextRecents));
  };

  const filteredTools = React.useMemo(() => {
    return ST_TOOLS.filter((tool) => {
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
    return ST_TOOLS.filter((tool) => recent.includes(tool.id));
  }, [recent]);

  return (
    <div className="space-y-6 text-left">
      {/* Header section */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-border/10 pb-4">
        <div className="space-y-1 font-sans">
          <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
            String Laboratory (ST)
          </h1>
          <p className="text-xs text-muted-foreground">
            Compute character frequencies, test anagrams, run KMP/Z matching passes, compare edit distance tables, and build suffix array indices.
          </p>
        </div>

        <div className="w-full md:max-w-xs">
          <Input
            placeholder="Search string tools..."
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
          {selectedCat} String Utilities ({filteredTools.length})
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
                          {tool.isPlaceholder && (
                            <Badge variant="warning" className="text-[7px] uppercase scale-90">Soon</Badge>
                          )}
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
              No string tools match your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
