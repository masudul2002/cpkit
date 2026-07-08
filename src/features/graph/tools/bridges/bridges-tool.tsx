"use client";

import * as React from "react";
import { GrHeader } from "../../shared/gr-header";
import { GrLayout } from "../../shared/gr-layout";
import { GraphCanvas, NodeItem, EdgeItem } from "../../visualization/graph-canvas";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function BridgesTool() {
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
    { id: "1-2", from: "1", to: "2", weight: 1, directed: false },
    { id: "2-4", from: "2", to: "4", weight: 1, directed: false },
    { id: "4-3", from: "4", to: "3", weight: 1, directed: false },
  ]);

  const [compared, setCompared] = React.useState(false);
  const [bridges, setBridges] = React.useState<string[]>([]);
  const [steps, setSteps] = React.useState<string[]>([]);

  const handleEvaluate = () => {
    setCompared(true);
    setBridges([]);
    setSteps([]);

    const V = nodes.length;
    const adj: Record<string, string[]> = {};
    nodes.forEach((n) => { adj[n.id] = []; });
    edges.forEach((edge) => {
      adj[edge.from]?.push(edge.to);
      if (!edge.directed) {
        adj[edge.to]?.push(edge.from);
      }
    });

    const tin: Record<string, number> = {};
    const low: Record<string, number> = {};
    const visited = new Set<string>();
    let timer = 0;

    const bridgeList: string[] = [];
    const log: string[] = [];

    const dfs = (u: string, p?: string) => {
      visited.add(u);
      timer++;
      tin[u] = low[u] = timer;

      const neighbors = adj[u] || [];
      neighbors.forEach((v) => {
        if (v === p) return;
        if (visited.has(v)) {
          low[u] = Math.min(low[u], tin[v]);
        } else {
          dfs(v, u);
          low[u] = Math.min(low[u], low[v]);
          log.push(`• Backtrack to ${u} from ${v}: tin[${u}]=${tin[u]}, low[${v}]=${low[v]}`);
          if (low[v] > tin[u]) {
            bridgeList.push(`${u}-${v}`);
            bridgeList.push(`${v}-${u}`);
            log.push(`  ↳ Found Bridge: Edge ${u}-${v} is critical (low[${v}] > tin[${u}])`);
          }
        }
      });
    };

    nodes.forEach((node) => {
      if (!visited.has(node.id)) {
        dfs(node.id);
      }
    });

    // Clean duplicates (keep standard edge IDs matching edges list)
    const activeBridges = edges.filter((e) =>
      bridgeList.includes(e.id) || bridgeList.includes(`${e.to}-${e.from}`)
    ).map((e) => e.id);

    setBridges(activeBridges);
    setSteps(log);
  };

  const definition = "A Bridge (cut edge) is an edge in a graph whose deletion increases the graph's number of connected components (disconnects a portion of the graph).";
  const idea = "Computes discovery time tin[u] and lowest reachable time low[u] via DFS. If a neighbor v has low[v] > tin[u], then u-v is a bridge because v has no back-edges to ancestors of u.";
  const pseudocode = `FindBridges(u, parent=-1):
  visited[u] = true
  tin[u] = low[u] = timer++
  for each neighbor v of u:
    if v == parent: continue
    if visited[v]:
      low[u] = min(low[u], tin[v])
    else:
      FindBridges(v, u)
      low[u] = min(low[u], low[v])
      if low[v] > tin[u]:
        edge u-v is a bridge`;

  const applications = [
    "Identifying vulnerabilities in computer networks.",
    "Road traffic bottlenecks planning.",
    "Biconnected components partitions."
  ];
  const mistakes = [
    "Treating parent edges as back-edges, yielding false low values.",
    "Not handling multi-edges between the same node pair correctly."
  ];
  const cpTips = [
    "Bridge finding is evaluated in O(V + E) using Tarjan's single-pass DFS. Ensure undirected graphs are processed with parents check parameters."
  ];

  return (
    <GrLayout
      timeComplexity="O(V + E)"
      spaceComplexity="O(V) recursion times tables"
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
              highlightedEdges={bridges}
            />

            {compared && (
              <div className="border-t border-border/5 pt-3 space-y-3 font-mono text-xs text-left">
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Number of Bridges Found:</span>
                  <span className="font-bold text-rose-500">{bridges.length} bridges</span>
                </div>
                {bridges.length > 0 && (
                  <div className="flex justify-between border-b border-border/5 pb-1">
                    <span>Critical Bridge Edges:</span>
                    <span className="font-bold text-rose-500">{bridges.join(", ")}</span>
                  </div>
                )}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Bridges DFS Traversal Steps:
                  </span>
                  <div className="p-3 bg-muted/20 border border-border/10 rounded-lg max-h-40 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-1">
                    {steps.length > 0 ? steps.map((step, idx) => (
                      <div key={idx} className="text-foreground/80">{step}</div>
                    )) : <div className="text-muted-foreground">No operations logged yet.</div>}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      }
    >
      <GrHeader
        title="Critical Bridges Solver"
        description="Detect critical bridge edges whose deletion disconnects the undirected graph."
        category="Properties"
        difficulty="Medium"
        shortcut="Alt+Shift+R"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <p className="text-xs text-muted-foreground">
            Click run to trace back-edges. Bridge edges are highlighted in yellow on the canvas.
          </p>
          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Run Bridge Finder
          </Button>
        </CardContent>
      </Card>
    </GrLayout>
  );
}
