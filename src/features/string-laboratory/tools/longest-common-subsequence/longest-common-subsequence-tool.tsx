"use client";

import * as React from "react";
import { StHeader } from "../../shared/st-header";
import { StLayout } from "../../shared/st-layout";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export function LcsTool() {
  const [valA, setValA] = React.useState("abaaz");
  const [valB, setValB] = React.useState("aabz");

  const [compared, setCompared] = React.useState(false);
  const [lcsString, setLcsString] = React.useState("");
  const [dpGrid, setDpGrid] = React.useState<number[][]>([]);
  const [backtrackCells, setBacktrackCells] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handleClear = () => {
    setValA("");
    setValB("");
    setCompared(false);
    setDpGrid([]);
    setLcsString("");
    setBacktrackCells([]);
    setError(null);
  };

  const handleEvaluate = () => {
    setError(null);
    setCompared(false);

    if (valA.length > 12 || valB.length > 12) {
      setError("Please limit string lengths to 12 characters to prevent visual overflows in the DP table.");
      return;
    }

    if (valA.length === 0 || valB.length === 0) {
      setError("Please enter non-empty strings");
      return;
    }

    setCompared(true);
    const N = valA.length;
    const M = valB.length;

    const dp = Array.from({ length: N + 1 }, () => new Array(M + 1).fill(0));

    for (let i = 1; i <= N; i++) {
      for (let j = 1; j <= M; j++) {
        if (valA[i - 1] === valB[j - 1]) {
          dp[i][j] = 1 + dp[i - 1][j - 1];
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    // Backtrack to collect LCS string & trace cell indexes
    let i = N;
    let j = M;
    let lcsArr: string[] = [];
    const cells: string[] = [];

    while (i > 0 && j > 0) {
      cells.push(`${i},${j}`);
      if (valA[i - 1] === valB[j - 1]) {
        lcsArr.push(valA[i - 1]);
        i--;
        j--;
      } else if (dp[i - 1][j] >= dp[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }

    setLcsString(lcsArr.reverse().join(""));
    setDpGrid(dp);
    setBacktrackCells(cells);
  };

  const definition = "Longest Common Subsequence (LCS) finds the longest subsequence present in both strings in the same relative order, but not necessarily contiguously.";
  const formula = "DP: dp[i][j] = 1 + dp[i-1][j-1] if A[i-1] == B[j-1] else max(dp[i-1][j], dp[i][j-1]).";
  const example = "For 'abaaz' and 'aabz': LCS is 'aabz' (length 4).";
  const applications = [
    "Diff comparison utility engines (file differences comparisons).",
    "Bioinformatics DNA matching.",
    "Revision control commits trackers."
  ];
  const mistakes = [
    "Incorrect grid indexes matching leading to off-by-one errors.",
    "Assuming substring contiguity (which belongs to Longest Common Substring!)."
  ];
  const cpTips = [
    "To trace the actual LCS string, start backtracking from dp[N][M] and match diagonally when characters are equal."
  ];

  return (
    <StLayout
      timeComplexity="O(N * M)"
      spaceComplexity="O(N * M)"
      definition={definition}
      formula={formula}
      example={example}
      applications={applications}
      mistakes={mistakes}
      cpTips={cpTips}
      resultChild={
        compared && dpGrid.length > 0 && (
          <Card className="border-border/40 bg-card/65 shadow-xs">
            <CardHeader className="pb-2 border-b border-border/10">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                LCS DP Table & Path
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-xs font-mono text-left">
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground font-semibold">LCS Result:</span>
                <span className="font-bold text-emerald-500">
                  {lcsString ? `"${lcsString}"` : "[no common subsequence]"}
                </span>
              </div>
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground">LCS Length:</span>
                <span className="font-bold text-foreground">{lcsString.length}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                  DP Table (Highlighted Backtrack Path):
                </span>
                <div className="overflow-x-auto border border-border/40 rounded-lg bg-background/25">
                  <table className="w-full text-center border-collapse">
                    <thead>
                      <tr className="bg-muted/80 text-muted-foreground font-bold text-[10px]">
                        <th className="p-2 border-r border-b border-border/10">dp</th>
                        <th className="p-2 border-r border-b border-border/10">∅</th>
                        {valB.split("").map((c, idx) => (
                          <th key={idx} className="p-2 border-r border-b border-border/10">{c}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dpGrid.map((row, i) => (
                        <tr key={i} className="hover:bg-accent/10 border-b border-border/10 transition-colors">
                          <td className="p-2 border-r border-border/10 bg-muted/30 font-bold">
                            {i === 0 ? "∅" : valA[i - 1]}
                          </td>
                          {row.map((val, j) => {
                            const isPath = backtrackCells.includes(`${i},${j}`);
                            return (
                              <td
                                key={j}
                                className={`p-2 border-r border-border/10 ${
                                  isPath ? "bg-emerald-500/20 border border-emerald-500 text-emerald-400 font-bold" : "text-foreground/80"
                                }`}
                              >
                                {val}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      }
    >
      <StHeader
        title="Longest Common Subsequence"
        description="Compute the longest common subsequence of two strings and trace the DP backtracking path."
        category="Dynamic Programming"
        difficulty="Medium"
        shortcut="Alt+Shift+C"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs">
        <CardHeader className="flex flex-row justify-between items-center pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="h-7 w-7 p-0 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              label="String A"
              value={valA}
              onChange={(val) => {
                setValA(val);
                setCompared(false);
              }}
              error={error || undefined}
            />
            <InputField
              label="String B"
              value={valB}
              onChange={(val) => {
                setValB(val);
                setCompared(false);
              }}
            />
          </div>
          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Calculate LCS
          </Button>
        </CardContent>
      </Card>
    </StLayout>
  );
}
