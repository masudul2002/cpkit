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

export function BucketSortTool() {
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

    if (arr.some((val) => val < 0)) {
      setError("Bucket Sort requires non-negative integers only.");
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

    const maxVal = Math.max(...workingArr, 1);
    const bucketCount = 5;
    const buckets: number[][] = Array.from({ length: bucketCount }, () => []);

    // Distribute elements into buckets
    workingArr.forEach((val, idx) => {
      // Calculate bucket index
      const bucketIdx = Math.min(
        Math.floor((val / maxVal) * bucketCount),
        bucketCount - 1
      );
      buckets[bucketIdx].push(val);

      generatedFrames.push({
        array: [...workingArr],
        comparing: [idx],
        swapping: [],
        sorted: [],
        log: `Distributed element ${val} (index ${idx}) into bucket ${bucketIdx}.`,
      });
    });

    generatedFrames.push({
      array: [...workingArr],
      comparing: [],
      swapping: [],
      sorted: [],
      log: `Buckets contents: [ ${buckets
        .map((b, idx) => `Bucket ${idx}: [${b.join(", ")}]`)
        .join(" | ") || "Empty"} ]`,
    });

    // Sort individual buckets and gather
    let k = 0;
    const sortedIndices: number[] = [];

    for (let i = 0; i < bucketCount; i++) {
      // Sort bucket using insertion sort equivalent (represented as simple JS sort)
      buckets[i].sort((a, b) => a - b);

      if (buckets[i].length > 0) {
        generatedFrames.push({
          array: [...workingArr],
          comparing: [],
          swapping: [],
          sorted: [...sortedIndices],
          log: `Sorted elements in bucket ${i}: [${buckets[i].join(", ")}]`,
        });
      }

      buckets[i].forEach((val) => {
        workingArr[k] = val;
        sortedIndices.push(k);

        generatedFrames.push({
          array: [...workingArr],
          comparing: [],
          swapping: [k],
          sorted: [...sortedIndices],
          log: `Gathered value ${val} from bucket ${i} and placed at index ${k}.`,
        });

        k++;
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
      }, 900);
    } else {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentFrameIdx, frames]);

  const definition = "Bucket Sort distributes elements of an array into multiple 'buckets'. Each bucket is then sorted individually, either recursively or using a different sorting algorithm, and then concatenated.";
  const idea = "Divide the element range into B buckets. Put elements into buckets based on range maps. Sort each bucket independently and gather elements back into the array.";
  const stable = "Stable (provided the sub-sort algorithm used within buckets is stable)";
  const inplace = "Out-of-place (requires separate memory buckets lists)";
  const pseudocode = `BucketSort(arr):
  N = arr.length
  max_val = max(arr)
  buckets = list of B empty buckets list
  for val in arr:
    idx = val * B / max_val
    buckets[idx].append(val)
  for b in buckets:
    SortBucket(b)
  ConcatenateBuckets(arr, buckets)`;

  const applications = [
    "Sorting uniformly distributed floating-point numbers in range [0, 1].",
    "Optimizing data splits across distributed files storage.",
    "Database parallel partitioning."
  ];
  const mistakes = [
    "Using bucket sort on highly skewed data, where all elements end up in a single bucket, collapsing the time complexity to O(N^2) or O(N log N).",
    "Calculating index mapping bounds incorrectly."
  ];
  const cpTips = [
    "Bucket Sort is highly efficient when inputs are uniformly distributed across a range. If N is massive, you can distribute elements into buckets and sort them concurrently to boost speed!"
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
      timeComplexity="O(N + B) average (for uniform distribution), O(N^2) worst case"
      spaceComplexity="O(N + B) auxiliary buckets memory"
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
              Buckets Distribution & Concatenation Visualizer
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
        title="Bucket Sort"
        description="Distribute elements into range-mapped buckets, sort them, and gather them."
        category="Sorting"
        difficulty="Medium"
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
