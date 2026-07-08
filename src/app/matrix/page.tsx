import { Table2 } from "lucide-react";

export default function MatrixPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] border border-dashed border-border/60 rounded-xl bg-card/25 p-8 text-center space-y-4">
      <div className="p-3 bg-primary/10 rounded-full text-primary">
        <Table2 className="h-6 w-6" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight">Matrix</h2>
      <p className="text-sm text-muted-foreground max-w-sm">
        Matrix Exponentiation, Linear Recurrence Solvers, and Gaussian Elimination. Ready for implementation.
      </p>
    </div>
  );
}
