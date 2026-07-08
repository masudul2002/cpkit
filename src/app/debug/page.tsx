import { Bug } from "lucide-react";

export default function DebugPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] border border-dashed border-border/60 rounded-xl bg-card/25 p-8 text-center space-y-4">
      <div className="p-3 bg-primary/10 rounded-full text-primary">
        <Bug className="h-6 w-6" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight">Debug Tools</h2>
      <p className="text-sm text-muted-foreground max-w-sm">
        Stress test solutions, compare outputs, and profile complexity. Ready for implementation.
      </p>
    </div>
  );
}
