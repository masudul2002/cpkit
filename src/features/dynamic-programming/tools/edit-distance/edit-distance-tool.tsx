"use client";

import * as React from "react";
import { DpHeader } from "../../shared/dp-header";
import { DpLayout } from "../../shared/dp-layout";
import { DpTableGrid } from "../../visualization/dp-table-grid";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function EditDistanceTool() {
  const [stringA, setStringA] = React.useState("cat");
  const [stringB, setStringB] = React.useState("cut");

  const [compared, setCompared] = React.useState(false);
  const [dpTable, setDpTable] = React.useState<number[][]>([]);
  const [rowHeaders, setRowHeaders] = React.useState<string[]>([]);
  const [colHeaders, setColHeaders] = React.useState<string[]>([]);
  const [backtrackCells, setBacktrackCells] = React.useState<[number, number][]>([]);
  const [editDistance, setEditDistance] = React.useState<number | null>(null);
  const [operations, setOperations] = React.useState<string[]>([]);

  const handleEvaluate = () => {
    setCompared(true);
    setDpTable([]);
    setBacktrackCells([]);
    setEditDistance(null);
    setOperations([]);

    const A = stringA.trim();
    const B = stringB.trim();

    const n = A.length;
    const m = B.length;

    // dp[i][j] holds min edits to convert A[0..i-1] to B[0..j-1]
    const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));

    // Base cases
    for (let i = 0; i <= n; i++) dp[i][0] = i;
    for (let j = 0; j <= m; j++) dp[0][j] = j;

    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= m; j++) {
        if (A[i - 1] === B[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = 1 + Math.min(
            dp[i - 1][j],    // Delete
            dp[i][j - 1],    // Insert
            dp[i - 1][j - 1] // Replace
          );
        }
      }
    }

    // Backtrack to isolate operations
    const bCells: [number, number][] = [];
    const ops: string[] = [];
    let i = n;
    let j = m;

    while (i > 0 || j > 0) {
      bCells.push([i, j]);
      if (i > 0 && j > 0 && A[i - 1] === B[j - 1]) {
        i--;
        j--;
      } else {
        const cost = dp[i][j];
        if (i > 0 && cost === dp[i - 1][j] + 1) {
          ops.push(`Delete character '${A[i - 1]}' from String A`);
          i--;
        } else if (j > 0 && cost === dp[i][j - 1] + 1) {
          ops.push(`Insert character '${B[j - 1]}' into String A`);
          j--;
        } else if (i > 0 && j > 0 && cost === dp[i - 1][j - 1] + 1) {
          ops.push(`Replace character '${A[i - 1]}' in String A with '${B[j - 1]}'`);
          i--;
          j--;
        } else {
          // Edge fallback
          if (i > 0) i--;
          else if (j > 0) j--;
        }
      }
    }
    bCells.push([0, 0]);

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
    setEditDistance(dp[n][m]);
    setOperations(ops.reverse());
  };

  const definition = "The Edit Distance (Levenshtein Distance) problem measures the minimum number of single-character editing operations (Insert, Delete, Replace) required to change one string into another.";
  const idea = "Solves by suffix comparisons. If characters match, no cost is added: dp[i][j] = dp[i-1][j-1]. Otherwise, we take 1 plus the minimum of Delete (top), Insert (left), and Replace (diagonal).";
  const recurrence = "dp[i][j] = dp[i-1][j-1]   if A[i-1] == B[j-1] else 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])";
  const transition = "Compares paths: diagonal represents matching or replacing; top represents deleting from A; left represents inserting into A.";
  const pseudocode = `EditDistance(A, B):
  N = A.length, M = B.length
  dp = 2D Array of size (N+1) x (M+1)
  for i = 0..N: dp[i][0] = i
  for j = 0..M: dp[0][j] = j
  for i = 1..N:
    for j = 1..M:
      if A[i-1] == B[j-1]:
        dp[i][j] = dp[i-1][j-1]
      else:
        dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
  return dp[N][M]`;

  const applications = [
    "Autocorrect spell checking tools.",
    "DNA similarities measurements.",
    "NLP text similarity calculations."
  ];
  const mistakes = [
    "Incorrect base cases initialization where `dp[i][0]` or `dp[0][j]` are left as 0 instead of i or j.",
    "Incorrect operations check matches."
  ];
  const cpTips = [
    "If only insertions and deletions are permitted (no replacements), the Edit Distance is directly equal to: `(N + M) - 2 * LCS_Length(A, B)`!"
  ];

  return (
    <DpLayout
      timeComplexity="O(N * M)"
      spaceComplexity="O(N * M) table size"
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
              Edit Distance DP Grid (backtrack path highlighted)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <DpTableGrid
              table={dpTable}
              rowHeaders={rowHeaders}
              colHeaders={colHeaders}
              highlightedCells={backtrackCells}
            />

            {compared && editDistance !== null && (
              <div className="border-t border-border/5 pt-3 space-y-3 font-mono text-xs text-left">
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Minimum Edit Distance:</span>
                  <span className="font-bold text-emerald-500">{editDistance} edits</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Operations Trace List:
                  </span>
                  <div className="p-2.5 bg-muted/20 border border-border/10 rounded-lg max-h-36 overflow-y-auto font-mono text-[11px] leading-relaxed text-foreground/80 space-y-1">
                    {operations.length > 0 ? operations.map((op, idx) => (
                      <div key={idx} className="text-foreground/85">{op}</div>
                    )) : <div className="text-muted-foreground">No operations needed (Strings are identical).</div>}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      }
    >
      <DpHeader
        title="Edit Distance"
        description="Compute minimum insert, delete, and replace edits needed to convert strings."
        category="Algorithms"
        difficulty="Medium"
        shortcut="Alt+Shift+E"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <InputField label="Source String A" value={stringA} onChange={setStringA} />
          <InputField label="Target String B" value={stringB} onChange={setStringB} />

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Run Edit Distance Solver
          </Button>
        </CardContent>
      </Card>
    </DpLayout>
  );
}
