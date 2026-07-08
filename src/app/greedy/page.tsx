import { Coins } from "lucide-react";

export default function GreedyPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] border border-dashed border-border/60 rounded-xl bg-card/25 p-8 text-center space-y-4">
      <div className="p-3 bg-primary/10 rounded-full text-primary">
        <Coins className="h-6 w-6" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight">Greedy Choice</h2>
      <p className="text-sm text-muted-foreground max-w-sm">
        Interval scheduling, scheduling optimization, Huffman coding, and exchange arguments. Ready for implementation.
      </p>
    </div>
  );
}
