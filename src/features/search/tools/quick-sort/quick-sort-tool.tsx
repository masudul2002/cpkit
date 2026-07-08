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

export function QuickSortTool() {
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

    const workingArr = [...arr];
    const generatedFrames: SortFrame[] = [];

    generatedFrames.push({
      array: [...workingArr],
      comparing: [],
      swapping: [],
      sorted: [],
      log: "Initial state of the unsorted array.",
    });

    const partition = (low: number, high: number) => {
      const pivot = workingArr[high];
      generatedFrames.push({
        array: [...workingArr],
        comparing: [high],
        swapping: [],
        sorted: [],
        log: `Partitioning range [${low}, ${high}]. Selected pivot key: ${pivot} at index ${high}`,
      });

      let i = low - 1;

      for (let j = low; j < high; j++) {
        generatedFrames.push({
          array: [...workingArr],
          comparing: [j, high],
          swapping: [],
          sorted: [],
          log: `Comparing element at index ${j} (${workingArr[j]}) with pivot ${pivot}`,
        });

        if (workingArr[j] < pivot) {
          i++;
          const temp = workingArr[i];
          workingArr[i] = workingArr[j];
          workingArr[j] = temp;

          generatedFrames.push({
            array: [...workingArr],
            comparing: [],
            swapping: [i, j],
            sorted: [],
            log: `Swapped index ${i} and ${j} since ${workingArr[i]} < pivot ${pivot}`,
          });
        }
      }

      const temp = workingArr[i + 1];
      workingArr[i + 1] = workingArr[high];
      workingArr[high] = temp;

      generatedFrames.push({
        array: [...workingArr],
        comparing: [],
        swapping: [i + 1, high],
        sorted: [],
        log: `Placed pivot ${pivot} into its correct position at index ${i + 1}`,
      });

      return i + 1;
    };

    const sort = (low: number, high: number) => {
      if (low < high) {
        const pi = partition(low, high);
        sort(low, pi - 1);
        sort(pi + 1, high);
      }
    };

    sort(0, workingArr.length - 1);

    generatedFrames.push({
      array: [...workingArr],
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: workingArr.length }, (_, idx) => idx),
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

  const definition = "Quick Sort is a Divide-and-Conquer sorting algorithm that selects a 'pivot' element, partitions the array around it (smaller elements to left, larger to right), and recursively sorts the partitions.";
  const idea = "Pick a pivot (commonly the last element). Partition elements such that elements <= pivot sit on the left, and elements > pivot sit on the right. Repeat recursively.";
  const stable = "Unstable (swaps can shift relative positions of equal elements)";
  const inplace = "In-place (requires only recursive stack space)";
  const pseudocode = `QuickSort(arr, low, high):
  if low < high:
    pi = Partition(arr, low, high)
    QuickSort(arr, low, pi - 1)
    QuickSort(arr, pi + 1, high)`;

  const applications = [
    "High-performance generic sort algorithms (e.g. std::sort).",
    "Selecting K-th smallest element (Quickselect).",
    "In-memory parallel sorting."
  ];
  const mistakes = [
    "Choosing deterministic pivots on sorted arrays (leads to worst case O(N^2) complexity; randomize pivot instead).",
    "Incorrect partition bounds offsets."
  ];
  const cpTips = [
    "To prevent adversarial test cases designed to trigger the O(N^2) worst case in competitive programming, always shuffle the array randomly or use a randomized pivot before running Quick Sort!"
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
      timeComplexity="O(N log N) average/best, O(N^2) worst case (for skewed pivots)"
      spaceComplexity="O(log N) recursive stack depth"
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
              Pivot Partitioning Visualizer
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
        title="Quick Sort"
        description="Partition elements around a selected pivot and sort sub-arrays recursively."
        category="Sorting"
        difficulty="Medium"
        shortcut="Alt+Shift+Q"
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
