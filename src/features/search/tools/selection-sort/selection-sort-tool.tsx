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

export function SelectionSortTool() {
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
      sorted: [],
      log: "Initial state of the unsorted array.",
    });

    const sortedIndices: number[] = [];

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      generatedFrames.push({
        array: [...workingArr],
        comparing: [i],
        swapping: [],
        sorted: [...sortedIndices],
        log: `Assume index ${i} (value: ${workingArr[i]}) is the current minimum.`,
      });

      for (let j = i + 1; j < n; j++) {
        generatedFrames.push({
          array: [...workingArr],
          comparing: [minIdx, j],
          swapping: [],
          sorted: [...sortedIndices],
          log: `Comparing current minimum at index ${minIdx} (${workingArr[minIdx]}) with value at index ${j} (${workingArr[j]})`,
        });

        if (workingArr[j] < workingArr[minIdx]) {
          minIdx = j;
          generatedFrames.push({
            array: [...workingArr],
            comparing: [minIdx],
            swapping: [],
            sorted: [...sortedIndices],
            log: `New minimum found at index ${minIdx} (value: ${workingArr[minIdx]})`,
          });
        }
      }

      if (minIdx !== i) {
        const temp = workingArr[i];
        workingArr[i] = workingArr[minIdx];
        workingArr[minIdx] = temp;

        generatedFrames.push({
          array: [...workingArr],
          comparing: [],
          swapping: [i, minIdx],
          sorted: [...sortedIndices],
          log: `Swapped index ${i} and ${minIdx} to place the minimum element ${workingArr[i]} in its sorted position.`,
        });
      }

      sortedIndices.push(i);
      generatedFrames.push({
        array: [...workingArr],
        comparing: [],
        swapping: [],
        sorted: [...sortedIndices],
        log: `Value ${workingArr[i]} at index ${i} is now in its final sorted position.`,
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

  const definition = "Selection Sort segments the list into sorted and unsorted zones, repeatedly finding the smallest element from the unsorted zone and swapping it into the next sorted position.";
  const idea = "Sweep the unsorted array to find the smallest element index. Swap it with the element at the boundary of the sorted and unsorted partitions.";
  const stable = "Unstable (swaps can change original positions of equal elements)";
  const inplace = "In-place (no auxiliary storage required)";
  const pseudocode = `SelectionSort(arr):
  N = arr.length
  for i = 0 to N-2:
    min_idx = i
    for j = i+1 to N-1:
      if arr[j] < arr[min_idx]:
        min_idx = j
    if min_idx != i:
      swap(arr[i], arr[min_idx])`;

  const applications = [
    "Simple swaps reduction setups.",
    "Instruction layouts with high swap costs."
  ];
  const mistakes = [
    "Using nested bounds incorrectly (inner loop must scan up to N-1).",
    "Not handling index preservation (unstable sort issue)."
  ];
  const cpTips = [
    "Selection Sort does at most N swaps, which makes it useful if swap operations are extremely expensive! However, for general tasks, O(N^2) complexity is too slow."
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
      timeComplexity="O(N^2) for all cases (always performs N^2 scans)"
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
              Scan / Min Swap Visualizer
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
        title="Selection Sort"
        description="Select the minimum element from the unsorted zone and swap it to the front."
        category="Sorting"
        difficulty="Easy"
        shortcut="Alt+Shift+S"
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
