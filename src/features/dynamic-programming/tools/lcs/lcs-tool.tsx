"use client";

import * as React from "react";
import { DpHeader } from "../../shared/dp-header";
import { DpLayout } from "../../shared/dp-layout";
import { DpTableGrid } from "../../visualization/dp-table-grid";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function LcsTool() {
  const [stringA, setStringA] = React.useState("stone");
  const [stringB, setStringB] = React.useState("longest");

  const [compared, setCompared] = React.useState(false);
  const [dpTable, setDpTable] = React.useState<number[][]>([]);
  const [rowHeaders, setRowHeaders] = React.useState<string[]>([]);
  const [colHeaders, setColHeaders] = React.useState<string[]>([]);
  const [backtrackCells, setBacktrackCells] = React.useState<[number, number][]>([]);
  const [lcsLength, setLcsLength] = React.useState<number | null>(null);
  const [lcsSequence, setLcsSequence] = React.useState<string>("");

  const handleEvaluate = () => {
    setCompared(true);
    setDpTable([]);
    setBacktrackCells([]);
    setLcsLength(null);
    setLcsSequence("");

    const A = stringA.trim();
    const B = stringB.trim();

    const n = A.length;
    const m = B.length;

    // dp[i][j] holds length of LCS of A[0..i-1] and B[0..j-1]
    const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));

    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= m; j++) {
        if (A[i - 1] === B[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    // Backtrack to extract LCS string and highlight cells
    const bCells: [number, number][] = [];
    let lcsArr: string[] = [];
    let i = n;
    let j = m;

    while (i > 0 && j > 0) {
      bCells.push([i, j]);
      if (A[i - 1] === B[j - 1]) {
        lcsArr.push(A[i - 1]);
        i--;
        j--;
      } else if (dp[i - 1][j] >= dp[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }
    bCells.push([i, j]);

    // Format headers
    const rHeaders = ["Base (0)"];
    for (let idx = 0; idx < n; idx++) {
      rHeaders.push(`A[${idx}]: ${A[idx]}`);
    }

    const cHeaders = ["Base (0)"];
    for (let idx = 0; idx < m; idx++) {
      cHeaders.push(`B[${idx}]: ${B[idx]}`);
    }

    setDpTable(dp);
    setRowHeaders(rHeaders);
    setColHeaders(cHeaders);
    setBacktrackCells(bCells);
    setLcsLength(dp[n][m]);
    setLcsSequence(lcsArr.reverse().join(""));
  };

  const definition = "The Longest Common Subsequence (LCS) problem finds the longest subsequence common to all sequences in a set of sequences (subsequences do not need to occupy consecutive positions).";
  const idea = "Compares string suffixes dynamically. If characters match, increment diagonal values: dp[i][j] = dp[i-1][j-1] + 1. Otherwise, take the maximum of adjacent subproblem cells.";
  const recurrence = "dp[i][j] = dp[i-1][j-1] + 1   if A[i-1] == B[j-1] else max(dp[i-1][j], dp[i][j-1])";
  const transition = "Decides to match characters (increment diagonal) or skip characters (taking maximum of top or left cell).";
  const pseudocode = `LCS(A, B):
  N = A.length, M = B.length
  dp = 2D Array of size (N+1) x (M+1) filled with 0
  for i = 1..N:
    for j = 1..M:
      if A[i-1] == B[j-1]:
        dp[i][j] = dp[i-1][j-1] + 1
      else:
        dp[i][j] = max(dp[i-1][j], dp[i][j-1])
  return dp[N][M]`;

  const applications = [
    "Diff checks and file revision managers (e.g. Git diffs).",
    "Bioinformatics DNA matching indices.",
    "Pattern recognition."
  ];
  const mistakes = [
    "Misalignment of characters indexing between 0-indexed strings and 1-indexed DP tables.",
    "Not tracing backtrack conditions correctly."
  ];
  const cpTips = [
    "For string LCS, if one string is a permutation of distinct integers, you can map character indices and solve it in O(N log N) using LIS (Longest Increasing Subsequence)!"
  ];

  return (
    <DpLayout
      timeComplexity="O(N * M)"
      spaceComplexity="O(N * M) table space"
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
              LCS DP Grid (backtrack path highlighted)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <DpTableGrid
              table={dpTable}
              rowHeaders={rowHeaders}
              colHeaders={colHeaders}
              highlightedCells={backtrackCells}
            />

            {compared && lcsLength !== null && (
              <div className="border-t border-border/5 pt-3 space-y-2 font-mono text-xs text-left">
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>LCS Length:</span>
                  <span className="font-bold text-emerald-500">{lcsLength} characters</span>
                </div>
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>LCS String Sequence:</span>
                  <span className="font-bold text-primary">
                    "{lcsSequence || "(empty)"}"
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      }
    >
      <DpHeader
        title="LCS Subsequence"
        description="Find the longest subsequence shared across two string configurations."
        category="Algorithms"
        difficulty="Medium"
        shortcut="Alt+Shift+L"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <InputField label="String A" value={stringA} onChange={setStringA} />
          <InputField label="String B" value={stringB} onChange={setStringB} />

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Run LCS Solver
          </Button>
        </CardContent>
      </Card>
    </DpLayout>
  );
}
