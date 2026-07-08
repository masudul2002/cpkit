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
  ArrowLeftRight,
  Rows,
  Binary,
  BarChart2,
  SortAsc,
  Copy,
  Shuffle,
  AlignLeft,
  FileCheck,
  Play,
  Cpu
} from "lucide-react";

interface DebugTool {
  id: string;
  title: string;
  description: string;
  category: "Difference" | "Analysis" | "Verification" | "Utilities";
  difficulty: "Easy" | "Medium" | "Hard";
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut: string;
}

const DEBUG_TOOLS: DebugTool[] = [
  {
    id: "comparer",
    title: "Output Comparer",
    description: "Compare expected output with received outputs line by line, ignoring trailing newlines.",
    category: "Difference",
    difficulty: "Easy",
    href: "/debug-tools/output-comparer",
    icon: ArrowLeftRight,
    shortcut: "Alt+Shift+1",
  },
  {
    id: "line-diff",
    title: "Line Difference",
    description: "Check differences line by line to see correct, missing, extra, or modified lines.",
    category: "Difference",
    difficulty: "Easy",
    href: "/debug-tools/line-diff",
    icon: Rows,
    shortcut: "Alt+Shift+2",
  },
  {
    id: "char-diff",
    title: "Character Difference",
    description: "Find the exact line, column, and ASCII code of the first mismatching character.",
    category: "Difference",
    difficulty: "Easy",
    href: "/debug-tools/character-diff",
    icon: Binary, // Binary code differences icon representation
    shortcut: "Alt+Shift+3",
  },
  {
    id: "freq",
    title: "Frequency Comparator",
    description: "Verify multiset element counts by comparing occurrence frequencies.",
    category: "Analysis",
    difficulty: "Medium",
    href: "/debug-tools/frequency-compare",
    icon: BarChart2,
    shortcut: "Alt+Shift+4",
  },
  {
    id: "sorted",
    title: "Sort Checker",
    description: "Check array sorting bounds (ascending, descending, strict, non-strict) and locate breaks.",
    category: "Verification",
    difficulty: "Easy",
    href: "/debug-tools/sort-checker",
    icon: SortAsc,
    shortcut: "Alt+Shift+5",
  },
  {
    id: "dup",
    title: "Duplicate Finder",
    description: "Scan elements list to locate duplicate values, counts, and their index offsets.",
    category: "Verification",
    difficulty: "Easy",
    href: "/debug-tools/duplicate-finder",
    icon: Copy,
    shortcut: "Alt+Shift+6",
  },
  {
    id: "shuffle",
    title: "Array Shuffler",
    description: "Randomize array elements with deterministic seed configurations.",
    category: "Utilities",
    difficulty: "Easy",
    href: "/debug-tools/shuffle-array",
    icon: Shuffle,
    shortcut: "Alt+Shift+7",
  },
  {
    id: "whitespace",
    title: "Whitespace Checker",
    description: "Verify output spacing layout to avoid presentation errors or mixed tab indentation bugs.",
    category: "Utilities",
    difficulty: "Easy",
    href: "/debug-tools/whitespace-checker",
    icon: AlignLeft,
    shortcut: "Alt+Shift+8",
  },
  {
    id: "validator",
    title: "Input Validator",
    description: "Validate N-sized arrays and matrices against constraints limits.",
    category: "Verification",
    difficulty: "Medium",
    href: "/debug-tools/input-validator",
    icon: FileCheck,
    shortcut: "Alt+Shift+9",
  },
  {
    id: "stress",
    title: "Stress Test (MVP)",
    description: "Run manual comparison test runs comparing brute force outputs against optimized solvers.",
    category: "Analysis",
    difficulty: "Hard",
    href: "/debug-tools/stress-test",
    icon: Play,
    shortcut: "Alt+Shift+0",
  },
  {
    id: "memory",
    title: "Memory Estimator",
    description: "Estimate heap memory footprint of standard C++ container variables.",
    category: "Analysis",
    difficulty: "Easy",
    href: "/debug-tools/memory-estimator",
    icon: Cpu,
    shortcut: "Alt+Shift+M",
  },
];

export function DbgDashboard() {
  const { toast } = useToast();
  const [search, setSearch] = React.useState("");
  const [favorites, setFavorites] = React.useState<string[]>([]);

  // Load favorites from local storage
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cpkit_dbg_favorites");
      if (saved) {
        try {
          setFavorites(JSON.parse(saved));
        } catch {}
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
        description: "Tool removed from dashboard pins.",
        variant: "info",
      });
    } else {
      nextFavs = [...favorites, id];
      toast({
        title: "Pinned to Favorites",
        description: "Tool pinned to dashboard for fast access.",
        variant: "success",
      });
    }

    setFavorites(nextFavs);
    localStorage.setItem("cpkit_dbg_favorites", JSON.stringify(nextFavs));
  };

  const filteredTools = React.useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return DEBUG_TOOLS;
    return DEBUG_TOOLS.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="space-y-6 text-left">
      {/* Header section */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-border/10 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
            Debug Utilities
          </h1>
          <p className="text-xs text-muted-foreground">
            Compare solution outputs, validate array sizes, locate spacing errors, and estimate memories.
          </p>
        </div>
        
        <div className="w-full md:max-w-xs">
          <Input
            placeholder="Search debug tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="h-4 w-4 text-muted-foreground" />}
            className="h-9"
          />
        </div>
      </div>

      {/* Grid of tools */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTools.length > 0 ? (
          filteredTools.map((tool) => {
            const isFav = favorites.includes(tool.id);
            const Icon = tool.icon;

            return (
              <Link href={tool.href} key={tool.id} className="group block cursor-pointer">
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
                      <span className="font-mono">{tool.shortcut}</span>
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
            No debug utilities match your search query.
          </div>
        )}
      </div>
    </div>
  );
}
