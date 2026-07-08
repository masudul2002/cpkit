import { Search } from "lucide-react";

export default function SearchPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] border border-dashed border-border/60 rounded-xl bg-card/25 p-8 text-center space-y-4">
      <div className="p-3 bg-primary/10 rounded-full text-primary">
        <Search className="h-6 w-6" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight">Search</h2>
      <p className="text-sm text-muted-foreground max-w-sm">
        Binary search, ternary search, parallel binary search, and metasearch helpers. Ready for implementation.
      </p>
    </div>
  );
}
