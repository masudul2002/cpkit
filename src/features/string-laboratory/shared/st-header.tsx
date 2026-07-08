"use client";

import * as React from "react";
import { Star, ShieldAlert } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";

interface StHeaderProps {
  title: string;
  description: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  shortcut?: string;
}

export function StHeader({ title, description, category, difficulty, shortcut }: StHeaderProps) {
  const { toast } = useToast();
  const [isFav, setIsFav] = React.useState(false);

  const handleFavoriteToggle = () => {
    setIsFav(!isFav);
    toast({
      title: !isFav ? "Pinned to Favorites" : "Unpinned from Favorites",
      description: `${title} has been ${!isFav ? "added to" : "removed from"} your favorites dashboard list.`,
      variant: !isFav ? "success" : "info",
    });
  };

  const handleReportIssue = () => {
    toast({
      title: "Report Issue",
      description: "Redirecting to GitHub Issues template tracker...",
      variant: "info",
    });
    window.open("https://github.com/masudul2002/cpkit/issues/new?template=bug_report.md", "_blank");
  };

  return (
    <div className="border-b border-border/10 pb-4 mb-6 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Title and platform badges */}
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-extrabold tracking-tight text-foreground">{title}</h2>
            <Badge variant="primary" className="text-[9px] uppercase tracking-wider">{category}</Badge>
            <Badge variant={difficulty === "Easy" ? "success" : "warning"} className="text-[9px]">{difficulty}</Badge>
          </div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-3">
          {shortcut && (
            <kbd className="px-1.5 py-0.5 border rounded bg-muted/60 font-mono text-[9px] text-muted-foreground select-none">
              {shortcut}
            </kbd>
          )}

          {/* Favorite Toggle */}
          <button
            onClick={handleFavoriteToggle}
            className="text-muted-foreground/60 hover:text-amber-500 transition-colors p-1.5 rounded-lg border border-border/40 hover:bg-accent/40 cursor-pointer"
            title={isFav ? "Remove from Favorites" : "Add to Favorites"}
          >
            <Star className={`h-4.5 w-4.5 ${isFav ? "fill-amber-500 text-amber-500 border-amber-500" : ""}`} />
          </button>

          {/* Report Issue */}
          <button
            onClick={handleReportIssue}
            className="text-muted-foreground/60 hover:text-rose-500 transition-colors p-1.5 rounded-lg border border-border/40 hover:bg-accent/40 cursor-pointer"
            title="Report Bug / Issue"
          >
            <ShieldAlert className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
