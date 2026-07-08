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

export function SpiralTool() {
  const [rows, setRows] = React.useState(3);
  const [cols, setCols] = React.useState(3);
  const [direction, setDirection] = React.useState<"cw" | "ccw">("cw");

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

  const getSpiralCw = (mat: number[][]): { vals: number[]; path: string[] } => {
    const R = mat.length;
    const C = mat[0]?.length || 0;
    const vals: number[] = [];
    const path: string[] = [];

    let top = 0;
    let bottom = R - 1;
    let left = 0;
    let right = C - 1;

    while (top <= bottom && left <= right) {
      // 1. Left to right
      for (let c = left; c <= right; c++) {
        vals.push(mat[top][c]);
        path.push(`${top},${c}`);
      }
      top++;

      // 2. Top to bottom
      for (let r = top; r <= bottom; r++) {
        vals.push(mat[r][right]);
        path.push(`${r},${right}`);
      }
      right--;

      // 3. Right to left
      if (top <= bottom) {
        for (let c = right; c >= left; c--) {
          vals.push(mat[bottom][c]);
          path.push(`${bottom},${c}`);
        }
        bottom--;
      }

      // 4. Bottom to top
      if (left <= right) {
        for (let r = bottom; r >= top; r--) {
          vals.push(mat[r][left]);
          path.push(`${r},${left}`);
        }
        left++;
      }
    }

    return { vals, path };
  };

  const getSpiralCcw = (mat: number[][]): { vals: number[]; path: string[] } => {
    const R = mat.length;
    const C = mat[0]?.length || 0;
    const vals: number[] = [];
    const path: string[] = [];

    let top = 0;
    let bottom = R - 1;
    let left = 0;
    let right = C - 1;

    while (top <= bottom && left <= right) {
      // 1. Top to bottom on left
      for (let r = top; r <= bottom; r++) {
        vals.push(mat[r][left]);
        path.push(`${r},${left}`);
      }
      left++;

      // 2. Left to right on bottom
      for (let c = left; c <= right; c++) {
        vals.push(mat[bottom][c]);
        path.push(`${bottom},${c}`);
      }
      bottom--;

      // 3. Bottom to top on right
      if (left <= right) {
        for (let r = bottom; r >= top; r--) {
          vals.push(mat[r][right]);
          path.push(`${r},${right}`);
        }
        right--;
      }

      // 4. Right to left on top
      if (top <= bottom) {
        for (let c = right; c >= left; c--) {
          vals.push(mat[top][c]);
          path.push(`${top},${c}`);
        }
        top++;
      }
    }

    return { vals, path };
  };

  const handleEvaluate = () => {
    setCompared(true);
    if (direction === "cw") {
      const res = getSpiralCw(matrix);
      setTraversed(res.vals);
      setCellPath(res.path);
    } else {
      const res = getSpiralCcw(matrix);
      setTraversed(res.vals);
      setCellPath(res.path);
    }
  };

  const definition = "Spiral traversal visits all matrix elements in a winding circular path, moving inwards from outer boundaries.";
  const formula = "Iteratively shrink bounding coordinates: top++, right--, bottom--, left++ after sweeping each edge.";
  const example = "For a 3x3 matrix: Clockwise spiral index sweep: (0,0)->(0,1)->(0,2)->(1,2)->(2,2)->(2,1)->(2,0)->(1,0)->(1,1).";
  const applications = [
    "Image pixels cropping cycles.",
    "Grid pathfinding constraints.",
    "Matrix restructuring converters."
  ];
  const mistakes = [
    "Double visiting cells at boundary overlaps.",
    "Infinite loops if boundary constraints fail to contract correctly."
  ];
  const cpTips = [
    "Always check whether `top <= bottom` and `left <= right` conditions are still met before traversing backward boundaries to avoid duplicate reads."
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
                Spiral Results
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
        title="Spiral Traversal"
        description="Traverse square or rectangular matrices spirally clockwise or counter-clockwise."
        category="Algorithms"
        difficulty="Easy"
        shortcut="Alt+Shift+H"
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
            <div className="space-y-1.5 max-w-[140px]">
              <label className="text-xs font-semibold text-foreground/80">Direction</label>
              <Select value={direction} onChange={(e) => { setDirection(e.target.value as any); setCompared(false); }}>
                <option value="cw">Clockwise</option>
                <option value="ccw">Counter-Clockwise</option>
              </Select>
            </div>
          </div>

          <MatrixInput rows={rows} cols={cols} value={matrix} onChange={(val) => { setMatrix(val); setCompared(false); }} />

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Run Spiral Traversal
          </Button>
        </CardContent>
      </Card>
    </MxLayout>
  );
}
