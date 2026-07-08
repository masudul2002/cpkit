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

export function MergeSortTool() {
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

    const merge = (l: number, m: number, r: number) => {
      const leftLen = m - l + 1;
      const rightLen = r - m;

      const L = new Array(leftLen);
      const R = new Array(rightLen);

      for (let x = 0; x < leftLen; x++) L[x] = workingArr[l + x];
      for (let y = 0; y < rightLen; y++) R[y] = workingArr[m + 1 + y];

      generatedFrames.push({
        array: [...workingArr],
        comparing: Array.from({ length: r - l + 1 }, (_, idx) => l + idx),
        swapping: [],
        sorted: [],
        log: `Merging partition low index ${l} to high index ${r}. Left subarray: [${L.join(
          ", "
        )}], Right subarray: [${R.join(", ")}]`,
      });

      let i = 0,
        j = 0,
        k = l;

      while (i < leftLen && j < rightLen) {
        generatedFrames.push({
          array: [...workingArr],
          comparing: [l + i, m + 1 + j],
          swapping: [],
          sorted: [],
          log: `Comparing left value ${L[i]} (index ${l + i}) with right value ${R[j]} (index ${m + 1 + j})`,
        });

        if (L[i] <= R[j]) {
          workingArr[k] = L[i];
          i++;
        } else {
          workingArr[k] = R[j];
          j++;
        }
        k++;
      }

      while (i < leftLen) {
        workingArr[k] = L[i];
        i++;
        k++;
      }

      while (j < rightLen) {
        workingArr[k] = R[j];
        j++;
        k++;
      }

      generatedFrames.push({
        array: [...workingArr],
        comparing: [],
        swapping: Array.from({ length: r - l + 1 }, (_, idx) => l + idx),
        sorted: [],
        log: `Merged sub-array range [${l}, ${r}] is now sorted: [${workingArr
          .slice(l, r + 1)
          .join(", ")}]`,
      });
    };

    const sort = (l: number, r: number) => {
      if (l < r) {
        const m = Math.floor((l + r) / 2);
        generatedFrames.push({
          array: [...workingArr],
          comparing: [l, r],
          swapping: [],
          sorted: [],
          log: `Dividing range [${l}, ${r}] at midpoint ${m}`,
        });

        sort(l, m);
        sort(m + 1, r);
        merge(l, m, r);
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

  const definition = "Merge Sort is a Divide-and-Conquer sorting algorithm that splits the array into two halves, recursively sorts them, and then merges the sorted halves.";
  const idea = "Divide the array recursively at midpoints until single-element segments remain. Merge adjacent sorted segments by comparing front elements.";
  const stable = "Stable (retains relative order of equal elements during merges)";
  const inplace = "Out-of-place (requires O(N) extra memory space)";
  const pseudocode = `MergeSort(arr, l, r):
  if l < r:
    m = l + (r - l) / 2
    MergeSort(arr, l, m)
    MergeSort(arr, m + 1, r)
    Merge(arr, l, m, r)`;

  const applications = [
    "Sorting external large datasets (disk files).",
    "Counting array inversions.",
    "Database parallel merge workers."
  ];
  const mistakes = [
    "Integer overflow when calculating midpoint mid = (low + high)/2.",
    "Not creating local subarray copies during merges, which overwrites values prematurely."
  ];
  const cpTips = [
    "Merge sort is stable and guarantees O(N log N) worst-case time complexity. In competitive programming, you can easily adapt merge sort to count the number of inversions in an array!"
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
      timeComplexity="O(N log N) for all cases (always executes identical recursive tree divisions)"
      spaceComplexity="O(N) auxiliary space"
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
              Recursive Divide & Merge Visualizer
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
        title="Merge Sort"
        description="Divide the array into halves, sort them recursively, and merge them."
        category="Sorting"
        difficulty="Medium"
        shortcut="Alt+Shift+M"
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
