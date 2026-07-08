"use client";

import * as React from "react";
import { DpHeader } from "../../shared/dp-header";
import { DpLayout } from "../../shared/dp-layout";
import { DpTableGrid } from "../../visualization/dp-table-grid";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function PartitionTool() {
  const [elementsStr, setElementsStr] = React.useState("1, 5, 11, 5");

  const [compared, setCompared] = React.useState(false);
  const [dpTable, setDpTable] = React.useState<string[][]>([]);
  const [rowHeaders, setRowHeaders] = React.useState<string[]>([]);
  const [colHeaders, setColHeaders] = React.useState<string[]>([]);
  const [backtrackCells, setBacktrackCells] = React.useState<[number, number][]>([]);
  const [isPartitionPossible, setIsPartitionPossible] = React.useState<boolean | null>(null);
  const [part1, setPart1] = React.useState<number[]>([]);
  const [part2, setPart2] = React.useState<number[]>([]);
  const [totalSum, setTotalSum] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleEvaluate = () => {
    setError(null);
    setCompared(true);
    setDpTable([]);
    setBacktrackCells([]);
    setIsPartitionPossible(null);
    setPart1([]);
    setPart2([]);
    setTotalSum(null);

    const arr = elementsStr.split(",").map((s) => parseInt(s.trim(), 10));
    if (arr.some(isNaN) || arr.length === 0) {
      setError("Please check your set elements inputs.");
      return;
    }

    const sum = arr.reduce((a, b) => a + b, 0);
    setTotalSum(sum);

    if (sum % 2 !== 0) {
      setIsPartitionPossible(false);
      setError("Total sum is odd. Equal partition is mathematically impossible.");
      return;
    }

    const target = sum / 2;
    const n = arr.length;
    const dp = Array.from({ length: n + 1 }, () => new Array(target + 1).fill(false));

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

    // Backtrack partitions
    const p1: number[] = [];
    const p2: number[] = [...arr];
    const bCells: [number, number][] = [];
    let tempSum = target;

    if (dp[n][target]) {
      for (let i = n; i > 0; i--) {
        bCells.push([i, tempSum]);
        if (tempSum >= arr[i - 1] && dp[i - 1][tempSum - arr[i - 1]] && !dp[i - 1][tempSum]) {
          p1.push(arr[i - 1]);
          // Remove from p2
          const idx = p2.indexOf(arr[i - 1]);
          if (idx > -1) p2.splice(idx, 1);
          tempSum -= arr[i - 1];
        }
      }
      bCells.push([0, tempSum]);
    }

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
    setIsPartitionPossible(dp[n][target]);
    setPart1(p1.reverse());
    setPart2(p2);
  };

  const definition = "The Partition Problem checks if a given set of positive integers can be partitioned into two subsets such that the sum of elements in both subsets is equal.";
  const idea = "This is a direct variation of Subset Sum where we check if a target sum of TotalSum / 2 is possible. If sum is odd, equal partition cannot be formed.";
  const recurrence = "dp[i][j] = dp[i-1][j] || dp[i-1][j - arr[i-1]]   if arr[i-1] <= j else dp[i-1][j]";
  const transition = "Performs boolean OR logic checks evaluating subset possibilities with or without elements.";
  const pseudocode = `CanPartition(arr):
  total_sum = sum(arr)
  if total_sum % 2 != 0: return False
  return SubsetSum(arr, total_sum / 2)`;

  const applications = [
    "Load balancing processor jobs.",
    "Checking knapsack limits partitions.",
    "Resource allocation."
  ];
  const mistakes = [
    "Attempting to partition sets containing odd total sums, yielding unnecessary loops computations.",
    "Not handling duplicates values correctly during partition splits backtracking."
  ];
  const cpTips = [
    "If the array elements can be negative, standard DP fails. We must shift weights or use meet-in-the-middle searching for small N <= 40!"
  ];

  return (
    <DpLayout
      timeComplexity="O(N * target)"
      spaceComplexity="O(N * target) table size"
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
              Partition Feasibility Grid (backtrack path highlighted)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <DpTableGrid
              table={dpTable}
              rowHeaders={rowHeaders}
              colHeaders={colHeaders}
              highlightedCells={backtrackCells}
            />

            {compared && isPartitionPossible !== null && (
              <div className="border-t border-border/5 pt-3 space-y-2 font-mono text-xs text-left">
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Total Sum:</span>
                  <span className="font-bold text-foreground">{totalSum} (Target sum: {totalSum ? totalSum / 2 : 0})</span>
                </div>
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Is Equal Partition Possible:</span>
                  <span className={`font-bold ${isPartitionPossible ? "text-emerald-500" : "text-rose-500"}`}>
                    {isPartitionPossible ? "POSSIBLE (True)" : "IMPOSSIBLE (False)"}
                  </span>
                </div>
                {isPartitionPossible && (
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between border-b border-border/5 pb-1">
                      <span>Subset 1 (Sum {totalSum ? totalSum / 2 : 0}):</span>
                      <span className="font-bold text-primary">[ {part1.join(", ")} ]</span>
                    </div>
                    <div className="flex justify-between border-b border-border/5 pb-1">
                      <span>Subset 2 (Sum {totalSum ? totalSum / 2 : 0}):</span>
                      <span className="font-bold text-amber-500">[ {part2.join(", ")} ]</span>
                    </div>
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
        title="Partition Problem"
        description="Determine if a set can be split into two equal-sum disjoint subsets."
        category="Algorithms"
        difficulty="Medium"
        shortcut="Alt+Shift+P"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <InputField label="Set Elements (comma separated)" value={elementsStr} onChange={setElementsStr} />

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Check Equal Partition
          </Button>
        </CardContent>
      </Card>
    </DpLayout>
  );
}
