"use client";

import * as React from "react";
import { MxHeader } from "../../shared/mx-header";
import { MxLayout } from "../../shared/mx-layout";
import { MatrixInput } from "../../shared/matrix-input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { RotateCcw } from "lucide-react";

export function RankTool() {
  const [rows, setRows] = React.useState(3);
  const [cols, setCols] = React.useState(3);
  const [matrix, setMatrix] = React.useState<number[][]>([]);
  const [rank, setRank] = React.useState<number | null>(null);
  const [steps, setSteps] = React.useState<string[]>([]);
  const [compared, setCompared] = React.useState(false);

  const handleClear = () => {
    setRows(3);
    setCols(3);
    setMatrix([]);
    setRank(null);
    setSteps([]);
    setCompared(false);
  };

  const getRank = (mat: number[][]): { rank: number; trace: string[] } => {
    const R = mat.length;
    const C = mat[0]?.length || 0;
    const temp = mat.map((rowArr) => [...rowArr].map(Number));
    const trace: string[] = [];
    
    let rankCount = C;

    for (let r = 0; r < rankCount; r++) {
      // Find pivot
      if (Math.abs(temp[r]?.[r] || 0) > 1e-9) {
        for (let c = 0; c < R; c++) {
          if (c !== r) {
            const factor = temp[c][r] / temp[r][r];
            trace.push(`• Row ${c + 1} = Row ${c + 1} - (${factor.toFixed(2)}) × Row ${r + 1} to zero-out index [${c}][${r}]`);
            for (let i = r; i < C; i++) {
              temp[c][i] -= factor * temp[r][i];
            }
          }
        }
      } else {
        let reduce = true;
        for (let i = r + 1; i < R; i++) {
          if (Math.abs(temp[i]?.[r] || 0) > 1e-9) {
            // Swap rows
            const swap = temp[r];
            temp[r] = temp[i];
            temp[i] = swap;
            trace.push(`• Swap Row ${r + 1} with Row ${i + 1} to acquire non-zero pivot at [${r}][${r}]`);
            reduce = false;
            break;
          }
        }
        if (reduce) {
          rankCount--;
          trace.push(`• Column ${r} is linearly dependent. Reduce theoretical rank to ${rankCount}`);
          for (let i = 0; i < R; i++) {
            if (temp[i]) temp[i][r] = temp[i][rankCount];
          }
        }
        r--;
      }
    }

    return { rank: Math.min(rankCount, R), trace };
  };

  const handleEvaluate = () => {
    setCompared(true);
    const res = getRank(matrix);
    setRank(res.rank);
    setSteps(res.trace);
  };

  const definition = "The Rank of a matrix is the maximum number of linearly independent row (or column) vectors in the matrix. Calculated using Gaussian elimination.";
  const formula = "Row reduction to Row Echelon Form: count the number of non-zero rows after row operations.";
  const example = "For [[1, 2], [2, 4]]: R2 = R2 - 2*R1 results in [[1, 2], [0, 0]]. Non-zero rows: 1. Rank is 1.";
  const applications = [
    "Checking solutions existence in linear systems (Rouché-Capelli theorem).",
    "Dimensionality reductions.",
    "Bivector independence checking."
  ];
  const mistakes = [
    "Dividing by zero when pivots are close to zero thresholds.",
    "Not performing row swaps when pivot elements are zero."
  ];
  const cpTips = [
    "For binary matrices (GF(2) field arithmetic), row reduction can be implemented extremely fast in O(N^3 / 64) using `std::bitset` and XOR operators!"
  ];

  return (
    <MxLayout
      timeComplexity="O(R^2 * C)"
      spaceComplexity="O(R * C) copy grid"
      definition={definition}
      formula={formula}
      example={example}
      applications={applications}
      mistakes={mistakes}
      cpTips={cpTips}
      resultChild={
        compared && rank !== null && (
          <Card className="border-border/40 bg-card/65 shadow-xs font-sans text-left">
            <CardHeader className="pb-2 border-b border-border/10">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Rank Output
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 font-mono text-xs">
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground font-semibold">Matrix Rank:</span>
                <span className="font-bold text-emerald-500">{rank}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                  Gaussian Row Operations:
                </span>
                <div className="p-3 bg-muted/20 border border-border/10 rounded-lg max-h-48 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-1">
                  {steps.length > 0 ? steps.map((step, idx) => (
                    <div key={idx} className="text-foreground/80">{step}</div>
                  )) : <div className="text-muted-foreground">No row reduction steps needed.</div>}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      }
    >
      <MxHeader
        title="Matrix Rank Solver"
        description="Determine the rank of square or rectangular matrices using Gaussian row reduction steps."
        category="Operations"
        difficulty="Medium"
        shortcut="Alt+Shift+9"
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
          <div className="flex gap-4 items-center">
            <div className="space-y-1.5 max-w-[100px]">
              <label className="text-xs font-semibold text-foreground/80">Rows</label>
              <Select value={rows.toString()} onChange={(e) => { setRows(parseInt(e.target.value, 10)); setCompared(false); }}>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </Select>
            </div>
            <div className="space-y-1.5 max-w-[100px]">
              <label className="text-xs font-semibold text-foreground/80">Columns</label>
              <Select value={cols.toString()} onChange={(e) => { setCols(parseInt(e.target.value, 10)); setCompared(false); }}>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </Select>
            </div>
          </div>

          <MatrixInput rows={rows} cols={cols} value={matrix} onChange={(val) => { setMatrix(val); setCompared(false); }} />

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Calculate Matrix Rank
          </Button>
        </CardContent>
      </Card>
    </MxLayout>
  );
}
