"use client";

import * as React from "react";
import { GrHeader } from "../../shared/gr-header";
import { GrLayout } from "../../shared/gr-layout";
import { GraphCanvas, NodeItem, EdgeItem } from "../../visualization/graph-canvas";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function TopologicalSortTool() {
  const [nodes, setNodes] = React.useState<NodeItem[]>([
    { id: "0", label: "0", x: 100, y: 100 },
    { id: "1", label: "1", x: 280, y: 80 },
    { id: "2", label: "2", x: 120, y: 260 },
    { id: "3", label: "3", x: 300, y: 240 },
    { id: "4", label: "4", x: 200, y: 170 },
  ]);
  const [edges, setEdges] = React.useState<EdgeItem[]>([
    { id: "0-1", from: "0", to: "1", weight: 1, directed: true },
    { id: "0-2", from: "0", to: "2", weight: 1, directed: true },
    { id: "1-3", from: "1", to: "3", weight: 1, directed: true },
    { id: "2-3", from: "2", to: "3", weight: 1, directed: true },
    { id: "2-4", from: "2", to: "4", weight: 1, directed: true },
    { id: "4-3", from: "4", to: "3", weight: 1, directed: true },
  ]);

  const [compared, setCompared] = React.useState(false);
  const [sortedOrder, setSortedOrder] = React.useState<string[]>([]);
  const [hasCycle, setHasCycle] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleEvaluate = () => {
    setError(null);
    setCompared(true);
    setSortedOrder([]);
    setHasCycle(false);

    const V = nodes.length;
    const inDegree: Record<string, number> = {};
    nodes.forEach((n) => { inDegree[n.id] = 0; });

    const adj: Record<string, string[]> = {};
    nodes.forEach((n) => { adj[n.id] = []; });

    edges.forEach((edge) => {
      adj[edge.from]?.push(edge.to);
      if (inDegree[edge.to] !== undefined) {
        inDegree[edge.to]++;
      }
    });

    // Kahn's Queue
    const q: string[] = [];
    nodes.forEach((n) => {
      if (inDegree[n.id] === 0) {
        q.push(n.id);
      }
    });

    const order: string[] = [];
    while (q.length > 0) {
      const u = q.shift()!;
      order.push(u);

      const neighbors = adj[u] || [];
      neighbors.forEach((v) => {
        inDegree[v]--;
        if (inDegree[v] === 0) {
          q.push(v);
        }
      });
    }

    setSortedOrder(order);

    if (order.length < V) {
      setHasCycle(true);
      setError("Topological Sort is impossible: The graph contains a cycle!");
    }
  };

  const definition = "Topological Sort orders the vertices of a Directed Acyclic Graph (DAG) linearly such that for every directed edge u -> v, vertex u comes before v in the ordering.";
  const idea = "Kahn's algorithm tracks in-degrees for all vertices, pushing zero-in-degree nodes into a queue. Popped vertices are appended to the sort, and adjacent in-degrees are decremented.";
  const pseudocode = `KahnTopologicalSort():
  in_degree = compute_indegrees()
  Q = Queue()
  for each node u:
    if in_degree[u] == 0: Q.push(u)

  order = []
  while Q is not empty:
    u = Q.pop()
    order.push(u)
    for each neighbor v of u:
      in_degree[v]--
      if in_degree[v] == 0: Q.push(v)

  if order.length < V: return "Cycle Detected"`;

  const applications = [
    "Instruction scheduling and task dependencies resolution.",
    "Auto-build package dependency compilers (e.g. webpack, make).",
    "Formula evaluations cells orders inside spreadsheets."
  ];
  const mistakes = [
    "Running topological sort on undirected graphs.",
    "Not flagging cycles when the output order length is less than V."
  ];
  const cpTips = [
    "If you need lexicographically smallest topological sort (e.g. node 0 preferred over 1 when independent), substitute the queue with a min-priority queue (min-heap)!"
  ];

  return (
    <GrLayout
      timeComplexity="O(V + E)"
      spaceComplexity="O(V) in-degree tracking array"
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
              <div className="border-t border-border/5 pt-3 space-y-3 font-mono text-xs text-left">
                {hasCycle ? (
                  <div className="p-3 border border-rose-500/20 bg-rose-500/10 text-rose-500 rounded-xl font-sans text-xs">
                    ⚠️ Cycle Detected! Topological sort is defined only on Directed Acyclic Graphs (DAGs).
                  </div>
                ) : (
                  <div className="flex justify-between border-b border-border/5 pb-1">
                    <span>Topological Sort Order:</span>
                    <span className="font-bold text-emerald-500">{sortedOrder.join(" → ")}</span>
                  </div>
                )}
              </div>
            )}
            {error && !hasCycle && <div className="text-xs text-rose-500 font-semibold font-mono">{error}</div>}
          </CardContent>
        </Card>
      }
    >
      <GrHeader
        title="Topological Sort"
        description="Linear dependency ordering for DAGs using Kahn's in-degree queue algorithm."
        category="Traversal"
        difficulty="Medium"
        shortcut="Alt+Shift+T"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <p className="text-xs text-muted-foreground">
            Ensure edges are directed (check "Directed" inside canvas controls) to model a dependency DAG, then run.
          </p>
          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Run Kahn's Algo
          </Button>
        </CardContent>
      </Card>
    </GrLayout>
  );
}
