"use client";

import * as React from "react";
import { GeneratorHeader } from "../../shared/generator-header";
import { GeneratorLayout } from "../../shared/generator-layout";
import { PreviewPanel } from "../../shared/preview-panel";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

export function ConstraintBuilderTool() {
  const [template, setTemplate] = React.useState<"arr_queries" | "matrix_grid" | "graph_queries">("arr_queries");
  const [nVal, setNVal] = React.useState("5");
  const [mVal, setMVal] = React.useState("4");
  const [minVal, setMinVal] = React.useState("1");
  const [maxVal, setMaxVal] = React.useState("100");
  const [density, setDensity] = React.useState("30"); // density in %

  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const handleGenerate = React.useCallback(() => {
    setError(null);
    setOutput("");

    let N = parseInt(nVal, 10);
    let M = parseInt(mVal, 10);
    let min = parseInt(minVal, 10);
    let max = parseInt(maxVal, 10);
    let dens = parseFloat(density);

    if (isNaN(N) || isNaN(M) || isNaN(min) || isNaN(max)) {
      setError("Please enter valid numeric parameters");
      return;
    }

    if (N < 1 || M < 1) {
      setError("N and M must be at least 1");
      return;
    }

    if (min > max) {
      setError("Min constraint must be less than or equal to Max constraint");
      return;
    }

    const lines: string[] = [];

    if (template === "arr_queries") {
      // Line 1: N M
      lines.push(`${N} ${M}`);
      // Line 2: N array elements
      const arr: number[] = [];
      for (let i = 0; i < N; i++) {
        arr.push(Math.floor(Math.random() * (max - min + 1)) + min);
      }
      lines.push(arr.join(" "));
      // Next M lines: queries
      for (let i = 0; i < M; i++) {
        const type = Math.random() < 0.5 ? "Q" : "U";
        if (type === "Q") {
          let l = Math.floor(Math.random() * N) + 1;
          let r = Math.floor(Math.random() * N) + 1;
          if (l > r) [l, r] = [r, l];
          lines.push(`Q ${l} ${r}`);
        } else {
          const idx = Math.floor(Math.random() * N) + 1;
          const val = Math.floor(Math.random() * (max - min + 1)) + min;
          lines.push(`U ${idx} ${val}`);
        }
      }
    } else if (template === "matrix_grid") {
      // Line 1: N M (rows, cols)
      lines.push(`${N} ${M}`);
      // N lines of matrix
      for (let i = 0; i < N; i++) {
        const row: string[] = [];
        for (let j = 0; j < M; j++) {
          if (!isNaN(dens) && Math.random() * 100 > dens) {
            row.push("0"); // density filter
          } else {
            const val = Math.floor(Math.random() * (max - min + 1)) + min;
            row.push(String(val));
          }
        }
        lines.push(row.join(" "));
      }
    } else if (template === "graph_queries") {
      // Line 1: N M (nodes, edges)
      lines.push(`${N} ${M}`);
      // M lines: edges
      const edgesSet = new Set<string>();
      for (let i = 0; i < M; i++) {
        let u = Math.floor(Math.random() * N) + 1;
        let v = Math.floor(Math.random() * N) + 1;
        if (u === v) {
          v = (v % N) + 1;
        }
        const key = u < v ? `${u}-${v}` : `${v}-${u}`;
        edgesSet.add(key);
        lines.push(`${u} ${v}`);
      }
    }

    setOutput(lines.join("\n"));
  }, [template, nVal, mVal, minVal, maxVal, density]);

  React.useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  const notes = [
    "Useful for composite inputs like (N, M) + Array + Query Lists.",
    "Density specifies the percentage probability of generating non-zero items in matrices.",
    "Standard CP graph templates connect vertices uniformly.",
  ];

  return (
    <GeneratorLayout
      notes={notes}
      timeComplexity="O(N + M)"
      spaceComplexity="O(N + M)"
      previewChild={<PreviewPanel value={output} onRegenerate={handleGenerate} />}
    >
      <GeneratorHeader
        title="Constraint Builder"
        description="Configure multi-structure datasets, matrices, and connected queries."
        category="Verification"
        difficulty="Hard"
        shortcut="Alt+Ctrl+B"
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">Compound Template</label>
              <Select value={template} onChange={(e) => setTemplate(e.target.value as any)}>
                <option value="arr_queries">Array + Range Queries</option>
                <option value="matrix_grid">Matrix Grid (With Density)</option>
                <option value="graph_queries">Basic Graph Edges List</option>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <InputField label="N Parameter" value={nVal} onChange={setNVal} />
              <InputField label="M Parameter" value={mVal} onChange={setMVal} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <InputField label="Min Element Value" value={minVal} onChange={setMinVal} />
            <InputField label="Max Element Value" value={maxVal} onChange={setMaxVal} />
            {template === "matrix_grid" && (
              <InputField label="Cell Density (%)" value={density} onChange={setDensity} />
            )}
          </div>
        </CardContent>
      </Card>
    </GeneratorLayout>
  );
}
