"use client";

import * as React from "react";
import { DpHeader } from "../../shared/dp-header";
import { DpLayout } from "../../shared/dp-layout";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function MemoizationTool() {
  const [fibN, setFibN] = React.useState("5");

  const [compared, setCompared] = React.useState(false);
  const [memoTable, setMemoTable] = React.useState<Record<number, number>>({});
  const [callTrace, setCallTrace] = React.useState<string[]>([]);
  const [totalCalls, setTotalCalls] = React.useState(0);
  const [savedCalls, setSavedCalls] = React.useState(0);
  const [result, setResult] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleEvaluate = () => {
    setError(null);
    setCompared(true);
    setMemoTable({});
    setCallTrace([]);
    setTotalCalls(0);
    setSavedCalls(0);
    setResult(null);

    const n = parseInt(fibN, 10);
    if (isNaN(n) || n < 0 || n > 25) {
      setError("Please enter a valid integer between 0 and 25 (higher values will exceed browser recursion limits).");
      return;
    }

    const memo: Record<number, number> = {};
    const trace: string[] = [];
    let callsCount = 0;
    let cacheHits = 0;

    const fib = (x: number, indent: number): number => {
      callsCount++;
      const spaces = " ".repeat(indent * 2);

      if (memo[x] !== undefined) {
        cacheHits++;
        trace.push(`${spaces}• fib(${x}) → Read from Memo Cache: ${memo[x]}`);
        return memo[x];
      }

      if (x === 0) {
        trace.push(`${spaces}• fib(0) → Base Case: 0`);
        return 0;
      }
      if (x === 1) {
        trace.push(`${spaces}• fib(1) → Base Case: 1`);
        return 1;
      }

      trace.push(`${spaces}• fib(${x}) → Recurse fib(${x - 1}) + fib(${x - 2})`);
      const ans = fib(x - 1, indent + 1) + fib(x - 2, indent + 1);
      memo[x] = ans;
      trace.push(`${spaces}• fib(${x}) → Memoize Result: ${ans}`);
      return ans;
    };

    const res = fib(n, 0);

    setMemoTable(memo);
    setCallTrace(trace);
    setTotalCalls(callsCount);
    setSavedCalls(cacheHits);
    setResult(res);
  };

  const definition = "Memoization (Top-Down Dynamic Programming) optimizes naive exponential recursive algorithms by saving subproblems solutions in a cache table (like an array or hash map) and returning them directly upon repeated calls.";
  const idea = "Solves the target problem recursively. Before running the recursive function body, check if the state is already computed in the memo table. If yes, return it; if no, calculate it recursively and save the result.";
  const recurrence = "fib(n) = fib(n-1) + fib(n-2)   with base cases fib(0)=0, fib(1)=1";
  const transition = "Caches states at heights matching subproblem values, reducing recursive branches depth from exponential O(2^N) to linear O(N) calls.";
  const pseudocode = `MemoizedFib(n, memo):
  if n in memo: return memo[n]
  if n <= 1: return n
  memo[n] = MemoizedFib(n-1, memo) + MemoizedFib(n-2, memo)
  return memo[n]`;

  const applications = [
    "Optimizing recursive DFS traversal paths on graphs and trees.",
    "Solving coin changes and knapsack subproblems.",
    "Evaluating game tree moves minimax calculations."
  ];
  const mistakes = [
    "Forgetting to pass the memo reference recursively, which causes identical calculations to run repeatedly.",
    "Not initializing base cases inside the memo cache beforehand."
  ];
  const cpTips = [
    "In competitive programming contests, Memoization is heavily favored when only a small subset of all possible DP state spaces is reachable, avoiding unnecessary tabulation computations!"
  ];

  return (
    <DpLayout
      timeComplexity="O(N) with memo / O(2^N) without"
      spaceComplexity="O(N) cache & stack depth"
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
              Memoization Calls and Cache State
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {/* Memo cache view */}
            <div className="space-y-2 text-left font-sans text-xs">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                Memoization Cache (memo[i]):
              </span>
              <div className="flex flex-wrap gap-1.5 font-mono">
                {Object.keys(memoTable).length > 0 ? Object.keys(memoTable).map((k) => {
                  const key = parseInt(k, 10);
                  return (
                    <div key={key} className="px-3 py-1.5 border border-border/40 rounded bg-background/25 flex flex-col items-center">
                      <span className="text-[9px] text-muted-foreground">fib({key})</span>
                      <span className="font-extrabold text-foreground">{memoTable[key]}</span>
                    </div>
                  );
                }) : <div className="text-muted-foreground text-xs font-sans">Memo table is empty.</div>}
              </div>
            </div>

            {compared && result !== null && (
              <div className="border-t border-border/5 pt-3 space-y-3 font-mono text-xs text-left">
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Result: fib({fibN}) =</span>
                  <span className="font-bold text-emerald-500">{result}</span>
                </div>
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Total Recursion Calls Executed:</span>
                  <span className="font-bold text-rose-500">{totalCalls} calls</span>
                </div>
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Redundant Calls Saved (Cache Hits):</span>
                  <span className="font-bold text-emerald-500">{savedCalls} calls</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Recursion Hops and Memo Lookups:
                  </span>
                  <div className="p-2.5 bg-muted/20 border border-border/10 rounded-lg max-h-40 overflow-y-auto font-mono text-[11px] leading-relaxed text-foreground/80 space-y-1 whitespace-pre">
                    {callTrace.map((line, idx) => (
                      <div key={idx}>{line}</div>
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
        title="Memoization Playground"
        description="Trace recursive calls and monitor memoization cache updates in top-down DP."
        category="Playgrounds"
        difficulty="Easy"
        shortcut="Alt+Shift+M"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <InputField label="Fibonacci Number N (N <= 25)" value={fibN} onChange={setFibN} />

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Run Recursive Tracer
          </Button>
        </CardContent>
      </Card>
    </DpLayout>
  );
}
