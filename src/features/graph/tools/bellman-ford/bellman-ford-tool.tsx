"use client";

import * as React from "react";
import { GrHeader } from "../../shared/gr-header";
import { GrLayout } from "../../shared/gr-layout";
import { GraphCanvas, NodeItem, EdgeItem } from "../../visualization/graph-canvas";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function BellmanFordTool() {
  const [nodes, setNodes] = React.useState<NodeItem[]>([
    { id: "0", label: "0", x: 100, y: 100 },
    { id: "1", label: "1", x: 280, y: 80 },
    { id: "2", label: "2", x: 120, y: 260 },
    { id: "3", label: "3", x: 300, y: 240 },
    { id: "4", label: "4", x: 200, y: 170 },
  ]);
  const [edges, setEdges] = React.useState<EdgeItem[]>([
    { id: "0-1", from: "0", to: "1", weight: 6, directed: true },
    { id: "0-2", from: "0", to: "2", weight: 7, directed: true },
    { id: "1-2", from: "1", to: "2", weight: 8, directed: true },
    { id: "1-3", from: "1", to: "3", weight: 5, directed: true },
    { id: "2-3", from: "2", to: "3", weight: -3, directed: true },
    { id: "2-4", from: "2", to: "4", weight: 9, directed: true },
    { id: "4-3", from: "4", to: "3", weight: 2, directed: true },
  ]);

  const [startNode, setStartNode] = React.useState("0");
  const [compared, setCompared] = React.useState(false);

  const [distances, setDistances] = React.useState<Record<string, number>>({});
  const [negativeCycle, setNegativeCycle] = React.useState(false);
  const [steps, setSteps] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handleEvaluate = () => {
    setError(null);
    setCompared(true);
    setDistances({});
    setNegativeCycle(false);
    setSteps([]);

    const exists = nodes.some((n) => n.id === startNode);
    if (!exists) {
      setError("Start node does not exist in the graph.");
      return;
    }

    const V = nodes.length;
    const dist: Record<string, number> = {};
    const trace: string[] = [];

    nodes.forEach((n) => {
      dist[n.id] = Infinity;
    });
    dist[startNode] = 0;

    // Run V - 1 iterations
    for (let i = 1; i < V; i++) {
      let relaxedAny = false;
      edges.forEach((edge) => {
        const u = edge.from;
        const v = edge.to;
        const w = edge.weight;

        if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
          dist[v] = dist[u] + w;
          relaxedAny = true;
          trace.push(`• Iteration ${i}: Relaxed edge ${edge.id}. Dist to ${v} updated to ${dist[v]}`);
        }
      });
      if (!relaxedAny) {
        trace.push(`• Iteration ${i}: No edge was relaxed. Early exit.`);
        break;
      }
    }

    // V-th iteration to check for negative cycles
    let cycles = false;
    edges.forEach((edge) => {
      const u = edge.from;
      const v = edge.to;
      const w = edge.weight;

      if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
        cycles = true;
        trace.push(`⚠️ Negative Cycle detected on edge ${edge.id}! Infinite relaxation possible.`);
      }
    });

    setDistances(dist);
    setNegativeCycle(cycles);
    setSteps(trace);
  };

  const definition = "Bellman-Ford's Algorithm computes single-source shortest paths on weighted graphs, supporting negative weights and detecting negative cycles.";
  const idea = "Relaxes all E edges V - 1 times. If any edge can be relaxed on the V-th sweep, a negative weight cycle reachable from the source exists.";
  const pseudocode = `BellmanFord(start_node):
  dist[start_node] = 0
  for all other nodes v: dist[v] = INF

  for iteration = 1..V-1:
    for each edge (u, v, weight):
      if dist[u] + weight < dist[v]:
        dist[v] = dist[u] + weight

  for each edge (u, v, weight):
    if dist[u] + weight < dist[v]:
      return "Negative Cycle Detected"`;

  const applications = [
    "Shortest paths in graphs containing negative weights.",
    "Arbitrage detection in exchange trading systems.",
    "Routing Information Protocol (RIP)."
  ];
  const mistakes = [
    "Not checking if `dist[u]` is infinite before relaxation, which can lead to invalid relaxations of remote cells.",
    "Incorrect cycle flags if graph is undirected with negative edge values."
  ];
  const cpTips = [
    "If you only need to compute shortest paths on a Directed Acyclic Graph (DAG) with negative edges, you can do it in O(V + E) using Topological Sort relaxation steps!"
  ];

  return (
    <GrLayout
      timeComplexity="O(V * E)"
      spaceComplexity="O(V) distance state space"
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
            />

            {compared && (
              <div className="border-t border-border/5 pt-3 space-y-3 font-mono text-xs">
                {negativeCycle && (
                  <div className="p-3 border border-rose-500/20 bg-rose-500/10 text-rose-500 rounded-xl font-sans text-xs">
                    ⚠️ Negative Cycle Detected! Shortest paths are undefined because they can tend to negative infinity.
                  </div>
                )}

                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">
                    Computed Distances Table:
                  </span>
                  <div className="grid gap-2 grid-cols-5 text-center">
                    {nodes.map((n) => {
                      const dist = distances[n.id];
                      return (
                        <div key={n.id} className="p-2 border border-border/40 rounded-lg bg-background/30">
                          <div className="font-bold text-foreground">Node {n.id}</div>
                          <div className="text-emerald-500 font-extrabold">{dist !== undefined && dist !== Infinity ? dist : "INF"}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Bellman-Ford Relaxation Log:
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
        title="Bellman-Ford Solver"
        description="Compute single-source shortest paths and detect negative cycles on weighted graphs."
        category="Shortest Path"
        difficulty="Medium"
        shortcut="Alt+Shift+F"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <InputField
            label="Start Node ID"
            value={startNode}
            onChange={(val) => {
              setStartNode(val);
              setCompared(false);
            }}
          />

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Run Bellman-Ford Solver
          </Button>
        </CardContent>
      </Card>
    </GrLayout>
  );
}
