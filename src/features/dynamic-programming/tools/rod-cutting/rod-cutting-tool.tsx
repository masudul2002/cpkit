"use client";

import * as React from "react";
import { DpHeader } from "../../shared/dp-header";
import { DpLayout } from "../../shared/dp-layout";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function RodCuttingTool() {
  const [lengthStr, setLengthStr] = React.useState("4");
  const [pricesStr, setPricesStr] = React.useState("1, 5, 8, 9");

  const [compared, setCompared] = React.useState(false);
  const [dpList, setDpList] = React.useState<number[]>([]);
  const [cutsList, setCutsList] = React.useState<number[]>([]);
  const [maxProfit, setMaxProfit] = React.useState<number | null>(null);
  const [selectedCuts, setSelectedCuts] = React.useState<number[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handleEvaluate = () => {
    setError(null);
    setCompared(true);
    setDpList([]);
    setCutsList([]);
    setMaxProfit(null);
    setSelectedCuts([]);

    const N = parseInt(lengthStr, 10);
    const prices = pricesStr.split(",").map((s) => parseInt(s.trim(), 10));

    if (isNaN(N) || N < 1 || prices.some(isNaN) || prices.length < N) {
      setError("Please check your rod length and prices inputs (prices length must match or exceed rod length).");
      return;
    }

    const dp = new Array(N + 1).fill(0);
    const cuts = new Array(N + 1).fill(0);

    for (let i = 1; i <= N; i++) {
      let maxVal = -Infinity;
      for (let j = 0; j < i; j++) {
        if (prices[j] + dp[i - j - 1] > maxVal) {
          maxVal = prices[j] + dp[i - j - 1];
          cuts[i] = j + 1; // cut of length j + 1
        }
      }
      dp[i] = maxVal;
    }

    // Reconstruct cut lengths
    const selected: number[] = [];
    let tempL = N;
    while (tempL > 0) {
      const cutLen = cuts[tempL];
      selected.push(cutLen);
      tempL -= cutLen;
    }

    setDpList(dp);
    setCutsList(cuts);
    setMaxProfit(dp[N]);
    setSelectedCuts(selected);
  };

  const definition = "The Rod Cutting problem finds the maximum profit obtainable by cutting a rod of length N into smaller pieces and selling them according to a prices list.";
  const idea = "The state dp[i] represents the maximum profit obtainable for a rod of length i. For each length i, we try cutting a piece of length j + 1 and add it to the maximum profit from the remaining length i - j - 1.";
  const recurrence = "dp[i] = max(price[j] + dp[i - j - 1])   for all j in [0, i-1]";
  const transition = "Compares the profits of all possible first cuts: making a cut of length j + 1 (yields price[j]) plus solving the remaining subproblem of length i - j - 1.";
  const pseudocode = `RodCutting(N, prices):
  dp = Array of size N + 1 filled with 0
  for i = 1..N:
    max_val = -INF
    for j = 0..i-1:
      max_val = max(max_val, prices[j] + dp[i - j - 1])
    dp[i] = max_val
  return dp[N]`;

  const applications = [
    "Material cut sheet layouts optimization.",
    "Resource allocation budget planning.",
    "Job scheduling with deadlines."
  ];
  const mistakes = [
    "Incorrect index offsets using 0-indexed price arrays inside 1-indexed DP loops.",
    "Not clearing parent pointers arrays correctly during backtracking."
  ];
  const cpTips = [
    "Rod cutting is isomorphic to Unbounded Knapsack, where item weights correspond to cut lengths and item values correspond to piece prices!"
  ];

  return (
    <DpLayout
      timeComplexity="O(N^2)"
      spaceComplexity="O(N) tables storage size"
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
              Rod Cutting DP Array Nodes (cuts highlighted)
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
                    <span className="text-[10px] opacity-60">Length {idx}</span>
                    <span className="text-sm font-extrabold my-1 text-emerald-500">${val}</span>
                    <span className="text-[9px] font-mono opacity-80">Cut: {cutsList[idx]}</span>
                  </div>
                );
              })}
            </div>

            {compared && maxProfit !== null && (
              <div className="border-t border-border/5 pt-3 space-y-2 font-mono text-xs text-left">
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Maximum Profit:</span>
                  <span className="font-bold text-emerald-500">${maxProfit}</span>
                </div>
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Optimal Cut Pieces:</span>
                  <span className="font-bold text-primary">[ {selectedCuts.map((c) => `len:${c}`).join(", ")} ]</span>
                </div>
              </div>
            )}
            {error && <div className="text-xs text-rose-500 font-semibold font-mono">{error}</div>}
          </CardContent>
        </Card>
      }
    >
      <DpHeader
        title="Rod Cutting Solver"
        description="Cut rods into optimal segments to maximize sales values."
        category="Algorithms"
        difficulty="Medium"
        shortcut="Alt+Shift+R"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <InputField label="Target Rod Length N" value={lengthStr} onChange={setLengthStr} />
          <InputField label="Prices for Lengths 1..N (comma separated)" value={pricesStr} onChange={setPricesStr} />

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Run Rod Cutting Solver
          </Button>
        </CardContent>
      </Card>
    </DpLayout>
  );
}
