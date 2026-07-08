"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { Star, Search, Pin, Trash2, Sliders, ExternalLink } from "lucide-react";
import Link from "next/link";

interface FavoriteItem {
  id: string;
  title: string;
  category: "Tool" | "Algorithm" | "Reference" | "Template";
  route: string;
  isPinned: boolean;
}

const DEFAULT_FAVORITES: FavoriteItem[] = [
  { id: "1", title: "Stress Test Checker", category: "Tool", route: "/debug-tools/stress-test", isPinned: true },
  { id: "2", title: "Dijkstra Visualizer", category: "Algorithm", route: "/graph/dijkstra", isPinned: true },
  { id: "3", title: "Fermat Modular Inverse Inverse", category: "Reference", route: "/reference", isPinned: false },
  { id: "4", title: "Segment Tree Templates", category: "Template", route: "/tree/segment-tree", isPinned: false },
];

export default function FavoritesPage() {
  const { toast } = useToast();
  const [favorites, setFavorites] = React.useState<FavoriteItem[]>([]);
  const [query, setQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("All");

  React.useEffect(() => {
    const saved = localStorage.getItem("cpkit_favorites");
    if (saved) {
      setFavorites(JSON.parse(saved));
    } else {
      setFavorites(DEFAULT_FAVORITES);
      localStorage.setItem("cpkit_favorites", JSON.stringify(DEFAULT_FAVORITES));
    }
  }, []);

  const saveFavorites = (list: FavoriteItem[]) => {
    setFavorites(list);
    localStorage.setItem("cpkit_favorites", JSON.stringify(list));
  };

  const togglePin = (id: string) => {
    const list = favorites.map((item) =>
      item.id === id ? { ...item, isPinned: !item.isPinned } : item
    );
    saveFavorites(list);
    toast({
      title: "Updated",
      description: "Priority pins adjusted.",
      variant: "success",
    });
  };

  const removeFav = (id: string) => {
    const list = favorites.filter((item) => item.id !== id);
    saveFavorites(list);
    toast({
      title: "Removed",
      description: "Favorites list updated.",
      variant: "success",
    });
  };

  // Filter list
  const filtered = favorites.filter((item) => {
    const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    return matchesQuery && matchesCategory;
  });

  // Sort by pinned first
  const sorted = [...filtered].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 text-left font-sans pb-16">
      <div className="flex items-center gap-4 bg-card/65 border border-border/40 p-5 rounded-2xl">
        <div className="p-3 bg-primary/10 text-primary border border-primary/20 rounded-xl">
          <Star className="h-6 w-6 fill-primary animate-pulse" />
        </div>
        <div>
          <h2 className="text-lg font-black text-foreground">Favorites Board</h2>
          <p className="text-xs text-muted-foreground">Manage prioritized shortcuts to quick actions and templates.</p>
        </div>
      </div>

      {/* Control filters bar */}
      <div className="flex flex-wrap items-center gap-3 bg-card/40 border border-border/10 p-3 rounded-2xl justify-between">
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bookmarks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8 text-xs h-9 bg-background/50 border-border/25"
          />
        </div>

        <div className="flex gap-1.5 overflow-auto">
          {["All", "Tool", "Algorithm", "Reference", "Template"].map((cat) => (
            <Badge
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              variant={categoryFilter === cat ? "primary" : "secondary"}
              className="cursor-pointer text-[10px] scale-90"
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      {sorted.length === 0 ? (
        <Card className="border-dashed border-border/60 bg-card/10 py-12 text-center">
          <CardContent className="space-y-3 flex flex-col items-center">
            <Star className="h-10 w-10 text-muted-foreground/30" />
            <h4 className="text-sm font-bold text-foreground">No matches found</h4>
            <p className="text-xs text-muted-foreground max-w-xs">
              Clear filters or search for another term.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {sorted.map((item) => (
            <Card key={item.id} className="border-border/40 bg-card/65 flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => togglePin(item.id)}
                  className={`h-8 w-8 cursor-pointer ${item.isPinned ? "text-amber-500 hover:text-amber-600" : "text-muted-foreground"}`}
                >
                  <Pin className={`h-4 w-4 ${item.isPinned ? "fill-amber-500" : ""}`} />
                </Button>
                <div className="text-left space-y-0.5">
                  <span className="text-xs font-bold text-foreground">{item.title}</span>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="secondary" className="text-[8px] scale-90">{item.category}</Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link href={item.route}>
                  <Button size="sm" variant="outline" className="cursor-pointer gap-1.5 h-8 text-xs">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Open Tool
                  </Button>
                </Link>
                <Button size="icon" variant="outline" onClick={() => removeFav(item.id)} className="h-8 w-8 text-rose-500 hover:text-rose-600 cursor-pointer">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
