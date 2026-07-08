"use client";

import * as React from "react";
import { SrHeader } from "../../shared/sr-header";
import { SrLayout } from "../../shared/sr-layout";
import { BarChartVisualizer } from "../../visualization/bar-chart-visualizer";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function BinarySearchTool() {
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

    // Binary search requires sorted arrays
    const isSorted = arr.every((val, idx) => idx === 0 || val >= arr[idx - 1]);
    if (!isSorted) {
      setError("Input array must be sorted in ascending order for Binary Search.");
      return;
    }

    const logs: string[] = [];
    let low = 0;
    let high = arr.length - 1;
    let matchIdx = -1;
    let step = 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      logs.push(`Step ${step++}: Search bounds low: ${low}, high: ${high} | Mid index: ${mid} (value: ${arr[mid]})`);

      if (arr[mid] === target) {
        logs.push(`  → Match found at index ${mid}!`);
        matchIdx = mid;
        setSortedIndices([mid]);
        break;
      } else if (arr[mid] < target) {
        logs.push(`  → Mid value ${arr[mid]} < Target ${target}. Shifting low bounds to ${mid + 1}.`);
        low = mid + 1;
      } else {
        logs.push(`  → Mid value ${arr[mid]} > Target ${target}. Shifting high bounds to ${mid - 1}.`);
        high = mid - 1;
      }
    }

    if (matchIdx === -1) {
      logs.push(`• Target ${target} not found.`);
    }

    setTraceLogs(logs);
    setFoundIndex(matchIdx);
  };

  const definition = "Binary Search halves the search space at each step by comparing the target to the middle element of a sorted array.";
  const idea = "Initialize pointers low = 0, high = N - 1. While low <= high, evaluate mid = (low + high)/2. Update bounds based on target comparison.";
  const pseudocode = `BinarySearch(arr, target):
  low = 0, high = arr.length - 1
  while low <= high:
    mid = low + (high - low) / 2
    if arr[mid] == target:
      return mid
    else if arr[mid] < target:
      low = mid + 1
    else:
      high = mid - 1
  return -1`;

  const applications = [
    "Logarithmic search queries.",
    "Database index scans.",
    "Base framework for binary search on answers."
  ];
  const mistakes = [
    "Searching unsorted arrays (fails to locate elements correctly).",
    "Integer overflow when calculating mid as (low + high)/2 (use low + (high - low)/2 instead)."
  ];
  const cpTips = [
    "Binary search is one of the most frequently used tools in competitive programming. Whenever you notice a monotonic function, always think about applying binary search!"
  ];

  const arrParsed = arrayStr.split(",").map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n));

  return (
    <SrLayout
      timeComplexity="O(log N) search bounds cuts"
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
              Logarithmic Interval Splits Visualizer
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
                    Halving Steps Trace:
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
        title="Binary Search"
        description="Halve search bounds logarithmically on sorted arrays."
        category="Searching"
        difficulty="Easy"
        shortcut="Alt+Shift+B"
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
            Run Binary Search
          </Button>
        </CardContent>
      </Card>
    </SrLayout>
  );
}
