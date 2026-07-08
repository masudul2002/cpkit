"use client";

import * as React from "react";
import { GeneratorHeader } from "../../shared/generator-header";
import { GeneratorLayout } from "../../shared/generator-layout";
import { PreviewPanel } from "../../shared/preview-panel";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

export function RandomPermutationTool() {
  const [sizeVal, setSizeVal] = React.useState("10");
  const [baseMode, setBaseMode] = React.useState<"zero" | "one">("one");
  const [separator, setSeparator] = React.useState("space");

  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const handleGenerate = React.useCallback(() => {
    setError(null);
    setOutput("");

    let n = parseInt(sizeVal, 10);
    if (isNaN(n) || n < 1 || n > 100000) {
      setError("Permutation size must be in range 1 to 100,000");
      return;
    }

    const arr: number[] = [];
    const start = baseMode === "zero" ? 0 : 1;
    const end = baseMode === "zero" ? n - 1 : n;

    for (let i = start; i <= end; i++) {
      arr.push(i);
    }

    // Fisher-Yates Shuffle
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    let sep = " ";
    if (separator === "comma") sep = ", ";
    if (separator === "newline") sep = "\n";

    setOutput(arr.join(sep));
  }, [sizeVal, baseMode, separator]);

  React.useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  const notes = [
    "Useful for generating random permutations of vertices or array order maps.",
    "0-indexed option maps values $0 \ldots N-1$ while 1-indexed maps $1 \ldots N$.",
    "Uses Fisher-Yates shuffle to guarantee uniform permutation choices.",
  ];

  return (
    <GeneratorLayout
      notes={notes}
      timeComplexity="O(N)"
      spaceComplexity="O(N)"
      previewChild={<PreviewPanel value={output} onRegenerate={handleGenerate} />}
    >
      <GeneratorHeader
        title="Random Permutation Generator"
        description="Generate a random permutation of values from 1 to N (or 0 to N-1)."
        category="Arrays"
        difficulty="Easy"
        shortcut="Alt+Ctrl+5"
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
            <InputField label="Permutation Size (N)" value={sizeVal} onChange={setSizeVal} />

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">Indexing Mode</label>
              <Select value={baseMode} onChange={(e) => setBaseMode(e.target.value as any)}>
                <option value="one">1-indexed (1 to N)</option>
                <option value="zero">0-indexed (0 to N-1)</option>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">Separator Style</label>
              <Select value={separator} onChange={(e) => setSeparator(e.target.value)}>
                <option value="space">Space (" ")</option>
                <option value="comma">Comma (", ")</option>
                <option value="newline">New Line ("\n")</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </GeneratorLayout>
  );
}
