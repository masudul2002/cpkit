"use client";

import * as React from "react";
import { DpHeader } from "../../shared/dp-header";
import { DpLayout } from "../../shared/dp-layout";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function LisTool() {
  const [arrayStr, setArrayStr] = React.useState("10, 22, 9, 33, 21, 50, 41, 60");

  const [compared, setCompared] = React.useState(false);
  const [array, setArray] = React.useState<number[]>([]);
  const [dpList, setDpList] = React.useState<number[]>([]);
  const [parentList, setParentList] = React.useState<number[]>([]);
  const [lisLength, setLisLength] = React.useState<number | null>(null);
  const [lisSequence, setLisSequence] = React.useState<number[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handleEvaluate = () => {
    setError(null);
    setCompared(true);
    setArray([]);
    setDpList([]);
    setParentList([]);
    setLisLength(null);
    setLisSequence([]);

    const arr = arrayStr.split(",").map((s) => parseInt(s.trim(), 10));
    if (arr.some(isNaN) || arr.length === 0) {
      setError("Please check your array numbers inputs.");
      return;
    }

    const n = arr.length;
    const dp = new Array(n).fill(1);
    const parent = new Array(n).fill(-1);

    let maxLen = 1;
    let bestEndIdx = 0;

    for (let i = 1; i < n; i++) {
      for (let j = 0; j < i; j++) {
        if (arr[j] < arr[i] && dp[j] + 1 > dp[i]) {
          dp[i] = dp[j] + 1;
          parent[i] = j;
        }
      }
      if (dp[i] > maxLen) {
        maxLen = dp[i];
        bestEndIdx = i;
      }
    }

    // Reconstruct sequence
    const seq: number[] = [];
    let curr = bestEndIdx;
    while (curr !== -1) {
      seq.push(arr[curr]);
      curr = parent[curr];
    }

    setArray(arr);
    setDpList(dp);
    setParentList(parent);
    setLisLength(maxLen);
    setLisSequence(seq.reverse());
  };

  const definition = "The Longest Increasing Subsequence (LIS) problem finds the length of the longest subsequence in a given sequence such that all elements of the subsequence are sorted in increasing order.";
  const idea = "State dp[i] represents the length of the LIS ending at index i. For each index i, sweep all previous indices j < i, transitioning dp[i] = max(dp[i], dp[j] + 1) if arr[j] < arr[i].";
  const recurrence = "dp[i] = 1 + max(dp[j])   for all j < i where arr[j] < arr[i]";
  const transition = "Decides to extend an increasing path ending at j with element i if element i is larger than element j.";
  const pseudocode = `LIS(arr):
  N = arr.length
  dp = Array of size N filled with 1
  for i = 1..N-1:
    for j = 0..i-1:
      if arr[j] < arr[i]:
        dp[i] = max(dp[i], dp[j] + 1)
  return max(dp)`;

  const applications = [
    "Box stacking optimization layouts.",
    "Stock market indices streaks trends audits.",
    "Solving path intersections queries."
  ];
  const mistakes = [
    "Failing to initialize all DP values to 1, since an isolated single element is an increasing subsequence of length 1.",
    "Misidentifying strict inequalities check requirements (e.g. non-decreasing vs increasing)."
  ];
  const cpTips = [
    "While this O(N^2) DP is educational, LIS can be solved in O(N log N) using a min-endings array with binary search (std::lower_bound in C++)!"
  ];

  return (
    <DpLayout
      timeComplexity="O(N^2) / O(N log N) optimized"
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
              LIS DP Array Nodes (path highlights)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {/* Visual DP array cards */}
            <div className="flex flex-wrap gap-2.5">
              {array.map((val, idx) => {
                const isPart = lisSequence.includes(val);
                return (
                  <div
                    key={idx}
                    className={`p-3 border rounded-xl flex flex-col items-center transition-all ${
                      isPart
                        ? "bg-primary border-primary text-primary-foreground shadow-md font-extrabold scale-105"
                        : "border-border/40 bg-background/25"
                    }`}
                  >
                    <span className="text-[10px] opacity-60">[{idx}]</span>
                    <span className="text-sm font-extrabold my-1">{val}</span>
                    <span className="text-[9px] font-mono opacity-80">dp: {dpList[idx]}</span>
                  </div>
                );
              })}
            </div>

            {compared && lisLength !== null && (
              <div className="border-t border-border/5 pt-3 space-y-2 font-mono text-xs text-left">
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>LIS Length:</span>
                  <span className="font-bold text-emerald-500">{lisLength} elements</span>
                </div>
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>LIS Sequence:</span>
                  <span className="font-bold text-primary">[ {lisSequence.join(", ")} ]</span>
                </div>
              </div>
            )}
            {error && <div className="text-xs text-rose-500 font-semibold font-mono">{error}</div>}
          </CardContent>
        </Card>
      }
    >
      <DpHeader
        title="LIS Sequence"
        description="Find the longest increasing subsequence in an array of numbers."
        category="Algorithms"
        difficulty="Medium"
        shortcut="Alt+Shift+I"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <InputField label="Source Array Numbers (comma separated)" value={arrayStr} onChange={setArrayStr} />

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Run LIS Solver
          </Button>
        </CardContent>
      </Card>
    </DpLayout>
  );
}
