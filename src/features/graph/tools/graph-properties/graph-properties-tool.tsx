"use client";

import * as React from "react";
import { GrHeader } from "../../shared/gr-header";
import { GrLayout } from "../../shared/gr-layout";
import { GraphCanvas, NodeItem, EdgeItem } from "../../visualization/graph-canvas";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function GraphPropertiesTool() {
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
  const [stats, setStats] = React.useState<{
    vCount: number;
    eCount: number;
    density: number;
    components: number;
    isTree: boolean;
    isDAG: boolean;
    hasCycle: boolean;
    adjListStr: string[];
  } | null>(null);

  const handleEvaluate = () => {
    setCompared(true);

    const V = nodes.length;
    const E = edges.length;

    if (V === 0) {
      setStats({
        vCount: 0,
        eCount: 0,
        density: 0,
        components: 0,
        isTree: false,
        isDAG: false,
        hasCycle: false,
        adjListStr: [],
      });
      return;
    }

    // Build Adjacency mappings
    const adj: Record<string, string[]> = {};
    const inDegree: Record<string, number> = {};
    nodes.forEach((n) => {
      adj[n.id] = [];
      inDegree[n.id] = 0;
    });

    edges.forEach((edge) => {
      adj[edge.from]?.push(edge.to);
      if (inDegree[edge.to] !== undefined) inDegree[edge.to]++;
      if (!edge.directed) {
        adj[edge.to]?.push(edge.from);
      }
    });

    // 1. Connected components sweep
    const visited = new Set<string>();
    let componentsCount = 0;

    const dfs = (u: string) => {
      visited.add(u);
      (adj[u] || []).forEach((v) => {
        if (!visited.has(v)) dfs(v);
      });
    };

    nodes.forEach((node) => {
      if (!visited.has(node.id)) {
        componentsCount++;
        dfs(node.id);
      }
    });

    // 2. Cycle Detection
    let cycleFound = false;
    const tempVisited = new Set<string>();
    const recStack = new Set<string>();

    const hasCycleDfsDirected = (u: string): boolean => {
      tempVisited.add(u);
      recStack.add(u);

      const neighbors = adj[u] || [];
      for (const v of neighbors) {
        if (!tempVisited.has(v)) {
          if (hasCycleDfsDirected(v)) return true;
        } else if (recStack.has(v)) {
          return true;
        }
      }

      recStack.delete(u);
      return false;
    };

    const hasCycleDfsUndirected = (u: string, p?: string): boolean => {
      tempVisited.add(u);

      const neighbors = adj[u] || [];
      for (const v of neighbors) {
        if (v === p) continue;
        if (tempVisited.has(v)) return true;
        if (hasCycleDfsUndirected(v, u)) return true;
      }
      return false;
    };

    tempVisited.clear();
    const isDirected = edges.some((e) => e.directed);

    for (const node of nodes) {
      if (!tempVisited.has(node.id)) {
        if (isDirected) {
          if (hasCycleDfsDirected(node.id)) {
            cycleFound = true;
            break;
          }
        } else {
          if (hasCycleDfsUndirected(node.id)) {
            cycleFound = true;
            break;
          }
        }
      }
    }

    // 3. Tree check: connected, undirected, and no cycles
    const tree = !isDirected && componentsCount === 1 && !cycleFound && E === V - 1;

    // 4. DAG check: directed and no cycles
    const dag = isDirected && !cycleFound;

    // 5. Density
    const maxEdges = isDirected ? V * (V - 1) : (V * (V - 1)) / 2;
    const densityVal = maxEdges > 0 ? E / maxEdges : 0;

    // 6. Adjacency list representation strings
    const adjStrings = nodes.map((node) => {
      const neighbors = adj[node.id] || [];
      return `Node ${node.id} → [ ${neighbors.join(", ")} ]`;
    });

    setStats({
      vCount: V,
      eCount: E,
      density: densityVal,
      components: componentsCount,
      isTree: tree,
      isDAG: dag,
      hasCycle: cycleFound,
      adjListStr: adjStrings,
    });
  };

  const definition = "Graph properties summarize structural indices (such as connectivity, cyclic properties, density, degrees, and matrix representations) that classify the topology.";
  const idea = "Runs static sweeps. Computes DFS reachability for connected components, DFS recStacks for cycle flags, and loops edge list maps to populate degrees.";
  const pseudocode = `AuditGraphProperties():
  V = nodes.length
  E = edges.length
  components = count_connected_components()
  has_cycle = detect_cycles()
  is_tree = (components == 1 and not has_cycle and E == V - 1)`;

  const applications = [
    "Classifying tree vs graph input configurations.",
    "Selecting optimal algorithms based on graph density.",
    "Sanity checking constraints validations."
  ];
  const mistakes = [
    "Assuming cycles are absent in undirected graphs with duplicate edge inputs.",
    "Incorrect density denominators for directed vs undirected scopes."
  ];
  const cpTips = [
    "Always check vertex and edge bounds in CP tasks. If `E = V - 1` and components are connected, immediately treat the graph as a Tree to optimize with LCA or DP tree algorithms!"
  ];

  return (
    <GrLayout
      timeComplexity="O(V + E)"
      spaceComplexity="O(V + E) list sizes"
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

            {compared && stats && (
              <div className="border-t border-border/5 pt-3 space-y-4 font-mono text-xs text-left">
                {/* Properties list */}
                <div className="grid gap-4 grid-cols-2">
                  <div className="space-y-1">
                    <div className="flex justify-between border-b border-border/5 pb-1">
                      <span className="text-muted-foreground">Vertices (V):</span>
                      <span className="font-bold">{stats.vCount}</span>
                    </div>
                    <div className="flex justify-between border-b border-border/5 pb-1">
                      <span className="text-muted-foreground">Edges (E):</span>
                      <span className="font-bold">{stats.eCount}</span>
                    </div>
                    <div className="flex justify-between border-b border-border/5 pb-1">
                      <span className="text-muted-foreground">Density:</span>
                      <span className="font-bold">{stats.density.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-b border-border/5 pb-1">
                      <span className="text-muted-foreground">Components:</span>
                      <span className="font-bold">{stats.components}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between border-b border-border/5 pb-1">
                      <span className="text-muted-foreground">Is Tree:</span>
                      <span className={`font-bold ${stats.isTree ? "text-emerald-500" : "text-rose-500"}`}>
                        {stats.isTree ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-border/5 pb-1">
                      <span className="text-muted-foreground">Is DAG:</span>
                      <span className={`font-bold ${stats.isDAG ? "text-emerald-500" : "text-rose-500"}`}>
                        {stats.isDAG ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-border/5 pb-1">
                      <span className="text-muted-foreground">Has Cycle:</span>
                      <span className={`font-bold ${stats.hasCycle ? "text-rose-500" : "text-emerald-500"}`}>
                        {stats.hasCycle ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Adjacency List */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Adjacency List Mapping:
                  </span>
                  <div className="p-3 bg-muted/20 border border-border/10 rounded-lg max-h-36 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-1">
                    {stats.adjListStr.map((str, idx) => (
                      <div key={idx} className="text-foreground/80">{str}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      }
    >
      <GrHeader
        title="Graph Properties"
        description="Analyze graph statistics including degrees, density, connected components, cycles, DAG, and tree indicators."
        category="Properties"
        difficulty="Easy"
        shortcut="Alt+Shift+G"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <p className="text-xs text-muted-foreground">
            Modify vertices and edges on the canvas above then click analyze to audit the topological properties.
          </p>
          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Analyze Graph Properties
          </Button>
        </CardContent>
      </Card>
    </GrLayout>
  );
}
