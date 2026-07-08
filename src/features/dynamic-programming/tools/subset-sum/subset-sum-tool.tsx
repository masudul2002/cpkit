"use client";

import * as React from "react";
import { DpHeader } from "../../shared/dp-header";
import { DpLayout } from "../../shared/dp-layout";
import { DpTableGrid } from "../../visualization/dp-table-grid";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function SubsetSumTool() {
  const [elementsStr, setElementsStr] = React.useState("3, 34, 4, 12, 5, 2");
  const [targetSumStr, setTargetSumStr] = React.useState("9");

  const [compared, setCompared] = React.useState(false);
  const [dpTable, setDpTable] = React.useState<string[][]>([]);
  const [rowHeaders, setRowHeaders] = React.useState<string[]>([]);
  const [colHeaders, setColHeaders] = React.useState<string[]>([]);
  const [backtrackCells, setBacktrackCells] = React.useState<[number, number][]>([]);
  const [possible, setPossible] = React.useState<boolean | null>(null);
  const [selectedSubset, setSelectedSubset] = React.useState<number[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handleEvaluate = () => {
    setError(null);
    setCompared(true);
    setDpTable([]);
    setBacktrackCells([]);
    setPossible(null);
    setSelectedSubset([]);

    const arr = elementsStr.split(",").map((s) => parseInt(s.trim(), 10));
    const target = parseInt(targetSumStr, 10);

    if (arr.some(isNaN) || isNaN(target) || target < 0) {
      setError("Please check your input set elements and target sum inputs.");
      return;
    }

    const n = arr.length;
    // DP size: (n + 1) rows, (target + 1) columns
    const dp = Array.from({ length: n + 1 }, () => new Array(target + 1).fill(false));

    // Base cases: sum 0 is always possible using empty set
    for (let i = 0; i <= n; i++) dp[i][0] = true;

    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= target; j++) {
        if (arr[i - 1] <= j) {
          dp[i][j] = dp[i - 1][j] || dp[i - 1][j - arr[i - 1]];
        } else {
          dp[i][j] = dp[i - 1][j];
        }
      }
    }

    // Backtrack path if possible
    const bCells: [number, number][] = [];
    const selected: number[] = [];
    let tempSum = target;

    if (dp[n][target]) {
      for (let i = n; i > 0; i--) {
        bCells.push([i, tempSum]);
        // If sum is possible without current element, skip it. Otherwise take it!
        if (tempSum >= arr[i - 1] && dp[i - 1][tempSum - arr[i - 1]] && !dp[i - 1][tempSum]) {
          selected.push(arr[i - 1]);
          tempSum -= arr[i - 1];
        }
      }
      bCells.push([0, tempSum]);
    }

    // Format boolean to string flags
    const formattedGrid = dp.map((row) =>
      row.map((val) => (val ? "T" : "F"))
    );

    const rHeaders = ["Base (0)"];
    arr.forEach((val, idx) => {
      rHeaders.push(`E[${idx}]: ${val}`);
    });

    const cHeaders = Array.from({ length: target + 1 }, (_, idx) => `sum=${idx}`);

    setDpTable(formattedGrid);
    setRowHeaders(rHeaders);
    setColHeaders(cHeaders);
    setBacktrackCells(bCells);
    setPossible(dp[n][target]);
    setSelectedSubset(selected.reverse());
  };

  const definition = "The Subset Sum problem decides if there exists a subset of non-negative integers from a set whose sum is exactly equal to a target sum S.";
  const idea = "The boolean state dp[i][j] tracks if a sum of j is possible using first i elements. For each element, a sum is possible if it was possible without it, or if we can make j - element using previous elements.";
  const recurrence = "dp[i][j] = dp[i-1][j] || dp[i-1][j - arr[i-1]]   if arr[i-1] <= j else dp[i-1][j]";
  const transition = "Performs boolean OR logic between skipping current element (dp[i-1][j]) and taking current element (dp[i-1][j - arr[i-1]]).";
  const pseudocode = `SubsetSum(arr, target):
  N = arr.length
  dp = 2D Boolean Array of size (N+1) x (target+1) filled with False
  for i = 0..N: dp[i][0] = True
  for i = 1..N:
    for j = 1..target:
      if arr[i-1] <= j:
        dp[i][j] = dp[i-1][j] or dp[i-1][j - arr[i-1]]
      else:
        dp[i][j] = dp[i-1][j]
  return dp[N][target]`;

  const applications = [
    "Load balancing partitions.",
    "Checking exact knapsack feasibility bounds.",
    "Bipartite partition optimizations."
  ];
  const mistakes = [
    "Not initializing base cases column `dp[i][0]` to True, since sum 0 is always possible.",
    "Attempting to read indices out of bounds when `j < arr[i-1]`."
  ];
  const cpTips = [
    "Subset sum is NP-complete but can be optimized heavily using `std::bitset` in C++ to run transitions in O(N * S / 64) time!"
  ];

  return (
    <DpLayout
      timeComplexity="O(N * target)"
      spaceComplexity="O(N * target) / O(target) optimized"
      definition={definition}
      idea={idea}
      recurrence={recurrence}
      transition={transition}
      pseudocode={pseudocode}
      applications={applications}
      mistakes={mistakes}
      cpTips={cpTips}
      visualizerChild={
        <Card className="border-border/40 bg-card/65 shadow-xs font-sans text-left">
          <CardHeader className="pb-2 border-b border-border/10">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Subset Sum Feasibility Grid (backtrack path highlighted)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <DpTableGrid
              table={dpTable}
              rowHeaders={rowHeaders}
              colHeaders={colHeaders}
              highlightedCells={backtrackCells}
            />

            {compared && possible !== null && (
              <div className="border-t border-border/5 pt-3 space-y-2 font-mono text-xs text-left">
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Is Target Sum Possible:</span>
                  <span className={`font-bold ${possible ? "text-emerald-500" : "text-rose-500"}`}>
                    {possible ? "POSSIBLE (True)" : "IMPOSSIBLE (False)"}
                  </span>
                </div>
                {possible && (
                  <div className="flex justify-between border-b border-border/5 pb-1">
                    <span>Valid Subset Found:</span>
                    <span className="font-bold text-primary">[ {selectedSubset.join(", ")} ]</span>
                  </div>
                )}
              </div>
            )}
            {error && <div className="text-xs text-rose-500 font-semibold font-mono">{error}</div>}
          </CardContent>
        </Card>
      }
    >
      <DpHeader
        title="Subset Sum Solver"
        description="Verify if a subset of elements can sum up exactly to a target sum."
        category="Algorithms"
        difficulty="Medium"
        shortcut="Alt+Shift+S"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <InputField label="Set Elements (comma separated)" value={elementsStr} onChange={setElementsStr} />
          <InputField label="Target Sum (S)" value={targetSumStr} onChange={setTargetSumStr} />

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Check Subset Sum
          </Button>
        </CardContent>
      </Card>
    </DpLayout>
  );
}
