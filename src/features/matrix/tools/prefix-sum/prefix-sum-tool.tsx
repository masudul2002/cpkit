"use client";

import * as React from "react";
import { MxHeader } from "../../shared/mx-header";
import { MxLayout } from "../../shared/mx-layout";
import { MatrixInput } from "../../shared/matrix-input";
import { MatrixGrid } from "../../shared/matrix-grid";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { RotateCcw } from "lucide-react";

export function PrefixSumTool() {
  const [rows, setRows] = React.useState(3);
  const [cols, setCols] = React.useState(3);
  const [matrix, setMatrix] = React.useState<number[][]>([]);
  const [prefixMat, setPrefixMat] = React.useState<number[][]>([]);

  // Query coords (1-based index)
  const [r1, setR1] = React.useState("1");
  const [c1, setC1] = React.useState("1");
  const [r2, setR2] = React.useState("2");
  const [c2, setC2] = React.useState("2");

  const [compared, setCompared] = React.useState(false);
  const [querySum, setQuerySum] = React.useState<number | null>(null);
  const [highlightedCells, setHighlightedCells] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handleClear = () => {
    setRows(3);
    setCols(3);
    setMatrix([]);
    setPrefixMat([]);
    setR1("1");
    setC1("1");
    setR2("2");
    setC2("2");
    setCompared(false);
    setQuerySum(null);
    setHighlightedCells([]);
    setError(null);
  };

  const handleEvaluate = () => {
    setError(null);
    setCompared(false);
    setQuerySum(null);
    setHighlightedCells([]);

    const R = matrix.length;
    const C = matrix[0]?.length || 0;

    // 1. Calculate 2D Prefix Sum (1-based mapping inside a (R+1)x(C+1) grid)
    const pref = Array.from({ length: R + 1 }, () => new Array(C + 1).fill(0));
    for (let i = 1; i <= R; i++) {
      for (let j = 1; j <= C; j++) {
        const val = matrix[i - 1][j - 1] || 0;
        pref[i][j] = pref[i - 1][j] + pref[i][j - 1] - pref[i - 1][j - 1] + val;
      }
    }

    // Slice prefix sum matrix (without the 0th index rows/columns) to show to users
    const displayPref = pref.slice(1).map((rowArr) => rowArr.slice(1));
    setPrefixMat(displayPref);

    // 2. Validate range query bounds
    const row1 = parseInt(r1, 10);
    const col1 = parseInt(c1, 10);
    const row2 = parseInt(r2, 10);
    const col2 = parseInt(c2, 10);

    if (isNaN(row1) || isNaN(col1) || isNaN(row2) || isNaN(col2)) {
      setError("Please enter valid positive integer coordinates");
      return;
    }

    if (row1 < 1 || row2 > R || col1 < 1 || col2 > C || row2 < row1 || col2 < col1) {
      setError(`Coordinates must satisfy: 1 <= r1 <= r2 <= ${R} and 1 <= c1 <= c2 <= ${C}`);
      return;
    }

    setCompared(true);

    // Calculate sum using 2D prefix formulas
    const sum = pref[row2][col2] - pref[row1 - 1][col2] - pref[row2][col1 - 1] + pref[row1 - 1][col1 - 1];
    setQuerySum(sum);

    // Collect query region cells list to highlight them in the grid!
    const highlights: string[] = [];
    for (let r = row1 - 1; r < row2; r++) {
      for (let c = col1 - 1; c < col2; c++) {
        highlights.push(`${r},${c}`);
      }
    }
    setHighlightedCells(highlights);
  };

  const definition = "2D Prefix Sum precalculates region totals such that any subgrid sum query is evaluated in O(1) constant time, avoiding double loops.";
  const formula = "Precompute: P[i][j] = P[i-1][j] + P[i][j-1] - P[i-1][j-1] + A[i-1][j-1]. Query: Sum = P[r2][c2] - P[r1-1][c2] - P[r2][c1-1] + P[r1-1][c1-1]";
  const example = "For a 3x3 matrix of 1s: Prefix Sum cell (2,2) represents subgrid sum of 1s up to index (2,2) = 4.";
  const applications = [
    "Subgrid range sum queries.",
    "Max sum subgrid queries (Kadane 2D).",
    "Integral image calculations in graphics."
  ];
  const mistakes = [
    "Using incorrect 0-based offsets without adjusting subtraction boundaries, resulting in off-by-one sums.",
    "Not handling coordinate index flips (e.g. r2 < r1)."
  ];
  const cpTips = [
    "2D prefix sums are extremely common for range query optimization. Always declare the prefix array with size `(R + 1) * (C + 1)` to easily handle the boundary base cases without nested checks."
  ];

  return (
    <MxLayout
      timeComplexity="O(R * C) build, O(1) query"
      spaceComplexity="O(R * C) prefix grid"
      definition={definition}
      formula={formula}
      example={example}
      applications={applications}
      mistakes={mistakes}
      cpTips={cpTips}
      resultChild={
        compared && prefixMat.length > 0 && (
          <Card className="border-border/40 bg-card/65 shadow-xs font-sans text-left">
            <CardHeader className="pb-2 border-b border-border/10">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Prefix Results & Queries
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <span className="text-xs font-bold text-muted-foreground block mb-2 font-mono">2D Prefix Sum Matrix:</span>
                <div className="flex justify-center">
                  <MatrixGrid matrix={prefixMat} />
                </div>
              </div>

              {querySum !== null && (
                <div className="space-y-2 border-t border-border/5 pt-3">
                  <div className="flex justify-between font-mono text-xs">
                    <span className="text-muted-foreground">Subgrid Sum [{r1},{c1}] to [{r2},{c2}]:</span>
                    <span className="font-bold text-emerald-500">{querySum}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block font-mono">
                      Query Calculations:
                    </span>
                    <div className="p-3 bg-muted/20 border border-border/10 rounded-lg font-mono text-[11px] leading-relaxed">
                      Sum = P[{r2}][{c2}] - P[{parseInt(r1)-1}][{c2}] - P[{r2}][{parseInt(c1)-1}] + P[{parseInt(r1)-1}][{parseInt(c1)-1}]
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-muted-foreground block mb-2 font-mono">Queried Region Highlighted:</span>
                    <div className="flex justify-center">
                      <MatrixGrid matrix={matrix} highlightedCells={highlightedCells} />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )
      }
    >
      <MxHeader
        title="Prefix Sum Matrix"
        description="Precompute subgrid sums for O(1) range queries and visualize regions."
        category="Algorithms"
        difficulty="Medium"
        shortcut="Alt+Shift+6"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
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
        <CardContent className="p-6 space-y-4 text-left">
          {/* Dimension configs */}
          <div className="flex gap-4 items-center">
            <div className="space-y-1.5 max-w-[80px]">
              <label className="text-xs font-semibold text-foreground/80">Rows</label>
              <Select value={rows.toString()} onChange={(e) => { setRows(parseInt(e.target.value, 10)); setCompared(false); }}>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </Select>
            </div>
            <div className="space-y-1.5 max-w-[80px]">
              <label className="text-xs font-semibold text-foreground/80">Columns</label>
              <Select value={cols.toString()} onChange={(e) => { setCols(parseInt(e.target.value, 10)); setCompared(false); }}>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </Select>
            </div>
          </div>

          <MatrixInput rows={rows} cols={cols} value={matrix} onChange={(val) => { setMatrix(val); setCompared(false); }} />

          {/* Subgrid coordinates queries */}
          <div className="border-t border-border/10 pt-3 space-y-3">
            <span className="text-xs font-bold text-foreground/80 block">Subgrid Range Query Bounds (1-based index)</span>
            <div className="grid gap-4 grid-cols-4">
              <InputField label="Row 1 (r1)" value={r1} onChange={(val) => { setR1(val); setCompared(false); }} />
              <InputField label="Col 1 (c1)" value={c1} onChange={(val) => { setC1(val); setCompared(false); }} />
              <InputField label="Row 2 (r2)" value={r2} onChange={(val) => { setR2(val); setCompared(false); }} />
              <InputField label="Col 2 (c2)" value={c2} onChange={(val) => { setC2(val); setCompared(false); }} />
            </div>
          </div>

          {error && <div className="text-xs text-rose-500 font-semibold font-mono">{error}</div>}

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Build & Query Prefix Sums
          </Button>
        </CardContent>
      </Card>
    </MxLayout>
  );
}
