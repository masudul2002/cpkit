"use client";

import * as React from "react";
import { DpHeader } from "../../shared/dp-header";
import { DpLayout } from "../../shared/dp-layout";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function TabulationTool() {
  const [fibN, setFibN] = React.useState("6");

  const [compared, setCompared] = React.useState(false);
  const [dpList, setDpList] = React.useState<number[]>([]);
  const [iterationLogs, setIterationLogs] = React.useState<string[]>([]);
  const [result, setResult] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleEvaluate = () => {
    setError(null);
    setCompared(true);
    setDpList([]);
    setIterationLogs([]);
    setResult(null);

    const n = parseInt(fibN, 10);
    if (isNaN(n) || n < 0 || n > 25) {
      setError("Please enter a valid integer between 0 and 25.");
      return;
    }

    const dp = new Array(n + 1).fill(0);
    const logs: string[] = [];

    // Base cases
    dp[0] = 0;
    logs.push("• Initialize Base Case: dp[0] = 0");
    if (n >= 1) {
      dp[1] = 1;
      logs.push("• Initialize Base Case: dp[1] = 1");
    }

    // Iterative loop
    for (let i = 2; i <= n; i++) {
      dp[i] = dp[i - 1] + dp[i - 2];
      logs.push(`• Loop i = ${i}: dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}`);
    }

    setDpList(dp);
    setIterationLogs(logs);
    setResult(dp[n]);
  };

  const definition = "Tabulation (Bottom-Up Dynamic Programming) solves all subproblems iteratively in a specified topological order (usually from smallest to largest), filling up a table sequentially without recursive overhead.";
  const idea = "Initialize base case cells. Write nested loops that solve larger problems by reading precomputed values directly from adjacent subproblem array cells.";
  const recurrence = "dp[i] = dp[i-1] + dp[i-2]   with base cases dp[0]=0, dp[1]=1";
  const transition = "Reads precomputed values at indices i-1 and i-2, computing dp[i] directly in O(1) time without recursion stack frames.";
  const pseudocode = `TabulatedFib(n):
  dp = Array of size n + 1
  dp[0] = 0, dp[1] = 1
  for i = 2..n:
    dp[i] = dp[i-1] + dp[i-2]
  return dp[n]`;

  const applications = [
    "Most standard DP algorithms where subproblems spaces are dense and fully visited.",
    "Efficient GPU memory parallel algorithms.",
    "Solving coin changes and string alignment alignments."
  ];
  const mistakes = [
    "Not allocating sufficient array size (e.g. index errors on small inputs like N=0 or N=1).",
    "Running loops in incorrect directions, reading uninitialized cells."
  ];
  const cpTips = [
    "In competitive programming contests, Tabulation is generally faster than Memoization due to the absence of function calls overhead and recursion limits, and it permits easy space optimization!"
  ];

  return (
    <DpLayout
      timeComplexity="O(N) time"
      spaceComplexity="O(N) array storage space"
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
              Bottom-Up Tabulation Grid (dp[i])
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {/* Visual DP array cards */}
            <div className="flex flex-wrap gap-2.5">
              {dpList.map((val, idx) => {
                return (
                  <div
                    key={idx}
                    className="p-3 border border-border/40 rounded-xl flex flex-col items-center bg-background/25"
                  >
                    <span className="text-[10px] opacity-60">dp[{idx}]</span>
                    <span className="text-sm font-extrabold my-1 text-emerald-500">{val}</span>
                  </div>
                );
              })}
            </div>

            {compared && result !== null && (
              <div className="border-t border-border/5 pt-3 space-y-3 font-mono text-xs text-left">
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Result: dp[{fibN}] =</span>
                  <span className="font-bold text-emerald-500">{result}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Bottom-Up Loops Execution Trace:
                  </span>
                  <div className="p-2.5 bg-muted/20 border border-border/10 rounded-lg max-h-36 overflow-y-auto font-mono text-[11px] leading-relaxed text-foreground/80 space-y-1">
                    {iterationLogs.map((log, idx) => (
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
        title="Tabulation Playground"
        description="Monitor bottom-up table updates and loop sequences in tabulated DP."
        category="Playgrounds"
        difficulty="Easy"
        shortcut="Alt+Shift+T"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <InputField label="Tabulation Size N (N <= 25)" value={fibN} onChange={setFibN} />

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Run Tabulation Solver
          </Button>
        </CardContent>
      </Card>
    </DpLayout>
  );
}
