"use client";

import * as React from "react";
import { TrHeader } from "../../shared/tr-header";
import { TrLayout } from "../../shared/tr-layout";
import { TreeCanvas, TreeNode, TreeEdge } from "../../visualization/tree-canvas";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function EulerTourTool() {
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
  const [tour, setTour] = React.useState<string[]>([]);
  const [timesTable, setTimesTable] = React.useState<{ tin: number; tout: number }[]>([]);

  const handleEvaluate = () => {
    setCompared(true);

    if (nodes.length === 0) {
      setTour([]);
      setTimesTable([]);
      return;
    }

    const adj: Record<string, string[]> = {};
    nodes.forEach((n) => { adj[n.id] = []; });
    edges.forEach((e) => {
      adj[e.from]?.push(e.to);
    });

    const childSet = new Set(edges.map((e) => e.to));
    const roots = nodes.filter((n) => !childSet.has(n.id));
    const rootId = roots[0]?.id || nodes[0].id;

    const euler: string[] = [];
    const tin: Record<string, number> = {};
    const tout: Record<string, number> = {};
    let timer = 0;

    const dfs = (u: string) => {
      timer++;
      tin[u] = timer;
      euler.push(u);

      const children = adj[u] || [];
      children.forEach((v) => {
        dfs(v);
        euler.push(u); // step back up
      });

      tout[u] = timer;
    };

    dfs(rootId);

    // Build visual times table
    const table = nodes.map((node) => ({
      tin: tin[node.id],
      tout: tout[node.id],
    }));

    setTour(euler);
    setTimesTable(table);
  };

  const definition = "An Euler Tour flattens a tree into a 1D array representation by recording the node sequence traversed during DFS. This allows mapping tree subtree operations into contiguous array range queries.";
  const idea = "Runs DFS. Appends the node key to the tour array when entering it, recursively traverses child nodes, and appends the node key again when backtracking back up. Entry tin[u] and exit tout[u] times denote subtree boundaries.";
  const pseudocode = `EulerTour(u):
  tin[u] = ++timer
  tour.push(u)
  for each child v of u:
    EulerTour(v)
    tour.push(u)
  tout[u] = timer`;

  const applications = [
    "Range updates and queries on subtrees (tin/tout maps) using Segment Trees.",
    "Finding Lowest Common Ancestor (LCA) in O(1) time using Range Minimum Queries (RMQ).",
    "Path query aggregations."
  ];
  const mistakes = [
    "Confusing tour array lengths when using standard traversal formats.",
    "Not handling disconnected tree nodes."
  ];
  const cpTips = [
    "By mapping subtree bounds to `[tin[u], tout[u]]` inside a segment tree, you can update a node's entire subtree in O(log N) time just like a range query!"
  ];

  return (
    <TrLayout
      timeComplexity="O(N)"
      spaceComplexity="O(N) flattened array size"
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
            />

            {compared && (
              <div className="border-t border-border/5 pt-3 space-y-3 font-mono text-xs text-left">
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Flattened Euler Tour Array:</span>
                  <span className="font-bold text-emerald-500">[ {tour.join(", ")} ]</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Entry & Exit DFS Times:
                  </span>
                  <div className="overflow-x-auto">
                    <table className="w-full text-center border border-border/40 rounded-xl bg-background/25 font-mono text-xs">
                      <thead>
                        <tr className="border-b border-border/20 bg-muted/20">
                          <th className="p-2 text-muted-foreground font-bold">Node</th>
                          <th className="p-2 text-foreground">Entry Time (tin)</th>
                          <th className="p-2 text-foreground">Exit Time (tout)</th>
                          <th className="p-2 text-foreground">Subtree Range</th>
                        </tr>
                      </thead>
                      <tbody>
                        {nodes.map((node, idx) => {
                          const row = timesTable[idx] || { tin: 0, tout: 0 };
                          return (
                            <tr key={node.id} className="border-b border-border/10 hover:bg-accent/10">
                              <td className="p-2 font-bold bg-muted/10">Node {node.id}</td>
                              <td className="p-2 text-primary font-bold">{row.tin}</td>
                              <td className="p-2 text-amber-500 font-bold">{row.tout}</td>
                              <td className="p-2 text-emerald-500 font-bold">[{row.tin}, {row.tout}]</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      }
    >
      <TrHeader
        title="Euler Tour DFS"
        description="Flatten tree hierarchies into 1D arrays with subtree entry/exit times."
        category="Traversals"
        difficulty="Easy"
        shortcut="Alt+Shift+E"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <p className="text-xs text-muted-foreground">
            Adjust tree nodes and edges on the canvas then run the Euler Tour flattener.
          </p>
          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Flatten Tree (Euler Tour)
          </Button>
        </CardContent>
      </Card>
    </TrLayout>
  );
}
