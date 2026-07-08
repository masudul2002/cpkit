"use client";

import * as React from "react";
import { GeneratorHeader } from "../../shared/generator-header";
import { GeneratorLayout } from "../../shared/generator-layout";
import { PreviewPanel } from "../../shared/preview-panel";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

export function RandomMatrixTool() {
  const [matrixStyle, setMatrixStyle] = React.useState<"std" | "binary" | "identity" | "sparse">("std");
  const [rows, setRows] = React.useState("5");
  const [cols, setCols] = React.useState("5");
  const [minVal, setMinVal] = React.useState("1");
  const [maxVal, setMaxVal] = React.useState("10");

  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const handleGenerate = React.useCallback(() => {
    setError(null);
    setOutput("");

    let r = parseInt(rows, 10);
    let c = parseInt(cols, 10);
    let min = parseInt(minVal, 10);
    let max = parseInt(maxVal, 10);

    if (isNaN(r) || isNaN(c)) {
      setError("Rows and Columns must be valid numbers");
      return;
    }

    if (r < 1 || r > 500 || c < 1 || c > 500) {
      setError("Dimensions must be in range 1 to 500");
      return;
    }

    if (matrixStyle === "std" || matrixStyle === "sparse") {
      if (isNaN(min) || isNaN(max) || min > max) {
        setError("Min constraint must be less than or equal to Max constraint");
        return;
      }
    }

    const grid: string[][] = [];

    for (let i = 0; i < r; i++) {
      const row: string[] = [];
      for (let j = 0; j < c; j++) {
        if (matrixStyle === "identity") {
          row.push(i === j ? "1" : "0");
        } else if (matrixStyle === "binary") {
          row.push(Math.random() < 0.5 ? "1" : "0");
        } else if (matrixStyle === "sparse") {
          // 80% chance of 0, 20% random
          if (Math.random() < 0.8) {
            row.push("0");
          } else {
            const val = Math.floor(Math.random() * (max - min + 1)) + min;
            row.push(String(val));
          }
        } else {
          // standard random range
          const val = Math.floor(Math.random() * (max - min + 1)) + min;
          row.push(String(val));
        }
      }
      grid.push(row);
    }

    setOutput(grid.map((row) => row.join(" ")).join("\n"));
  }, [matrixStyle, rows, cols, minVal, maxVal]);

  React.useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  const notes = [
    "Supports generating binary (0/1), identity, sparse, and standard matrices.",
    "Grid dimensions are restricted to 500x500 to keep browser thread responsive.",
    "Row spacing follows newline separators and column space tabs.",
  ];

  return (
    <GeneratorLayout
      notes={notes}
      timeComplexity="O(Rows * Columns)"
      spaceComplexity="O(Rows * Columns)"
      previewChild={<PreviewPanel value={output} onRegenerate={handleGenerate} />}
    >
      <GeneratorHeader
        title="Random Matrix Generator"
        description="Generate standard grids, binary patterns, sparse tables, or identity matrices."
        category="Matrices"
        difficulty="Easy"
        shortcut="Alt+Ctrl+4"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Constraints Config
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-500 font-semibold rounded-lg">
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-3">
            <InputField label="Matrix Rows (N)" value={rows} onChange={setRows} />
            <InputField label="Matrix Columns (M)" value={cols} onChange={setCols} />
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">Matrix Style</label>
              <Select value={matrixStyle} onChange={(e) => setMatrixStyle(e.target.value as any)}>
                <option value="std">Standard (Random Integers)</option>
                <option value="binary">Binary (Only 0 or 1)</option>
                <option value="identity">Identity Matrix (Square)</option>
                <option value="sparse">Sparse Matrix (Mostly 0)</option>
              </Select>
            </div>
          </div>

          {(matrixStyle === "std" || matrixStyle === "sparse") && (
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField label="Min Element Value" value={minVal} onChange={setMinVal} />
              <InputField label="Max Element Value" value={maxVal} onChange={setMaxVal} />
            </div>
          )}
        </CardContent>
      </Card>
    </GeneratorLayout>
  );
}
