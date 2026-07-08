"use client";

import * as React from "react";
import { GrHeader } from "../../shared/gr-header";
import { GrLayout } from "../../shared/gr-layout";
import { GraphCanvas, NodeItem, EdgeItem } from "../../visualization/graph-canvas";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function BfsTool() {
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
  const [distances, setDistances] = React.useState<Record<string, number>>({});
  const [treeEdges, setTreeEdges] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handleEvaluate = () => {
    setError(null);
    setCompared(true);
    setVisited([]);
    setDistances({});
    setTreeEdges([]);

    const exists = nodes.some((n) => n.id === startNode);
    if (!exists) {
      setError("Start node does not exist in the graph.");
      return;
    }

    // Run BFS
    const adj: Record<string, string[]> = {};
    nodes.forEach((n) => { adj[n.id] = []; });
    edges.forEach((edge) => {
      adj[edge.from]?.push(edge.to);
      if (!edge.directed) {
        adj[edge.to]?.push(edge.from);
      }
    });

    const q: string[] = [startNode];
    const dists: Record<string, number> = { [startNode]: 0 };
    const visOrder: string[] = [];
    const tree: string[] = [];
    const visitedSet = new Set<string>([startNode]);

    while (q.length > 0) {
      const curr = q.shift()!;
      visOrder.push(curr);

      const neighbors = adj[curr] || [];
      neighbors.forEach((nxt) => {
        if (!visitedSet.has(nxt)) {
          visitedSet.add(nxt);
          dists[nxt] = dists[curr] + 1;
          tree.push(`${curr}-${nxt}`);
          q.push(nxt);
        }
      });
    }

    setVisited(visOrder);
    setDistances(dists);
    setTreeEdges(tree);
  };

  const definition = "Breadth-First Search (BFS) is a fundamental traversal algorithm that explores all vertices of a graph at the current depth level before moving to the next level.";
  const idea = "Initialize a FIFO queue with the start node, marking it visited. Loop until queue is empty, popping the front node and pushing all unvisited neighbors, updating distances.";
  const pseudocode = `BFS(start_node):
  let Q = Queue()
  Q.push(start_node)
  mark start_node as visited
  dist[start_node] = 0

  while Q is not empty:
    let u = Q.pop()
    for each neighbor v of u:
      if v is not visited:
        mark v visited
        dist[v] = dist[u] + 1
        Q.push(v)`;

  const applications = [
    "Shortest path in unweighted graphs.",
    "Web crawling and indexing.",
    "Bipartite graph checking (Two-coloring)."
  ];
  const mistakes = [
    "Forgetting to mark nodes visited immediately when pushing to queue, causing redundant pushes and infinite loops.",
    "Not handling disconnected graphs."
  ];
  const cpTips = [
    "Use BFS for any shortest path queries where edge weights are unweighted (or all weights are 1) as it runs in O(V + E) without priority queue overhead."
  ];

  return (
    <GrLayout
      timeComplexity="O(V + E)"
      spaceComplexity="O(V) queue & visited buffers"
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
                  <span>Visited Traversal Order:</span>
                  <span className="font-bold text-primary">{visited.join(" → ")}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">
                    Shortest Distances from Node {startNode}:
                  </span>
                  <div className="grid gap-2 grid-cols-5 text-center">
                    {nodes.map((n) => {
                      const dist = distances[n.id];
                      return (
                        <div key={n.id} className="p-2 border border-border/40 rounded-lg bg-background/30">
                          <div className="font-bold text-foreground">Node {n.id}</div>
                          <div className="text-emerald-500 font-extrabold">{dist !== undefined ? dist : "INF"}</div>
                        </div>
                      );
                    })}
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
        title="BFS Traversal"
        description="Visualize graph exploration level-by-level using FIFO queues and unweighted distances."
        category="Traversal"
        difficulty="Easy"
        shortcut="Alt+Shift+Q"
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
            Run BFS Traversal
          </Button>
        </CardContent>
      </Card>
    </GrLayout>
  );
}
