"use client";

import * as React from "react";
import { GrHeader } from "../../shared/gr-header";
import { GrLayout } from "../../shared/gr-layout";
import { GraphCanvas, NodeItem, EdgeItem } from "../../visualization/graph-canvas";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function SccTool() {
  const [nodes, setNodes] = React.useState<NodeItem[]>([
    { id: "0", label: "0", x: 100, y: 100 },
    { id: "1", label: "1", x: 280, y: 80 },
    { id: "2", label: "2", x: 120, y: 260 },
    { id: "3", label: "3", x: 300, y: 240 },
    { id: "4", label: "4", x: 200, y: 170 },
  ]);
  const [edges, setEdges] = React.useState<EdgeItem[]>([
    { id: "0-1", from: "0", to: "1", weight: 1, directed: true },
    { id: "1-2", from: "1", to: "2", weight: 1, directed: true },
    { id: "2-0", from: "2", to: "0", weight: 1, directed: true },
    { id: "1-3", from: "1", to: "3", weight: 1, directed: true },
    { id: "3-4", from: "3", to: "4", weight: 1, directed: true },
    { id: "4-3", from: "4", to: "3", weight: 1, directed: true },
  ]);

  const [compared, setCompared] = React.useState(false);
  const [sccGroups, setSccGroups] = React.useState<string[][]>([]);
  const [steps, setSteps] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handleEvaluate = () => {
    setError(null);
    setCompared(true);
    setSccGroups([]);
    setSteps([]);

    const V = nodes.length;
    if (V === 0) return;

    // Check if graph contains any directed edges
    const anyDirected = edges.some((e) => e.directed);
    if (!anyDirected) {
      setError("SCC is defined only on Directed Graphs. Please ensure edges are directed in controls.");
      return;
    }

    // Build standard adj list
    const adj: Record<string, string[]> = {};
    const revAdj: Record<string, string[]> = {};
    nodes.forEach((n) => {
      adj[n.id] = [];
      revAdj[n.id] = [];
    });

    edges.forEach((edge) => {
      adj[edge.from]?.push(edge.to);
      revAdj[edge.to]?.push(edge.from);
      if (!edge.directed) {
        adj[edge.to]?.push(edge.from);
        revAdj[edge.from]?.push(edge.to);
      }
    });

    const visited = new Set<string>();
    const stackOrder: string[] = [];
    const log: string[] = [];

    // Step 1: DFS finish times order
    const dfs1 = (u: string) => {
      visited.add(u);
      const neighbors = adj[u] || [];
      neighbors.forEach((v) => {
        if (!visited.has(v)) dfs1(v);
      });
      stackOrder.push(u);
    };

    nodes.forEach((node) => {
      if (!visited.has(node.id)) dfs1(node.id);
    });

    log.push(`• Step 1 finish order stack: [${stackOrder.join(", ")}]`);

    // Step 2: DFS on reversed graph
    visited.clear();
    const groups: string[][] = [];

    const dfs2 = (u: string, currentComponent: string[]) => {
      visited.add(u);
      currentComponent.push(u);
      const neighbors = revAdj[u] || [];
      neighbors.forEach((v) => {
        if (!visited.has(v)) dfs2(v, currentComponent);
      });
    };

    // Pop from finish stack backwards
    for (let i = stackOrder.length - 1; i >= 0; i--) {
      const u = stackOrder[i];
      if (!visited.has(u)) {
        const comp: string[] = [];
        dfs2(u, comp);
        groups.push(comp);
        log.push(`• Step 2: Extracted SCC component { ${comp.join(", ")} } starting from node ${u}`);
      }
    }

    setSccGroups(groups);
    setSteps(log);
  };

  const definition = "Strongly Connected Components (SCC) are maximal subgraphs in a directed graph where every vertex is reachable from any other vertex in the subgraph.";
  const idea = "Kosaraju's algorithm runs two DFS sweeps: first to order vertices by finish times; second on the transpose (reversed edge) graph processing nodes in reverse finish order to isolate components.";
  const pseudocode = `KosarajuSCC():
  visited = Set()
  stack = []
  for each node u:
    if u not visited: DFS1(u, visited, stack)

  rev_graph = transpose_edges()
  visited.clear()
  components = []
  while stack is not empty:
    u = stack.pop()
    if u not visited:
      comp = []
      DFS2(u, visited, comp)
      components.push(comp)`;

  const applications = [
    "Simplifying directed graphs into acyclic DAG representations (condensation graphs).",
    "Social network community detection.",
    "Solving 2-SAT boolean satisfiability constraints."
  ];
  const mistakes = [
    "Running SCC checks on undirected graphs.",
    "Forgetting to transpose edge directions before running the second DFS phase."
  ];
  const cpTips = [
    "Kosaraju is simpler to debug, but Tarjan's SCC solver is slightly faster as it extracts components in a single DFS pass using low-link times."
  ];

  return (
    <GrLayout
      timeComplexity="O(V + E) dual DFS passes"
      spaceComplexity="O(V + E) transpose adjacency list"
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

            {compared && sccGroups.length > 0 && (
              <div className="border-t border-border/5 pt-3 space-y-3 font-mono text-xs text-left">
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Total SCCs Found:</span>
                  <span className="font-bold text-emerald-500">{sccGroups.length} components</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">
                    Component Groupings:
                  </span>
                  <div className="space-y-2">
                    {sccGroups.map((g, idx) => (
                      <div key={idx} className="p-2 border border-border/40 rounded-lg bg-background/30 flex items-center justify-between font-sans">
                        <span className="text-xs font-bold text-muted-foreground">Component #{idx + 1}:</span>
                        <span className="font-mono text-xs text-emerald-500 font-extrabold">{`{ ${g.join(", ")} }`}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Kosaraju DFS Executions:
                  </span>
                  <div className="p-3 bg-muted/20 border border-border/10 rounded-lg max-h-36 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-1">
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
        title="Kosaraju SCC Solver"
        description="Extract strongly connected components (SCC) on directed graphs using dual DFS."
        category="Traversal"
        difficulty="Medium"
        shortcut="Alt+Shift+S"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <p className="text-xs text-muted-foreground">
            Set edges to "Directed" on the canvas controls, build components cycles, and click run.
          </p>
          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Extract SCCs
          </Button>
        </CardContent>
      </Card>
    </GrLayout>
  );
}
