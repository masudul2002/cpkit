"use client";

import * as React from "react";
import { GrHeader } from "../../shared/gr-header";
import { GrLayout } from "../../shared/gr-layout";
import { GraphCanvas, NodeItem, EdgeItem } from "../../visualization/graph-canvas";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function FloydWarshallTool() {
  const [nodes, setNodes] = React.useState<NodeItem[]>([
    { id: "0", label: "0", x: 100, y: 100 },
    { id: "1", label: "1", x: 280, y: 80 },
    { id: "2", label: "2", x: 120, y: 260 },
    { id: "3", label: "3", x: 300, y: 240 },
  ]);
  const [edges, setEdges] = React.useState<EdgeItem[]>([
    { id: "0-1", from: "0", to: "1", weight: 3, directed: true },
    { id: "0-2", from: "0", to: "2", weight: 8, directed: true },
    { id: "1-2", from: "1", to: "2", weight: 2, directed: true },
    { id: "1-3", from: "1", to: "3", weight: 1, directed: true },
    { id: "2-3", from: "2", to: "3", weight: 4, directed: true },
  ]);

  const [compared, setCompared] = React.useState(false);
  const [distMatrix, setDistMatrix] = React.useState<number[][]>([]);

  const handleEvaluate = () => {
    setCompared(true);
    const n = nodes.length;

    // Initialize distance matrix
    const matrix = Array.from({ length: n }, (_, r) =>
      Array.from({ length: n }, (_, c) => (r === c ? 0 : Infinity))
    );

    // Map nodes to indices
    const nodeIndex: Record<string, number> = {};
    nodes.forEach((node, idx) => {
      nodeIndex[node.id] = idx;
    });

    edges.forEach((edge) => {
      const u = nodeIndex[edge.from];
      const v = nodeIndex[edge.to];
      if (u !== undefined && v !== undefined) {
        matrix[u][v] = Math.min(matrix[u][v], edge.weight);
        if (!edge.directed) {
          matrix[v][u] = Math.min(matrix[v][u], edge.weight);
        }
      }
    });

    // Run Floyd-Warshall DP updates
    for (let k = 0; k < n; k++) {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (matrix[i][k] !== Infinity && matrix[k][j] !== Infinity) {
            matrix[i][j] = Math.min(matrix[i][j], matrix[i][k] + matrix[k][j]);
          }
        }
      }
    }

    setDistMatrix(matrix);
  };

  const definition = "Floyd-Warshall's Algorithm solves the all-pairs shortest paths problem on a directed or undirected graph, computing distances between all node pairs.";
  const idea = "A dynamic programming formulation that updates the distance matrix by testing if routing through intermediate nodes 0..V-1 offers shorter pathways.";
  const pseudocode = `FloydWarshall():
  dist[i][j] = edge_weight(i, j) if exists else INF
  dist[i][i] = 0

  for k = 0..V-1:
    for i = 0..V-1:
      for j = 0..V-1:
        dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])`;

  const applications = [
    "All-pairs shortest path routing calculations.",
    "Transitive closure computation (Warshall's algorithm).",
    "Finding the minimax path (widest path) between all pairs."
  ];
  const mistakes = [
    "Forgetting to initialize diagonal values `dist[i][i]` to 0.",
    "Incorrect loops ordering (k must be the outermost loop for correct DP transitions)."
  ];
  const cpTips = [
    "Because of its simplicity (three nested loops) and fast execution on small V <= 400, Floyd-Warshall is heavily favored in contests for all-pairs query sets."
  ];

  return (
    <GrLayout
      timeComplexity="O(V^3)"
      spaceComplexity="O(V^2) distance matrix state"
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

            {compared && distMatrix.length > 0 && (
              <div className="border-t border-border/5 pt-3 space-y-3 font-mono text-xs text-left">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">
                  All-Pairs Distance Matrix (dist[i][j]):
                </span>
                <div className="overflow-x-auto">
                  <table className="w-full text-center border border-border/40 rounded-xl bg-background/20 font-mono text-xs">
                    <thead>
                      <tr className="border-b border-border/20 bg-muted/20">
                        <th className="p-2 text-muted-foreground font-bold">Node</th>
                        {nodes.map((n) => (
                          <th key={n.id} className="p-2 text-foreground font-bold">To {n.id}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {nodes.map((nRow, rIdx) => (
                        <tr key={nRow.id} className="border-b border-border/10 hover:bg-accent/10">
                          <td className="p-2 text-foreground font-bold bg-muted/10">From {nRow.id}</td>
                          {nodes.map((nCol, cIdx) => {
                            const val = distMatrix[rIdx][cIdx];
                            return (
                              <td key={nCol.id} className="p-2 font-semibold text-emerald-500">
                                {val === Infinity ? "INF" : val}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      }
    >
      <GrHeader
        title="Floyd-Warshall Solver"
        description="Compute all-pairs shortest paths on directed or weighted graphs using intermediate node checks."
        category="Shortest Path"
        difficulty="Medium"
        shortcut="Alt+Shift+V"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <p className="text-xs text-muted-foreground">
            Adjust vertices and weights on the canvas above then click run to build the complete all-pairs distance matrix.
          </p>
          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Run Floyd-Warshall Solver
          </Button>
        </CardContent>
      </Card>
    </GrLayout>
  );
}
