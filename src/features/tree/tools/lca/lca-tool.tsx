"use client";

import * as React from "react";
import { TrHeader } from "../../shared/tr-header";
import { TrLayout } from "../../shared/tr-layout";
import { TreeCanvas, TreeNode, TreeEdge } from "../../visualization/tree-canvas";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export function LcaTool() {
  const { toast } = useToast();
  const [nodes, setNodes] = React.useState<TreeNode[]>([
    { id: "1", label: "1", x: 300, y: 50 },
    { id: "2", label: "2", x: 200, y: 120, parentId: "1" },
    { id: "3", label: "3", x: 400, y: 120, parentId: "1" },
    { id: "4", label: "4", x: 150, y: 190, parentId: "2" },
    { id: "5", label: "5", x: 250, y: 190, parentId: "2" },
    { id: "6", label: "6", x: 350, y: 190, parentId: "3" },
    { id: "7", label: "7", x: 450, y: 190, parentId: "3" },
  ]);
  const [edges, setEdges] = React.useState<TreeEdge[]>([
    { id: "1-2", from: "1", to: "2" },
    { id: "1-3", from: "1", to: "3" },
    { id: "2-4", from: "2", to: "4" },
    { id: "2-5", from: "2", to: "5" },
    { id: "3-6", from: "3", to: "6" },
    { id: "3-7", from: "3", to: "7" },
  ]);

  const [nodeU, setNodeU] = React.useState("4");
  const [nodeV, setNodeV] = React.useState("5");

  const [compared, setCompared] = React.useState(false);
  const [lcaNodeId, setLcaNodeId] = React.useState<string | null>(null);
  const [upTable, setUpTable] = React.useState<Record<string, string[]>>({});
  const [steps, setSteps] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handleEvaluate = () => {
    setError(null);
    setCompared(true);
    setLcaNodeId(null);
    setSteps([]);
    setUpTable({});

    const existsU = nodes.some((n) => n.id === nodeU);
    const existsV = nodes.some((n) => n.id === nodeV);

    if (!existsU || !existsV) {
      setError("Both nodes U and V must exist in the tree.");
      return;
    }

    const n = nodes.length;
    // Map node IDs to tree levels/depths
    const depth: Record<string, number> = {};
    const parent: Record<string, string> = {};

    // Group children
    const adj: Record<string, string[]> = {};
    nodes.forEach((n) => { adj[n.id] = []; });
    edges.forEach((e) => {
      adj[e.from]?.push(e.to);
    });

    const childSet = new Set(edges.map((e) => e.to));
    const roots = nodes.filter((n) => !childSet.has(n.id));
    const rootId = roots[0]?.id || nodes[0].id;

    // DFS to find depths & immediate parents
    const dfs = (u: string, p: string, d: number) => {
      depth[u] = d;
      parent[u] = p;
      (adj[u] || []).forEach((v) => dfs(v, u, d + 1));
    };
    dfs(rootId, rootId, 0);

    // Compute binary lifting ancestors: up[node][i] = node at height 2^i above
    const LOG = 4; // log2 of max N
    const up: Record<string, string[]> = {};

    nodes.forEach((node) => {
      up[node.id] = new Array(LOG).fill(rootId);
      up[node.id][0] = parent[node.id] || rootId;
    });

    for (let i = 1; i < LOG; i++) {
      nodes.forEach((node) => {
        const anc = up[node.id][i - 1];
        up[node.id][i] = up[anc][i - 1];
      });
    }

    setUpTable(up);

    // Run LCA Query with steps
    let u = nodeU;
    let v = nodeV;
    const log: string[] = [`• Find LCA for Node ${u} (depth ${depth[u]}) and Node ${v} (depth ${depth[v]}):`];

    // Lift deeper node to same level
    if (depth[u] < depth[v]) {
      log.push(`  → Swap U and V because V is deeper`);
      const temp = u;
      u = v;
      v = temp;
    }

    let diff = depth[u] - depth[v];
    if (diff > 0) {
      log.push(`  → Lift Node U from depth ${depth[u]} to match Node V at depth ${depth[v]} (diff = ${diff}):`);
      for (let i = LOG - 1; i >= 0; i--) {
        if ((diff & (1 << i)) !== 0) {
          const nextU = up[u][i];
          log.push(`    ↳ Lift Node U by $2^${i}$ steps to Node ${nextU}`);
          u = nextU;
        }
      }
    }

    if (u === v) {
      log.push(`  → Nodes met at Node ${u}. LCA is Node ${u}`);
      setLcaNodeId(u);
      setSteps(log);
      return;
    }

    // Lift together
    log.push(`  → Lift both nodes together to find common ancestor:`);
    for (let i = LOG - 1; i >= 0; i--) {
      if (up[u][i] !== up[v][i]) {
        log.push(`    ↳ Lift Node U to ${up[u][i]} and Node V to ${up[v][i]} ($2^${i}$ steps)`);
        u = up[u][i];
        v = up[v][i];
      }
    }

    const ans = parent[u];
    log.push(`  → Common parent found: LCA is Node ${ans}`);
    setLcaNodeId(ans);
    setSteps(log);
  };

  const definition = "Lowest Common Ancestor (LCA) of two nodes u and v in a tree is the deepest node that is an ancestor of both u and v.";
  const idea = "Binary lifting computes parents at heights $2^i$ using dynamic programming. To find LCA(u, v), first lift the deeper node to match depths, then elevate both nodes together until they share the same parent.";
  const pseudocode = `LCA(u, v):
  if depth[u] < depth[v]: swap(u, v)
  // lift u to same depth as v
  for i = LOG-1 down to 0:
    if depth[u] - (1 << i) >= depth[v]:
      u = up[u][i]

  if u == v: return u

  // lift together
  for i = LOG-1 down to 0:
    if up[u][i] != up[v][i]:
      u = up[u][i]
      v = up[v][i]

  return up[u][0]`;

  const applications = [
    "Range queries (distance between two tree nodes) in O(1) time after O(log N) LCA.",
    "Updating path values in trees dynamically.",
    "Evaluating ancestor connectivity checks."
  ];
  const mistakes = [
    "Incorrect binary lifting initialization causing out of bounds indices.",
    "Not swapping nodes correctly when depths differ."
  ];
  const cpTips = [
    "Binary lifting LCA takes O(N log N) preprocessing time and O(log N) per query. If query speed is critical, you can map the tree to an Euler Tour and run a range minimum query (RMQ) Segment Tree to achieve O(1) query time!"
  ];

  return (
    <TrLayout
      timeComplexity="O(N log N) prep / O(log N) query"
      spaceComplexity="O(N log N) parent tables"
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
              highlightedNodes={
                compared && lcaNodeId ? [nodeU, nodeV, lcaNodeId] : []
              }
            />

            {compared && lcaNodeId && (
              <div className="border-t border-border/5 pt-3 space-y-3 font-mono text-xs text-left">
                <div className="p-2.5 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 rounded-lg">
                  LCA of Node {nodeU} and Node {nodeV} is: <span className="font-extrabold text-white">Node {lcaNodeId}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Binary Lifting Ancestors Table (up[node][power]):
                  </span>
                  <div className="overflow-x-auto">
                    <table className="w-full text-center border border-border/40 rounded-xl bg-background/25 font-mono text-[10px]">
                      <thead>
                        <tr className="border-b border-border/20 bg-muted/20">
                          <th className="p-1 text-muted-foreground font-bold">Node</th>
                          <th className="p-1 text-foreground">2^0 Parent</th>
                          <th className="p-1 text-foreground">2^1 Parent</th>
                          <th className="p-1 text-foreground">2^2 Parent</th>
                          <th className="p-1 text-foreground">2^3 Parent</th>
                        </tr>
                      </thead>
                      <tbody>
                        {nodes.map((node) => {
                          const row = upTable[node.id] || [];
                          return (
                            <tr key={node.id} className="border-b border-border/10 hover:bg-accent/10">
                              <td className="p-1 font-bold bg-muted/10">Node {node.id}</td>
                              <td className="p-1">{row[0] || "-"}</td>
                              <td className="p-1">{row[1] || "-"}</td>
                              <td className="p-1">{row[2] || "-"}</td>
                              <td className="p-1">{row[3] || "-"}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                    LCA Query Traversal Steps:
                  </span>
                  <div className="p-2.5 bg-muted/20 border border-border/10 rounded-lg max-h-36 overflow-y-auto font-mono text-[11px] leading-relaxed text-foreground/80 space-y-1">
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
      <TrHeader
        title="Lowest Common Ancestor"
        description="Query lowest common ancestors on trees using binary lifting tables."
        category="Algorithms"
        difficulty="Medium"
        shortcut="Alt+Shift+L"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <div className="grid gap-2 grid-cols-2">
            <InputField label="Node U" value={nodeU} onChange={setNodeU} />
            <InputField label="Node V" value={nodeV} onChange={setNodeV} />
          </div>
          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Calculate LCA
          </Button>
        </CardContent>
      </Card>
    </TrLayout>
  );
}
