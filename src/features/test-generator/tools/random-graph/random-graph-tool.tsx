"use client";

import * as React from "react";
import { GeneratorHeader } from "../../shared/generator-header";
import { GeneratorLayout } from "../../shared/generator-layout";
import { PreviewPanel } from "../../shared/preview-panel";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export function RandomGraphTool() {
  const [nodesVal, setNodesVal] = React.useState("5");
  const [edgesVal, setEdgesVal] = React.useState("6");
  const [directed, setDirected] = React.useState(false);
  const [weighted, setWeighted] = React.useState(false);
  const [minWeight, setMinWeight] = React.useState("1");
  const [maxWeight, setMaxWeight] = React.useState("10");
  const [connected, setConnected] = React.useState(true);
  const [isDag, setIsDag] = React.useState(false);

  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const handleGenerate = React.useCallback(() => {
    setError(null);
    setOutput("");

    let N = parseInt(nodesVal, 10);
    let M = parseInt(edgesVal, 10);
    let minW = parseInt(minWeight, 10);
    let maxW = parseInt(maxWeight, 10);

    if (isNaN(N) || isNaN(M)) {
      setError("Please enter valid nodes and edges count");
      return;
    }

    if (N < 2 || N > 50000 || M < 0 || M > 100000) {
      setError("Nodes must be in 2..50,000, edges 0..100,000");
      return;
    }

    if (connected && M < N - 1) {
      setError(`Connected graph requires at least N - 1 (${N - 1}) edges`);
      return;
    }

    // Maximum possible edges verification
    const maxEdges = directed ? N * (N - 1) : (N * (N - 1)) / 2;
    if (M > maxEdges) {
      setError(`Max possible edges for N=${N} is ${maxEdges}`);
      return;
    }

    if (weighted && (isNaN(minW) || isNaN(maxW) || minW > maxW)) {
      setError("Min weight must be less than or equal to Max weight");
      return;
    }

    const edgesSet = new Set<string>();
    const edgesList: string[] = [];

    const getEdgeKey = (u: number, v: number) => {
      return directed ? `${u}->${v}` : u < v ? `${u}-${v}` : `${v}-${u}`;
    };

    const addEdge = (u: number, v: number) => {
      const key = getEdgeKey(u, v);
      if (edgesSet.has(key)) return false;
      edgesSet.add(key);

      let edgeStr = `${u} ${v}`;
      if (weighted) {
        const w = Math.floor(Math.random() * (maxW - minW + 1)) + minW;
        edgeStr += ` ${w}`;
      }
      edgesList.push(edgeStr);
      return true;
    };

    // 1. Connected Tree Spanning Spurt
    if (connected) {
      // Connect node i to a random node in [1, i-1]
      for (let i = 2; i <= N; i++) {
        const p = Math.floor(Math.random() * (i - 1)) + 1;
        addEdge(p, i);
      }
    }

    // 2. DAG topological order setup
    const nodeOrder = Array.from({ length: N }, (_, i) => i + 1);
    if (isDag) {
      // Shuffle ordering
      for (let i = N - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nodeOrder[i], nodeOrder[j]] = [nodeOrder[j], nodeOrder[i]];
      }
    }

    // 3. Fill remaining edges
    let attempts = 0;
    while (edgesList.length < M && attempts < 1000000) {
      attempts++;
      let u = Math.floor(Math.random() * N) + 1;
      let v = Math.floor(Math.random() * N) + 1;

      if (u === v) continue;

      if (isDag) {
        // Enforce directed topology u -> v where order[u] < order[v]
        const uIdx = nodeOrder.indexOf(u);
        const vIdx = nodeOrder.indexOf(v);
        if (uIdx > vIdx) {
          [u, v] = [v, u];
        }
      }

      addEdge(u, v);
    }

    if (edgesList.length < M) {
      setError("Could not generate target edges due to constraints collisions");
      return;
    }

    // output formats: "N M\nu v w..."
    const resLines = [`${N} ${M}`, ...edgesList];
    setOutput(resLines.join("\n"));
  }, [nodesVal, edgesVal, directed, weighted, minWeight, maxWeight, connected, isDag]);

  React.useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  const notes = [
    "Output shows N M (nodes, edges) in line 1 followed by u v w edge lists.",
    "Connected flag spans a random tree first to guarantee node access pathways.",
    "DAG mode enforces topological orders, automatically enabling Directed mode.",
  ];

  return (
    <GeneratorLayout
      notes={notes}
      timeComplexity="O(N + M)"
      spaceComplexity="O(N + M)"
      previewChild={<PreviewPanel value={output} onRegenerate={handleGenerate} />}
    >
      <GeneratorHeader
        title="Random Graph Generator"
        description="Generate connected, directed, weighted graphs or DAGs."
        category="Graphs"
        difficulty="Medium"
        shortcut="Alt+Ctrl+6"
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
            <InputField label="Number of Edges (M)" value={edgesVal} onChange={setEdgesVal} />
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-1 select-none">
            <div className="flex items-center gap-1.5 text-xs">
              <Checkbox
                id="directed-g"
                checked={directed || isDag}
                disabled={isDag}
                onCheckedChange={(checked) => setDirected(!!checked)}
              />
              <label htmlFor="directed-g" className="cursor-pointer font-medium text-foreground/80">
                Directed Graph
              </label>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <Checkbox
                id="connected-g"
                checked={connected}
                onCheckedChange={(checked) => setConnected(!!checked)}
              />
              <label htmlFor="connected-g" className="cursor-pointer font-medium text-foreground/80">
                Ensure Connected (Spans Tree)
              </label>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <Checkbox
                id="dag-g"
                checked={isDag}
                onCheckedChange={(checked) => {
                  setIsDag(!!checked);
                  if (checked) setDirected(true);
                }}
              />
              <label htmlFor="dag-g" className="cursor-pointer font-medium text-foreground/80">
                DAG (Directed Acyclic)
              </label>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <Checkbox
                id="weighted-g"
                checked={weighted}
                onCheckedChange={(checked) => setWeighted(!!checked)}
              />
              <label htmlFor="weighted-g" className="cursor-pointer font-medium text-foreground/80">
                Weighted Edges
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
