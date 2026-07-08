"use client";

import * as React from "react";
import { SrHeader } from "../../shared/sr-header";
import { SrLayout } from "../../shared/sr-layout";
import { BarChartVisualizer } from "../../visualization/bar-chart-visualizer";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function LowerBoundTool() {
  const [arrayStr, setArrayStr] = React.useState("5, 8, 12, 12, 12, 38, 56, 72");
  const [targetStr, setTargetStr] = React.useState("12");

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
      setError("Input array must be sorted in ascending order for Lower Bound.");
      return;
    }

    const logs: string[] = [];
    let low = 0;
    let high = arr.length;
    let step = 1;

    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      logs.push(`Step ${step++}: Bounds low: ${low}, high: ${high} | Mid: ${mid} (value: ${arr[mid]})`);

      if (arr[mid] >= target) {
        logs.push(`  → Mid value ${arr[mid]} >= Target ${target}. Shifting high to mid index ${mid}.`);
        high = mid;
      } else {
        logs.push(`  → Mid value ${arr[mid]} < Target ${target}. Shifting low to mid+1 index ${mid + 1}.`);
        low = mid + 1;
      }
    }

    logs.push(`• Lower bound index located at index ${low}. Value: ${low < arr.length ? arr[low] : "Out of bounds"}`);

    setTraceLogs(logs);
    setFoundIndex(low);
    if (low < arr.length) {
      setSortedIndices([low]);
    }
  };

  const definition = "Lower Bound returns the index of the first element in a sorted range that does not compare less than the target value (i.e. element >= target).";
  const idea = "Run binary search using bounds low = 0, high = N. If mid value >= target, shift high = mid, otherwise shift low = mid + 1.";
  const pseudocode = `LowerBound(arr, target):
  low = 0, high = arr.length
  while low < high:
    mid = low + (high - low) / 2
    if arr[mid] >= target:
      high = mid
    else:
      low = mid + 1
  return low`;

  const applications = [
    "Finding the first occurrence of an element in duplicate arrays.",
    "Database range query bounds setup.",
    "Evaluating bounds in competitive programming solutions."
  ];
  const mistakes = [
    "Setting high bounds to N - 1 (which fails if all elements are smaller than target, where result should be N).",
    "Not sorting the array before query."
  ];
  const cpTips = [
    "In C++ STL, this is equivalent to std::lower_bound. It is essential when searching for insertion offsets or counting element occurrences!"
  ];

  const arrParsed = arrayStr.split(",").map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n));

  return (
    <SrLayout
      timeComplexity="O(log N) search operations"
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
              First Element Greater/Equal Target Index Highlight
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
                  <span>Lower Bound Index:</span>
                  <span className="font-bold text-emerald-500">{foundIndex}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Bounds Tracing Steps:
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
        title="Lower Bound"
        description="Find the first index where element >= target in a sorted collection."
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
          <InputField label="Sorted Array (comma separated)" value={arrayStr} onChange={setArrayStr} />
          <InputField label="Search Target" value={targetStr} onChange={setTargetStr} />

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Calculate Lower Bound
          </Button>
        </CardContent>
      </Card>
    </SrLayout>
  );
}
