import { Triangle } from "lucide-react";

export default function GeometryPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] border border-dashed border-border/60 rounded-xl bg-card/25 p-8 text-center space-y-4">
      <div className="p-3 bg-primary/10 rounded-full text-primary">
        <Triangle className="h-6 w-6" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight">Geometry</h2>
      <p className="text-sm text-muted-foreground max-w-sm">
        Convex hull, line intersections, sweep line algorithms, and polygon area. Ready for implementation.
      </p>
    </div>
  );
}
