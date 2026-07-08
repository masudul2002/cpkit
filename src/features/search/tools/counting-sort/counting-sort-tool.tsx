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

export function CountingSortTool() {
  const [arrayStr, setArrayStr] = React.useState("5, 2, 8, 2, 3, 5, 1, 4");

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
      setError("Counting Sort requires non-negative integers only.");
      return;
    }

    const maxVal = Math.max(...arr, 0);
    if (maxVal > 100) {
      setError("Counting Sort limits inputs elements to <= 100 for visual clarity.");
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

    // Count frequencies
    const count = new Array(maxVal + 1).fill(0);
    arr.forEach((val, idx) => {
      count[val]++;
      generatedFrames.push({
        array: [...workingArr],
        comparing: [idx],
        swapping: [],
        sorted: [],
        log: `Increment frequency count for element ${val} at index ${idx}. Freq[${val}] = ${count[val]}`,
      });
    });

    generatedFrames.push({
      array: [...workingArr],
      comparing: [],
      swapping: [],
      sorted: [],
      log: `Frequency counts collected: [ ${count
        .map((c, val) => `${val}: ${c}`)
        .join(", ")} ]`,
    });

    // Reconstruct sorted array
    let k = 0;
    const sortedIndices: number[] = [];

    for (let val = 0; val <= maxVal; val++) {
      while (count[val] > 0) {
        workingArr[k] = val;
        sortedIndices.push(k);
        count[val]--;

        generatedFrames.push({
          array: [...workingArr],
          comparing: [],
          swapping: [k],
          sorted: [...sortedIndices],
          log: `Placing value ${val} at index ${k} based on remaining frequency.`,
        });

        k++;
      }
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
      }, 700);
    } else {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentFrameIdx, frames]);

  const definition = "Counting Sort is a non-comparison integer sorting algorithm that works by counting the number of occurrences of each unique element value, then calculating indices directly.";
  const idea = "Initialize a frequency count array of size Max + 1 with 0. Scan the array to increment occurrences. Scan the count array to reconstruct sorted numbers.";
  const stable = "Stable (when implemented with index prefix sums back sweeps)";
  const inplace = "Out-of-place (requires O(MaxElement) frequency storage)";
  const pseudocode = `CountingSort(arr):
  max_val = max(arr)
  count = array of size max_val + 1 filled with 0
  for val in arr:
    count[val]++
  k = 0
  for val = 0 to max_val:
    while count[val] > 0:
      arr[k] = val
      count[val]--
      k++`;

  const applications = [
    "Sorting small ranges integers.",
    "Subroutine in Radix Sort.",
    "Frequency distribution analyses."
  ];
  const mistakes = [
    "Using counting sort on large ranges (e.g. elements up to 10^9, which leads to Out Of Memory exceptions).",
    "Not handling negative integers without offsets mapping."
  ];
  const cpTips = [
    "Counting sort is extremely fast O(N + K) when range K is small (K <= 10^6). Whenever you need to sort small bound keys, think of Counting Sort!"
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
      timeComplexity="O(N + K) where K is the range of values (Max - Min)"
      spaceComplexity="O(K) auxiliary counts list"
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
              Frequencies Accumulation Visualizer
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
        title="Counting Sort"
        description="Frequencies counts to achieve O(N) non-comparison sorts."
        category="Sorting"
        difficulty="Medium"
        shortcut="Alt+Shift+C"
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
