"use client";

import * as React from "react";
import { TrHeader } from "../../shared/tr-header";
import { TrLayout } from "../../shared/tr-layout";
import { TreeCanvas, TreeNode, TreeEdge } from "../../visualization/tree-canvas";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function DiameterTool() {
  const [nodes, setNodes] = React.useState<TreeNode[]>([
    { id: "1", label: "1", x: 300, y: 50 },
    { id: "2", label: "2", x: 200, y: 120, parentId: "1" },
    { id: "3", label: "3", x: 400, y: 120, parentId: "1" },
    { id: "4", label: "4", x: 150, y: 190, parentId: "2" },
    { id: "5", label: "5", x: 250, y: 190, parentId: "2" },
  ]);
  const [edges, setEdges] = React.useState<TreeEdge[]>([
    { id: "1-2", from: "1", to: "2" },
    { id: "1-3", from: "1", to: "3" },
    { id: "2-4", from: "2", to: "4" },
    { id: "2-5", from: "2", to: "5" },
  ]);

  const [compared, setCompared] = React.useState(false);
  const [diameter, setDiameter] = React.useState<number>(0);
  const [diameterNodes, setDiameterNodes] = React.useState<string[]>([]);
  const [steps, setSteps] = React.useState<string[]>([]);

  const handleEvaluate = () => {
    setCompared(true);
    setSteps([]);
    setDiameterNodes([]);

    if (nodes.length === 0) {
      setDiameter(0);
      return;
    }

    // Build undirected tree
    const adj: Record<string, string[]> = {};
    nodes.forEach((n) => { adj[n.id] = []; });
    edges.forEach((e) => {
      adj[e.from]?.push(e.to);
      adj[e.to]?.push(e.from);
    });

    const log: string[] = [];

    // Helper DFS to find farthest node
    const getFarthest = (start: string): { node: string; dist: number; path: string[] } => {
      const dists: Record<string, number> = { [start]: 0 };
      const parent: Record<string, string> = {};
      const q: string[] = [start];

      let farNode = start;
      let maxDist = 0;

      while (q.length > 0) {
        const u = q.shift()!;
        const d = dists[u];

        if (d > maxDist) {
          maxDist = d;
          farNode = u;
        }

        (adj[u] || []).forEach((v) => {
          if (dists[v] === undefined) {
            dists[v] = d + 1;
            parent[v] = u;
            q.push(v);
          }
        });
      }

      // Reconstruct path
      const path: string[] = [];
      let curr = farNode;
      while (curr !== start) {
        path.push(curr);
        curr = parent[curr];
      }
      path.push(start);
      return { node: farNode, dist: maxDist, path: path.reverse() };
    };

    const arbitrary = nodes[0].id;
    log.push(`• Step 1: Run DFS from arbitrary Node ${arbitrary}:`);
    const pass1 = getFarthest(arbitrary);
    log.push(`  → Farthest node found: Node ${pass1.node} at distance ${pass1.dist}`);

    log.push(`• Step 2: Run DFS from Node ${pass1.node}:`);
    const pass2 = getFarthest(pass1.node);
    log.push(`  → Farthest node found: Node ${pass2.node} at distance ${pass2.dist}`);
    log.push(`  → Diameter Path: [ ${pass2.path.join(" → ")} ]`);

    setDiameter(pass2.dist);
    setDiameterNodes(pass2.path);
    setSteps(log);
  };

  const definition = "The Diameter of a tree is the maximum length of a simple path between any two vertices in the tree (the maximum distance between any two nodes).";
  const idea = "Can be solved using two DFS sweeps on undirected trees: first DFS from an arbitrary node locates the farthest leaf y; second DFS from y locates the farthest node z. The path y-z is the diameter.";
  const pseudocode = `TreeDiameter():
  y = DFS_Farthest(arbitrary_node)
  z = DFS_Farthest(y)
  return distance(y, z)`;

  const applications = [
    "Minimizing packet routing distances.",
    "Tree center evaluation indices (finding node minimizing maximum depth).",
    "Centroid partitioning tree splits."
  ];
  const mistakes = [
    "Attempting to run dual DFS on trees containing negative edge weights (requires DP instead).",
    "Not mapping tree links undirected parent-child routes."
  ];
  const cpTips = [
    "If the tree edges contain negative weights, the dual DFS approach fails. Instead, use tree Dynamic Programming (DP) tracking two maximum down-paths for each node!"
  ];

  return (
    <TrLayout
      timeComplexity="O(N) dual DFS passes"
      spaceComplexity="O(N) recursion stack size"
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
              Tree Layout Canvas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <TreeCanvas
              nodes={nodes}
              edges={edges}
              highlightedNodes={diameterNodes}
            />

            {compared && (
              <div className="border-t border-border/5 pt-3 space-y-3 font-mono text-xs text-left">
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Tree Diameter:</span>
                  <span className="font-bold text-emerald-500">{diameter} edges</span>
                </div>
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Diameter Path:</span>
                  <span className="font-bold text-amber-500">[ {diameterNodes.join(" → ")} ]</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Diameter Sweeps Execution Log:
                  </span>
                  <div className="p-2.5 bg-muted/20 border border-border/10 rounded-lg max-h-36 overflow-y-auto font-mono text-[11px] leading-relaxed text-foreground/80 space-y-1">
                    {steps.map((step, idx) => (
                      <div key={idx} className="text-foreground/80">{step}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      }
    >
      <TrHeader
        title="Tree Diameter"
        description="Compute maximum path lengths in tree networks utilizing dual DFS sweeps."
        category="Algorithms"
        difficulty="Easy"
        shortcut="Alt+Shift+D"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <p className="text-xs text-muted-foreground">
            Adjust tree structures on the canvas and run the diameter calculator. Farthest leaf paths are highlighted in yellow.
          </p>
          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Calculate Tree Diameter
          </Button>
        </CardContent>
      </Card>
    </TrLayout>
  );
}
