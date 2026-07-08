"use client";

import * as React from "react";
import { MxHeader } from "../../shared/mx-header";
import { MxLayout } from "../../shared/mx-layout";
import { MatrixInput } from "../../shared/matrix-input";
import { MatrixGrid } from "../../shared/matrix-grid";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { RotateCcw } from "lucide-react";

export function DiagonalTool() {
  const [rows, setRows] = React.useState(3);
  const [cols, setCols] = React.useState(3);
  const [mode, setMode] = React.useState<"primary" | "secondary" | "zigzag">("primary");

  const [matrix, setMatrix] = React.useState<number[][]>([]);
  const [traversed, setTraversed] = React.useState<number[]>([]);
  const [cellPath, setCellPath] = React.useState<string[]>([]);
  const [compared, setCompared] = React.useState(false);

  const handleClear = () => {
    setRows(3);
    setCols(3);
    setMatrix([]);
    setTraversed([]);
    setCellPath([]);
    setCompared(false);
  };

  const handleEvaluate = () => {
    setCompared(true);
    const R = matrix.length;
    const C = matrix[0]?.length || 0;
    const vals: number[] = [];
    const path: string[] = [];

    if (mode === "primary") {
      const len = Math.min(R, C);
      for (let i = 0; i < len; i++) {
        vals.push(matrix[i][i]);
        path.push(`${i},${i}`);
      }
    } else if (mode === "secondary") {
      const len = Math.min(R, C);
      for (let i = 0; i < len; i++) {
        vals.push(matrix[i][C - 1 - i]);
        path.push(`${i},${C - 1 - i}`);
      }
    } else {
      // Zigzag traversal
      // Total diagonals count = R + C - 1
      for (let k = 0; k < R + C - 1; k++) {
        if (k % 2 === 0) {
          // Upward traversal
          let r = Math.min(k, R - 1);
          let c = k - r;
          while (r >= 0 && c < C) {
            vals.push(matrix[r][c]);
            path.push(`${r},${c}`);
            r--;
            c++;
          }
        } else {
          // Downward traversal
          let c = Math.min(k, C - 1);
          let r = k - c;
          while (r < R && c >= 0) {
            vals.push(matrix[r][c]);
            path.push(`${r},${c}`);
            r++;
            c--;
          }
        }
      }
    }

    setTraversed(vals);
    setCellPath(path);
  };

  const definition = "Diagonal traversal visits matrix elements along diagonal lines. Types include the main diagonal (top-left to bottom-right), anti-diagonal (top-right to bottom-left), and zigzag order.";
  const formula = "Zigzag: cells satisfy r + c = k. Alternating parity of k determines upward/downward traversal vectors.";
  const example = "For a 3x3 main diagonal: indices are (0,0), (1,1), (2,2). Anti-diagonal: (0,2), (1,1), (2,0).";
  const applications = [
    "Zigzag jpeg compression encoding patterns.",
    "Matrix coordinate transforms.",
    "Grid pathfinders boundary checks."
  ];
  const mistakes = [
    "Out of bounds index sweeps in zigzag loops.",
    "Incorrect index mappings for rectangular matrices."
  ];
  const cpTips = [
    "Notice that all cells on the same diagonal parallel to the anti-diagonal have the constant sum value: `row + col = const`. We can collect them in a list of buckets indexed by `row + col`!"
  ];

  return (
    <MxLayout
      timeComplexity="O(R * C)"
      spaceComplexity="O(R * C) traversal buffer"
      definition={definition}
      formula={formula}
      example={example}
      applications={applications}
      mistakes={mistakes}
      cpTips={cpTips}
      resultChild={
        compared && traversed.length > 0 && (
          <Card className="border-border/40 bg-card/65 shadow-xs font-sans text-left">
            <CardHeader className="pb-2 border-b border-border/10">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Traversal Results
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-center">
                <MatrixGrid matrix={matrix} highlightedCells={cellPath} />
              </div>

              <div className="space-y-1 font-mono text-xs">
                <span className="text-muted-foreground font-semibold">Traversal Output List:</span>
                <div className="p-3 bg-muted/20 border border-border/10 rounded-lg max-h-36 overflow-y-auto font-mono text-[11px] leading-relaxed break-all">
                  {traversed.join(", ")}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      }
    >
      <MxHeader
        title="Diagonal Traversal"
        description="Traverse square or rectangular matrices along primary, secondary, or zigzag diagonal lines."
        category="Algorithms"
        difficulty="Easy"
        shortcut="Alt+Shift+D"
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
          <div className="flex flex-wrap gap-4 items-center">
            <div className="space-y-1.5 max-w-[80px]">
              <label className="text-xs font-semibold text-foreground/80">Rows</label>
              <Select value={rows.toString()} onChange={(e) => { setRows(parseInt(e.target.value, 10)); setCompared(false); }}>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </Select>
            </div>
            <div className="space-y-1.5 max-w-[80px]">
              <label className="text-xs font-semibold text-foreground/80">Columns</label>
              <Select value={cols.toString()} onChange={(e) => { setCols(parseInt(e.target.value, 10)); setCompared(false); }}>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </Select>
            </div>
            <div className="space-y-1.5 max-w-[150px]">
              <label className="text-xs font-semibold text-foreground/80">Diagonal Mode</label>
              <Select value={mode} onChange={(e) => { setMode(e.target.value as any); setCompared(false); }}>
                <option value="primary">Primary Diagonal</option>
                <option value="secondary">Secondary Diagonal</option>
                <option value="zigzag">Zigzag Diagonal</option>
              </Select>
            </div>
          </div>

          <MatrixInput rows={rows} cols={cols} value={matrix} onChange={(val) => { setMatrix(val); setCompared(false); }} />

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Run Diagonal Traversal
          </Button>
        </CardContent>
      </Card>
    </MxLayout>
  );
}
