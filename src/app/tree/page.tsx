import { GitBranch } from "lucide-react";

export default function TreePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] border border-dashed border-border/60 rounded-xl bg-card/25 p-8 text-center space-y-4">
      <div className="p-3 bg-primary/10 rounded-full text-primary">
        <GitBranch className="h-6 w-6" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight">Tree</h2>
      <p className="text-sm text-muted-foreground max-w-sm">
        Lowest Common Ancestor, Segment Trees, Fenwick Trees, and Tree Decomposition models. Ready for implementation.
      </p>
    </div>
  );
}
