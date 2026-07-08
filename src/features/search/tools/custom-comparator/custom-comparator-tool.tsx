"use client";

import * as React from "react";
import { SrHeader } from "../../shared/sr-header";
import { SrLayout } from "../../shared/sr-layout";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RecordItem {
  id: number;
  name: string;
  score: number;
}

export function CustomComparatorTool() {
  const [dataStr, setDataStr] = React.useState("A:5, B:2, C:5, D:1, E:2");
  const [comparatorType, setComparatorType] = React.useState<"val-asc" | "val-desc" | "stable-demo">("val-asc");

  const [compared, setCompared] = React.useState(false);
  const [originalList, setOriginalList] = React.useState<RecordItem[]>([]);
  const [sortedList, setSortedList] = React.useState<RecordItem[]>([]);
  const [isStable, setIsStable] = React.useState<boolean | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleEvaluate = () => {
    setError(null);
    setCompared(true);
    setOriginalList([]);
    setSortedList([]);
    setIsStable(null);

    const parts = dataStr.split(",").map((s) => s.trim());
    const records: RecordItem[] = [];

    for (let i = 0; i < parts.length; i++) {
      const pair = parts[i].split(":");
      if (pair.length !== 2 || isNaN(parseInt(pair[1], 10))) {
        setError(`Invalid pair format: '${parts[i]}'. Use 'Name:Score' format.`);
        return;
      }
      records.push({
        id: i + 1,
        name: pair[0].trim(),
        score: parseInt(pair[1], 10),
      });
    }

    setOriginalList([...records]);

    let sorted: RecordItem[] = [];

    if (comparatorType === "val-asc") {
      // Ascending sort by score. Note: JavaScript Array.prototype.sort is stable in modern engines
      sorted = [...records].sort((a, b) => a.score - b.score);
    } else if (comparatorType === "val-desc") {
      // Descending sort by score
      sorted = [...records].sort((a, b) => b.score - a.score);
    } else if (comparatorType === "stable-demo") {
      // Stable demo: Sort by score ascending.
      // We will manually evaluate stability by checking if duplicate scores retain relative original ID order.
      sorted = [...records].sort((a, b) => a.score - b.score);
    }

    setSortedList(sorted);

    // Verify stability: for any equal scores, the original ID order (id) must be preserved in sorted list
    let stable = true;
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i].score === sorted[i + 1].score && sorted[i].id > sorted[i + 1].id) {
        stable = false;
        break;
      }
    }
    setIsStable(stable);
  };

  const definition = "A Custom Comparator defines user-specified sorting rules. A Stable Sort guarantees that elements with equal keys retain their relative original order in the output.";
  const idea = "A comparator function compares two elements, returning a negative number if the first element should sit before the second, positive if after, and zero if equal.";
  const pseudocode = `CustomComparator(a, b):
  if a.score != b.score:
    return a.score < b.score ? -1 : 1
  return a.id < b.id ? -1 : 1 // preserves stability`;

  const applications = [
    "Sorting complex structures (e.g. sorting students by grade, then by alphabetical name).",
    "Preserving chronological transaction logs order.",
    "Custom competitive programming structures sorts."
  ];
  const mistakes = [
    "A comparator must be transitive and return 0 for equal elements. Returning values incorrectly leads to undefined behaviors or infinite loops in quicksort implementations.",
    "Using unstable quicksort without secondary key indices checks, which destroys original relative order."
  ];
  const cpTips = [
    "In C++, std::sort is unstable (uses Introsort), whereas std::stable_sort is stable. Always use std::stable_sort if you must retain original relative records order!"
  ];

  return (
    <SrLayout
      timeComplexity="O(N log N) comparison sort runtime"
      spaceComplexity="O(N) record storage"
      definition={definition}
      idea={idea}
      pseudocode={pseudocode}
      applications={applications}
      mistakes={mistakes}
      cpTips={cpTips}
      visualizerChild={
        <Card className="border-border/40 bg-card/65 shadow-xs font-sans text-left">
          <CardHeader className="pb-2 border-b border-border/10">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Sorted Output Records Visualizer
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-3.5 border border-border/40 rounded-xl bg-background/25">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">
                  Original Input Records Sequence
                </span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {originalList.map((item) => (
                    <span key={item.id} className="px-2 py-1 bg-muted/30 border border-border/10 rounded font-mono text-xs">
                      {item.name}:{item.score} (id:{item.id})
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 border border-border/40 rounded-xl bg-background/25">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">
                  Sorted Output Records Sequence
                </span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {sortedList.map((item) => (
                    <span key={item.id} className="px-2 py-1 bg-primary/20 border border-primary/20 rounded font-mono text-xs font-semibold">
                      {item.name}:{item.score} (id:{item.id})
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {compared && isStable !== null && (
              <div className="border-t border-border/5 pt-3 font-mono text-xs text-left">
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Is Sort Stability Preserved:</span>
                  <span className={`font-bold ${isStable ? "text-emerald-500" : "text-rose-500"}`}>
                    {isStable ? "STABLE (True)" : "UNSTABLE (False)"}
                  </span>
                </div>
              </div>
            )}
            {error && <div className="text-xs text-rose-500 font-semibold font-mono">{error}</div>}
          </CardContent>
        </Card>
      }
    >
      <SrHeader
        title="Custom Comparator Playground"
        description="Verify custom comparator rules and stable sort invariants."
        category="Playgrounds & Sims"
        difficulty="Easy"
        shortcut="Alt+Shift+C"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <InputField label="Records (comma separated Name:Score)" value={dataStr} onChange={setDataStr} />

          <div className="space-y-1">
            <span className="text-xs font-bold text-muted-foreground">Comparator Rule</span>
            <select
              value={comparatorType}
              onChange={(e) => setComparatorType(e.target.value as "val-asc" | "val-desc" | "stable-demo")}
              className="w-full h-10 border border-border/40 rounded-xl bg-background/50 px-3 text-xs outline-none focus:border-primary cursor-pointer"
            >
              <option value="val-asc">Score (Ascending)</option>
              <option value="val-desc">Score (Descending)</option>
              <option value="stable-demo">Stable Score Sorting Check</option>
            </select>
          </div>

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Run Sort Play
          </Button>
        </CardContent>
      </Card>
    </SrLayout>
  );
}
