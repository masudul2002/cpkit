"use client";

import * as React from "react";
import { TrHeader } from "../../shared/tr-header";
import { TrLayout } from "../../shared/tr-layout";
import { TreeCanvas, TreeNode, TreeEdge } from "../../visualization/tree-canvas";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export function FenwickTool() {
  const { toast } = useToast();
  const [array, setArray] = React.useState<number[]>([3, 2, -1, 6, 5, 4, -3]);
  const [inputIdx, setInputIdx] = React.useState("2");
  const [inputVal, setInputVal] = React.useState("5");

  const [queryIdx, setQueryIdx] = React.useState("4");

  const [nodes, setNodes] = React.useState<TreeNode[]>([]);
  const [edges, setEdges] = React.useState<TreeEdge[]>([]);
  const [highlightNodes, setHighlightNodes] = React.useState<string[]>([]);
  const [querySumResult, setQuerySumResult] = React.useState<number | null>(null);
  const [trace, setTrace] = React.useState<string[]>([]);

  const rebuildFenwickTree = (arr: number[]) => {
    // A Fenwick Tree has size N + 1 (1-indexed)
    const n = arr.length;
    const bit = new Array(n + 1).fill(0);

    for (let i = 0; i < n; i++) {
      const idx1 = i + 1;
      let curr = idx1;
      while (curr <= n) {
        bit[curr] += arr[i];
        curr += curr & -curr;
      }
    }

    // Visualize Fenwick tree by building parent links where parent of i is i - LSB(i)
    const nNodes: TreeNode[] = [];
    const nEdges: TreeEdge[] = [];

    // Calculate depths based on parent-links to layout hierarchically
    const depthMap: Record<number, number> = {};
    const getDepth = (i: number): number => {
      if (i === 0) return 0;
      if (depthMap[i] !== undefined) return depthMap[i];
      const p = i - (i & -i);
      depthMap[i] = getDepth(p) + 1;
      return depthMap[i];
    };

    // Group children by parent
    const childMap: Record<number, number[]> = {};
    for (let i = 1; i <= n; i++) {
      const p = i - (i & -i);
      if (childMap[p] === undefined) childMap[p] = [];
      childMap[p].push(i);
    }

    for (let i = 1; i <= n; i++) {
      const d = getDepth(i);
      const valRange = `${i - (i & -i) + 1} to ${i}`;
      nNodes.push({
        id: i.toString(),
        label: bit[i].toString(),
        x: 0,
        y: 50 + d * 60,
        val: `idx: ${i} [${valRange}]`,
      });

      const p = i - (i & -i);
      if (p > 0) {
        nEdges.push({
          id: `${p}-${i}`,
          from: p.toString(),
          to: i.toString(),
        });
      }
    }

    // Position coordinates
    let currentX = 50;
    const nodeObjMap = new Map(nNodes.map((n) => [n.id, n]));

    const positionNodes = (u: number) => {
      const node = nodeObjMap.get(u.toString());
      const children = childMap[u] || [];
      if (!node) return;

      if (children.length === 0) {
        node.x = currentX;
        currentX += 80;
        return;
      }

      children.forEach((c) => positionNodes(c));
      const leftChild = nodeObjMap.get(children[0].toString());
      const rightChild = nodeObjMap.get(children[children.length - 1].toString());

      if (leftChild && rightChild) {
        node.x = (leftChild.x + rightChild.x) / 2;
      }
    };

    // Nodes with parent 0 are roots of the forest
    const roots = childMap[0] || [];
    roots.forEach((r) => positionNodes(r));

    const maxX = Math.max(...nNodes.map((n) => n.x), 100);
    const shift = Math.max((600 - maxX) / 2, 20);
    nNodes.forEach((node) => {
      node.x += shift;
    });

    setNodes(nNodes);
    setEdges(nEdges);
  };

  React.useEffect(() => {
    rebuildFenwickTree(array);
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
    setTrace([]);
    toast({
      title: "Point Updated",
      description: `Index ${idx} value updated to ${val}.`,
      variant: "success",
    });
  };

  const handleQuery = () => {
    const qIdx = parseInt(queryIdx, 10);
    const n = array.length;

    if (isNaN(qIdx) || qIdx < 0 || qIdx >= n) {
      toast({
        title: "Invalid Query Index",
        description: `Index must be between 0 and ${n - 1}.`,
        variant: "warning",
      });
      return;
    }

    // 1-indexed BIT queries
    const bitIdx = qIdx + 1;
    const highlighted: string[] = [];
    const log: string[] = [`• Compute Prefix Sum at Index ${qIdx} (1-indexed BIT index ${bitIdx}):`];

    let curr = bitIdx;
    let sum = 0;
    while (curr > 0) {
      highlighted.push(curr.toString());
      // Accumulate value directly from node or BIT
      // We rebuild BIT value inline
      const bitArr = new Array(n + 1).fill(0);
      for (let i = 0; i < n; i++) {
        let tempIdx = i + 1;
        while (tempIdx <= n) {
          bitArr[tempIdx] += array[i];
          tempIdx += tempIdx & -tempIdx;
        }
      }

      sum += bitArr[curr];
      log.push(`  → Add BIT[${curr}] (${bitArr[curr]}) to sum. Next index: ${curr} - (${curr} & -${curr}) = ${curr - (curr & -curr)}`);
      curr -= curr & -curr;
    }

    setHighlightNodes(highlighted);
    setQuerySumResult(sum);
    setTrace(log);
  };

  const definition = "A Fenwick Tree (Binary Indexed Tree / BIT) is a data structure that can efficiently update elements and calculate prefix sums in an array of numbers in logarithmic time.";
  const idea = "Each index in a Fenwick Tree stores the sum of a range of elements determined by its Least Significant Bit (LSB). Point updates run in O(log N) by hopping parents ($i \\mathrel{+}= i \\mathbin{\\&} -i$), and prefix queries run in O(log N) by hopping children ($i \\mathrel{-}= i \\mathbin{\\&} -i$).";
  const pseudocode = `PrefixSum(i):
  sum = 0
  while i > 0:
    sum += tree[i]
    i -= i & -i // clear LSB
  return sum

Update(i, val):
  delta = val - arr[i]
  arr[i] = val
  while i <= N:
    tree[i] += delta
    i += i & -i // add LSB`;

  const applications = [
    "Dynamic cumulative frequency tables queries.",
    "Counting array inversions.",
    "General dynamic range query updates."
  ];
  const mistakes = [
    "Using 0-indexed values; Fenwick Trees MUST be 1-indexed because $0 \\mathbin{\\&} -0 = 0$, leading to infinite loops.",
    "Forgetting to calculate difference delta when performing updates instead of set operations."
  ];
  const cpTips = [
    "Fenwick Trees have an incredibly small memory footprint and very short code length, making them preferred over Segment Trees when only range prefix queries are required!"
  ];

  return (
    <TrLayout
      timeComplexity="O(log N) query & update"
      spaceComplexity="O(N) BIT storage array"
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
              Binary Indexed Tree Forest
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <TreeCanvas
              nodes={nodes}
              edges={edges}
              highlightedNodes={highlightNodes}
            />

            {/* Flat Array view */}
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
              <div className="border-t border-border/5 pt-3 space-y-2 font-mono text-xs text-left">
                <div className="p-2.5 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 rounded-lg">
                  Prefix Sum from Index 0 to {queryIdx} = <span className="font-extrabold">{querySumResult}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                    LSB Query Hops Log:
                  </span>
                  <div className="p-2.5 bg-muted/20 border border-border/10 rounded-lg max-h-32 overflow-y-auto font-mono text-[11px] leading-relaxed text-foreground/80 space-y-1">
                    {trace.map((t, idx) => (
                      <div key={idx}>{t}</div>
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
        title="Fenwick Tree"
        description="Compute prefix sums using LSB bitwise operations and point updates."
        category="Algorithms"
        difficulty="Medium"
        shortcut="Alt+Shift+F"
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
            <InputField label="Prefix Query Up To" value={queryIdx} onChange={setQueryIdx} />
            <Button onClick={handleQuery} variant="outline" className="mt-6 justify-center cursor-pointer h-9">
              Prefix Query
            </Button>
          </div>
        </CardContent>
      </Card>
    </TrLayout>
  );
}
