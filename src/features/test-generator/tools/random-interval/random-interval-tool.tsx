"use client";

import * as React from "react";
import { GeneratorHeader } from "../../shared/generator-header";
import { GeneratorLayout } from "../../shared/generator-layout";
import { PreviewPanel } from "../../shared/preview-panel";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

export function RandomIntervalTool() {
  const [quantity, setQuantity] = React.useState("5");
  const [maxBound, setMaxBound] = React.useState("100");
  const [intervalStyle, setIntervalStyle] = React.useState<"std" | "disjoint" | "nested">("std");

  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const handleGenerate = React.useCallback(() => {
    setError(null);
    setOutput("");

    let Q = parseInt(quantity, 10);
    let N = parseInt(maxBound, 10);

    if (isNaN(Q) || isNaN(N)) {
      setError("Please enter valid parameters");
      return;
    }

    if (Q < 1 || Q > 100000 || N < 2) {
      setError("Quantity must be 1..100,000 and max bound at least 2");
      return;
    }

    const intervals: string[] = [];

    if (intervalStyle === "nested") {
      // e.g. [1, N], [2, N-1], [3, N-2], etc.
      let l = 1;
      let r = N;
      for (let i = 0; i < Q; i++) {
        if (l > r) {
          setError(`Cannot generate ${Q} nested intervals with max bound ${N}. Decrease quantity or increase max bound.`);
          return;
        }
        intervals.push(`${l} ${r}`);
        l += Math.floor(Math.random() * 2) + 1;
        r -= Math.floor(Math.random() * 2) + 1;
      }
    } else if (intervalStyle === "disjoint") {
      // Segment the range [1, N] into 2 * Q points
      if (N < 2 * Q) {
        setError(`Disjoint intervals of count ${Q} require max bound of at least ${2 * Q}`);
        return;
      }

      const points = new Set<number>();
      while (points.size < 2 * Q) {
        points.add(Math.floor(Math.random() * N) + 1);
      }

      const sortedPoints = Array.from(points).sort((a, b) => a - b);
      for (let i = 0; i < Q; i++) {
        intervals.push(`${sortedPoints[2 * i]} ${sortedPoints[2 * i + 1]}`);
      }
    } else {
      // Standard random overlapping intervals [L, R]
      for (let i = 0; i < Q; i++) {
        let l = Math.floor(Math.random() * N) + 1;
        let r = Math.floor(Math.random() * N) + 1;
        if (l > r) [l, r] = [r, l];
        intervals.push(`${l} ${r}`);
      }
    }

    const res = [`${Q}`, ...intervals];
    setOutput(res.join("\n"));
  }, [quantity, maxBound, intervalStyle]);

  React.useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  const notes = [
    "Useful for interval scheduling, scanline, or coordinate compression test cases.",
    "Disjoint mode partitions range uniformly so no interval coordinates overlap.",
    "Nested mode ensures interval $i+1$ is strictly inside interval $i$ bounds.",
  ];

  return (
    <GeneratorLayout
      notes={notes}
      timeComplexity="O(Q log Q)"
      spaceComplexity="O(Q)"
      previewChild={<PreviewPanel value={output} onRegenerate={handleGenerate} />}
    >
      <GeneratorHeader
        title="Random Interval Generator"
        description="Generate standard overlapping, disjoint, or nested [L, R] intervals."
        category="Intervals"
        difficulty="Easy"
        shortcut="Alt+Ctrl+9"
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
            <InputField label="Max Bound Range (N)" value={maxBound} onChange={setMaxBound} />

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">Interval Style</label>
              <Select value={intervalStyle} onChange={(e) => setIntervalStyle(e.target.value as any)}>
                <option value="std">Standard (Overlapping allowed)</option>
                <option value="disjoint">Disjoint (No overlaps)</option>
                <option value="nested">Nested (Contained containment)</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </GeneratorLayout>
  );
}
