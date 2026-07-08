"use client";

import * as React from "react";
import { MxHeader } from "../../shared/mx-header";
import { MxLayout } from "../../shared/mx-layout";
import { MatrixInput } from "../../shared/matrix-input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { RotateCcw } from "lucide-react";

export function DeterminantTool() {
  const [size, setSize] = React.useState(3);
  const [matrix, setMatrix] = React.useState<number[][]>([]);
  const [determinant, setDeterminant] = React.useState<number | null>(null);
  const [compared, setCompared] = React.useState(false);

  const handleClear = () => {
    setSize(3);
    setMatrix([]);
    setDeterminant(null);
    setCompared(false);
  };

  const getDet2x2 = (m: number[][]): number => {
    return m[0][0] * m[1][1] - m[0][1] * m[1][0];
  };

  const getDet3x3 = (m: number[][]): number => {
    return (
      m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
      m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
      m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
    );
  };

  const handleEvaluate = () => {
    setCompared(true);
    const n = matrix.length;

    if (n === 2) {
      setDeterminant(getDet2x2(matrix));
    } else if (n === 3) {
      setDeterminant(getDet3x3(matrix));
    } else {
      setDeterminant(null);
    }
  };

  const definition = "The Determinant is a scalar value calculated from a square matrix, summarizing properties of the linear transformation described by the matrix.";
  const formula = "2x2: ad - bc. 3x3: Cofactor expansion along the first row: a*det(A11) - b*det(A12) + c*det(A13).";
  const example = "For A = [[1, 2], [3, 4]]: det(A) = 1*4 - 2*3 = 4 - 6 = -2.";
  const applications = [
    "Checking if a matrix is invertible (det != 0).",
    "Solving systems of linear equations via Cramer's Rule.",
    "Computing area/volume of vector transformations."
  ];
  const mistakes = [
    "Sign errors when computing cofactor terms (+, -, + sequence).",
    "Attempting calculations on non-square matrices."
  ];
  const cpTips = [
    "For larger N x N matrices, compute the determinant efficiently in O(N^3) time by reducing the matrix to Upper Triangular Form using Gaussian Elimination; the determinant is then the product of the diagonal elements!"
  ];

  return (
    <MxLayout
      timeComplexity="O(N^3) via Gaussian, O(1) for N <= 3"
      spaceComplexity="O(1)"
      definition={definition}
      formula={formula}
      example={example}
      applications={applications}
      mistakes={mistakes}
      cpTips={cpTips}
      resultChild={
        compared && determinant !== null && (
          <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
            <CardHeader className="pb-2 border-b border-border/10">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Determinant Output
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 font-mono text-xs text-left">
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground font-semibold">Determinant (det A):</span>
                <span className={`font-bold ${determinant === 0 ? "text-rose-500" : "text-emerald-500"}`}>
                  {determinant}
                </span>
              </div>
              <div className="pt-2 text-[10px] text-muted-foreground/60 leading-relaxed font-sans">
                {determinant === 0 ? "⚠️ The matrix is singular (non-invertible)." : "✓ The matrix is invertible."}
              </div>
            </CardContent>
          </Card>
        )
      }
    >
      <MxHeader
        title="Matrix Determinant"
        description="Compute scalar determinants for square matrices of size 2x2 or 3x3."
        category="Operations"
        difficulty="Easy"
        shortcut="Alt+Shift+8"
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
          <div className="space-y-1.5 max-w-[100px]">
            <label className="text-xs font-semibold text-foreground/80">Matrix Size (N)</label>
            <Select value={size.toString()} onChange={(e) => { setSize(parseInt(e.target.value, 10)); setCompared(false); }}>
              <option value="2">2x2</option>
              <option value="3">3x3</option>
            </Select>
          </div>

          <MatrixInput rows={size} cols={size} value={matrix} onChange={(val) => { setMatrix(val); setCompared(false); }} />

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Calculate Determinant
          </Button>
        </CardContent>
      </Card>
    </MxLayout>
  );
}
