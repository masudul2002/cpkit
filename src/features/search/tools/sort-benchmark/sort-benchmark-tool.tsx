"use client";

import * as React from "react";
import { SrHeader } from "../../shared/sr-header";
import { SrLayout } from "../../shared/sr-layout";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BenchmarkResult {
  name: string;
  timeMs: number;
  comparisons: number;
  swaps: number;
  memoryEst: string;
}

export function SortBenchmarkTool() {
  const [arraySizeStr, setArraySizeStr] = React.useState("1000");

  const [compared, setCompared] = React.useState(false);
  const [resultsList, setResultsList] = React.useState<BenchmarkResult[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handleBenchmark = () => {
    setError(null);
    setCompared(true);
    setResultsList([]);

    const size = parseInt(arraySizeStr, 10);
    if (isNaN(size) || size <= 0 || size > 10000) {
      setError("Please specify an array size between 1 and 10,000 elements.");
      return;
    }

    // Generate random integers array
    const originalArr = Array.from({ length: size }, () => Math.floor(Math.random() * 10000));

    const results: BenchmarkResult[] = [];

    // 1. Bubble Sort Benchmark
    (() => {
      const arr = [...originalArr];
      let comparisons = 0;
      let swaps = 0;
      const start = performance.now();
      const n = arr.length;
      for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
          comparisons++;
          if (arr[j] > arr[j + 1]) {
            const temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
            swaps++;
            swapped = true;
          }
        }
        if (!swapped) break;
      }
      const end = performance.now();
      results.push({
        name: "Bubble Sort",
        timeMs: end - start,
        comparisons,
        swaps,
        memoryEst: "O(1) auxiliary",
      });
    })();

    // 2. Selection Sort Benchmark
    (() => {
      const arr = [...originalArr];
      let comparisons = 0;
      let swaps = 0;
      const start = performance.now();
      const n = arr.length;
      for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
          comparisons++;
          if (arr[j] < arr[minIdx]) {
            minIdx = j;
          }
        }
        if (minIdx !== i) {
          const temp = arr[i];
          arr[i] = arr[minIdx];
          arr[minIdx] = temp;
          swaps++;
        }
      }
      const end = performance.now();
      results.push({
        name: "Selection Sort",
        timeMs: end - start,
        comparisons,
        swaps,
        memoryEst: "O(1) auxiliary",
      });
    })();

    // 3. Insertion Sort Benchmark
    (() => {
      const arr = [...originalArr];
      let comparisons = 0;
      let swaps = 0;
      const start = performance.now();
      const n = arr.length;
      for (let i = 1; i < n; i++) {
        const key = arr[i];
        let j = i - 1;
        while (j >= 0) {
          comparisons++;
          if (arr[j] > key) {
            arr[j + 1] = arr[j];
            swaps++;
            j--;
          } else {
            break;
          }
        }
        arr[j + 1] = key;
      }
      const end = performance.now();
      results.push({
        name: "Insertion Sort",
        timeMs: end - start,
        comparisons,
        swaps,
        memoryEst: "O(1) auxiliary",
      });
    })();

    // 4. Merge Sort Benchmark
    (() => {
      const arr = [...originalArr];
      let comparisons = 0;
      let swaps = 0;
      const start = performance.now();

      const merge = (l: number, m: number, r: number) => {
        const leftLen = m - l + 1;
        const rightLen = r - m;
        const L = arr.slice(l, m + 1);
        const R = arr.slice(m + 1, r + 1);
        let i = 0,
          j = 0,
          k = l;
        while (i < leftLen && j < rightLen) {
          comparisons++;
          if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
          } else {
            arr[k] = R[j];
            j++;
          }
          swaps++; // count array assignments as swaps equivalent for consistency
          k++;
        }
        while (i < leftLen) {
          arr[k] = L[i];
          i++;
          k++;
        }
        while (j < rightLen) {
          arr[k] = R[j];
          j++;
          k++;
        }
      };

      const sort = (l: number, r: number) => {
        if (l < r) {
          const m = Math.floor((l + r) / 2);
          sort(l, m);
          sort(m + 1, r);
          merge(l, m, r);
        }
      };

      sort(0, arr.length - 1);
      const end = performance.now();
      results.push({
        name: "Merge Sort",
        timeMs: end - start,
        comparisons,
        swaps,
        memoryEst: `O(${size}) auxiliary`,
      });
    })();

    // 5. Quick Sort Benchmark
    (() => {
      const arr = [...originalArr];
      let comparisons = 0;
      let swaps = 0;
      const start = performance.now();

      const partition = (low: number, high: number) => {
        const pivot = arr[high];
        let i = low - 1;
        for (let j = low; j < high; j++) {
          comparisons++;
          if (arr[j] < pivot) {
            i++;
            const temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
            swaps++;
          }
        }
        const temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        swaps++;
        return i + 1;
      };

      const sort = (low: number, high: number) => {
        if (low < high) {
          const pi = partition(low, high);
          sort(low, pi - 1);
          sort(pi + 1, high);
        }
      };

      sort(0, arr.length - 1);
      const end = performance.now();
      results.push({
        name: "Quick Sort",
        timeMs: end - start,
        comparisons,
        swaps,
        memoryEst: "O(log N) stack",
      });
    })();

    setResultsList(results);
  };

  const definition = "The Sorting Benchmark Tool evaluates and compares the efficiency (run time, comparison scans, swaps, and memory overheads) of various sorting algorithms on random arrays of custom sizes.";
  const idea = "Generate a randomized array, copy it, and execute different sort algorithms on the copies. Log the number of comparisons and swaps, and record performance execution intervals.";
  const pseudocode = `BenchmarkSorting(size):
  arr = GenerateRandomArray(size)
  for algo in [Bubble, Selection, Insertion, Merge, Quick]:
    ResetCounters()
    StartTimer()
    algo.sort(arr.copy())
    EndTimer()
    RecordResults()`;

  const applications = [
    "Analyzing computational complexity in practice.",
    "Selecting optimal algorithms under constraints.",
    "Learning the impact of N^2 worst-cases vs N log N algorithms."
  ];
  const mistakes = [
    "Benchmarking sorted/nearly sorted inputs without testing randomized cases.",
    "Not copying the source array before each sort run (which leads to sorting already sorted arrays)."
  ];
  const cpTips = [
    "Always remember that comparison limits in online judges are typically 10^8 operations. Thus, O(N^2) sorting algorithms will Time Limit Exceeded (TLE) for N > 5000, demanding O(N log N) options!"
  ];

  return (
    <SrLayout
      timeComplexity="Varies (O(N^2) to O(N log N))"
      spaceComplexity="O(N) for merge arrays storage"
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
              Performance Benchmark Report Table
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse select-none">
                <thead>
                  <tr className="border-b border-border/15 font-bold uppercase text-[9px] text-muted-foreground">
                    <th className="py-2.5">Algorithm Name</th>
                    <th className="py-2.5">Execution Time</th>
                    <th className="py-2.5">Comparisons</th>
                    <th className="py-2.5">Swaps/Moves</th>
                    <th className="py-2.5">Memory Limit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/5 font-mono text-[11px] text-foreground/80">
                  {resultsList.map((res, idx) => (
                    <tr key={idx} className="hover:bg-muted/10">
                      <td className="py-3 font-sans font-bold text-primary">{res.name}</td>
                      <td className="py-3 text-emerald-500 font-extrabold">{res.timeMs.toFixed(3)} ms</td>
                      <td className="py-3">{res.comparisons.toLocaleString()}</td>
                      <td className="py-3">{res.swaps.toLocaleString()}</td>
                      <td className="py-3 text-muted-foreground">{res.memoryEst}</td>
                    </tr>
                  ))}
                  {resultsList.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-muted-foreground font-sans text-xs">
                        Click 'Execute Benchmark' to generate report.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      }
    >
      <SrHeader
        title="Sorting Benchmark Tool"
        description="Compare time execution, comparison scans, swaps, and memory across multiple sorting algorithms."
        category="Benchmarking"
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
          <InputField label="Array Size Elements Count" value={arraySizeStr} onChange={setArraySizeStr} />

          <Button onClick={handleBenchmark} className="w-full justify-center cursor-pointer">
            Execute Benchmark Run
          </Button>
        </CardContent>
      </Card>
    </SrLayout>
  );
}
