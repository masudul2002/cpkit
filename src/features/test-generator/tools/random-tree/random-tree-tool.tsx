"use client";

import * as React from "react";
import { GeneratorHeader } from "../../shared/generator-header";
import { GeneratorLayout } from "../../shared/generator-layout";
import { PreviewPanel } from "../../shared/preview-panel";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export function RandomTreeTool() {
  const [nodesVal, setNodesVal] = React.useState("6");
  const [treeType, setTreeType] = React.useState<"general" | "binary">("general");
  const [weighted, setWeighted] = React.useState(false);
  const [minWeight, setMinWeight] = React.useState("1");
  const [maxWeight, setMaxWeight] = React.useState("100");
  const [shuffleLabels, setShuffleLabels] = React.useState(true);

  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const handleGenerate = React.useCallback(() => {
    setError(null);
    setOutput("");

    let N = parseInt(nodesVal, 10);
    let minW = parseInt(minWeight, 10);
    let maxW = parseInt(maxWeight, 10);

    if (isNaN(N) || N < 2 || N > 100000) {
      setError("Number of nodes must be in range 2 to 100,000");
      return;
    }

    if (weighted && (isNaN(minW) || isNaN(maxW) || minW > maxW)) {
      setError("Min weight must be less than or equal to Max weight");
      return;
    }

    // Vertex labels: 1...N
    const labels = Array.from({ length: N }, (_, i) => i + 1);
    if (shuffleLabels) {
      // Shuffle vertex mapping labels
      for (let i = N - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [labels[i], labels[j]] = [labels[j], labels[i]];
      }
    }

    const edgesList: string[] = [];
    const childrenCount = new Array(N + 1).fill(0);
    const availableParents: number[] = [1]; // 1-based index (positions in the tree array)

    for (let i = 2; i <= N; i++) {
      let pIdx = 0;
      
      if (treeType === "binary") {
        // Pick parent from available list where childCount < 2
        pIdx = Math.floor(Math.random() * availableParents.length);
        const parentNode = availableParents[pIdx];
        
        const u = labels[parentNode - 1];
        const v = labels[i - 1];

        let edgeStr = `${u} ${v}`;
        if (weighted) {
          const w = Math.floor(Math.random() * (maxW - minW + 1)) + minW;
          edgeStr += ` ${w}`;
        }
        edgesList.push(edgeStr);

        childrenCount[parentNode]++;
        if (childrenCount[parentNode] >= 2) {
          // Remove parent node from available list
          availableParents.splice(pIdx, 1);
        }
        availableParents.push(i); // Add current node as parent candidate
      } else {
        // General tree: pick any parent node in [1, i-1]
        const parentNode = Math.floor(Math.random() * (i - 1)) + 1;
        const u = labels[parentNode - 1];
        const v = labels[i - 1];

        let edgeStr = `${u} ${v}`;
        if (weighted) {
          const w = Math.floor(Math.random() * (maxW - minW + 1)) + minW;
          edgeStr += ` ${w}`;
        }
        edgesList.push(edgeStr);
      }
    }

    const res = [`${N}`, ...edgesList];
    setOutput(res.join("\n"));
  }, [nodesVal, treeType, weighted, minWeight, maxWeight, shuffleLabels]);

  React.useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  const notes = [
    "Output lists N (number of nodes) followed by N-1 edges.",
    "Binary tree algorithm limits degree constraints (max 2 child links).",
    "Shuffle labels ensures random root positions (otherwise root is always node 1).",
  ];

  return (
    <GeneratorLayout
      notes={notes}
      timeComplexity="O(N)"
      spaceComplexity="O(N)"
      previewChild={<PreviewPanel value={output} onRegenerate={handleGenerate} />}
    >
      <GeneratorHeader
        title="Random Tree Generator"
        description="Generate random trees, binary trees, or weighted trees."
        category="Graphs"
        difficulty="Medium"
        shortcut="Alt+Ctrl+7"
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
            <InputField label="Number of Nodes (N)" value={nodesVal} onChange={setNodesVal} />

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">Tree Branching Style</label>
              <Select value={treeType} onChange={(e) => setTreeType(e.target.value as any)}>
                <option value="general">General Spanning Tree</option>
                <option value="binary">Binary Tree (Max 2 Children)</option>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-1 select-none">
            <div className="flex items-center gap-1.5 text-xs">
              <Checkbox
                id="weighted-t"
                checked={weighted}
                onCheckedChange={(checked) => setWeighted(!!checked)}
              />
              <label htmlFor="weighted-t" className="cursor-pointer font-medium text-foreground/80">
                Weighted Tree Edges
              </label>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <Checkbox
                id="shuffle-t"
                checked={shuffleLabels}
                onCheckedChange={(checked) => setShuffleLabels(!!checked)}
              />
              <label htmlFor="shuffle-t" className="cursor-pointer font-medium text-foreground/80">
                Shuffle Vertex Labels (Randomizes Root)
              </label>
            </div>
          </div>

          {weighted && (
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField label="Min Edge Weight" value={minWeight} onChange={setMinWeight} />
              <InputField label="Max Edge Weight" value={maxWeight} onChange={setMaxWeight} />
            </div>
          )}
        </CardContent>
      </Card>
    </GeneratorLayout>
  );
}
