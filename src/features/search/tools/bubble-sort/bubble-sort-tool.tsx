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

export function BubbleSortTool() {
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
      setError("Please check your array input elements.");
      return;
    }

    const n = arr.length;
    const workingArr = [...arr];
    const generatedFrames: SortFrame[] = [];

    // Initial frame
    generatedFrames.push({
      array: [...workingArr],
      comparing: [],
      swapping: [],
      sorted: [],
      log: "Initial state of the unsorted array.",
    });

    const sortedIndices: number[] = [];

    for (let i = 0; i < n - 1; i++) {
      let swapped = false;
      for (let j = 0; j < n - i - 1; j++) {
        // Comparison frame
        generatedFrames.push({
          array: [...workingArr],
          comparing: [j, j + 1],
          swapping: [],
          sorted: [...sortedIndices],
          log: `Comparing values at index ${j} (${workingArr[j]}) and index ${j + 1} (${workingArr[j + 1]})`,
        });

        if (workingArr[j] > workingArr[j + 1]) {
          // Swap
          const temp = workingArr[j];
          workingArr[j] = workingArr[j + 1];
          workingArr[j + 1] = temp;
          swapped = true;

          generatedFrames.push({
            array: [...workingArr],
            comparing: [],
            swapping: [j, j + 1],
            sorted: [...sortedIndices],
            log: `Swapped index ${j} and ${j + 1} since ${temp} > ${workingArr[j]}`,
          });
        }
      }
      sortedIndices.push(n - i - 1);
      generatedFrames.push({
        array: [...workingArr],
        comparing: [],
        swapping: [],
        sorted: [...sortedIndices],
        log: `Pass ${i + 1} complete. Value ${workingArr[n - i - 1]} at index ${n - i - 1} is now in its final sorted position.`,
      });

      if (!swapped) {
        logsBreak: {
          generatedFrames.push({
            array: [...workingArr],
            comparing: [],
            swapping: [],
            sorted: Array.from({ length: n }, (_, idx) => idx),
            log: "No swaps occurred during this pass. Array is fully sorted!",
          });
        }
        break;
      }
    }

    // Final sorted zone highlight
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

  const definition = "Bubble Sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. This pass is repeated until the list is sorted.";
  const idea = "Run nested loops. Compare adjacent cells: if left > right, swap. After each inner loop pass, the largest unsorted element bubbles up to the end.";
  const stable = "Stable (adjacent equal values do not swap)";
  const inplace = "In-place (no auxiliary array required)";
  const pseudocode = `BubbleSort(arr):
  N = arr.length
  for i = 0 to N-2:
    swapped = false
    for j = 0 to N-i-2:
      if arr[j] > arr[j+1]:
        swap(arr[j], arr[j+1])
        swapped = true
    if not swapped: break`;

  const applications = [
    "Educational tool for basic sorting structures.",
    "Checking sorted arrays in linear time O(N) optimized.",
    "Small arrays swaps visualization."
  ];
  const mistakes = [
    "Forgetting the optimization flag 'swapped', which leads to redundant N^2 sweeps even on sorted arrays.",
    "Incorrect nested loops bounds leading to index out of bounds errors."
  ];
  const cpTips = [
    "Bubble sort is O(N^2) and is rarely used in real competitive programming tests except for checking basic inversions count or small size arrays (N <= 1000)!"
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
      timeComplexity="O(N^2) average/worst, O(N) best case optimized"
      spaceComplexity="O(1) auxiliary memory"
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
              Pass / Swapping Trace Visualizer
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
        title="Bubble Sort"
        description="Repeatedly swap adjacent elements if they are in the wrong order."
        category="Sorting"
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
          <InputField label="Array to Sort (comma separated)" value={arrayStr} onChange={setArrayStr} />

          <Button onClick={handleSort} className="w-full justify-center cursor-pointer">
            Initialize Sort Trace
          </Button>
        </CardContent>
      </Card>
    </SrLayout>
  );
}
