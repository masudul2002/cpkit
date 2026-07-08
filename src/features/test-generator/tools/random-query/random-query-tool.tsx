"use client";

import * as React from "react";
import { GeneratorHeader } from "../../shared/generator-header";
import { GeneratorLayout } from "../../shared/generator-layout";
import { PreviewPanel } from "../../shared/preview-panel";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";

export function RandomQueryTool() {
  const [queriesVal, setQueriesVal] = React.useState("10");
  const [arraySizeVal, setArraySizeVal] = React.useState("1000");
  const [queryStyle, setQueryStyle] = React.useState<"numeric" | "text">("numeric");

  const [useRange, setUseRange] = React.useState(true);
  const [usePoint, setUsePoint] = React.useState(false);
  const [useUpdate, setUseUpdate] = React.useState(true);

  const [minUpdate, setMinUpdate] = React.useState("1");
  const [maxUpdate, setMaxUpdate] = React.useState("100");

  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const handleGenerate = React.useCallback(() => {
    setError(null);
    setOutput("");

    let Q = parseInt(queriesVal, 10);
    let N = parseInt(arraySizeVal, 10);
    let minU = parseInt(minUpdate, 10);
    let maxU = parseInt(maxUpdate, 10);

    if (isNaN(Q) || isNaN(N)) {
      setError("Please enter valid query quantity and array constraints");
      return;
    }

    if (Q < 1 || Q > 100000 || N < 1) {
      setError("Queries quantity must be 1 to 100,000");
      return;
    }

    if (useUpdate && (isNaN(minU) || isNaN(maxU) || minU > maxU)) {
      setError("Min update value must be less than or equal to Max update");
      return;
    }

    // Build available types
    const types: string[] = [];
    if (useRange) types.push("range");
    if (usePoint) types.push("point");
    if (useUpdate) types.push("update");

    if (types.length === 0) {
      setError("Please enable at least one query type");
      return;
    }

    const lines: string[] = [];
    for (let i = 0; i < Q; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      if (type === "range") {
        let l = Math.floor(Math.random() * N) + 1;
        let r = Math.floor(Math.random() * N) + 1;
        if (l > r) [l, r] = [r, l];
        
        lines.push(queryStyle === "numeric" ? `1 ${l} ${r}` : `Q ${l} ${r}`);
      } else if (type === "point") {
        const idx = Math.floor(Math.random() * N) + 1;
        lines.push(queryStyle === "numeric" ? `2 ${idx}` : `P ${idx}`);
      } else if (type === "update") {
        const idx = Math.floor(Math.random() * N) + 1;
        const val = Math.floor(Math.random() * (maxU - minU + 1)) + minU;
        lines.push(queryStyle === "numeric" ? `3 ${idx} ${val}` : `U ${idx} ${val}`);
      }
    }

    const res = [`${Q}`, ...lines];
    setOutput(res.join("\n"));
  }, [queriesVal, arraySizeVal, queryStyle, useRange, usePoint, useUpdate, minUpdate, maxUpdate]);

  React.useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  const notes = [
    "Useful for range queries exercises like Segment Trees, Fenwick Trees, or RMQ.",
    "Numeric format maps: 1=Range, 2=Point, 3=Update. Text maps: Q=Range, P=Point, U=Update.",
    "First line output lists Q (total queries count). All indices are 1-based.",
  ];

  return (
    <GeneratorLayout
      notes={notes}
      timeComplexity="O(Q)"
      spaceComplexity="O(Q)"
      previewChild={<PreviewPanel value={output} onRegenerate={handleGenerate} />}
    >
      <GeneratorHeader
        title="Random Queries Generator"
        description="Generate numeric or text-based range, point, and update queries."
        category="Queries"
        difficulty="Easy"
        shortcut="Alt+Ctrl+8"
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
            <InputField label="Number of Queries (Q)" value={queriesVal} onChange={setQueriesVal} />
            <InputField label="Array Size Bound (N)" value={arraySizeVal} onChange={setArraySizeVal} />
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">Query Format</label>
              <Select value={queryStyle} onChange={(e) => setQueryStyle(e.target.value as any)}>
                <option value="numeric">Numeric Codes (1, 2, 3)</option>
                <option value="text">Text Characters (Q, P, U)</option>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-1 select-none">
            <div className="flex items-center gap-1.5 text-xs">
              <Checkbox
                id="use-range-q"
                checked={useRange}
                onCheckedChange={(checked) => setUseRange(!!checked)}
              />
              <label htmlFor="use-range-q" className="cursor-pointer font-medium text-foreground/80">
                Range Queries
              </label>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <Checkbox
                id="use-point-q"
                checked={usePoint}
                onCheckedChange={(checked) => setUsePoint(!!checked)}
              />
              <label htmlFor="use-point-q" className="cursor-pointer font-medium text-foreground/80">
                Point Queries
              </label>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <Checkbox
                id="use-update-q"
                checked={useUpdate}
                onCheckedChange={(checked) => setUseUpdate(!!checked)}
              />
              <label htmlFor="use-update-q" className="cursor-pointer font-medium text-foreground/80">
                Update Queries
              </label>
            </div>
          </div>

          {useUpdate && (
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField label="Min Update Value" value={minUpdate} onChange={setMinUpdate} />
              <InputField label="Max Update Value" value={maxUpdate} onChange={setMaxUpdate} />
            </div>
          )}
        </CardContent>
      </Card>
    </GeneratorLayout>
  );
}
