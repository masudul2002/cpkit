"use client";

import * as React from "react";
import { SrHeader } from "../../shared/sr-header";
import { SrLayout } from "../../shared/sr-layout";
import { BarChartVisualizer } from "../../visualization/bar-chart-visualizer";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function TernarySearchTool() {
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
      setError("Please check your array and target inputs.");
      return;
    }

    const isSorted = arr.every((val, idx) => idx === 0 || val >= arr[idx - 1]);
    if (!isSorted) {
      setError("Input array must be sorted in ascending order for Ternary Search.");
      return;
    }

    const logs: string[] = [];
    let low = 0;
    let high = arr.length - 1;
    let matchIdx = -1;
    let step = 1;

    while (low <= high) {
      const mid1 = low + Math.floor((high - low) / 3);
      const mid2 = high - Math.floor((high - low) / 3);

      logs.push(
        `Step ${step++}: Range [${low}, ${high}] | mid1: ${mid1} (val: ${arr[mid1]}), mid2: ${mid2} (val: ${arr[mid2]})`
      );

      if (arr[mid1] === target) {
        logs.push(`  → Match found at mid1 index ${mid1}!`);
        matchIdx = mid1;
        setSortedIndices([mid1]);
        break;
      }
      if (arr[mid2] === target) {
        logs.push(`  → Match found at mid2 index ${mid2}!`);
        matchIdx = mid2;
        setSortedIndices([mid2]);
        break;
      }

      if (target < arr[mid1]) {
        logs.push(`  → Target ${target} < ${arr[mid1]} (mid1). Shifting high to ${mid1 - 1}.`);
        high = mid1 - 1;
      } else if (target > arr[mid2]) {
        logs.push(`  → Target ${target} > ${arr[mid2]} (mid2). Shifting low to ${mid2 + 1}.`);
        low = mid2 + 1;
      } else {
        logs.push(`  → Target ${target} lies between mid1 and mid2. Shifting range to [${mid1 + 1}, ${mid2 - 1}].`);
        low = mid1 + 1;
        high = mid2 - 1;
      }
    }

    if (matchIdx === -1) {
      logs.push(`• Target ${target} not found.`);
    }

    setTraceLogs(logs);
    setFoundIndex(matchIdx);
  };

  const definition = "Ternary Search divides the search space into three equal segments by evaluating two midpoints (mid1 and mid2) instead of one, running in logarithmic time.";
  const idea = "Divide the interval [low, high] into three equal parts. Compare the target to mid1 and mid2 to eliminate 1/3 or 2/3 of the search space.";
  const pseudocode = `TernarySearch(arr, target):
  low = 0, high = arr.length - 1
  while low <= high:
    mid1 = low + (high - low) / 3
    mid2 = high - (high - low) / 3
    if arr[mid1] == target: return mid1
    if arr[mid2] == target: return mid2
    if target < arr[mid1]:
      high = mid1 - 1
    else if target > arr[mid2]:
      low = mid2 + 1
    else:
      low = mid1 + 1
      high = mid2 - 1
  return -1`;

  const applications = [
    "Searching sorted arrays using three-way branching.",
    "Finding the extreme value (minimum or maximum) of a unimodal function (continuous ternary search).",
    "Optimization models calculations."
  ];
  const mistakes = [
    "Using ternary search on non-unimodal functions when optimization is needed.",
    "Calculating midpoints incorrectly causing out of bounds indices."
  ];
  const cpTips = [
    "While Ternary Search on sorted arrays does fewer iterations than Binary Search, it does more comparisons per iteration. Thus, standard Binary Search is generally preferred for simple arrays, but Ternary Search is unmatched for finding peaks in unimodal graphs!"
  ];

  const arrParsed = arrayStr.split(",").map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n));

  return (
    <SrLayout
      timeComplexity="O(log3 N) branching divisions"
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
              Three-way Range Divisions Visualizer
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
                  <span>Match Index Located:</span>
                  <span className={`font-bold ${foundIndex === -1 ? "text-rose-500" : "text-emerald-500"}`}>
                    {foundIndex === -1 ? "Not Found (-1)" : `Index ${foundIndex}`}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Three-way Steps Trace:
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
        title="Ternary Search"
        description="Divide search bounds into three parts to isolate targets or unimodal peak boundaries."
        category="Searching"
        difficulty="Medium"
        shortcut="Alt+Shift+T"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <InputField label="Sorted Array (comma separated)" value={arrayStr} onChange={setArrayStr} />
          <InputField label="Search Target" value={targetStr} onChange={setTargetStr} />

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Run Ternary Search
          </Button>
        </CardContent>
      </Card>
    </SrLayout>
  );
}
