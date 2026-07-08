"use client";

import * as React from "react";
import { DpHeader } from "../../shared/dp-header";
import { DpLayout } from "../../shared/dp-layout";
import { DpTableGrid } from "../../visualization/dp-table-grid";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function MatrixChainTool() {
  const [dimsStr, setDimsStr] = React.useState("10, 20, 30, 40, 30");

  const [compared, setCompared] = React.useState(false);
  const [dpTable, setDpTable] = React.useState<number[][]>([]);
  const [rowHeaders, setRowHeaders] = React.useState<string[]>([]);
  const [colHeaders, setColHeaders] = React.useState<string[]>([]);
  const [minOps, setMinOps] = React.useState<number | null>(null);
  const [parenthesization, setParenthesization] = React.useState<string>("");
  const [error, setError] = React.useState<string | null>(null);

  const handleEvaluate = () => {
    setError(null);
    setCompared(true);
    setDpTable([]);
    setMinOps(null);
    setParenthesization("");

    const P = dimsStr.split(",").map((s) => parseInt(s.trim(), 10));
    if (P.some(isNaN) || P.length < 2) {
      setError("Please check your dimensions inputs. At least 2 values are required.");
      return;
    }

    const n = P.length - 1; // number of matrices
    const dp = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));
    const sTable = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));

    // l is chain length
    for (let l = 2; l <= n; l++) {
      for (let i = 1; i <= n - l + 1; i++) {
        const j = i + l - 1;
        dp[i][j] = Infinity;
        for (let k = i; k < j; k++) {
          const q = dp[i][k] + dp[k + 1][j] + P[i - 1] * P[k] * P[j];
          if (q < dp[i][j]) {
            dp[i][j] = q;
            sTable[i][j] = k;
          }
        }
      }
    }

    // Reconstruct optimal parenthesization recursively
    const getParens = (iIdx: number, jIdx: number): string => {
      if (iIdx === jIdx) return `A${iIdx}`;
      const k = sTable[iIdx][jIdx];
      return `(${getParens(iIdx, k)} x ${getParens(k + 1, jIdx)})`;
    };

    const rHeaders = Array.from({ length: n + 1 }, (_, idx) => `Row M${idx}`);
    const cHeaders = Array.from({ length: n + 1 }, (_, idx) => `Col M${idx}`);

    setDpTable(dp);
    setRowHeaders(rHeaders);
    setColHeaders(cHeaders);
    setMinOps(dp[1][n]);
    setParenthesization(getParens(1, n));
  };

  const definition = "The Matrix Chain Multiplication (MCM) problem determines the most efficient way to multiply a given sequence of matrices, finding an order that minimizes the total scalar multiplications.";
  const idea = "The state dp[i][j] stores the minimum scalar multiplications to multiply matrices from index i to j. For all intermediate split points k, we find the minimum split transition value.";
  const recurrence = "dp[i][j] = min(dp[i][k] + dp[k+1][j] + P[i-1]*P[k]*P[j])   for all k in [i, j-1]";
  const transition = "Splits the matrix chain into two sub-chains: matrices i..k and matrices k+1..j, summing subproblem costs plus the cost to multiply the two resulting matrices.";
  const pseudocode = `MatrixChainOrder(P):
  N = P.length - 1
  dp = 2D Array of size (N+1) x (N+1) filled with 0
  for l = 2..N: // chain length
    for i = 1..N-l+1:
      j = i + l - 1
      dp[i][j] = INF
      for k = i..j-1:
        cost = dp[i][k] + dp[k+1][j] + P[i-1]*P[k]*P[j]
        dp[i][j] = min(dp[i][j], cost)
  return dp[1][N]`;

  const applications = [
    "Evaluating optimal query plans in database engines.",
    "Order of operations code optimizations.",
    "Dynamic parsing algorithms."
  ];
  const mistakes = [
    "Looping lengths index offsets out of order, violating DP dependencies.",
    "Attempting to read off-diagonal elements before calculating subproblems."
  ];
  const cpTips = [
    "Standard MCM is a classic interval DP. If you see queries of the format 'merge adjacent elements with a cost', it is almost always isomorphic to MCM!"
  ];

  return (
    <DpLayout
      timeComplexity="O(N^3)"
      spaceComplexity="O(N^2) state space size"
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
              MCM Cost Grid (dp[i][j])
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <DpTableGrid
              table={dpTable}
              rowHeaders={rowHeaders}
              colHeaders={colHeaders}
            />

            {compared && minOps !== null && (
              <div className="border-t border-border/5 pt-3 space-y-2 font-mono text-xs text-left">
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Minimum Scalar Multiplications:</span>
                  <span className="font-bold text-emerald-500">{minOps} ops</span>
                </div>
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Optimal Parenthesization:</span>
                  <span className="font-bold text-primary">{parenthesization}</span>
                </div>
              </div>
            )}
            {error && <div className="text-xs text-rose-500 font-semibold font-mono">{error}</div>}
          </CardContent>
        </Card>
      }
    >
      <DpHeader
        title="Matrix Chain Multiplication"
        description="Compute optimal parenthesizations to minimize scalar multiplications."
        category="Algorithms"
        difficulty="Hard"
        shortcut="Alt+Shift+M"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <InputField label="Matrix Dimensions P (comma separated, length N+1)" value={dimsStr} onChange={setDimsStr} />

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Calculate Optimal MCM
          </Button>
        </CardContent>
      </Card>
    </DpLayout>
  );
}
