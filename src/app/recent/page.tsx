"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { Clock, Trash2, Search, ExternalLink } from "lucide-react";
import Link from "next/link";

interface HistoryItem {
  id: string;
  title: string;
  category: string;
  timestamp: string;
  route: string;
}

const DEFAULT_HISTORY: HistoryItem[] = [
  { id: "1", title: "Practice Workspace", category: "Workspace", timestamp: "5 mins ago", route: "/practice" },
  { id: "2", title: "Output Comparer Diff", category: "Debug Tool", timestamp: "1 hour ago", route: "/debug-tools/output-comparer" },
  { id: "3", title: "Fermat Modular Inverse Inverse", category: "Reference", timestamp: "2 hours ago", route: "/reference" },
  { id: "4", title: "Activity Selection Visualizer", category: "Greedy Tool", timestamp: "1 day ago", route: "/greedy/activity-selection" },
];

export default function RecentPage() {
  const { toast } = useToast();
  const [history, setHistory] = React.useState<HistoryItem[]>([]);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    const saved = localStorage.getItem("cpkit_history");
    if (saved) {
      setHistory(JSON.parse(saved));
    } else {
      setHistory(DEFAULT_HISTORY);
      localStorage.setItem("cpkit_history", JSON.stringify(DEFAULT_HISTORY));
    }
  }, []);

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("cpkit_history");
    toast({
      title: "History Cleared",
      description: "Logs deleted from local storage.",
      variant: "success",
    });
  };

  const filtered = history.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 text-left font-sans pb-16">
      <div className="flex items-center gap-4 bg-card/65 border border-border/40 p-5 rounded-2xl">
        <div className="p-3 bg-primary/10 text-primary border border-primary/20 rounded-xl">
          <Clock className="h-6 w-6 animate-pulse" />
        </div>
        <div>
          <h2 className="text-lg font-black text-foreground">Recent History</h2>
          <p className="text-xs text-muted-foreground">List of workspaces and reference cheatsheets opened recently.</p>
        </div>
      </div>

      {/* Control bar */}
      <div className="flex flex-wrap items-center gap-3 bg-card/40 border border-border/10 p-3 rounded-2xl justify-between">
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search history logs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8 text-xs h-9 bg-background/50 border-border/25"
          />
        </div>

        <Button size="sm" variant="outline" onClick={clearHistory} className="cursor-pointer gap-2 h-9 text-xs">
          <Trash2 className="h-4 w-4 text-rose-500" />
          Clear Activity Logs
        </Button>
      </div>

      {filtered.length === 0 ? (
        <Card className="border-dashed border-border/60 bg-card/10 py-12 text-center">
          <CardContent className="space-y-3 flex flex-col items-center">
            <Clock className="h-10 w-10 text-muted-foreground/30" />
            <h4 className="text-sm font-bold text-foreground">No recent activity logs</h4>
            <p className="text-xs text-muted-foreground max-w-xs">
              Go open workspaces or run debug tests to populate reports list.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map((item) => (
            <Card key={item.id} className="border-border/40 bg-card/65 flex items-center justify-between p-4">
              <div className="text-left space-y-0.5">
                <span className="text-xs font-bold text-foreground block">{item.title}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[8px] scale-90">{item.category}</Badge>
                  <span className="text-[9px] text-muted-foreground">{item.timestamp}</span>
                </div>
              </div>

              <Link href={item.route}>
                <Button size="sm" variant="outline" className="cursor-pointer gap-1.5 h-8 text-xs">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Restore Section
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
