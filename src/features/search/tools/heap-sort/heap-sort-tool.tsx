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

export function HeapSortTool() {
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

    const heapify = (size: number, i: number) => {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;

      if (left < size) {
        generatedFrames.push({
          array: [...workingArr],
          comparing: [largest, left],
          swapping: [],
          sorted: [],
          log: `Checking left child at index ${left} (${workingArr[left]}) vs parent at index ${largest} (${workingArr[largest]})`,
        });
        if (workingArr[left] > workingArr[largest]) {
          largest = left;
        }
      }

      if (right < size) {
        generatedFrames.push({
          array: [...workingArr],
          comparing: [largest, right],
          swapping: [],
          sorted: [],
          log: `Checking right child at index ${right} (${workingArr[right]}) vs current largest at index ${largest} (${workingArr[largest]})`,
        });
        if (workingArr[right] > workingArr[largest]) {
          largest = right;
        }
      }

      if (largest !== i) {
        const swapTemp = workingArr[i];
        workingArr[i] = workingArr[largest];
        workingArr[largest] = swapTemp;

        generatedFrames.push({
          array: [...workingArr],
          comparing: [],
          swapping: [i, largest],
          sorted: [],
          log: `Swapped index ${i} and ${largest} to restore binary max-heap property.`,
        });

        heapify(size, largest);
      }
    };

    // Build max heap
    generatedFrames.push({
      array: [...workingArr],
      comparing: [],
      swapping: [],
      sorted: [],
      log: "Phase 1: Building binary max heap from unsorted array.",
    });

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(n, i);
    }

    // Extract elements from heap
    const sortedIndices: number[] = [];
    for (let i = n - 1; i > 0; i--) {
      generatedFrames.push({
        array: [...workingArr],
        comparing: [0, i],
        swapping: [],
        sorted: [...sortedIndices],
        log: `Phase 2: Swapping root element ${workingArr[0]} with end index ${i} (${workingArr[i]}).`,
      });

      const temp = workingArr[0];
      workingArr[0] = workingArr[i];
      workingArr[i] = temp;
      sortedIndices.push(i);

      generatedFrames.push({
        array: [...workingArr],
        comparing: [],
        swapping: [0, i],
        sorted: [...sortedIndices],
        log: `Value ${temp} at index ${i} is now in its final sorted position. Re-heapifying root.`,
      });

      heapify(i, 0);
    }
    sortedIndices.push(0);

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

  const definition = "Heap Sort visualizes the array as a binary heap tree structure. It builds a max-heap, then repeatedly extracts the maximum element and restores the heap property.";
  const idea = "Phase 1: Rearrange array into a binary max heap. Phase 2: Swap the root (maximum element) with the last element. Decrease heap size and run heapify on the root. Repeat.";
  const stable = "Unstable (heap parent swaps can reorder identical elements)";
  const inplace = "In-place (sort is performed directly on the array)";
  const pseudocode = `HeapSort(arr):
  N = arr.length
  for i = N/2 - 1 down to 0:
    Heapify(arr, N, i)
  for i = N - 1 down to 1:
    swap(arr[0], arr[i])
    Heapify(arr, i, 0)`;

  const applications = [
    "Systems with tight memory limits (guarantees O(N log N) without recursion stack).",
    "Priority queue allocations.",
    "Real-time safety critical applications."
  ];
  const mistakes = [
    "Using 1-indexed heap indices formulas in a 0-indexed language (left is 2*i+1, right is 2*i+2).",
    "Forgetting to heapify the recursively affected subtree."
  ];
  const cpTips = [
    "Heap Sort is an excellent sorting algorithm that guarantees O(N log N) worst-case time complexity with O(1) auxiliary space. When space complexity is premium, Heap Sort is the best choice!"
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
      timeComplexity="O(N log N) for all cases (always sweeps heap trees)"
      spaceComplexity="O(1) auxiliary space"
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
              Heapification / Extract Max Visualizer
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
        title="Heap Sort"
        description="Represent the array as a binary tree heap, extract maximums, and restore heap properties."
        category="Sorting"
        difficulty="Medium"
        shortcut="Alt+Shift+H"
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
