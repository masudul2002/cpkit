"use client";

import * as React from "react";
import { GdHeader } from "../../shared/gd-header";
import { GdLayout } from "../../shared/gd-layout";
import { TreeCanvas, TreeNode, TreeEdge } from "@/features/tree/visualization/tree-canvas";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MergeNode {
  size: number;
  left?: MergeNode;
  right?: MergeNode;
  id: string;
}

export function OptimalMergeTool() {
  const [sizesStr, setSizesStr] = React.useState("2, 3, 4, 7");

  const [compared, setCompared] = React.useState(false);
  const [nodes, setNodes] = React.useState<TreeNode[]>([]);
  const [edges, setEdges] = React.useState<TreeEdge[]>([]);
  const [mergeLogs, setMergeLogs] = React.useState<string[]>([]);
  const [totalCost, setTotalCost] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleEvaluate = () => {
    setError(null);
    setCompared(true);
    setNodes([]);
    setEdges([]);
    setMergeLogs([]);
    setTotalCost(null);

    const sizes = sizesStr.split(",").map((s) => parseInt(s.trim(), 10));
    if (sizes.some(isNaN) || sizes.length === 0) {
      setError("Please check your file sizes input.");
      return;
    }

    const n = sizes.length;
    let leafNodesList: MergeNode[] = Array.from({ length: n }, (_, idx) => ({
      size: sizes[idx],
      id: `leaf_${idx}`,
    }));

    const queue = [...leafNodesList];
    const logs: string[] = [];
    let parentCounter = 1;
    let accumCost = 0;

    while (queue.length > 1) {
      // Sort ascending by size
      queue.sort((a, b) => a.size - b.size);

      const left = queue.shift()!;
      const right = queue.shift()!;
      const parentSize = left.size + right.size;
      accumCost += parentSize;

      logs.push(`• Merge file size ${left.size} and size ${right.size} → Created merged file of size ${parentSize} (Cost: +${parentSize})`);

      const parent: MergeNode = {
        size: parentSize,
        left,
        right,
        id: `parent_${parentCounter++}`,
      };

      queue.push(parent);
    }

    const root = queue[0];

    // Layout the tree for TreeCanvas
    const treeNodes: TreeNode[] = [];
    const treeEdges: TreeEdge[] = [];

    const assignCoordinates = (curr: MergeNode | undefined, x: number, y: number, spread: number) => {
      if (!curr) return;

      treeNodes.push({
        id: curr.id,
        label: `${curr.size}`,
        x,
        y,
      });

      if (curr.left) {
        treeEdges.push({
          id: `${curr.id}-${curr.left.id}`,
          from: curr.id,
          to: curr.left.id,
        });
        assignCoordinates(curr.left, x - spread, y + 60, spread * 0.5);
      }

      if (curr.right) {
        treeEdges.push({
          id: `${curr.id}-${curr.right.id}`,
          from: curr.id,
          to: curr.right.id,
        });
        assignCoordinates(curr.right, x + spread, y + 60, spread * 0.5);
      }
    };

    assignCoordinates(root, 250, 40, 100);

    setNodes(treeNodes);
    setEdges(treeEdges);
    setMergeLogs(logs);
    setTotalCost(accumCost);
  };

  const definition = "The Optimal Merge Pattern problem finds the most efficient way to merge a set of sorted files into a single sorted file, minimizing total record comparison movements.";
  const greedyChoice = "Repeatedly extract the two files of smallest sizes from a min-priority queue, merge them (cost = sum of sizes), and insert the resulting file back.";
  const optimalSubstructure = "An optimal merge pattern for N files consists of merging the two smallest files first, then solving the remaining N-1 file merges optimally.";
  const proofIdea = "Proof by Huffman coding equivalence: since record movements are weighted by the depth of leaf files, placing larger files closer to the root (merging them last) minimizes total weighted depth.";
  const pseudocode = `OptimalMerge(sizes):
  PQ = Min-Priority Queue of sizes
  total_cost = 0
  while PQ.size > 1:
    f1 = PQ.extract_min()
    f2 = PQ.extract_min()
    cost = f1 + f2
    total_cost += cost
    PQ.insert(cost)
  return total_cost`;

  const applications = [
    "External sorting algorithms (e.g. merge sort runs).",
    "Optimizing network packet mergers.",
    "Efficient file concatenation strategies."
  ];
  const mistakes = [
    "Merging arbitrary adjacent files (this is a different problem: optimal chain merging, which requires DP). Optimal Merge Pattern allows arbitrary pairings.",
    "Not tracking accumulated costs correctly."
  ];
  const cpTips = [
    "Whenever you see a problem asking to 'combine elements pairwise where the cost is the sum of sizes' and any elements can be paired, always use a priority queue greedy approach!"
  ];

  return (
    <GdLayout
      timeComplexity="O(N log N) with priority queue"
      spaceComplexity="O(N) tree size memory"
      definition={definition}
      greedyChoice={greedyChoice}
      optimalSubstructure={optimalSubstructure}
      proofIdea={proofIdea}
      pseudocode={pseudocode}
      applications={applications}
      mistakes={mistakes}
      cpTips={cpTips}
      visualizerChild={
        <Card className="border-border/40 bg-card/65 shadow-xs font-sans text-left">
          <CardHeader className="pb-2 border-b border-border/10">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Optimal Merge Pattern Decision Tree
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Tree Canvas */}
            <div className="h-[280px] border border-border/40 rounded-xl relative overflow-hidden bg-muted/5">
              <TreeCanvas nodes={nodes} edges={edges} />
            </div>

            {compared && totalCost !== null && (
              <div className="border-t border-border/5 pt-3 space-y-3 font-mono text-xs text-left">
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Total Minimum Merge Cost:</span>
                  <span className="font-bold text-emerald-500">{totalCost} record operations</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Priority Queue Merging Sequence:
                  </span>
                  <div className="p-2.5 bg-muted/20 border border-border/10 rounded-lg max-h-36 overflow-y-auto font-mono text-[11px] leading-relaxed text-foreground/80 space-y-1">
                    {mergeLogs.map((log, idx) => (
                      <div key={idx} className="text-foreground/80">{log}</div>
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
      <GdHeader
        title="Optimal Merge Pattern"
        description="Construct optimal merge trees using min-priority queues."
        category="Greedy"
        difficulty="Medium"
        shortcut="Alt+Shift+O"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <InputField label="Unmerged File Sizes (comma separated)" value={sizesStr} onChange={setSizesStr} />

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Calculate Merges
          </Button>
        </CardContent>
      </Card>
    </GdLayout>
  );
}
