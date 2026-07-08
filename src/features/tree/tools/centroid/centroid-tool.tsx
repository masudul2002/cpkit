"use client";

import * as React from "react";
import { TrHeader } from "../../shared/tr-header";
import { TrLayout } from "../../shared/tr-layout";
import { TreeCanvas, TreeNode, TreeEdge } from "../../visualization/tree-canvas";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function CentroidTool() {
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

  const [compared, setCompared] = React.useState(false);
  const [centroidId, setCentroidId] = React.useState<string | null>(null);
  const [centroidTreeNodes, setCentroidTreeNodes] = React.useState<TreeNode[]>([]);
  const [centroidTreeEdges, setCentroidTreeEdges] = React.useState<TreeEdge[]>([]);
  const [steps, setSteps] = React.useState<string[]>([]);

  const handleEvaluate = () => {
    setCompared(true);
    setCentroidId(null);
    setCentroidTreeNodes([]);
    setCentroidTreeEdges([]);
    setSteps([]);

    const n = nodes.length;
    if (n === 0) return;

    // Build undirected tree
    const adj: Record<string, string[]> = {};
    nodes.forEach((node) => { adj[node.id] = []; });
    edges.forEach((edge) => {
      adj[edge.from]?.push(edge.to);
      adj[edge.to]?.push(edge.from);
    });

    const isRemoved = new Set<string>();
    const subtreeSize: Record<string, number> = {};
    const log: string[] = [];

    // Helper to calculate subtree sizes
    const getSizes = (u: string, p: string): number => {
      let size = 1;
      (adj[u] || []).forEach((v) => {
        if (v !== p && !isRemoved.has(v)) {
          size += getSizes(v, u);
        }
      });
      subtreeSize[u] = size;
      return size;
    };

    // Helper to locate centroid of a component
    const getCentroid = (u: string, p: string, totalSize: number): string => {
      const neighbors = adj[u] || [];
      for (const v of neighbors) {
        if (v !== p && !isRemoved.has(v)) {
          if (subtreeSize[v] > totalSize / 2) {
            return getCentroid(v, u, totalSize);
          }
        }
      }
      return u;
    };

    // Build Centroid Tree recursively
    const cTreeNodes: TreeNode[] = [];
    const cTreeEdges: TreeEdge[] = [];
    let leafX = 50;

    const decompose = (u: string, depth: number, parentCId?: string): string => {
      const totalSize = getSizes(u, u);
      const centroid = getCentroid(u, u, totalSize);

      log.push(`• Layer ${depth}: Centroid of component containing ${u} (size ${totalSize}) is Node ${centroid}`);

      cTreeNodes.push({
        id: centroid,
        label: centroid,
        x: 0,
        y: 50 + depth * 70,
      });

      if (parentCId) {
        cTreeEdges.push({
          id: `${parentCId}-${centroid}`,
          from: parentCId,
          to: centroid,
        });
      }

      isRemoved.add(centroid);

      // Decompose subtrees recursively
      (adj[centroid] || []).forEach((v) => {
        if (!isRemoved.has(v)) {
          decompose(v, depth + 1, centroid);
        }
      });

      return centroid;
    };

    const firstCentroid = decompose(nodes[0].id, 0);
    setCentroidId(firstCentroid);

    // Position coordinates of Centroid Tree
    const nodeObjMap = new Map(cTreeNodes.map((node) => [node.id, node]));
    const childMap: Record<string, string[]> = {};
    cTreeNodes.forEach((node) => { childMap[node.id] = []; });
    cTreeEdges.forEach((edge) => {
      childMap[edge.from]?.push(edge.to);
    });

    const positionCentroidTreeNodes = (nodeId: string) => {
      const node = nodeObjMap.get(nodeId);
      const children = childMap[nodeId] || [];
      if (!node) return;

      if (children.length === 0) {
        node.x = leafX;
        leafX += 70;
        return;
      }

      children.forEach(positionCentroidTreeNodes);
      const leftChild = nodeObjMap.get(children[0]);
      const rightChild = nodeObjMap.get(children[children.length - 1]);

      if (leftChild && rightChild) {
        node.x = (leftChild.x + rightChild.x) / 2;
      }
    };

    positionCentroidTreeNodes(firstCentroid);

    const maxX = Math.max(...cTreeNodes.map((n) => n.x), 100);
    const shift = Math.max((600 - maxX) / 2, 20);
    cTreeNodes.forEach((node) => {
      node.x += shift;
    });

    setCentroidTreeNodes(cTreeNodes);
    setCentroidTreeEdges(cTreeEdges);
    setSteps(log);
  };

  const definition = "Centroid Decomposition is a divide-and-conquer technique on trees. It divides a tree of size N into subtrees of size at most N/2 by removing a special node called the Centroid. The centroid tree structure is obtained by recursively linking centroids.";
  const idea = "Compute component size. Find centroid node u where all subtrees connected to u have sizes <= N/2. Remove u, link it as parent in the centroid tree, and recursively decompose remaining components.";
  const pseudocode = `Decompose(u):
  N = calculate_subtree_sizes(u)
  centroid = find_centroid(u, N)
  is_centroid[centroid] = true
  for each neighbor v of centroid:
    if not is_centroid[v]:
      centroid_parent[Decompose(v)] = centroid
  return centroid`;

  const applications = [
    "Solving path query constraints in trees (e.g. counting paths of length K).",
    "Dynamic tree updates and queries in O(log^2 N) time.",
    "Divide-and-conquer path optimizations."
  ];
  const mistakes = [
    "Not recalculating subtree sizes of components before finding subsequent centroids, leading to infinite loops.",
    "Incorrect index offsets when building undirected edge listings."
  ];
  const cpTips = [
    "Since the height of the Centroid Tree is guaranteed to be at most O(log N), you can run divide-and-conquer algorithms efficiently with a maximum recursion depth of log N!"
  ];

  return (
    <TrLayout
      timeComplexity="O(N log N) decomposition"
      spaceComplexity="O(N) decomposition structures"
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
              highlightedNodes={centroidId ? [centroidId] : []}
            />

            {compared && centroidTreeNodes.length > 0 && (
              <div className="border-t border-border/5 pt-3 space-y-3 font-mono text-xs text-left">
                <div className="p-2.5 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 rounded-lg">
                  First root centroid representative: <span className="font-extrabold text-white">Node {centroidId}</span>
                </div>

                {/* Render the generated Centroid Tree! */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Generated Centroid Tree:
                  </span>
                  <div className="p-2 border border-border/10 rounded-xl bg-background/25">
                    <TreeCanvas
                      nodes={centroidTreeNodes}
                      edges={centroidTreeEdges}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Recursive Centroid Splits:
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
        title="Centroid Decomposition"
        description="Decompose tree topologies recursively into logarithmic height centroid trees."
        category="Algorithms"
        difficulty="Hard"
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
            Decompose the tree recursively. The root centroid of the first recursion split is highlighted in yellow.
          </p>
          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Run Decomposition
          </Button>
        </CardContent>
      </Card>
    </TrLayout>
  );
}
