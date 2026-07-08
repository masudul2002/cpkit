"use client";

import * as React from "react";
import { MxHeader } from "../../shared/mx-header";
import { MxLayout } from "../../shared/mx-layout";
import { MatrixGrid } from "../../shared/matrix-grid";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { RotateCcw } from "lucide-react";

export function IdentityTool() {
  const [size, setSize] = React.useState("3");
  const [mode, setMode] = React.useState<"identity" | "diagonal">("identity");
  const [diagonalVals, setDiagonalVals] = React.useState("5 7 -2");

  const [compared, setCompared] = React.useState(false);
  const [matrix, setMatrix] = React.useState<number[][]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handleClear = () => {
    setSize("3");
    setMode("identity");
    setDiagonalVals("5 7 -2");
    setCompared(false);
    setMatrix([]);
    setError(null);
  };

  const handleEvaluate = () => {
    setError(null);
    setCompared(false);

    const N = parseInt(size, 10);
    if (isNaN(N) || N < 1 || N > 8) {
      setError("Please enter a valid size between 1 and 8");
      return;
    }

    setCompared(true);

    if (mode === "identity") {
      const nextMat = Array.from({ length: N }, (_, r) =>
        Array.from({ length: N }, (_, c) => (r === c ? 1 : 0))
      );
      setMatrix(nextMat);
    } else {
      const tokens = diagonalVals.trim().split(/\s+/).filter(Boolean);
      if (tokens.length !== N) {
        setError(`Please enter exactly ${N} integers for the diagonal elements.`);
        return;
      }

      const diags: number[] = [];
      for (const t of tokens) {
        const val = parseInt(t, 10);
        if (isNaN(val)) {
          setError(`Invalid diagonal value: "${t}"`);
          return;
        }
        diags.push(val);
      }

      const nextMat = Array.from({ length: N }, (_, r) =>
        Array.from({ length: N }, (_, c) => (r === c ? diags[r] : 0))
      );
      setMatrix(nextMat);
    }
  };

  const definition = "An Identity matrix is a square matrix with 1s on the main diagonal and 0s elsewhere. A Diagonal matrix generalized this with arbitrary values on the main diagonal.";
  const formula = "Diagonal: M[i][j] = d_i if i==j else 0. Identity is diagonal where d_i = 1 for all i.";
  const example = "For N = 3 and diagonal values [5, 7, -2]: M[0][0]=5, M[1][1]=7, M[2][2]=-2, other cells are 0.";
  const applications = [
    "Base case identity matrices for binary exponentiation.",
    "Matrix multipliers equivalents to scalar variables.",
    "Eigenvalues and eigenvectors calculations."
  ];
  const mistakes = [
    "Passing non-square dimensions for identity matrices.",
    "Incorrect length matching for custom diagonal parameter inputs."
  ];
  const cpTips = [
    "When computing recurrence states using matrix exponentiation, initialization begins with an identity matrix (the multiplicative identity) in the product accumulator."
  ];

  return (
    <MxLayout
      timeComplexity="O(N^2)"
      spaceComplexity="O(N^2) grid buffer"
      definition={definition}
      formula={formula}
      example={example}
      applications={applications}
      mistakes={mistakes}
      cpTips={cpTips}
      resultChild={
        compared && matrix.length > 0 && (
          <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
            <CardHeader className="pb-2 border-b border-border/10">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Matrix Output Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex justify-center">
              <MatrixGrid matrix={matrix} />
            </CardContent>
          </Card>
        )
      }
    >
      <MxHeader
        title="Identity & Diagonal Generator"
        description="Construct identity matrices or custom diagonal matrices with specific diagonal parameters."
        category="Creation"
        difficulty="Easy"
        shortcut="Alt+Shift+5"
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
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              label="Dimension Size (N)"
              value={size}
              onChange={(val) => {
                setSize(val);
                setCompared(false);
              }}
              error={error || undefined}
            />
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">Generator Mode</label>
              <Select value={mode} onChange={(e) => { setMode(e.target.value as any); setCompared(false); }}>
                <option value="identity">Identity Matrix (1s)</option>
                <option value="diagonal">Diagonal Matrix (Custom)</option>
              </Select>
            </div>
          </div>

          {mode === "diagonal" && (
            <InputField
              label="Diagonal Values (space separated)"
              value={diagonalVals}
              onChange={(val) => {
                setDiagonalVals(val);
                setCompared(false);
              }}
            />
          )}

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Generate Matrix
          </Button>
        </CardContent>
      </Card>
    </MxLayout>
  );
}
