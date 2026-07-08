import { Percent } from "lucide-react";

export default function NumberTheoryPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] border border-dashed border-border/60 rounded-xl bg-card/25 p-8 text-center space-y-4">
      <div className="p-3 bg-primary/10 rounded-full text-primary">
        <Percent className="h-6 w-6" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight">Number Theory</h2>
      <p className="text-sm text-muted-foreground max-w-sm">
        GCD, Extended Euclidean, Modular Inverse, Prime Sieve, and Combinatorics. Ready for implementation.
      </p>
    </div>
  );
}
