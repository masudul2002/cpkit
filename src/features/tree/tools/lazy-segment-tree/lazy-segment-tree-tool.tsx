"use client";

import * as React from "react";
import { TrHeader } from "../../shared/tr-header";
import { TrLayout } from "../../shared/tr-layout";
import { TreeCanvas, TreeNode, TreeEdge } from "../../visualization/tree-canvas";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export function LazySegmentTreeTool() {
  const { toast } = useToast();
  const [array, setArray] = React.useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [rangeL, setRangeL] = React.useState("1");
  const [rangeR, setRangeR] = React.useState("4");
  const [updateVal, setUpdateVal] = React.useState("5");

  const [queryL, setQueryL] = React.useState("2");
  const [queryR, setQueryR] = React.useState("4");

  const [nodes, setNodes] = React.useState<TreeNode[]>([]);
  const [edges, setEdges] = React.useState<TreeEdge[]>([]);
  const [highlightNodes, setHighlightNodes] = React.useState<string[]>([]);
  const [lazyMap, setLazyMap] = React.useState<Record<string, number>>({});
  const [queryResult, setQueryResult] = React.useState<number | null>(null);
  const [propagationLogs, setPropagationLogs] = React.useState<string[]>([]);

  const rebuildLazyTree = (arr: number[], currentLazy: Record<string, number>) => {
    if (arr.length === 0) {
      setNodes([]);
      setEdges([]);
      return;
    }

    const nNodes: TreeNode[] = [];
    const nEdges: TreeEdge[] = [];

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

      // Add lazy tag contribution to display value if present
      const lazyVal = currentLazy[uId] || 0;
      const displayVal = sum + lazyVal * (r - l + 1);

      nNodes.push({
        id: uId,
        label: displayVal.toString(),
        x: 0,
        y: 50 + depth * 70,
        val: lazyVal > 0 ? `[${l}, ${r}] (lz: +${lazyVal})` : `[${l}, ${r}]`,
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

    // Coordinate Layout
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

    const maxX = Math.max(...nNodes.map((n) => n.x), 100);
    const shift = Math.max((600 - maxX) / 2, 20);
    nNodes.forEach((node) => {
      node.x += shift;
    });

    setNodes(nNodes);
    setEdges(nEdges);
  };

  React.useEffect(() => {
    rebuildLazyTree(array, lazyMap);
  }, [array, lazyMap]);

  const handleRangeUpdate = () => {
    const l = parseInt(rangeL, 10);
    const r = parseInt(rangeR, 10);
    const val = parseInt(updateVal, 10);
    const n = array.length;

    if (isNaN(l) || isNaN(r) || isNaN(val) || l < 0 || r >= n || l > r) {
      toast({
        title: "Invalid Range",
        description: `L and R must satisfy 0 <= L <= R <= ${n - 1}.`,
        variant: "warning",
      });
      return;
    }

    const nextLazy = { ...lazyMap };
    const logs: string[] = [`• Range update add +${val} over range [${l}, ${r}]`];

    // Simulate lazy segment tree range updates
    const update = (currL: number, currR: number) => {
      const uId = `${currL}-${currR}`;
      if (l <= currL && currR <= r) {
        nextLazy[uId] = (nextLazy[uId] || 0) + val;
        logs.push(`  → Apply Lazy tag of +${val} to node [${currL}, ${currR}]`);
        return;
      }

      const mid = Math.floor((currL + currR) / 2);
      if (l <= mid) {
        update(currL, mid);
      }
      if (r > mid) {
        update(mid + 1, currR);
      }
    };

    update(0, n - 1);
    setLazyMap(nextLazy);
    setQueryResult(null);
    setHighlightNodes([]);
    setPropagationLogs(logs);
    toast({
      title: "Range Updated",
      description: `Lazy tag +${val} applied to ranges.`,
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
        description: `0 <= L <= R <= ${n - 1} condition violated.`,
        variant: "warning",
      });
      return;
    }

    const highlighted: string[] = [];
    let sumResult = 0;
    const logs: string[] = [`• Run Range Sum Query over range [${ql}, ${qr}]`];

    // Simulate query with lazy tag pushes
    const query = (currL: number, currR: number, inheritedLazy: number) => {
      const uId = `${currL}-${currR}`;
      const currentLazyVal = inheritedLazy + (lazyMap[uId] || 0);

      if (ql <= currL && currR <= qr) {
        highlighted.push(uId);
        // Calculate range sum directly from array values plus lazy tag increments
        let sum = 0;
        for (let i = currL; i <= currR; i++) {
          sum += array[i] + currentLazyVal;
        }
        sumResult += sum;
        logs.push(`  → Collect node [${currL}, ${currR}] value: sum = ${sum} (includes lazy tag offset ${currentLazyVal})`);
        return;
      }

      const mid = Math.floor((currL + currR) / 2);

      if (lazyMap[uId] > 0) {
        logs.push(`  ↳ Push lazy tag of +${lazyMap[uId]} from [${currL}, ${currR}] to children [${currL}, ${mid}] and [${mid + 1}, ${currR}]`);
      }

      if (ql <= mid) {
        query(currL, mid, currentLazyVal);
      }
      if (qr > mid) {
        query(mid + 1, currR, currentLazyVal);
      }
    };

    query(0, n - 1, 0);
    setHighlightNodes(highlighted);
    setQueryResult(sumResult);
    setPropagationLogs(logs);
  };

  const definition = "A Lazy Segment Tree optimizes range update operations (e.g., adding a value to all array elements in a range [L, R]) to logarithmic time by deferring child updates until they are queried.";
  const idea = "Instead of updating all leaves, range updates store 'lazy tags' at high-level segment nodes. When queries or updates traverse down, these tags are pushed to children (tag propagation).";
  const pseudocode = `RangeUpdate(l, r, qL, qR, val):
  if lazy[node] != 0:
    tree[node] += lazy[node] * (r - l + 1)
    if l != r:
      lazy[left] += lazy[node]
      lazy[right] += lazy[node]
    lazy[node] = 0

  if qL <= l and r <= qR:
    tree[node] += val * (r - l + 1)
    if l != r:
      lazy[left] += val
      lazy[right] += val
    return`;

  const applications = [
    "Range updates (Add/Set) combined with Range Queries (Sum/Min/Max).",
    "Sweeping algorithms with dynamic values.",
    "Updating dense grid subregions."
  ];
  const mistakes = [
    "Forgetting to push lazy tags before accessing child nodes, returning stale sums.",
    "Incorrectly accumulating lazy values instead of replacing them (in Range Set updates)."
  ];
  const cpTips = [
    "Lazy segment trees are considered advanced but are highly reusable. Write a template struct that supports a custom lazy 'Action' type and tree 'Node' type!"
  ];

  return (
    <TrLayout
      timeComplexity="O(log N) lazy query & updates"
      spaceComplexity="O(N) segment tree & lazy tag sizes"
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

            {queryResult !== null && (
              <div className="border-t border-border/5 pt-3 font-mono text-xs text-left">
                <div className="p-2.5 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 rounded-lg">
                  Query Range [{queryL}, {queryR}] Sum = <span className="font-extrabold">{queryResult}</span>
                </div>
              </div>
            )}

            {propagationLogs.length > 0 && (
              <div className="border-t border-border/5 pt-3 space-y-1 font-mono text-xs text-left">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                  Lazy Tag Pushes & Evaluations:
                </span>
                <div className="p-2.5 bg-muted/20 border border-border/10 rounded-lg max-h-36 overflow-y-auto font-mono text-[11px] leading-relaxed text-foreground/80 space-y-1">
                  {propagationLogs.map((log, idx) => (
                    <div key={idx}>{log}</div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      }
    >
      <TrHeader
        title="Lazy Segment Tree"
        description="Apply logarithmic range additions and trace deferred tag propagation steps."
        category="Algorithms"
        difficulty="Hard"
        shortcut="Alt+Shift+L"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <div className="grid gap-2 grid-cols-3">
            <InputField label="Add L" value={rangeL} onChange={setRangeL} />
            <InputField label="Add R" value={rangeR} onChange={setRangeR} />
            <InputField label="Add Val" value={updateVal} onChange={setUpdateVal} />
          </div>
          <Button onClick={handleRangeUpdate} className="w-full justify-center cursor-pointer">
            Apply Range Addition
          </Button>

          <hr className="border-border/10 my-2" />

          <div className="grid gap-2 grid-cols-2">
            <InputField label="Query Left" value={queryL} onChange={setQueryL} />
            <InputField label="Query Right" value={queryR} onChange={setQueryR} />
          </div>
          <Button onClick={handleQuery} variant="outline" className="w-full justify-center cursor-pointer">
            Query Range Sum
          </Button>
        </CardContent>
      </Card>
    </TrLayout>
  );
}
