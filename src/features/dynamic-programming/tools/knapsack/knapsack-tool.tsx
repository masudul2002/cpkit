"use client";

import * as React from "react";
import { DpHeader } from "../../shared/dp-header";
import { DpLayout } from "../../shared/dp-layout";
import { DpTableGrid } from "../../visualization/dp-table-grid";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function KnapsackTool() {
  const [weightsStr, setWeightsStr] = React.useState("1, 2, 3, 5");
  const [valuesStr, setValuesStr] = React.useState("1, 6, 18, 22");
  const [capacityStr, setCapacityStr] = React.useState("5");

  const [compared, setCompared] = React.useState(false);
  const [dpTable, setDpTable] = React.useState<(number | null)[][]>([]);
  const [rowHeaders, setRowHeaders] = React.useState<string[]>([]);
  const [colHeaders, setColHeaders] = React.useState<string[]>([]);
  const [backtrackCells, setBacktrackCells] = React.useState<[number, number][]>([]);
  const [maxProfit, setMaxProfit] = React.useState<number | null>(null);
  const [selectedItems, setSelectedItems] = React.useState<number[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handleEvaluate = () => {
    setError(null);
    setCompared(true);
    setDpTable([]);
    setBacktrackCells([]);
    setMaxProfit(null);
    setSelectedItems([]);

    const wt = weightsStr.split(",").map((s) => parseInt(s.trim(), 10));
    const val = valuesStr.split(",").map((s) => parseInt(s.trim(), 10));
    const W = parseInt(capacityStr, 10);

    if (wt.some(isNaN) || val.some(isNaN) || isNaN(W)) {
      setError("Please check your weights, values, and capacity inputs.");
      return;
    }

    if (wt.length !== val.length) {
      setError("Weights and Values arrays must have the same length.");
      return;
    }

    const n = wt.length;
    // DP dimensions: (n + 1) rows, (W + 1) columns
    const dp = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));

    for (let i = 1; i <= n; i++) {
      for (let w = 0; w <= W; w++) {
        if (wt[i - 1] <= w) {
          dp[i][w] = Math.max(
            val[i - 1] + dp[i - 1][w - wt[i - 1]],
            dp[i - 1][w]
          );
        } else {
          dp[i][w] = dp[i - 1][w];
        }
      }
    }

    // Backtrack to find items
    const selected: number[] = [];
    const bCells: [number, number][] = [];
    let wTemp = W;

    for (let i = n; i > 0; i--) {
      bCells.push([i, wTemp]);
      if (dp[i][wTemp] !== dp[i - 1][wTemp]) {
        selected.push(i - 1); // 0-indexed item index
        wTemp -= wt[i - 1];
      }
    }
    bCells.push([0, wTemp]);

    // Set visualization headers
    const rHeaders = ["Base (0)"];
    for (let i = 0; i < n; i++) {
      rHeaders.push(`Item ${i + 1} (w:${wt[i]}, v:${val[i]})`);
    }

    const cHeaders = Array.from({ length: W + 1 }, (_, i) => `w=${i}`);

    setDpTable(dp);
    setRowHeaders(rHeaders);
    setColHeaders(cHeaders);
    setBacktrackCells(bCells);
    setMaxProfit(dp[n][W]);
    setSelectedItems(selected.reverse());
  };

  const definition = "The 0/1 Knapsack problem limits items to selection count 0 or 1. Given items of weights and values, choose a subset that maximizes total value without exceeding total weight capacity W.";
  const idea = "Solves subproblems using state dp[i][w], representing maximum profit using first i items and weight limit w. If weight of item i fits, compare picking it vs skipping it.";
  const recurrence = "dp[i][w] = max(val[i-1] + dp[i-1][w - wt[i-1]], dp[i-1][w])   if wt[i-1] <= w else dp[i-1][w]";
  const transition = "Compares profit from adding item i (val[i-1] plus max profit from remaining weight w - wt[i-1]) against skipping item i (matching previous state dp[i-1][w]).";
  const pseudocode = `Knapsack(N, W, wt, val):
  dp = 2D Array of size (N+1) x (W+1) filled with 0
  for i = 1..N:
    for w = 0..W:
      if wt[i-1] <= w:
        dp[i][w] = max(val[i-1] + dp[i-1][w - wt[i-1]], dp[i-1][w])
      else:
        dp[i][w] = dp[i-1][w]
  return dp[N][W]`;

  const applications = [
    "Budget allocations and asset selections.",
    "Cargo loadings load optimizations.",
    "Biclique optimizations."
  ];
  const mistakes = [
    "Incorrect index offsets using 0-indexed values lists inside 1-indexed DP loops.",
    "Not allocating correct rows/cols buffers sizes."
  ];
  const cpTips = [
    "If item values are small and weight limits are massive (e.g. W = 10^9), swap the DP state to: `dp[i][v]` = minimum weight needed to achieve profit value `v`!"
  ];

  return (
    <DpLayout
      timeComplexity="O(N * W)"
      spaceComplexity="O(N * W) table space"
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
              Knapsack DP Grid (backtrack path highlighted)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <DpTableGrid
              table={dpTable}
              rowHeaders={rowHeaders}
              colHeaders={colHeaders}
              highlightedCells={backtrackCells}
            />

            {compared && maxProfit !== null && (
              <div className="border-t border-border/5 pt-3 space-y-2 font-mono text-xs text-left">
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Maximum Profit Achieved:</span>
                  <span className="font-bold text-emerald-500">{maxProfit}</span>
                </div>
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Selected Item Indices (0-indexed):</span>
                  <span className="font-bold text-primary">
                    [ {selectedItems.length > 0 ? selectedItems.join(", ") : "No items selected"} ]
                  </span>
                </div>
              </div>
            )}
            {error && <div className="text-xs text-rose-500 font-semibold font-mono">{error}</div>}
          </CardContent>
        </Card>
      }
    >
      <DpHeader
        title="0/1 Knapsack Solver"
        description="Choose subsets of items to maximize values without exceeding weight limits."
        category="Algorithms"
        difficulty="Medium"
        shortcut="Alt+Shift+K"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <InputField label="Item Weights (comma separated)" value={weightsStr} onChange={setWeightsStr} />
          <InputField label="Item Values (comma separated)" value={valuesStr} onChange={setValuesStr} />
          <InputField label="Knapsack Capacity (W)" value={capacityStr} onChange={setCapacityStr} />

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Run Knapsack Solver
          </Button>
        </CardContent>
      </Card>
    </DpLayout>
  );
}
