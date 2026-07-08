"use client";

import * as React from "react";
import { GrHeader } from "../../shared/gr-header";
import { GrLayout } from "../../shared/gr-layout";
import { GraphCanvas, NodeItem, EdgeItem } from "../../visualization/graph-canvas";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function BipartiteTool() {
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

  const [compared, setCompared] = React.useState(false);
  const [isBipartite, setIsBipartite] = React.useState(true);
  const [colors, setColors] = React.useState<Record<string, string>>({});
  const [conflictEdge, setConflictEdge] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleEvaluate = () => {
    setError(null);
    setCompared(true);
    setColors({});
    setConflictEdge(null);
    setIsBipartite(true);

    const R = nodes.length;
    if (R === 0) return;

    // Build adjacency list
    const adj: Record<string, string[]> = {};
    nodes.forEach((n) => { adj[n.id] = []; });
    edges.forEach((edge) => {
      adj[edge.from]?.push(edge.to);
      if (!edge.directed) {
        adj[edge.to]?.push(edge.from);
      }
    });

    const colMap: Record<string, number> = {}; // 0 or 1
    let ok = true;
    let badEdge: string | null = null;

    // Handle disconnected graphs
    for (let i = 0; i < R; i++) {
      const startId = nodes[i].id;
      if (colMap[startId] === undefined) {
        const q = [startId];
        colMap[startId] = 0;

        while (q.length > 0) {
          const curr = q.shift()!;
          const neighbors = adj[curr] || [];

          for (const nxt of neighbors) {
            if (colMap[nxt] === undefined) {
              colMap[nxt] = 1 - colMap[curr];
              q.push(nxt);
            } else if (colMap[nxt] === colMap[curr]) {
              ok = false;
              badEdge = `${curr}-${nxt}`;
              break;
            }
          }
          if (!ok) break;
        }
      }
      if (!ok) break;
    }

    setIsBipartite(ok);
    if (!ok) {
      setError(`Graph is NOT bipartite. Conflict found at edge: ${badEdge}`);
      setConflictEdge(badEdge);
    }

    // Convert colors to highlight strings
    const strColors: Record<string, string> = {};
    nodes.forEach((n) => {
      const c = colMap[n.id];
      strColors[n.id] = c === 0 ? "Red" : c === 1 ? "Blue" : "None";
    });
    setColors(strColors);
  };

  const definition = "A Bipartite Graph is a graph whose vertices can be divided into two independent sets U and V such that every edge connects a vertex in U to one in V. No edges exist between vertices of the same set.";
  const idea = "Run BFS / DFS to two-color the graph. If any adjacent neighbors share the same color, the graph contains an odd-length cycle and is not bipartite.";
  const pseudocode = `IsBipartite():
  color = {} // stores 0 or 1 for each node
  for each uncolored node start:
    color[start] = 0
    Q = Queue([start])
    while Q is not empty:
      u = Q.pop()
      for each neighbor v of u:
        if v not in color:
          color[v] = 1 - color[u]
          Q.push(v)
        else if color[v] == color[u]:
          return false
  return true`;

  const applications = [
    "Stable marriage problems and matching markets.",
    "Maximum flow matching algorithms.",
    "Scheduling jobs across processors."
  ];
  const mistakes = [
    "Failing to sweep all vertices, missing disconnected components which may contain odd cycles.",
    "Assuming undirected edges only."
  ];
  const cpTips = [
    "Bipartite graph verification is identical to checking if a graph contains any odd cycles. If the graph contains only even cycles, it is always bipartite."
  ];

  return (
    <GrLayout
      timeComplexity="O(V + E)"
      spaceComplexity="O(V) coloring buffer"
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
              highlightedEdges={conflictEdge ? [conflictEdge] : []}
            />

            {compared && (
              <div className="border-t border-border/5 pt-3 space-y-3 font-mono text-xs text-left">
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Is Bipartite:</span>
                  <span className={`font-bold ${isBipartite ? "text-emerald-500" : "text-rose-500"}`}>
                    {isBipartite ? "YES (Bipartite Graph)" : "NO (Non-Bipartite Graph)"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">
                    Vertex Color Partition:
                  </span>
                  <div className="grid gap-2 grid-cols-5 text-center font-sans">
                    {nodes.map((n) => {
                      const col = colors[n.id];
                      return (
                        <div key={n.id} className="p-2 border border-border/40 rounded-lg bg-background/30">
                          <div className="font-bold text-foreground">Node {n.id}</div>
                          <div className={`text-xs font-extrabold mt-1 ${
                            col === "Red" ? "text-rose-500" : col === "Blue" ? "text-blue-500" : "text-muted-foreground"
                          }`}>{col || "None"}</div>
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
        title="Bipartite Checker"
        description="Verify bipartite properties by trying to two-color the graph nodes."
        category="Properties"
        difficulty="Easy"
        shortcut="Alt+Shift+C"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <p className="text-xs text-muted-foreground">
            Run two-coloring check. If conflicts are found, the offending odd-cycle edge is highlighted.
          </p>
          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Check Bipartite Property
          </Button>
        </CardContent>
      </Card>
    </GrLayout>
  );
}
