"use client";

import * as React from "react";
import { GrHeader } from "../../shared/gr-header";
import { GrLayout } from "../../shared/gr-layout";
import { GraphCanvas, NodeItem, EdgeItem } from "../../visualization/graph-canvas";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function DijkstraTool() {
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

  const [startNode, setStartNode] = React.useState("0");
  const [compared, setCompared] = React.useState(false);

  const [visited, setVisited] = React.useState<string[]>([]);
  const [distances, setDistances] = React.useState<Record<string, number>>({});
  const [pathEdges, setPathEdges] = React.useState<string[]>([]);
  const [steps, setSteps] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handleEvaluate = () => {
    setError(null);
    setCompared(true);
    setVisited([]);
    setDistances({});
    setPathEdges([]);
    setSteps([]);

    const exists = nodes.some((n) => n.id === startNode);
    if (!exists) {
      setError("Start node does not exist in the graph.");
      return;
    }

    // Initialize structures
    const dist: Record<string, number> = {};
    const parent: Record<string, string> = {};
    const vis: Set<string> = new Set();
    const visOrder: string[] = [];
    const trace: string[] = [];

    nodes.forEach((n) => {
      dist[n.id] = Infinity;
    });
    dist[startNode] = 0;

    // Adjacency mappings
    const adj: Record<string, { to: string; weight: number; edgeId: string }[]> = {};
    nodes.forEach((n) => { adj[n.id] = []; });
    edges.forEach((edge) => {
      adj[edge.from]?.push({ to: edge.to, weight: edge.weight, edgeId: edge.id });
      if (!edge.directed) {
        adj[edge.to]?.push({ to: edge.from, weight: edge.weight, edgeId: edge.id });
      }
    });

    for (let step = 0; step < nodes.length; step++) {
      // Find node with minimum distance among unvisited
      let u: string | null = null;
      let minDist = Infinity;

      nodes.forEach((n) => {
        if (!vis.has(n.id) && dist[n.id] < minDist) {
          minDist = dist[n.id];
          u = n.id;
        }
      });

      if (u === null || dist[u] === Infinity) {
        break;
      }

      vis.add(u);
      visOrder.push(u);
      trace.push(`• Select Node ${u} with current minimum distance = ${dist[u]}`);

      const neighbors = adj[u] || [];
      neighbors.forEach(({ to: v, weight, edgeId }) => {
        if (!vis.has(v)) {
          const oldDist = dist[v];
          const newDist = dist[u!] + weight;
          if (newDist < oldDist) {
            dist[v] = newDist;
            parent[v] = u!;
            trace.push(`  → Relax Edge ${edgeId}: Dist to ${v} updated from ${oldDist === Infinity ? "INF" : oldDist} to ${newDist}`);
          }
        }
      });
    }

    // Reconstruct paths edges
    const pEdges: string[] = [];
    nodes.forEach((n) => {
      let curr = n.id;
      while (parent[curr]) {
        const p = parent[curr];
        pEdges.push(`${p}-${curr}`);
        curr = p;
      }
    });

    setVisited(visOrder);
    setDistances(dist);
    setPathEdges(pEdges);
    setSteps(trace);
  };

  const definition = "Dijkstra's Algorithm finds the shortest paths from a single source node to all other nodes in a graph with non-negative edge weights.";
  const idea = "Repeatedly selects the unvisited node with the smallest tentative distance, relaxes all of its outgoing edges, and marks it as visited.";
  const pseudocode = `Dijkstra(start_node):
  dist[start_node] = 0
  for all other nodes v: dist[v] = INF
  PQ.push((0, start_node))

  while PQ is not empty:
    (d, u) = PQ.pop()
    if d > dist[u]: continue
    for each neighbor (v, weight) of u:
      if dist[u] + weight < dist[v]:
        dist[v] = dist[u] + weight
        PQ.push((dist[v], v))`;

  const applications = [
    "GPS routing navigation routes maps.",
    "Network packets routing routing protocols.",
    "Pathfinding in game lattices."
  ];
  const mistakes = [
    "Attempting to run Dijkstra on graphs with negative edge weights, which can cause infinite loops or incorrect distances.",
    "Not checking if popped node distance exceeds current distance, leading to redundant relaxations."
  ];
  const cpTips = [
    "Always use a `std::priority_queue` in C++ or min-heap structures to achieve O(E log V) running times in competitive programming."
  ];

  return (
    <GrLayout
      timeComplexity="O(E log V) / O(V^2)"
      spaceComplexity="O(V + E) priority heap & tables"
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
              visitedNodes={visited}
              highlightedEdges={pathEdges}
            />

            {compared && (
              <div className="border-t border-border/5 pt-3 space-y-3 font-mono text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">
                    Shortest Distances Table:
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
                    Dijkstra Edge Relaxation Steps:
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
        title="Dijkstra Shortest Path"
        description="Calculate single-source shortest paths on weighted graphs using greedy edge relaxation."
        category="Shortest Path"
        difficulty="Medium"
        shortcut="Alt+Shift+J"
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
            Run Dijkstra Solver
          </Button>
        </CardContent>
      </Card>
    </GrLayout>
  );
}
