"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import {
  Search as SearchIcon,
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

interface SrToolItem {
  id: string;
  title: string;
  description: string;
  category: "Searching Algorithms" | "Sorting Algorithms" | "Playgrounds & Sims";
  difficulty: "Easy" | "Medium" | "Hard";
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  timeComplexity: string;
}

const SR_TOOLS: SrToolItem[] = [
  {
    id: "linear-search",
    title: "Linear Search",
    description: "Scan elements sequentially one-by-one to locate match values.",
    category: "Searching Algorithms",
    difficulty: "Easy",
    href: "/search/linear-search",
    icon: Activity,
    timeComplexity: "O(N)",
  },
  {
    id: "binary-search",
    title: "Binary Search",
    description: "Logarithmically divide search bounds on sorted arrays.",
    category: "Searching Algorithms",
    difficulty: "Easy",
    href: "/search/binary-search",
    icon: Layers,
    timeComplexity: "O(log N)",
  },
  {
    id: "lower-bound",
    title: "Lower Bound",
    description: "Find the first element index greater than or equal to the target.",
    category: "Searching Algorithms",
    difficulty: "Easy",
    href: "/search/lower-bound",
    icon: Compass,
    timeComplexity: "O(log N)",
  },
  {
    id: "upper-bound",
    title: "Upper Bound",
    description: "Find the first element index strictly greater than the target.",
    category: "Searching Algorithms",
    difficulty: "Easy",
    href: "/search/upper-bound",
    icon: Compass,
    timeComplexity: "O(log N)",
  },
  {
    id: "ternary-search",
    title: "Ternary Search",
    description: "Find target in sorted range or peaks of unimodal continuous functions.",
    category: "Searching Algorithms",
    difficulty: "Medium",
    href: "/search/ternary-search",
    icon: TrendingUp,
    timeComplexity: "O(log3 N)",
  },
  {
    id: "binary-search-answer",
    title: "Binary Search on Answer",
    description: "Perform binary searches to solve Book Allocation or Cows optimization limits.",
    category: "Searching Algorithms",
    difficulty: "Hard",
    href: "/search/binary-search-answer",
    icon: Calculator,
    timeComplexity: "O(N log S)",
  },
  {
    id: "bubble-sort",
    title: "Bubble Sort",
    description: "Repeatedly scan and swap adjacent unsorted elements.",
    category: "Sorting Algorithms",
    difficulty: "Easy",
    href: "/sorting/bubble-sort",
    icon: Sliders,
    timeComplexity: "O(N^2)",
  },
  {
    id: "selection-sort",
    title: "Selection Sort",
    description: "Select the minimum element from the unsorted zone and place it at the front.",
    category: "Sorting Algorithms",
    difficulty: "Easy",
    href: "/sorting/selection-sort",
    icon: Sliders,
    timeComplexity: "O(N^2)",
  },
  {
    id: "insertion-sort",
    title: "Insertion Sort",
    description: "Build final sorted array by inserting each key element relative to sorted prefix.",
    category: "Sorting Algorithms",
    difficulty: "Easy",
    href: "/sorting/insertion-sort",
    icon: Sliders,
    timeComplexity: "O(N^2)",
  },
  {
    id: "merge-sort",
    title: "Merge Sort",
    description: "Divide array into halves, sort recursively, and merge sorted halves.",
    category: "Sorting Algorithms",
    difficulty: "Medium",
    href: "/sorting/merge-sort",
    icon: Layers,
    timeComplexity: "O(N log N)",
  },
  {
    id: "quick-sort",
    title: "Quick Sort",
    description: "Partition array elements around pivot keys recursively.",
    category: "Sorting Algorithms",
    difficulty: "Medium",
    href: "/sorting/quick-sort",
    icon: Scissors,
    timeComplexity: "O(N log N)",
  },
  {
    id: "heap-sort",
    title: "Heap Sort",
    description: "Represent the array as a binary max heap, repeatedly extract max elements.",
    category: "Sorting Algorithms",
    difficulty: "Medium",
    href: "/sorting/heap-sort",
    icon: Calculator,
    timeComplexity: "O(N log N)",
  },
  {
    id: "counting-sort",
    title: "Counting Sort",
    description: "Non-comparison sorting using value frequencies counts lists.",
    category: "Sorting Algorithms",
    difficulty: "Medium",
    href: "/sorting/counting-sort",
    icon: Cpu,
    timeComplexity: "O(N + K)",
  },
  {
    id: "radix-sort",
    title: "Radix Sort",
    description: "Sort integers digit-by-digit from LSD to MSD stably.",
    category: "Sorting Algorithms",
    difficulty: "Medium",
    href: "/sorting/radix-sort",
    icon: Cpu,
    timeComplexity: "O(D * N)",
  },
  {
    id: "bucket-sort",
    title: "Bucket Sort",
    description: "Distribute elements into range buckets, sort buckets, and gather.",
    category: "Sorting Algorithms",
    difficulty: "Medium",
    href: "/sorting/bucket-sort",
    icon: Cpu,
    timeComplexity: "O(N + B)",
  },
  {
    id: "sort-benchmark",
    title: "Sorting Benchmark Tool",
    description: "Compare execution times, comparisons, and swaps across algorithms.",
    category: "Playgrounds & Sims",
    difficulty: "Medium",
    href: "/sorting/sort-benchmark",
    icon: Calculator,
    timeComplexity: "O(N log N)",
  },
  {
    id: "custom-comparator",
    title: "Custom Comparator Playground",
    description: "Verify sorting stability and user-defined records comparators.",
    category: "Playgrounds & Sims",
    difficulty: "Easy",
    href: "/sorting/custom-comparator",
    icon: Sliders,
    timeComplexity: "O(N log N)",
  },
];

export function SrDashboard() {
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

  const filteredTools = SR_TOOLS.filter((tool) => {
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
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search searching, sorting algorithms, bounds, benchmark..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 w-full"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {["All", "Searching Algorithms", "Sorting Algorithms", "Playgrounds & Sims"].map((cat) => (
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
              Search space bounds & decision functions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs leading-relaxed text-foreground/80">
            <p>
              In competitive programming, searching extends beyond simple arrays. By defining a monotonic decision function `f(x)` that returns `true` or `false`, we can binary search the solution space to find boundary thresholds.
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
              <li><strong className="text-foreground">Lower Bound</strong>: First index where `f(x)` is satisfied (element &gt;= target).</li>
              <li><strong className="text-foreground">Binary Search on Answer</strong>: Finding maximum/minimum feasible limits.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/65 shadow-xs">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-foreground uppercase tracking-wider text-muted-foreground">
              Sorting Stability Invariants
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs leading-relaxed text-foreground/80">
            <p>
              A sorting algorithm is stable if it preserves the relative order of items with equal keys. This is critical when sorting records across multiple columns.
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
              <li><strong className="text-foreground">Stable algorithms</strong>: Bubble Sort, Insertion Sort, Merge Sort, Counting Sort.</li>
              <li><strong className="text-foreground">Unstable algorithms</strong>: Selection Sort, Quick Sort, Heap Sort.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
