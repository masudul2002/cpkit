"use client";

import * as React from "react";
import { SrHeader } from "../../shared/sr-header";
import { SrLayout } from "../../shared/sr-layout";
import { BarChartVisualizer } from "../../visualization/bar-chart-visualizer";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SortFrame {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  log: string;
}

export function InsertionSortTool() {
  const [arrayStr, setArrayStr] = React.useState("23, 8, 56, 12, 38, 5, 72, 16");

  const [compared, setCompared] = React.useState(false);
  const [frames, setFrames] = React.useState<SortFrame[]>([]);
  const [currentFrameIdx, setCurrentFrameIdx] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSort = () => {
    setError(null);
    setCompared(true);
    setFrames([]);
    setCurrentFrameIdx(0);
    setIsPlaying(false);

    const arr = arrayStr.split(",").map((s) => parseInt(s.trim(), 10));
    if (arr.some(isNaN) || arr.length === 0) {
      setError("Please check your array input.");
      return;
    }

    const n = arr.length;
    const workingArr = [...arr];
    const generatedFrames: SortFrame[] = [];

    generatedFrames.push({
      array: [...workingArr],
      comparing: [],
      swapping: [],
      sorted: [0],
      log: "Initial state. The first element is considered sorted.",
    });

    for (let i = 1; i < n; i++) {
      const key = workingArr[i];
      let j = i - 1;

      generatedFrames.push({
        array: [...workingArr],
        comparing: [i, j],
        swapping: [],
        sorted: Array.from({ length: i }, (_, idx) => idx),
        log: `Pick element key = ${key} at index ${i} to insert into the sorted partition.`,
      });

      while (j >= 0 && workingArr[j] > key) {
        workingArr[j + 1] = workingArr[j];

        generatedFrames.push({
          array: [...workingArr],
          comparing: [j],
          swapping: [j + 1],
          sorted: Array.from({ length: i }, (_, idx) => (idx === j + 1 ? i : idx)), // preserve boundary colors
          log: `Value ${workingArr[j]} at index ${j} > key ${key}. Shifting it to index ${j + 1}.`,
        });

        j--;
      }
      workingArr[j + 1] = key;

      generatedFrames.push({
        array: [...workingArr],
        comparing: [],
        swapping: [j + 1],
        sorted: Array.from({ length: i + 1 }, (_, idx) => idx),
        log: `Placed key = ${key} at its correct sorted position (index ${j + 1}).`,
      });
    }

    generatedFrames.push({
      array: [...workingArr],
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: n }, (_, idx) => idx),
      log: "Sorting complete! The entire array is sorted.",
    });

    setFrames(generatedFrames);
  };

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && currentFrameIdx < frames.length - 1) {
      timer = setTimeout(() => {
        setCurrentFrameIdx((prev) => prev + 1);
      }, 600);
    } else {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentFrameIdx, frames]);

  const definition = "Insertion Sort builds the final sorted array one item at a time by placing each new element into its correct relative position within the already-sorted prefix partition.";
  const idea = "Iterate from index 1 to N-1. Save the key element. Shift all sorted elements larger than key to the right, then insert the key into the vacant slot.";
  const stable = "Stable (does not change order of equal elements during shifts)";
  const inplace = "In-place (requires no extra memory)";
  const pseudocode = `InsertionSort(arr):
  N = arr.length
  for i = 1 to N-1:
    key = arr[i]
    j = i - 1
    while j >= 0 and arr[j] > key:
      arr[j+1] = arr[j]
      j = j - 1
    arr[j+1] = key`;

  const applications = [
    "Sorting small datasets (very fast for N <= 10).",
    "Nearly sorted arrays (runs in O(N) time).",
    "Subroutine in hybrid sorting algorithms (e.g. Timsort)."
  ];
  const mistakes = [
    "Failing to save key element, which gets overwritten during shifts.",
    "Incorrect index bounds causing array index out of bounds exceptions."
  ];
  const cpTips = [
    "Insertion sort runs in O(N) for nearly sorted inputs. When writing custom optimizations for fast online sorting, insertion sort is a highly efficient choice for small subarrays!"
  ];

  const currentFrame = frames[currentFrameIdx] || {
    array: arrayStr.split(",").map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n)),
    comparing: [],
    swapping: [],
    sorted: [],
    log: "Initial state.",
  };

  return (
    <SrLayout
      timeComplexity="O(N^2) worst/average, O(N) best case (for sorted inputs)"
      spaceComplexity="O(1) auxiliary variables"
      definition={definition}
      idea={idea}
      stable={stable}
      inplace={inplace}
      pseudocode={pseudocode}
      applications={applications}
      mistakes={mistakes}
      cpTips={cpTips}
      visualizerChild={
        <Card className="border-border/40 bg-card/65 shadow-xs font-sans text-left">
          <CardHeader className="pb-2 border-b border-border/10">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Shift / Insert Visualizer
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <BarChartVisualizer
              array={currentFrame.array}
              comparingIndices={currentFrame.comparing}
              swappingIndices={currentFrame.swapping}
              sortedIndices={currentFrame.sorted}
            />

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentFrameIdx((prev) => Math.max(prev - 1, 0))}
                  disabled={currentFrameIdx === 0}
                  className="cursor-pointer text-xs"
                >
                  Prev
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentFrameIdx((prev) => Math.min(prev + 1, frames.length - 1))}
                  disabled={frames.length === 0 || currentFrameIdx === frames.length - 1}
                  className="cursor-pointer text-xs"
                >
                  Next
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => setIsPlaying(!isPlaying)}
                  disabled={frames.length === 0}
                  className="cursor-pointer text-xs"
                >
                  {isPlaying ? "Pause" : "Play"}
                </Button>
              </div>

              <span className="font-mono text-xs text-muted-foreground">
                Step: {currentFrameIdx + 1} / {frames.length || 1}
              </span>
            </div>

            {compared && (
              <div className="border-t border-border/5 pt-3 font-mono text-xs text-left">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">
                  Active Operation:
                </span>
                <p className="text-emerald-500 font-bold text-[11px] leading-relaxed min-h-[32px]">{currentFrame.log}</p>
              </div>
            )}
            {error && <div className="text-xs text-rose-500 font-semibold font-mono">{error}</div>}
          </CardContent>
        </Card>
      }
    >
      <SrHeader
        title="Insertion Sort"
        description="Insert each element into its correct relative position within the sorted prefix partition."
        category="Sorting"
        difficulty="Easy"
        shortcut="Alt+Shift+I"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <InputField label="Array to Sort (comma separated)" value={arrayStr} onChange={setArrayStr} />

          <Button onClick={handleSort} className="w-full justify-center cursor-pointer">
            Initialize Sort Trace
          </Button>
        </CardContent>
      </Card>
    </SrLayout>
  );
}
