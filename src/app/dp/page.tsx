import { Layers } from "lucide-react";

export default function DpPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] border border-dashed border-border/60 rounded-xl bg-card/25 p-8 text-center space-y-4">
      <div className="p-3 bg-primary/10 rounded-full text-primary">
        <Layers className="h-6 w-6" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight">Dynamic Programming</h2>
      <p className="text-sm text-muted-foreground max-w-sm">
        Classical DP patterns, Bitmask DP, Digit DP, Convex Hull Trick, and Optimizations. Ready for implementation.
      </p>
    </div>
  );
}
