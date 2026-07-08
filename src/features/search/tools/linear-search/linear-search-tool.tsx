"use client";

import * as React from "react";
import { SrHeader } from "../../shared/sr-header";
import { SrLayout } from "../../shared/sr-layout";
import { BarChartVisualizer } from "../../visualization/bar-chart-visualizer";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function LinearSearchTool() {
  const [arrayStr, setArrayStr] = React.useState("5, 8, 12, 16, 23, 38, 56, 72");
  const [targetStr, setTargetStr] = React.useState("23");

  const [compared, setCompared] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState<number | null>(null);
  const [comparingIndices, setComparingIndices] = React.useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = React.useState<number[]>([]);
  const [traceLogs, setTraceLogs] = React.useState<string[]>([]);
  const [foundIndex, setFoundIndex] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleEvaluate = () => {
    setError(null);
    setCompared(true);
    setCurrentIndex(null);
    setComparingIndices([]);
    setSortedIndices([]);
    setTraceLogs([]);
    setFoundIndex(null);

    const arr = arrayStr.split(",").map((s) => parseInt(s.trim(), 10));
    const target = parseInt(targetStr, 10);

    if (arr.some(isNaN) || isNaN(target) || arr.length === 0) {
      setError("Please check your array and target element inputs.");
      return;
    }

    const logs: string[] = [];
    let matchIdx = -1;

    for (let i = 0; i < arr.length; i++) {
      logs.push(`Step ${i + 1}: Checking index ${i} (value: ${arr[i]}) vs Target ${target}`);
      if (arr[i] === target) {
        logs.push(`  → Match found at index ${i}!`);
        matchIdx = i;
        setSortedIndices([i]);
        break;
      }
    }

    if (matchIdx === -1) {
      logs.push(`• Sweep completed. Target ${target} not found in the array.`);
    }

    setTraceLogs(logs);
    setFoundIndex(matchIdx);
  };

  const definition = "Linear Search checks each element of the array sequentially from start to end until a match is found or the array is exhausted.";
  const idea = "Initialize index pointer at 0. Increment pointer and compare each cell value to the target. Returns index if found, else -1.";
  const pseudocode = `LinearSearch(arr, target):
  for i = 0 to arr.length - 1:
    if arr[i] == target:
      return i
  return -1`;

  const applications = [
    "Searching small unsorted collections.",
    "Finding matches in singly-linked lists.",
    "Simplest fallback search."
  ];
  const mistakes = [
    "Not handling duplicates (linear search typically returns the first occurrence index).",
    "Searching large datasets where O(N) is too slow."
  ];
  const cpTips = [
    "In competitive programming contests, linear search is useful only when N <= 10^5. For sorted collections or functions with monotonic properties, always upgrade to Binary Search!"
  ];

  const arrParsed = arrayStr.split(",").map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n));

  return (
    <SrLayout
      timeComplexity="O(N) linear sweep"
      spaceComplexity="O(1) auxiliary variables"
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
              Sequential Sweep Pointer Index Highlight
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <BarChartVisualizer
              array={arrParsed}
              currentIndex={currentIndex}
              comparingIndices={comparingIndices}
              sortedIndices={sortedIndices}
            />

            {compared && (
              <div className="border-t border-border/5 pt-3 space-y-3 font-mono text-xs text-left">
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Target Index Found:</span>
                  <span className={`font-bold ${foundIndex === -1 ? "text-rose-500" : "text-emerald-500"}`}>
                    {foundIndex === -1 ? "Not Found (-1)" : `Index ${foundIndex}`}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Sweep Logs Trace:
                  </span>
                  <div className="p-2.5 bg-muted/20 border border-border/10 rounded-lg max-h-40 overflow-y-auto font-mono text-[11px] leading-relaxed text-foreground/80 space-y-1">
                    {traceLogs.map((log, idx) => (
                      <div key={idx}>{log}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {error && <div className="text-xs text-rose-500 font-semibold font-mono">{error}</div>}
          </CardContent>
        </Card>
      }
    >
      <SrHeader
        title="Linear Search"
        description="Scan array elements sequentially to locate match values."
        category="Searching"
        difficulty="Easy"
        shortcut="Alt+Shift+L"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <InputField label="Array Elements (comma separated)" value={arrayStr} onChange={setArrayStr} />
          <InputField label="Search Target" value={targetStr} onChange={setTargetStr} />

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Run Linear Sweep
          </Button>
        </CardContent>
      </Card>
    </SrLayout>
  );
}
