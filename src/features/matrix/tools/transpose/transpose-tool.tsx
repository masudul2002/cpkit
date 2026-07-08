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

export function TransposeTool() {
  const [rows, setRows] = React.useState(3);
  const [cols, setCols] = React.useState(3);
  const [matrix, setMatrix] = React.useState<number[][]>([]);
  const [transposed, setTransposed] = React.useState<number[][]>([]);
  const [compared, setCompared] = React.useState(false);

  const handleClear = () => {
    setRows(3);
    setCols(3);
    setMatrix([]);
    setTransposed([]);
    setCompared(false);
  };

  const handleEvaluate = () => {
    setCompared(true);
    const r = matrix.length;
    const c = matrix[0]?.length || 0;

    // Initialize transpose matrix dp[c][r]
    const nextMat = Array.from({ length: c }, () => new Array(r).fill(0));

    for (let i = 0; i < r; i++) {
      for (let j = 0; j < c; j++) {
        nextMat[j][i] = matrix[i][j];
      }
    }
    setTransposed(nextMat);
  };

  const definition = "Matrix transposition flips a matrix over its main diagonal, switching the row and column indices of the matrix.";
  const formula = "Transpose: B[i][j] = A[j][i] where matrix A is of size R x C, and transpose B is of size C x R.";
  const example = "Transposing a 2x3 matrix turns it into a 3x2 matrix. Row 1 becomes Column 1.";
  const applications = [
    "Simplifying 2D matrix dynamic programming transitions.",
    "Fast calculations of column sums.",
    "Linear transformations matrices."
  ];
  const mistakes = [
    "Forgetting that rows and columns swap dimensions for rectangular inputs.",
    "Index out of bounds error when initializing transposed matrix loops."
  ];
  const cpTips = [
    "To optimize cache efficiency in competitive programming when querying column elements, transpose the matrix beforehand so queries run along sequential row addresses."
  ];

  return (
    <MxLayout
      timeComplexity="O(R * C)"
      spaceComplexity="O(R * C) transposed buffer"
      definition={definition}
      formula={formula}
      example={example}
      applications={applications}
      mistakes={mistakes}
      cpTips={cpTips}
      resultChild={
        compared && transposed.length > 0 && (
          <Card className="border-border/40 bg-card/65 shadow-xs">
            <CardHeader className="pb-2 border-b border-border/10">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Transposed Matrix Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex justify-center">
              <MatrixGrid matrix={transposed} />
            </CardContent>
          </Card>
        )
      }
    >
      <MxHeader
        title="Matrix Transpose"
        description="Flipped reflection of row and column indexes for square or rectangular matrices."
        category="Operations"
        difficulty="Easy"
        shortcut="Alt+Shift+2"
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
        <CardContent className="p-6 space-y-4 font-sans">
          <div className="flex gap-4 items-center">
            <div className="space-y-1.5 max-w-[100px]">
              <label className="text-xs font-semibold text-foreground/80">Rows</label>
              <Select value={rows.toString()} onChange={(e) => { setRows(parseInt(e.target.value, 10)); setCompared(false); }}>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </Select>
            </div>
            <div className="space-y-1.5 max-w-[100px]">
              <label className="text-xs font-semibold text-foreground/80">Columns</label>
              <Select value={cols.toString()} onChange={(e) => { setCols(parseInt(e.target.value, 10)); setCompared(false); }}>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </Select>
            </div>
          </div>

          <MatrixInput
            rows={rows}
            cols={cols}
            value={matrix}
            onChange={(val) => {
              setMatrix(val);
              setCompared(false);
            }}
          />

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Transpose Matrix
          </Button>
        </CardContent>
      </Card>
    </MxLayout>
  );
}
