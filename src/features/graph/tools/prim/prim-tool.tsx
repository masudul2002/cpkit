"use client";

import * as React from "react";
import { GrHeader } from "../../shared/gr-header";
import { GrLayout } from "../../shared/gr-layout";
import { GraphCanvas, NodeItem, EdgeItem } from "../../visualization/graph-canvas";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function PrimTool() {
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

  const [mstEdges, setMstEdges] = React.useState<string[]>([]);
  const [totalWeight, setTotalWeight] = React.useState<number | null>(null);
  const [visited, setVisited] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handleEvaluate = () => {
    setError(null);
    setCompared(true);
    setMstEdges([]);
    setTotalWeight(null);
    setVisited([]);

    const exists = nodes.some((n) => n.id === startNode);
    if (!exists) {
      setError("Start node does not exist in the graph.");
      return;
    }

    const V = nodes.length;
    const visitedSet = new Set<string>([startNode]);
    const selectedEdges: string[] = [];
    let sum = 0;

    // Run V - 1 times to find edges
    while (visitedSet.size < V) {
      let minEdge: EdgeItem | null = null;
      let minW = Infinity;

      edges.forEach((edge) => {
        const uVisited = visitedSet.has(edge.from);
        const vVisited = visitedSet.has(edge.to);

        // One endpoint must be in MST, the other outside (unvisited)
        if ((uVisited && !vVisited) || (!uVisited && vVisited)) {
          if (edge.weight < minW) {
            minW = edge.weight;
            minEdge = edge;
          }
        }
      });

      if (minEdge === null) {
        // Disconnected graph
        setError("Warning: Graph is disconnected. Spanning tree is incomplete.");
        break;
      }

      const activeEdge = minEdge as EdgeItem;
      visitedSet.add(activeEdge.from);
      visitedSet.add(activeEdge.to);
      selectedEdges.push(activeEdge.id);
      sum += activeEdge.weight;
    }

    setMstEdges(selectedEdges);
    setTotalWeight(sum);
    setVisited(Array.from(visitedSet));
  };

  const definition = "Prim's Algorithm grows a Minimum Spanning Tree (MST) from a starting vertex by greedily adding the cheapest edge connecting visited nodes to unvisited nodes.";
  const idea = "Starts from root. Tracks adjacent minimum edge values using a min-priority queue, selecting the next cheapest transition that avoids cycle loops.";
  const pseudocode = `PrimMST(start_node):
  vis[start_node] = true
  PQ.push(edges outgoing from start_node)

  while PQ is not empty and MST edges < V - 1:
    (weight, u, v) = PQ.pop()
    if vis[u] and vis[v]: continue

    let next_node = vis[u] ? v : u
    vis[next_node] = true
    MST.push(edge u-v)
    PQ.push(edges outgoing from next_node)`;

  const applications = [
    "Minimizing wiring and routing network layout costs.",
    "Approximation algorithms for TSP (Travelling Salesperson).",
    "Cluster analysis in data science."
  ];
  const mistakes = [
    "Failing to filter out edges that connect two already visited nodes, creating loops.",
    "Not checking for disconnected elements."
  ];
  const cpTips = [
    "Use Prim's algorithm for dense graphs (E ≈ V^2) with matrix inputs; for sparse graphs, Kruskal's algorithm is usually easier and faster."
  ];

  return (
    <GrLayout
      timeComplexity="O(E log V) / O(V^2)"
      spaceComplexity="O(V) visited tracking arrays"
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
              highlightedEdges={mstEdges}
            />

            {compared && totalWeight !== null && (
              <div className="border-t border-border/5 pt-3 space-y-3 font-mono text-xs text-left">
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>MST Total Weight:</span>
                  <span className="font-bold text-emerald-500">{totalWeight}</span>
                </div>
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Spanning Tree Edges:</span>
                  <span className="font-bold text-primary">{mstEdges.join(", ")}</span>
                </div>
              </div>
            )}
            {error && <div className="text-xs text-rose-500 font-semibold font-mono">{error}</div>}
          </CardContent>
        </Card>
      }
    >
      <GrHeader
        title="Prim's MST"
        description="Construct a Minimum Spanning Tree greedily connecting closest neighbors."
        category="Spanning Tree"
        difficulty="Medium"
        shortcut="Alt+Shift+I"
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
            Run Prim Solver
          </Button>
        </CardContent>
      </Card>
    </GrLayout>
  );
}
