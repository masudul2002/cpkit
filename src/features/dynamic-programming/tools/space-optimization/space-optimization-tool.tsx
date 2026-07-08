"use client";

import * as React from "react";
import { DpHeader } from "../../shared/dp-header";
import { DpLayout } from "../../shared/dp-layout";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function SpaceOptimizationTool() {
  const [arrayStr, setArrayStr] = React.useState("2, 3, 5");
  const [targetSumStr, setTargetSumStr] = React.useState("6");

  const [compared, setCompared] = React.useState(false);
  const [originalSpace, setOriginalSpace] = React.useState(0);
  const [optimizedSpace, setOptimizedSpace] = React.useState(0);
  const [originalTable, setOriginalTable] = React.useState<boolean[][]>([]);
  const [optimizedRow, setOptimizedRow] = React.useState<boolean[]>([]);
  const [traceLogs, setTraceLogs] = React.useState<string[]>([]);
  const [result, setResult] = React.useState<boolean | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleEvaluate = () => {
    setError(null);
    setCompared(true);
    setOriginalTable([]);
    setOptimizedRow([]);
    setTraceLogs([]);
    setResult(null);

    const arr = arrayStr.split(",").map((s) => parseInt(s.trim(), 10));
    const target = parseInt(targetSumStr, 10);

    if (arr.some(isNaN) || isNaN(target) || target < 0) {
      setError("Please check your set elements and target sum inputs.");
      return;
    }

    const n = arr.length;

    // 1. Calculate Original 2D DP Table: (n+1) x (target+1)
    const dp2D = Array.from({ length: n + 1 }, () => new Array(target + 1).fill(false));
    for (let i = 0; i <= n; i++) dp2D[i][0] = true;

    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= target; j++) {
        if (arr[i - 1] <= j) {
          dp2D[i][j] = dp2D[i - 1][j] || dp2D[i - 1][j - arr[i - 1]];
        } else {
          dp2D[i][j] = dp2D[i - 1][j];
        }
      }
    }

    // 2. Calculate Optimized 1D DP Row: (target+1)
    const dp1D = new Array(target + 1).fill(false);
    dp1D[0] = true;
    const logs: string[] = ["• Initialize 1D Row: dp[0] = True, all other sums = False"];

    for (let i = 0; i < n; i++) {
      const val = arr[i];
      logs.push(`• Process Element E[${i}] = ${val}:`);
      // Update backwards to prevent using the same element multiple times
      for (let j = target; j >= val; j--) {
        const oldState = dp1D[j];
        dp1D[j] = dp1D[j] || dp1D[j - val];
        if (dp1D[j] !== oldState) {
          logs.push(`  → dp[${j}] updated from False to True (using E[${i}] = ${val} and state dp[${j - val}])`);
        }
      }
    }

    setOriginalSpace((n + 1) * (target + 1) * 1); // 1 byte per boolean
    setOptimizedSpace((target + 1) * 1);
    setOriginalTable(dp2D);
    setOptimizedRow(dp1D);
    setTraceLogs(logs);
    setResult(dp1D[target]);
  };

  const definition = "Space Optimization reduces the memory footprint of dynamic programming algorithms by discarding intermediate subproblems cells that are no longer needed to compute subsequent states.";
  const idea = "In 2D subproblem grids (like Knapsack or Subset Sum), the transitions for row i only read values from row i - 1. We can reduce the space complexity from O(N * S) to O(S) by keeping a single row and updating values backwards.";
  const recurrence = "dp[j] = dp[j] || dp[j - val]   updated in reverse order j = target down to val";
  const transition = "Overwrites the current cell in-place. Processing backwards ensures we query cells from the previous iteration's row state, not the current row state.";
  const pseudocode = `OptimizedSubsetSum(arr, target):
  dp = Array of size target + 1 filled with False
  dp[0] = True
  for val in arr:
    for j = target down to val:
      dp[j] = dp[j] or dp[j - val]
  return dp[target]`;

  const applications = [
    "Minimizing memory consumption in Knapsack problems.",
    "Optimizing LCS and Edit Distance down to two rows instead of a 2D grid.",
    "Fitting massive DP bounds within strict CP contest memory limits."
  ];
  const mistakes = [
    "Looping forwards when updating a single-row Knapsack / Subset Sum array, which permits multiple selections of the same element (Unbounded Knapsack behavior).",
    "Not copying previous row states when updating two-row grids (like LCS)."
  ];
  const cpTips = [
    "Always check the memory limit in CP contests. If N = 1000 and W = 10000, a 2D table of type `int` takes 40MB, whereas space optimization reduces it to just 40KB!"
  ];

  return (
    <DpLayout
      timeComplexity="O(N * target) time"
      spaceComplexity="O(target) optimized space"
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
              Memory Reduction Audit
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Memory comparison metric */}
            <div className="grid gap-4 grid-cols-2 text-center">
              <div className="p-3 border border-border/40 rounded-xl bg-rose-500/5">
                <div className="text-[10px] text-muted-foreground uppercase font-bold">Original 2D DP Space</div>
                <div className="text-lg font-extrabold text-rose-500 mt-1">{compared ? `${originalSpace} Cells` : "-"}</div>
                <div className="text-[9px] text-muted-foreground/60 mt-0.5">O(N * Target)</div>
              </div>
              <div className="p-3 border border-border/40 rounded-xl bg-emerald-500/5">
                <div className="text-[10px] text-muted-foreground uppercase font-bold">Optimized 1D DP Space</div>
                <div className="text-lg font-extrabold text-emerald-500 mt-1">{compared ? `${optimizedSpace} Cells` : "-"}</div>
                <div className="text-[9px] text-muted-foreground/60 mt-0.5">O(Target)</div>
              </div>
            </div>

            {compared && (
              <div className="border-t border-border/5 pt-3 space-y-3 font-mono text-xs text-left">
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Is Target Sum Possible:</span>
                  <span className={`font-bold ${result ? "text-emerald-500" : "text-rose-500"}`}>
                    {result ? "POSSIBLE (True)" : "IMPOSSIBLE (False)"}
                  </span>
                </div>

                {/* Optimized row values */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Final Optimized 1D DP Row:
                  </span>
                  <div className="flex flex-wrap gap-1.5 font-mono">
                    {optimizedRow.map((val, idx) => (
                      <div key={idx} className={`px-2 py-1 border rounded font-bold ${
                        val ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "border-border/40 bg-background/25 text-muted-foreground"
                      }`}>
                        dp[{idx}]: {val ? "T" : "F"}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                    1D Row Transition Logs (Updated Backwards):
                  </span>
                  <div className="p-2.5 bg-muted/20 border border-border/10 rounded-lg max-h-36 overflow-y-auto font-mono text-[11px] leading-relaxed text-foreground/80 space-y-1">
                    {traceLogs.map((log, idx) => (
                      <div key={idx} className="text-foreground/80">{log}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {error && <div className="text-xs text-rose-500 font-semibold font-mono">{error}</div>}
          </CardContent>
        </Card>
      }
    >
      <DpHeader
        title="Space Optimization"
        description="Compare memory footprints of original 2D DP grids vs optimized 1D DP rows."
        category="Playgrounds"
        difficulty="Hard"
        shortcut="Alt+Shift+S"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <InputField label="Set Elements (comma separated)" value={arrayStr} onChange={setArrayStr} />
          <InputField label="Target Sum" value={targetSumStr} onChange={setTargetSumStr} />

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Run Memory Audit
          </Button>
        </CardContent>
      </Card>
    </DpLayout>
  );
}
