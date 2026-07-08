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

export function MultiplicationTool() {
  const [rowsA, setRowsA] = React.useState(2);
  const [colsA, setColsA] = React.useState(3);
  const [rowsB, setRowsB] = React.useState(3);
  const [colsB, setColsB] = React.useState(2);

  const [matrixA, setMatrixA] = React.useState<number[][]>([]);
  const [matrixB, setMatrixB] = React.useState<number[][]>([]);
  const [result, setResult] = React.useState<number[][]>([]);
  const [steps, setSteps] = React.useState<string[]>([]);

  const [compared, setCompared] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleClear = () => {
    setRowsA(2);
    setColsA(3);
    setRowsB(3);
    setColsB(2);
    setMatrixA([]);
    setMatrixB([]);
    setResult([]);
    setSteps([]);
    setCompared(false);
    setError(null);
  };

  const handleEvaluate = () => {
    setError(null);
    setCompared(false);
    setSteps([]);

    if (colsA !== rowsB) {
      setError(`Dimension Compatibility Error: Cols of A (${colsA}) must equal Rows of B (${rowsB}).`);
      return;
    }

    setCompared(true);
    const R = rowsA;
    const C = colsB;
    const common = colsA;

    // Initialize result C[R][C]
    const nextMat = Array.from({ length: R }, () => new Array(C).fill(0));
    const trace: string[] = [];

    for (let i = 0; i < R; i++) {
      for (let j = 0; j < C; j++) {
        let sum = 0;
        const terms: string[] = [];
        for (let k = 0; k < common; k++) {
          const valA = matrixA[i][k] || 0;
          const valB = matrixB[k][j] || 0;
          sum += valA * valB;
          terms.push(`(${valA} × ${valB})`);
        }
        nextMat[i][j] = sum;
        trace.push(`• C[${i}][${j}] = ${terms.join(" + ")} = ${sum}`);
      }
    }

    setResult(nextMat);
    setSteps(trace);
  };

  const definition = "Matrix multiplication multiplies rows of matrix A by columns of matrix B. The number of columns in A must equal the number of rows in B.";
  const formula = "C[i][j] = sum(A[i][k] * B[k][j]) for k = 0..commonDim-1. Result matrix is of size R_A x C_B.";
  const example = "Multiplying 2x3 by 3x2 matrices results in a 2x2 matrix, matching columns/rows dimensions.";
  const applications = [
    "Matrix exponentiation for fast DP recurrence solver.",
    "Graph paths count mappings.",
    "Linear transformation transformations."
  ];
  const mistakes = [
    "Trying to multiply matrices with incompatible shapes (e.g., Cols A != Rows B).",
    "Off-by-one errors during inner product sums loops."
  ];
  const cpTips = [
    "Fast matrix multiplication is a staple in CP for solving linear recurrences (like finding the N-th Fibonacci number in O(log N) time) using binary matrix power loops."
  ];

  return (
    <MxLayout
      timeComplexity="O(R_A * C_A * C_B)"
      spaceComplexity="O(R_A * C_B) result buffer"
      definition={definition}
      formula={formula}
      example={example}
      applications={applications}
      mistakes={mistakes}
      cpTips={cpTips}
      resultChild={
        compared && result.length > 0 && (
          <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
            <CardHeader className="pb-2 border-b border-border/10">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Product Matrix C Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-center">
                <MatrixGrid matrix={result} />
              </div>
              
              <div className="space-y-1 text-left">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block font-mono">
                  Inner Product Computations:
                </span>
                <div className="p-3 bg-muted/20 border border-border/10 rounded-lg max-h-48 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-1">
                  {steps.map((step, idx) => (
                    <div key={idx} className="text-foreground/80">{step}</div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      }
    >
      <MxHeader
        title="Matrix Multiplication"
        description="Multiply matrix A by matrix B and trace the cell-by-cell dot products."
        category="Operations"
        difficulty="Easy"
        shortcut="Alt+Shift+4"
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
        <CardContent className="p-6 space-y-6 text-left">
          {/* Dimension configs */}
          <div className="flex flex-wrap gap-4 items-center border-b border-border/10 pb-4">
            <div className="space-y-3">
              <span className="text-[10px] font-extrabold uppercase text-muted-foreground tracking-wider block">Matrix A Shape</span>
              <div className="flex gap-2">
                <Select value={rowsA.toString()} onChange={(e) => { setRowsA(parseInt(e.target.value, 10)); setCompared(false); }}>
                  <option value="2">2 Rows</option>
                  <option value="3">3 Rows</option>
                  <option value="4">4 Rows</option>
                </Select>
                <Select value={colsA.toString()} onChange={(e) => { setColsA(parseInt(e.target.value, 10)); setCompared(false); }}>
                  <option value="2">2 Cols</option>
                  <option value="3">3 Cols</option>
                  <option value="4">4 Cols</option>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-extrabold uppercase text-muted-foreground tracking-wider block">Matrix B Shape</span>
              <div className="flex gap-2">
                <Select value={rowsB.toString()} onChange={(e) => { setRowsB(parseInt(e.target.value, 10)); setCompared(false); }}>
                  <option value="2">2 Rows</option>
                  <option value="3">3 Rows</option>
                  <option value="4">4 Rows</option>
                </Select>
                <Select value={colsB.toString()} onChange={(e) => { setColsB(parseInt(e.target.value, 10)); setCompared(false); }}>
                  <option value="2">2 Cols</option>
                  <option value="3">3 Cols</option>
                  <option value="4">4 Cols</option>
                </Select>
              </div>
            </div>
          </div>

          {/* Matrix input fields */}
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-foreground/80 block mb-1">Matrix A Inputs</span>
              <MatrixInput rows={rowsA} cols={colsA} value={matrixA} onChange={(val) => { setMatrixA(val); setCompared(false); }} />
            </div>

            <div>
              <span className="text-xs font-bold text-foreground/80 block mb-1">Matrix B Inputs</span>
              <MatrixInput rows={rowsB} cols={colsB} value={matrixB} onChange={(val) => { setMatrixB(val); setCompared(false); }} />
            </div>
          </div>

          {error && <div className="text-xs text-rose-500 font-semibold font-mono">{error}</div>}

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Multiply Matrices
          </Button>
        </CardContent>
      </Card>
    </MxLayout>
  );
}
