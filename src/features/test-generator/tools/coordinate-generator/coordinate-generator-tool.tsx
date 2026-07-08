"use client";

import * as React from "react";
import { GeneratorHeader } from "../../shared/generator-header";
import { GeneratorLayout } from "../../shared/generator-layout";
import { PreviewPanel } from "../../shared/preview-panel";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export function CoordinateGeneratorTool() {
  const [quantity, setQuantity] = React.useState("5");
  const [dimension, setDimension] = React.useState<"2D" | "3D">("2D");
  const [coordType, setCoordType] = React.useState<"int" | "float">("int");
  const [minVal, setMinVal] = React.useState("-100");
  const [maxVal, setMaxVal] = React.useState("100");
  const [precision, setPrecision] = React.useState("4");

  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const handleGenerate = React.useCallback(() => {
    setError(null);
    setOutput("");

    let Q = parseInt(quantity, 10);
    let min = parseFloat(minVal);
    let max = parseFloat(maxVal);
    let prec = parseInt(precision, 10);

    if (isNaN(Q) || isNaN(min) || isNaN(max)) {
      setError("Please enter valid parameters");
      return;
    }

    if (min > max) {
      setError("Min constraint must be less than or equal to Max constraint");
      return;
    }

    if (Q < 1 || Q > 50000) {
      setError("Quantity must be in range 1 to 50,000");
      return;
    }

    const lines: string[] = [];
    for (let i = 0; i < Q; i++) {
      const coords: string[] = [];
      const dims = dimension === "2D" ? 2 : 3;

      for (let d = 0; d < dims; d++) {
        if (coordType === "int") {
          const val = Math.floor(Math.random() * (max - min + 1)) + min;
          coords.push(String(val));
        } else {
          const val = Math.random() * (max - min) + min;
          coords.push(val.toFixed(prec));
        }
      }
      lines.push(coords.join(" "));
    }

    const res = [`${Q}`, ...lines];
    setOutput(res.join("\n"));
  }, [quantity, dimension, coordType, minVal, maxVal, precision]);

  React.useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  const notes = [
    "Useful for geometry, coordinate grids, convex hulls, or spatial indexes.",
    "Output specifies the count Q followed by Q space-separated lines.",
    "Decimal precision applies only in Floating Point mode.",
  ];

  return (
    <GeneratorLayout
      notes={notes}
      timeComplexity="O(Quantity)"
      spaceComplexity="O(Quantity)"
      previewChild={<PreviewPanel value={output} onRegenerate={handleGenerate} />}
    >
      <GeneratorHeader
        title="Coordinate Generator"
        description="Generate 2D or 3D coordinate tuples in integer or decimal formats."
        category="Geometry"
        difficulty="Easy"
        shortcut="Alt+Ctrl+C"
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
            <InputField label="Quantity (Q)" value={quantity} onChange={setQuantity} />

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">Dimensions</label>
              <Select value={dimension} onChange={(e) => setDimension(e.target.value as any)}>
                <option value="2D">2D Coordinates (X, Y)</option>
                <option value="3D">3D Coordinates (X, Y, Z)</option>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">Coordinate Format</label>
              <Select value={coordType} onChange={(e) => setCoordType(e.target.value as any)}>
                <option value="int">Integer Values</option>
                <option value="float">Floating Point Decimals</option>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <InputField label="Min Range Coordinate" value={minVal} onChange={setMinVal} />
            <InputField label="Max Range Coordinate" value={maxVal} onChange={setMaxVal} />
            {coordType === "float" && (
              <InputField label="Decimal Precision" value={precision} onChange={setPrecision} />
            )}
          </div>
        </CardContent>
      </Card>
    </GeneratorLayout>
  );
}
