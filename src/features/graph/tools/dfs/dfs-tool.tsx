"use client";

import * as React from "react";
import { GrHeader } from "../../shared/gr-header";
import { GrLayout } from "../../shared/gr-layout";
import { GraphCanvas, NodeItem, EdgeItem } from "../../visualization/graph-canvas";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function DfsTool() {
  const [nodes, setNodes] = React.useState<NodeItem[]>([
    { id: "0", label: "0", x: 100, y: 100 },
    { id: "1", label: "1", x: 280, y: 80 },
    { id: "2", label: "2", x: 120, y: 260 },
    { id: "3", label: "3", x: 300, y: 240 },
    { id: "4", label: "4", x: 200, y: 170 },
  ]);
  const [edges, setEdges] = React.useState<EdgeItem[]>([
    { id: "0-1", from: "0", to: "1", weight: 1, directed: false },
    { id: "0-2", from: "0", to: "2", weight: 1, directed: false },
    { id: "1-3", from: "1", to: "3", weight: 1, directed: false },
    { id: "2-3", from: "2", to: "3", weight: 1, directed: false },
    { id: "2-4", from: "2", to: "4", weight: 1, directed: false },
    { id: "4-3", from: "4", to: "3", weight: 1, directed: false },
  ]);

  const [startNode, setStartNode] = React.useState("0");
  const [compared, setCompared] = React.useState(false);

  const [visited, setVisited] = React.useState<string[]>([]);
  const [treeEdges, setTreeEdges] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handleEvaluate = () => {
    setError(null);
    setCompared(true);
    setVisited([]);
    setTreeEdges([]);

    const exists = nodes.some((n) => n.id === startNode);
    if (!exists) {
      setError("Start node does not exist in the graph.");
      return;
    }

    const adj: Record<string, string[]> = {};
    nodes.forEach((n) => { adj[n.id] = []; });
    edges.forEach((edge) => {
      adj[edge.from]?.push(edge.to);
      if (!edge.directed) {
        adj[edge.to]?.push(edge.from);
      }
    });

    const visitedSet = new Set<string>();
    const visOrder: string[] = [];
    const tree: string[] = [];

    const dfs = (u: string) => {
      visitedSet.add(u);
      visOrder.push(u);

      const neighbors = adj[u] || [];
      neighbors.forEach((v) => {
        if (!visitedSet.has(v)) {
          tree.push(`${u}-${v}`);
          dfs(v);
        }
      });
    };

    dfs(startNode);

    setVisited(visOrder);
    setTreeEdges(tree);
  };

  const definition = "Depth-First Search (DFS) is a traversal algorithm that visits vertices by going as deep as possible along each branch before backtracking.";
  const idea = "Implemented recursively using the system call stack (or iteratively using an explicit Stack). Visits start node, marks it visited, and recursively calls DFS on all unvisited neighbors.";
  const pseudocode = `DFS(u):
  mark u as visited
  visited_order.push(u)
  for each neighbor v of u:
    if v is not visited:
      DFS(v)`;

  const applications = [
    "Connected components labeling in graphs.",
    "Cycle detection in directed or undirected topologies.",
    "Topological sorting of DAGs."
  ];
  const mistakes = [
    "Failing to track visited nodes, causing recursive stack overflow errors.",
    "Using incorrect neighbors checks for directed edge graphs."
  ];
  const cpTips = [
    "In competitive programming contests, DFS is preferred for connectivity and tree queries because of its simple, short implementation code footprint."
  ];

  return (
    <GrLayout
      timeComplexity="O(V + E)"
      spaceComplexity="O(V) recursion call stack depth"
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
              highlightedEdges={treeEdges}
            />

            {compared && (
              <div className="border-t border-border/5 pt-3 space-y-3 font-mono text-xs">
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>DFS Traversal Order:</span>
                  <span className="font-bold text-primary">{visited.join(" → ")}</span>
                </div>
              </div>
            )}
            {error && <div className="text-xs text-rose-500 font-semibold font-mono">{error}</div>}
          </CardContent>
        </Card>
      }
    >
      <GrHeader
        title="DFS Traversal"
        description="Visualize depth-first graph traversals recursively tracing parent paths."
        category="Traversal"
        difficulty="Easy"
        shortcut="Alt+Shift+W"
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
            Run DFS Traversal
          </Button>
        </CardContent>
      </Card>
    </GrLayout>
  );
}
