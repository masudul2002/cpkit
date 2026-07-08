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

export function MatrixGeneratorTool() {
  const [rows, setRows] = React.useState("3");
  const [cols, setCols] = React.useState("3");
  const [type, setType] = React.useState<"random" | "binary" | "identity" | "sparse" | "weighted">("random");

  const [compared, setCompared] = React.useState(false);
  const [matrix, setMatrix] = React.useState<number[][]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handleClear = () => {
    setRows("3");
    setCols("3");
    setType("random");
    setCompared(false);
    setMatrix([]);
    setError(null);
  };

  const handleEvaluate = () => {
    setError(null);
    setCompared(false);

    const r = parseInt(rows, 10);
    const c = parseInt(cols, 10);

    if (isNaN(r) || isNaN(c) || r < 1 || c < 1 || r > 8 || c > 8) {
      setError("Please enter valid positive dimensions between 1 and 8 to prevent layout issues.");
      return;
    }

    if (type === "identity" && r !== c) {
      setError("Identity matrix requires square dimensions (Rows must equal Columns).");
      return;
    }

    setCompared(true);
    let nextMat: number[][] = [];

    if (type === "identity") {
      nextMat = Array.from({ length: r }, (_, rowIndex) =>
        Array.from({ length: c }, (_, colIndex) => (rowIndex === colIndex ? 1 : 0))
      );
    } else if (type === "binary") {
      nextMat = Array.from({ length: r }, () =>
        Array.from({ length: c }, () => (Math.random() > 0.5 ? 1 : 0))
      );
    } else if (type === "sparse") {
      nextMat = Array.from({ length: r }, () =>
        Array.from({ length: c }, () => (Math.random() > 0.8 ? Math.floor(Math.random() * 9) + 1 : 0))
      );
    } else if (type === "weighted") {
      nextMat = Array.from({ length: r }, () =>
        Array.from({ length: c }, () => Math.floor(Math.random() * 99) + 1)
      );
    } else {
      nextMat = Array.from({ length: r }, () =>
        Array.from({ length: c }, () => Math.floor(Math.random() * 9) + 1)
      );
    }

    setMatrix(nextMat);
  };

  const definition = "Matrix Generator builds matrices based on specified dimensions and data formats (random integer, binary, identity flags, sparse zero ratios, or weighted values).";
  const formula = "Identity: M[i][j] = 1 if i==j else 0. Sparse: density ratio controls chance of zeroing cell.";
  const example = "Generating a 3x3 Identity Matrix places 1s on diagonal coordinates (0,0), (1,1), (2,2) and 0s elsewhere.";
  const applications = [
    "Generating random test inputs for matrix multiplications.",
    "Dynamic programming grid setups.",
    "Adjacency matrix representation for graphs."
  ];
  const mistakes = [
    "Failing to enforce square dimensions when generating identity matrices.",
    "Generating excessively large matrices that overflow browser styling blocks."
  ];
  const cpTips = [
    "In competitive programming test generation, utilize sparse matrices with low density bounds to model realistic graph configurations."
  ];

  return (
    <MxLayout
      timeComplexity="O(R * C)"
      spaceComplexity="O(R * C) generated buffer"
      definition={definition}
      formula={formula}
      example={example}
      applications={applications}
      mistakes={mistakes}
      cpTips={cpTips}
      resultChild={
        compared && matrix.length > 0 && (
          <Card className="border-border/40 bg-card/65 shadow-xs">
            <CardHeader className="pb-2 border-b border-border/10">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Generated Grid Preview
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
        title="Matrix Generator"
        description="Construct random, binary, identity, sparse, or weighted matrices with custom constraints."
        category="Creation"
        difficulty="Easy"
        shortcut="Alt+Shift+1"
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
              label="Rows (1-8)"
              value={rows}
              onChange={(val) => {
                setRows(val);
                setCompared(false);
              }}
              error={error || undefined}
            />
            <InputField
              label="Columns (1-8)"
              value={cols}
              onChange={(val) => {
                setCols(val);
                setCompared(false);
              }}
            />
          </div>

          <div className="space-y-1.5 max-w-[220px]">
            <label className="text-xs font-semibold text-foreground/80">Matrix Type</label>
            <Select value={type} onChange={(e) => { setType(e.target.value as any); setCompared(false); }}>
              <option value="random">Random Integers (1-9)</option>
              <option value="binary">Binary Matrix (0 or 1)</option>
              <option value="identity">Identity Matrix (1s on Diagonal)</option>
              <option value="sparse">Sparse Matrix (Mostly 0s)</option>
              <option value="weighted">Weighted (Large Weights 1-99)</option>
            </Select>
          </div>

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer font-sans">
            Generate Matrix
          </Button>
        </CardContent>
      </Card>
    </MxLayout>
  );
}
