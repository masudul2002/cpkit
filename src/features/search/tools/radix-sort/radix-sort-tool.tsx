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

export function RadixSortTool() {
  const [arrayStr, setArrayStr] = React.useState("170, 45, 75, 90, 802, 24, 2, 66");

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

    if (arr.some((val) => val < 0)) {
      setError("Radix Sort requires non-negative integers only.");
      return;
    }

    const maxVal = Math.max(...arr, 0);
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

    // Counting sort by specific digit 'exp' (1, 10, 100...)
    const countSortByDigit = (exp: number) => {
      const output = new Array(n).fill(0);
      const count = new Array(10).fill(0);

      // Collect counts
      for (let i = 0; i < n; i++) {
        const digit = Math.floor(workingArr[i] / exp) % 10;
        count[digit]++;
      }

      // Prefix sums
      for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
      }

      // Build output array backwards to preserve stability
      for (let i = n - 1; i >= 0; i--) {
        const digit = Math.floor(workingArr[i] / exp) % 10;
        output[count[digit] - 1] = workingArr[i];
        count[digit]--;
      }

      // Copy back
      for (let i = 0; i < n; i++) {
        workingArr[i] = output[i];
      }

      generatedFrames.push({
        array: [...workingArr],
        comparing: [],
        swapping: Array.from({ length: n }, (_, idx) => idx),
        sorted: [],
        log: `Sorted array by digit place: ${exp}s place. Output: [${workingArr.join(", ")}]`,
      });
    };

    // Run radix passes
    for (let exp = 1; Math.floor(maxVal / exp) > 0; exp *= 10) {
      countSortByDigit(exp);
    }

    generatedFrames.push({
      array: [...workingArr],
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: n }, (_, idx) => idx),
      log: "Sorting complete! All digit places processed.",
    });

    setFrames(generatedFrames);
  };

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && currentFrameIdx < frames.length - 1) {
      timer = setTimeout(() => {
        setCurrentFrameIdx((prev) => prev + 1);
      }, 900);
    } else {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentFrameIdx, frames]);

  const definition = "Radix Sort processes integers digit-by-digit, starting from the least significant digit (LSD) to the most significant digit (MSD), using a stable sub-sorting algorithm like Counting Sort.";
  const idea = "Perform counting sort on the array for each digit place (ones, tens, hundreds...). Preserving stability ensures elements sort correctly across preceding digits.";
  const stable = "Stable (requires a stable sub-sorting routine)";
  const inplace = "Out-of-place (requires auxiliary output copy lists)";
  const pseudocode = `RadixSort(arr):
  max_val = max(arr)
  exp = 1
  while max_val / exp > 0:
    StableCountingSortByDigit(arr, exp)
    exp *= 10`;

  const applications = [
    "Sorting large collections of uniform key lengths (e.g. phone numbers).",
    "High-speed machine card sorters.",
    "Suffix Array construction acceleration."
  ];
  const mistakes = [
    "Using an unstable sub-sort algorithm, which completely breaks correctness across digit places.",
    "Not handling negative numbers correctly."
  ];
  const cpTips = [
    "Radix sort runs in linear O(D * (N + B)) where D is digits count and B is base (10). It is exceptionally fast and beats comparison sorting for large integer sets!"
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
      timeComplexity="O(D * (N + B)) where D is digits count, B is base base (10)"
      spaceComplexity="O(N + B) auxiliary space buffers"
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
              Digit-by-Digit Places Visualizer
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
        title="Radix Sort"
        description="Process elements digit-by-digit to achieve linear O(N) sort speeds."
        category="Sorting"
        difficulty="Medium"
        shortcut="Alt+Shift+R"
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
