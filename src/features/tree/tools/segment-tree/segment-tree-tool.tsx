"use client";

import * as React from "react";
import { TrHeader } from "../../shared/tr-header";
import { TrLayout } from "../../shared/tr-layout";
import { TreeCanvas, TreeNode, TreeEdge } from "../../visualization/tree-canvas";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export function SegmentTreeTool() {
  const { toast } = useToast();
  const [array, setArray] = React.useState<number[]>([2, 4, 5, 7, 8, 1]);
  const [inputIdx, setInputIdx] = React.useState("3");
  const [inputVal, setInputVal] = React.useState("9");

  const [queryL, setQueryL] = React.useState("1");
  const [queryR, setQueryR] = React.useState("4");

  const [nodes, setNodes] = React.useState<TreeNode[]>([]);
  const [edges, setEdges] = React.useState<TreeEdge[]>([]);
  const [highlightNodes, setHighlightNodes] = React.useState<string[]>([]);
  const [querySumResult, setQuerySumResult] = React.useState<number | null>(null);

  const rebuildSegmentTree = (arr: number[]) => {
    if (arr.length === 0) {
      setNodes([]);
      setEdges([]);
      return;
    }

    const nNodes: TreeNode[] = [];
    const nEdges: TreeEdge[] = [];

    // Construct Segment Tree layout recursively
    const build = (l: number, r: number, depth: number, parentId?: string): { id: string; sum: number } => {
      const uId = `${l}-${r}`;
      let sum = 0;

      if (l === r) {
        sum = arr[l];
      } else {
        const mid = Math.floor((l + r) / 2);
        const left = build(l, mid, depth + 1, uId);
        const right = build(mid + 1, r, depth + 1, uId);
        sum = left.sum + right.sum;
      }

      nNodes.push({
        id: uId,
        label: sum.toString(),
        x: 0, // calculated later
        y: 50 + depth * 70,
        val: `[${l}, ${r}]`,
      });

      if (parentId) {
        nEdges.push({
          id: `${parentId}-${uId}`,
          from: parentId,
          to: uId,
        });
      }

      return { id: uId, sum };
    };

    build(0, arr.length - 1, 0);

    // Compute layout coordinates dynamically
    const nodeMap = new Map(nNodes.map((n) => [n.id, n]));
    const childMap: Record<string, string[]> = {};
    nNodes.forEach((n) => { childMap[n.id] = []; });
    nEdges.forEach((e) => {
      childMap[e.from]?.push(e.to);
    });

    let currentX = 50;

    const positionNodes = (u: string) => {
      const node = nodeMap.get(u);
      const children = childMap[u] || [];
      if (!node) return;

      if (children.length === 0) {
        node.x = currentX;
        currentX += 75;
        return;
      }

      children.forEach((c) => positionNodes(c));
      const leftChild = nodeMap.get(children[0]);
      const rightChild = nodeMap.get(children[1]);

      if (leftChild && rightChild) {
        node.x = (leftChild.x + rightChild.x) / 2;
      }
    };

    const rootId = `0-${arr.length - 1}`;
    positionNodes(rootId);

    // Translate coordinates to center within canvas width
    const maxX = Math.max(...nNodes.map((n) => n.x), 100);
    const shift = Math.max((600 - maxX) / 2, 20);
    nNodes.forEach((node) => {
      node.x += shift;
    });

    setNodes(nNodes);
    setEdges(nEdges);
  };

  React.useEffect(() => {
    rebuildSegmentTree(array);
  }, [array]);

  const handleUpdate = () => {
    const idx = parseInt(inputIdx, 10);
    const val = parseInt(inputVal, 10);
    const n = array.length;

    if (isNaN(idx) || isNaN(val) || idx < 0 || idx >= n) {
      toast({
        title: "Invalid Update Indices",
        description: `Index must be between 0 and ${n - 1}.`,
        variant: "warning",
      });
      return;
    }

    const nextArr = [...array];
    nextArr[idx] = val;
    setArray(nextArr);
    setQuerySumResult(null);
    setHighlightNodes([]);
    toast({
      title: "Point Updated",
      description: `Index ${idx} updated to ${val}.`,
      variant: "success",
    });
  };

  const handleQuery = () => {
    const ql = parseInt(queryL, 10);
    const qr = parseInt(queryR, 10);
    const n = array.length;

    if (isNaN(ql) || isNaN(qr) || ql < 0 || qr >= n || ql > qr) {
      toast({
        title: "Invalid Query Range",
        description: `L and R must satisfy 0 <= L <= R <= ${n - 1}.`,
        variant: "warning",
      });
      return;
    }

    const highlighted: string[] = [];
    let sumResult = 0;

    const query = (l: number, r: number, qLeft: number, qRight: number) => {
      if (qLeft <= l && r <= qRight) {
        highlighted.push(`${l}-${r}`);
        // Calculate range sum directly from nodes label or array
        let sum = 0;
        for (let i = l; i <= r; i++) {
          sum += array[i];
        }
        sumResult += sum;
        return;
      }

      const mid = Math.floor((l + r) / 2);
      if (qLeft <= mid) {
        query(l, mid, qLeft, qRight);
      }
      if (qRight > mid) {
        query(mid + 1, r, qLeft, qRight);
      }
    };

    query(0, n - 1, ql, qr);
    setHighlightNodes(highlighted);
    setQuerySumResult(sumResult);
  };

  const definition = "A Segment Tree is a binary tree used for storing intervals or segments. It allows querying which of the stored segments contain a given point, or performing range query sum/min/max operations in logarithmic time.";
  const idea = "Divide intervals in half recursively. Leaf nodes represent point elements of the array. Query intervals are decomposed into O(log N) disjoint segments covered by segment tree nodes.";
  const pseudocode = `QuerySegment(l, r, qL, qR):
  if qL <= l and r <= qR:
    return tree[node]
  mid = (l + r) / 2
  sum = 0
  if qL <= mid: sum += QuerySegment(l, mid, qL, qR)
  if qR > mid: sum += QuerySegment(mid + 1, r, qL, qR)
  return sum`;

  const applications = [
    "Range Sum, Minimum, Maximum, and Greatest Common Divisor queries.",
    "Dynamic range inversions counting.",
    "Dynamic geometry sweep-line calculations."
  ];
  const mistakes = [
    "Over-allocating segment tree size. A static segment tree needs 4 * N node space to prevent index overflow issues.",
    "Incorrect boundary mid condition checks, leading to infinite recursion loops."
  ];
  const cpTips = [
    "In competitive programming contests, Segment Tree is extremely popular because it can be generalized to support custom range associative merge operations!"
  ];

  return (
    <TrLayout
      timeComplexity="O(log N) query & update"
      spaceComplexity="O(N) segment tree space"
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
              Segment Tree Node Segments
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <TreeCanvas
              nodes={nodes}
              edges={edges}
              highlightedNodes={highlightNodes}
            />

            {/* Mirror 1D Array view */}
            <div className="border-t border-border/5 pt-3 space-y-2 text-left font-sans text-xs">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                Source Array:
              </span>
              <div className="flex flex-wrap gap-1.5 font-mono">
                {array.map((val, idx) => (
                  <div key={idx} className="px-2.5 py-1.5 border border-border/40 rounded bg-background/25 flex flex-col items-center">
                    <span className="text-[9px] text-muted-foreground">[{idx}]</span>
                    <span className="font-extrabold text-foreground">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {querySumResult !== null && (
              <div className="border-t border-border/5 pt-3 font-mono text-xs text-left">
                <div className="p-2.5 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 rounded-lg">
                  Query Range [{queryL}, {queryR}] Sum = <span className="font-extrabold">{querySumResult}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      }
    >
      <TrHeader
        title="Segment Tree"
        description="Query range sums and apply point updates over contiguous segment splits."
        category="Algorithms"
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
          <div className="grid gap-2 grid-cols-2">
            <InputField label="Update Index" value={inputIdx} onChange={setInputIdx} />
            <InputField label="New Value" value={inputVal} onChange={setInputVal} />
          </div>
          <Button onClick={handleUpdate} className="w-full justify-center cursor-pointer">
            Apply Point Update
          </Button>

          <hr className="border-border/10 my-2" />

          <div className="grid gap-2 grid-cols-2">
            <InputField label="Query Left (L)" value={queryL} onChange={setQueryL} />
            <InputField label="Query Right (R)" value={queryR} onChange={setQueryR} />
          </div>
          <Button onClick={handleQuery} variant="outline" className="w-full justify-center cursor-pointer">
            Query Range Sum
          </Button>
        </CardContent>
      </Card>
    </TrLayout>
  );
}
