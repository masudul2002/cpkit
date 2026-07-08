"use client";

import * as React from "react";
import { GrHeader } from "../../shared/gr-header";
import { GrLayout } from "../../shared/gr-layout";
import { GraphCanvas, NodeItem, EdgeItem } from "../../visualization/graph-canvas";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function KruskalTool() {
  const [nodes, setNodes] = React.useState<NodeItem[]>([
    { id: "0", label: "0", x: 100, y: 100 },
    { id: "1", label: "1", x: 280, y: 80 },
    { id: "2", label: "2", x: 120, y: 260 },
    { id: "3", label: "3", x: 300, y: 240 },
    { id: "4", label: "4", x: 200, y: 170 },
  ]);
  const [edges, setEdges] = React.useState<EdgeItem[]>([
    { id: "0-1", from: "0", to: "1", weight: 4, directed: false },
    { id: "0-2", from: "0", to: "2", weight: 2, directed: false },
    { id: "1-3", from: "1", to: "3", weight: 5, directed: false },
    { id: "2-3", from: "2", to: "3", weight: 8, directed: false },
    { id: "2-4", from: "2", to: "4", weight: 3, directed: false },
    { id: "4-3", from: "4", to: "3", weight: 1, directed: false },
  ]);

  const [compared, setCompared] = React.useState(false);
  const [mstEdges, setMstEdges] = React.useState<string[]>([]);
  const [totalWeight, setTotalWeight] = React.useState<number | null>(null);
  const [steps, setSteps] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handleEvaluate = () => {
    setError(null);
    setCompared(true);
    setMstEdges([]);
    setTotalWeight(null);
    setSteps([]);

    // Sort edges
    const sorted = [...edges].sort((a, b) => a.weight - b.weight);

    // DSU Structures
    const parent: Record<string, string> = {};
    nodes.forEach((n) => { parent[n.id] = n.id; });

    const find = (i: string): string => {
      let curr = i;
      while (parent[curr] !== curr) {
        // Path compression
        parent[curr] = parent[parent[curr]];
        curr = parent[curr];
      }
      return curr;
    };

    const union = (root1: string, root2: string) => {
      parent[root1] = root2;
    };

    const selected: string[] = [];
    let sum = 0;
    const log: string[] = [];

    sorted.forEach((edge) => {
      const u = edge.from;
      const v = edge.to;
      const rootU = find(u);
      const rootV = find(v);

      if (rootU !== rootV) {
        union(rootU, rootV);
        selected.push(edge.id);
        sum += edge.weight;
        log.push(`• Accept Edge ${edge.id} (weight ${edge.weight}) because it connects separate DSU sets`);
      } else {
        log.push(`• Reject Edge ${edge.id} (weight ${edge.weight}) because both endpoints are in the same DSU set (creates cycle)`);
      }
    });

    setMstEdges(selected);
    setTotalWeight(sum);
    setSteps(log);

    if (selected.length < nodes.length - 1 && nodes.length > 0) {
      setError("Warning: Graph is disconnected. Generated MST is incomplete.");
    }
  };

  const definition = "Kruskal's Algorithm finds the Minimum Spanning Tree (MST) by sorting all graph edges by weight and adding them one by one, avoiding cycle paths using a Disjoint Set Union (DSU).";
  const idea = "Initialize parent arrays. Sort edges ascending. Loop through edges: if endpoints have different roots, union components and add edge to tree; otherwise skip.";
  const pseudocode = `KruskalMST():
  Sort edges by weight ascending
  DSU = DisjointSetUnion()

  for each edge (u, v, weight):
    if DSU.find(u) != DSU.find(v):
      DSU.union(u, v)
      MST.push(edge u-v)`;

  const applications = [
    "Efficient wire connections spanning graphs.",
    "Biclique cluster segmentations.",
    "Maze generators."
  ];
  const mistakes = [
    "Not sorting the edge collection beforehand, yielding incorrect spanning weights.",
    "Not tracking component parents correctly, causing cycle loops."
  ];
  const cpTips = [
    "Kruskal is the most popular MST algorithm in CP contests due to its simple implementation using a pre-written DSU helper struct."
  ];

  return (
    <GrLayout
      timeComplexity="O(E log E) / O(E log V) sorting time"
      spaceComplexity="O(V) DSU parent arrays"
      definition={definition}
      idea={idea}
      pseudocode={pseudocode}
      applications={applications}
      mistakes={mistakes}
      cpTips={cpTips}
      visualizerChild={
        <Card className="border-border/40 bg-card/65 shadow-xs font-sans text-left">
          <CardHeader className="pb-2 border-b border-border/10">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Interactive SVG Graph Canvas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <GraphCanvas
              nodes={nodes}
              edges={edges}
              onChange={(n, e) => {
                setNodes(n);
                setEdges(e);
                setCompared(false);
              }}
              highlightedEdges={mstEdges}
            />

            {compared && totalWeight !== null && (
              <div className="border-t border-border/5 pt-3 space-y-3 font-mono text-xs text-left">
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>MST Total Weight:</span>
                  <span className="font-bold text-emerald-500">{totalWeight}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Kruskal Edge Selection Trace:
                  </span>
                  <div className="p-3 bg-muted/20 border border-border/10 rounded-lg max-h-48 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-1">
                    {steps.map((step, idx) => (
                      <div key={idx} className="text-foreground/80">{step}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {error && <div className="text-xs text-rose-500 font-semibold font-mono">{error}</div>}
          </CardContent>
        </Card>
      }
    >
      <GrHeader
        title="Kruskal's MST"
        description="Construct a Minimum Spanning Tree by sorting edges and joining components with DSU."
        category="Spanning Tree"
        difficulty="Medium"
        shortcut="Alt+Shift+K"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <p className="text-xs text-muted-foreground">
            Make sure edges have weights on the canvas above then run Kruskal to generate the spanning tree.
          </p>
          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Run Kruskal Solver
          </Button>
        </CardContent>
      </Card>
    </GrLayout>
  );
}
