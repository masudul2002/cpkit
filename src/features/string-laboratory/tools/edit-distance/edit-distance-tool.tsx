"use client";

import * as React from "react";
import { StHeader } from "../../shared/st-header";
import { StLayout } from "../../shared/st-layout";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export function EditDistanceTool() {
  const [valA, setValA] = React.useState("cat");
  const [valB, setValB] = React.useState("cut");

  const [compared, setCompared] = React.useState(false);
  const [distance, setDistance] = React.useState(0);
  const [dpGrid, setDpGrid] = React.useState<number[][]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handleClear = () => {
    setValA("");
    setValB("");
    setCompared(false);
    setDpGrid([]);
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

    // dp[N + 1][M + 1]
    const dp = Array.from({ length: N + 1 }, () => new Array(M + 1).fill(0));

    for (let i = 0; i <= N; i++) dp[i][0] = i;
    for (let j = 0; j <= M; j++) dp[0][j] = j;

    for (let i = 1; i <= N; i++) {
      for (let j = 1; j <= M; j++) {
        if (valA[i - 1] === valB[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = 1 + Math.min(
            dp[i - 1][j], // Delete
            dp[i][j - 1], // Insert
            dp[i - 1][j - 1] // Replace
          );
        }
      }
    }

    setDistance(dp[N][M]);
    setDpGrid(dp);
  };

  const definition = "Edit Distance calculates the minimum number of character operations (inserts, deletes, or substitutions) needed to transform string A into string B.";
  const formula = "DP formula: dp[i][j] = dp[i-1][j-1] if A[i-1] == B[j-1] else 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]).";
  const example = "For 'cat' to 'cut': change 'a' to 'u' (1 replacement operation). Edit distance is 1.";
  const applications = [
    "Spelling autocorrection solvers.",
    "Levenshtein distance estimations.",
    "DNA sequence alignments."
  ];
  const mistakes = [
    "Incorrect index offsets when initialising boundary base-cases (0 to N).",
    "Failing to handle string updates when base cases are zero."
  ];
  const cpTips = [
    "For space optimization in competitive programming, note that computing the edit distance only requires the current and previous rows, reducing auxiliary space to O(min(N, M))."
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
                Edit Distance DP Table
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-xs font-mono text-left">
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground font-semibold">Total Operations (Levenshtein):</span>
                <span className="font-bold text-emerald-500">{distance}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                  DP Transitions Grid:
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
                            const isAnswer = i === valA.length && j === valB.length;
                            return (
                              <td
                                key={j}
                                className={`p-2 border-r border-border/10 ${
                                  isAnswer ? "bg-emerald-500/25 border border-emerald-500 font-extrabold text-emerald-400" : "text-foreground/80"
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
        title="Edit Distance (Levenshtein)"
        description="Calculate the minimum character operations to transform string A to string B, drawing the complete DP table."
        category="Dynamic Programming"
        difficulty="Medium"
        shortcut="Alt+Shift+D"
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
              label="Source String (A)"
              value={valA}
              onChange={(val) => {
                setValA(val);
                setCompared(false);
              }}
              error={error || undefined}
            />
            <InputField
              label="Target String (B)"
              value={valB}
              onChange={(val) => {
                setValB(val);
                setCompared(false);
              }}
            />
          </div>
          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Calculate Edit Distance
          </Button>
        </CardContent>
      </Card>
    </StLayout>
  );
}
