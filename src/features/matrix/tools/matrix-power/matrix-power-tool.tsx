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

export function MatrixPowerTool() {
  const [size, setSize] = React.useState(2);
  const [exponent, setExponent] = React.useState("5");
  const [matrix, setMatrix] = React.useState<number[][]>([]);
  const [result, setResult] = React.useState<number[][]>([]);

  const [compared, setCompared] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleClear = () => {
    setSize(2);
    setExponent("5");
    setMatrix([]);
    setResult([]);
    setCompared(false);
    setError(null);
  };

  const getIdentity = (n: number): number[][] => {
    return Array.from({ length: n }, (_, r) =>
      Array.from({ length: n }, (_, c) => (r === c ? 1 : 0))
    );
  };

  const multiply = (matA: number[][], matB: number[][]): number[][] => {
    const n = matA.length;
    const res = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        let sum = 0;
        for (let k = 0; k < n; k++) {
          sum += matA[i][k] * matB[k][j];
        }
        res[i][j] = sum;
      }
    }
    return res;
  };

  const handleEvaluate = () => {
    setError(null);
    setCompared(false);

    const k = parseInt(exponent, 10);
    if (isNaN(k) || k < 0 || k > 100) {
      setError("Please enter a valid exponent exponent range between 0 and 100");
      return;
    }

    setCompared(true);
    const n = matrix.length;

    let res = getIdentity(n);
    let base = matrix;
    let exp = k;

    while (exp > 0) {
      if (exp % 2 === 1) {
        res = multiply(res, base);
      }
      base = multiply(base, base);
      exp = Math.floor(exp / 2);
    }

    setResult(res);
  };

  const definition = "Matrix Exponentiation computes A^K (power of a square matrix) in O(N^3 log K) logarithmic time steps using binary exponentiation.";
  const formula = "Binary Exponentiation: A^K = (A^(K/2))^2 if K is even; A * A^(K-1) if K is odd.";
  const example = "For A = [[1, 1], [1, 0]], A^5 computes the 6th Fibonacci term = [[8, 5], [5, 3]].";
  const applications = [
    "Logarithmic solution to linear recurrences (e.g. N-th Fibonacci).",
    "Counting path lengths of exactly K edges in graphs.",
    "Dynamic programming transitions speedups."
  ];
  const mistakes = [
    "Attempting exponentiation on non-square matrices.",
    "Not initializing the accumulator matrix with the Identity matrix."
  ];
  const cpTips = [
    "Always apply modular arithmetic inside the inner loop of your matrix multiplication to prevent integer overflows when computing large recurrence powers."
  ];

  return (
    <MxLayout
      timeComplexity="O(N^3 log K)"
      spaceComplexity="O(N^2) state matrix buffer"
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
                Exponentiation Result
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex justify-center">
              <MatrixGrid matrix={result} />
            </CardContent>
          </Card>
        )
      }
    >
      <MxHeader
        title="Matrix Exponentiation"
        description="Raise a square matrix to the power K using fast binary exponentiation algorithms."
        category="Operations"
        difficulty="Medium"
        shortcut="Alt+Shift+7"
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
              <label className="text-xs font-semibold text-foreground/80">Matrix Size (N)</label>
              <Select value={size.toString()} onChange={(e) => { setSize(parseInt(e.target.value, 10)); setCompared(false); }}>
                <option value="2">2x2</option>
                <option value="3">3x3</option>
                <option value="4">4x4</option>
              </Select>
            </div>
            <InputField
              label="Exponent (K <= 100)"
              value={exponent}
              onChange={(val) => {
                setExponent(val);
                setCompared(false);
              }}
              error={error || undefined}
            />
          </div>

          <MatrixInput rows={size} cols={size} value={matrix} onChange={(val) => { setMatrix(val); setCompared(false); }} />

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Exponentiate Matrix
          </Button>
        </CardContent>
      </Card>
    </MxLayout>
  );
}
