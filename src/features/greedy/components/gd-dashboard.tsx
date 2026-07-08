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
  TrendingUp,
  Sliders,
  Activity,
  Layers,
  Scissors,
  Calculator,
  Compass,
  Cpu
} from "lucide-react";

interface GdToolItem {
  id: string;
  title: string;
  description: string;
  category: "Intervals & Scheduling" | "Knapsack & Sequencing" | "Playgrounds & Sims";
  difficulty: "Easy" | "Medium" | "Hard";
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  timeComplexity: string;
}

const GD_TOOLS: GdToolItem[] = [
  {
    id: "activity-selection",
    title: "Activity Selection",
    description: "Sort by finish times and select maximum non-overlapping tasks scheduling.",
    category: "Intervals & Scheduling",
    difficulty: "Easy",
    href: "/greedy/activity-selection",
    icon: Activity,
    timeComplexity: "O(N log N)",
  },
  {
    id: "fractional-knapsack",
    title: "Fractional Knapsack",
    description: "Fill knapsack fractionally using sorted value/weight density ratios.",
    category: "Knapsack & Sequencing",
    difficulty: "Easy",
    href: "/greedy/fractional-knapsack",
    icon: Layers,
    timeComplexity: "O(N log N)",
  },
  {
    id: "job-sequencing",
    title: "Job Sequencing",
    description: "Schedule jobs in free slots before deadlines to maximize revenue yields.",
    category: "Knapsack & Sequencing",
    difficulty: "Medium",
    href: "/greedy/job-sequencing",
    icon: Sliders,
    timeComplexity: "O(N^2)",
  },
  {
    id: "minimum-platform",
    title: "Minimum Platforms",
    description: "Determine minimum station platform tracks to prevent train scheduling waiting overlaps.",
    category: "Intervals & Scheduling",
    difficulty: "Medium",
    href: "/greedy/minimum-platform",
    icon: Compass,
    timeComplexity: "O(N log N)",
  },
  {
    id: "interval-scheduling",
    title: "Interval Scheduling",
    description: "Select the maximum mutually compatible interval segments subset.",
    category: "Intervals & Scheduling",
    difficulty: "Easy",
    href: "/greedy/interval-scheduling",
    icon: TrendingUp,
    timeComplexity: "O(N log N)",
  },
  {
    id: "interval-merging",
    title: "Merge Intervals",
    description: "Sort by start times and merge overlapping ranges greedily.",
    category: "Intervals & Scheduling",
    difficulty: "Medium",
    href: "/greedy/interval-merging",
    icon: Scissors,
    timeComplexity: "O(N log N)",
  },
  {
    id: "huffman",
    title: "Huffman Coding",
    description: "Construct optimal prefix binary trees for data compression schemas.",
    category: "Knapsack & Sequencing",
    difficulty: "Hard",
    href: "/greedy/huffman",
    icon: Calculator,
    timeComplexity: "O(N log N)",
  },
  {
    id: "coin-greedy",
    title: "Coin Greedy",
    description: "Verify local greedy choice optimality against global optimal changes.",
    category: "Playgrounds & Sims",
    difficulty: "Medium",
    href: "/greedy/coin-greedy",
    icon: Sliders,
    timeComplexity: "O(Coins)",
  },
  {
    id: "gas-station",
    title: "Gas Station",
    description: "Identify starting station index completing circular path gas checks.",
    category: "Playgrounds & Sims",
    difficulty: "Medium",
    href: "/greedy/gas-station",
    icon: Compass,
    timeComplexity: "O(N)",
  },
  {
    id: "optimal-merge",
    title: "Optimal Merge Pattern",
    description: "Construct optimal pairwise merges trees using min-priority queues.",
    category: "Playgrounds & Sims",
    difficulty: "Medium",
    href: "/greedy/optimal-merge",
    icon: Calculator,
    timeComplexity: "O(N log N)",
  },
  {
    id: "load-balancing",
    title: "Load Balancing",
    description: "Distribute task loads greedily across bins to minimize peak makespans.",
    category: "Playgrounds & Sims",
    difficulty: "Medium",
    href: "/greedy/load-balancing",
    icon: Cpu,
    timeComplexity: "O(N log N)",
  },
];

export function GdDashboard() {
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

  const filteredTools = GD_TOOLS.filter((tool) => {
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
            placeholder="Search greedy algorithms, timelines, schedulers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 w-full"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {["All", "Intervals & Scheduling", "Knapsack & Sequencing", "Playgrounds & Sims"].map((cat) => (
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
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-start justify-between">
                    <div className="p-2 border border-border/30 rounded-xl bg-muted/20 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <button
                      onClick={(e) => handleFavoriteToggle(tool.id, e)}
                      className="text-muted-foreground/45 hover:text-amber-500 transition-colors p-1"
                    >
                      <Star className={`h-4.5 w-4.5 ${isFav ? "fill-amber-500 text-amber-500" : ""}`} />
                    </button>
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
              The Greedy Method Paradigm
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs leading-relaxed text-foreground/80">
            <p>
              Greedy algorithms build up a solution piece by piece, always choosing the next piece that offers the most obvious and immediate local benefit. To prove its correctness, it must satisfy:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
              <li><strong className="text-foreground">Greedy Choice Property</strong>: A globally optimal solution can be reached by making locally optimal (greedy) choices.</li>
              <li><strong className="text-foreground">Optimal Substructure</strong>: An optimal solution to the global problem contains optimal solutions to subproblems.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/65 shadow-xs">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-foreground uppercase tracking-wider text-muted-foreground">
              How to Prove Greedy Correctness
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs leading-relaxed text-foreground/80">
            <p>
              Unlike Dynamic Programming which checks all subproblems, Greedy makes a single irrevocable decision. Proofs of correctness generally use:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
              <li><strong className="text-foreground">Exchange Arguments</strong>: Show that any optimal solution can be converted into the greedy solution without losing quality.</li>
              <li><strong className="text-foreground">Greedy Stays Ahead</strong>: Show that at each step of the algorithm, greedy is at least as good as any other choices pattern.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
