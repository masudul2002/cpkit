"use client";

import * as React from "react";
import { GrHeader } from "../../shared/gr-header";
import { GrLayout } from "../../shared/gr-layout";
import { GraphCanvas, NodeItem, EdgeItem } from "../../visualization/graph-canvas";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ArticulationTool() {
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
  const [articulations, setArticulations] = React.useState<string[]>([]);
  const [steps, setSteps] = React.useState<string[]>([]);

  const handleEvaluate = () => {
    setCompared(true);
    setArticulations([]);
    setSteps([]);

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

    const tin: Record<string, number> = {};
    const low: Record<string, number> = {};
    const visited = new Set<string>();
    const isCutPoint = new Set<string>();
    let timer = 0;
    const log: string[] = [];

    const dfs = (u: string, p?: string) => {
      visited.add(u);
      timer++;
      tin[u] = low[u] = timer;
      let children = 0;

      const neighbors = adj[u] || [];
      neighbors.forEach((v) => {
        if (v === p) return;
        if (visited.has(v)) {
          low[u] = Math.min(low[u], tin[v]);
        } else {
          dfs(v, u);
          low[u] = Math.min(low[u], low[v]);
          children++;
          log.push(`• Backtrack to ${u} from ${v}: low[${v}]=${low[v]}, tin[${u}]=${tin[u]}`);
          if (p !== undefined && low[v] >= tin[u]) {
            isCutPoint.add(u);
            log.push(`  ↳ Found Articulation Point: Node ${u} is critical (low[${v}] >= tin[${u}])`);
          }
        }
      });

      if (p === undefined && children > 1) {
        isCutPoint.add(u);
        log.push(`  ↳ Found Articulation Point: Root Node ${u} has ${children} independent subtrees`);
      }
    };

    nodes.forEach((node) => {
      if (!visited.has(node.id)) {
        dfs(node.id);
      }
    });

    const res = Array.from(isCutPoint);
    setArticulations(res);
    setSteps(log);
  };

  const definition = "An Articulation Point (cut vertex) is a node in an undirected graph whose removal (along with all its incident edges) increases the number of connected components.";
  const idea = "DFS traversal records tin[u] and low[u]. For non-root node u, it is a cut vertex if a child v has low[v] >= tin[u]. For root node, it is a cut vertex if it has >= 2 children.";
  const pseudocode = `FindCutVertices(u, parent=-1):
  visited[u] = true
  tin[u] = low[u] = timer++
  children = 0
  for each neighbor v of u:
    if v == parent: continue
    if visited[v]:
      low[u] = min(low[u], tin[v])
    else:
      FindCutVertices(v, u)
      low[u] = min(low[u], low[v])
      children++
      if parent != -1 and low[v] >= tin[u]:
        node u is cut vertex

  if parent == -1 and children > 1:
    node u is cut vertex`;

  const applications = [
    "Analyzing vulnerabilities in electrical grids or server lines.",
    "Biconnected components partitioning.",
    "Key hubs routing networks."
  ];
  const mistakes = [
    "Treating root nodes with only 1 child as articulation points.",
    "Forgetting parent node check parameters in non-root evaluations."
  ];
  const cpTips = [
    "Tarjan's articulation point solver runs in O(V + E) alongside bridge discovery, making it essential for connectivity auditing."
  ];

  return (
    <GrLayout
      timeComplexity="O(V + E)"
      spaceComplexity="O(V) times tables buffers"
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
              pathNodes={articulations} // Highlight articulation nodes in gold/path state!
            />

            {compared && (
              <div className="border-t border-border/5 pt-3 space-y-3 font-mono text-xs text-left">
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Number of Cut Vertices Found:</span>
                  <span className="font-bold text-amber-500">{articulations.length} vertices</span>
                </div>
                {articulations.length > 0 && (
                  <div className="flex justify-between border-b border-border/5 pb-1">
                    <span>Articulation Points (Nodes):</span>
                    <span className="font-bold text-amber-500">{articulations.join(", ")}</span>
                  </div>
                )}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Articulation DFS Traversal Trace:
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
        title="Articulation Points"
        description="Identify critical cut-nodes whose deletion disconnects the undirected graph."
        category="Properties"
        difficulty="Medium"
        shortcut="Alt+Shift+A"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <p className="text-xs text-muted-foreground">
            Click run to compute cut-vertices. Articulation points are highlighted in yellow on the canvas.
          </p>
          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Run Articulation Finder
          </Button>
        </CardContent>
      </Card>
    </GrLayout>
  );
}
