"use client";

import * as React from "react";
import { TrHeader } from "../../shared/tr-header";
import { TrLayout } from "../../shared/tr-layout";
import { TreeCanvas, TreeNode, TreeEdge } from "../../visualization/tree-canvas";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";

export function HeapTool() {
  const { toast } = useToast();
  const [heapType, setHeapType] = React.useState<"min" | "max">("min");
  const [array, setArray] = React.useState<number[]>([10, 15, 30, 40, 50, 60]);
  const [inputVal, setInputVal] = React.useState("5");

  const [nodes, setNodes] = React.useState<TreeNode[]>([]);
  const [edges, setEdges] = React.useState<TreeEdge[]>([]);
  const [heapifyLogs, setHeapifyLogs] = React.useState<string[]>([]);

  // Generate tree coordinates based on binary heap array indexing
  const layoutHeap = (heapArray: number[]) => {
    if (heapArray.length === 0) {
      setNodes([]);
      setEdges([]);
      return;
    }

    const newNodes: TreeNode[] = [];
    const newEdges: TreeEdge[] = [];

    // Simple levels coordinate assignment
    // Level d contains indices from 2^d - 1 to 2^(d+1) - 2
    heapArray.forEach((val, idx) => {
      const depth = Math.floor(Math.log2(idx + 1));
      const levelIdx = idx - (Math.pow(2, depth) - 1);
      const levelSize = Math.pow(2, depth);

      // Distribute evenly along width
      const width = 600;
      const spacing = width / (levelSize + 1);
      const x = spacing * (levelIdx + 1);
      const y = 50 + depth * 70;

      const uId = idx.toString();
      newNodes.push({
        id: uId,
        label: val.toString(),
        x,
        y,
        val: `Index: ${idx}`,
      });

      // Add parent edge
      if (idx > 0) {
        const parentIdx = Math.floor((idx - 1) / 2);
        newEdges.push({
          id: `${parentIdx}-${idx}`,
          from: parentIdx.toString(),
          to: uId,
        });
      }
    });

    setNodes(newNodes);
    setEdges(newEdges);
  };

  React.useEffect(() => {
    layoutHeap(array);
  }, [array]);

  const handleInsert = () => {
    const val = parseInt(inputVal, 10);
    if (isNaN(val)) return;

    const nextArr = [...array, val];
    const logs: string[] = [`• Push ${val} to index ${nextArr.length - 1}`];

    // Bubble up / Heapify Up
    let idx = nextArr.length - 1;
    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2);
      const shouldSwap =
        heapType === "min"
          ? nextArr[idx] < nextArr[parentIdx]
          : nextArr[idx] > nextArr[parentIdx];

      if (shouldSwap) {
        logs.push(`  → Swap Index ${idx} (${nextArr[idx]}) with Parent Index ${parentIdx} (${nextArr[parentIdx]})`);
        const temp = nextArr[idx];
        nextArr[idx] = nextArr[parentIdx];
        nextArr[parentIdx] = temp;
        idx = parentIdx;
      } else {
        break;
      }
    }

    setArray(nextArr);
    setHeapifyLogs(logs);
    toast({
      title: "Element Inserted",
      description: `Value ${val} added and heapified.`,
      variant: "success",
    });
  };

  const handleExtract = () => {
    if (array.length === 0) {
      toast({
        title: "Empty Heap",
        description: "No elements inside heap to extract.",
        variant: "warning",
      });
      return;
    }

    const nextArr = [...array];
    const extracted = nextArr[0];
    const last = nextArr.pop()!;
    const logs: string[] = [`• Extract root value ${extracted}`];

    if (nextArr.length > 0) {
      nextArr[0] = last;
      logs.push(`• Move last element ${last} to root index 0`);

      // Bubble down / Heapify Down
      let idx = 0;
      const n = nextArr.length;

      while (true) {
        const left = 2 * idx + 1;
        const right = 2 * idx + 2;
        let target = idx;

        if (left < n) {
          const checkLeft =
            heapType === "min"
              ? nextArr[left] < nextArr[target]
              : nextArr[left] > nextArr[target];
          if (checkLeft) target = left;
        }

        if (right < n) {
          const checkRight =
            heapType === "min"
              ? nextArr[right] < nextArr[target]
              : nextArr[right] > nextArr[target];
          if (checkRight) target = right;
        }

        if (target !== idx) {
          logs.push(`  → Swap Index ${idx} (${nextArr[idx]}) with child Index ${target} (${nextArr[target]})`);
          const temp = nextArr[idx];
          nextArr[idx] = nextArr[target];
          nextArr[target] = temp;
          idx = target;
        } else {
          break;
        }
      }
    }

    setArray(nextArr);
    setHeapifyLogs(logs);
    toast({
      title: "Root Extracted",
      description: `Extracted root value ${extracted}.`,
      variant: "info",
    });
  };

  const definition = "A Binary Heap is a complete binary tree that satisfies the heap property: in a Min Heap, each node's value is greater than or equal to its parent's value; in a Max Heap, each node's value is less than or equal to its parent's value.";
  const idea = "Supports fast access to the minimum (or maximum) element in O(1). Node additions append to the bottom right and bubble up; root extractions replace the root with the last element and bubble down.";
  const pseudocode = `HeapifyUp(idx):
  parent = (idx - 1) / 2
  if idx > 0 and heap[idx] < heap[parent]:
    swap(heap[idx], heap[parent])
    HeapifyUp(parent)`;

  const applications = [
    "Used to implement Priority Queues.",
    "Heapsort algorithm sorting keys in O(N log N).",
    "Graph traversal shortest paths (Dijkstra, Prim MST)."
  ];
  const mistakes = [
    "Incorrect index calculations for 0-indexed vs 1-indexed heap arrays.",
    "Not comparing both children when bubbling down, causing heap violations."
  ];
  const cpTips = [
    "Always rely on `std::priority_queue` in C++ or `heapq` in Python during contests. Remember that standard priority queues are Max Heaps by default!"
  ];

  return (
    <TrLayout
      timeComplexity="O(log N) operations / O(1) top access"
      spaceComplexity="O(N) contiguous space"
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
              Binary Heap Visualizer
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <TreeCanvas
              nodes={nodes}
              edges={edges}
            />

            {/* Mirror 1D Array view */}
            <div className="border-t border-border/5 pt-3 space-y-2 text-left font-sans text-xs">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                1D Array Representation:
              </span>
              <div className="flex flex-wrap gap-1.5 font-mono">
                {array.length > 0 ? array.map((val, idx) => (
                  <div key={idx} className="px-2 py-1.5 border border-border/40 rounded bg-background/25 flex flex-col items-center">
                    <span className="text-[9px] text-muted-foreground">[{idx}]</span>
                    <span className="font-extrabold text-foreground">{val}</span>
                  </div>
                )) : <div className="text-muted-foreground text-xs font-sans">Heap is empty.</div>}
              </div>
            </div>

            {heapifyLogs.length > 0 && (
              <div className="border-t border-border/5 pt-3 space-y-1 font-mono text-xs text-left">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                  Heapify Swapping Logs:
                </span>
                <div className="p-2.5 bg-muted/20 border border-border/10 rounded-lg max-h-32 overflow-y-auto font-mono text-[11px] leading-relaxed text-foreground/80 space-y-1">
                  {heapifyLogs.map((log, idx) => (
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
        title="Binary Heap"
        description="Interact with Min/Max heaps, monitoring point insertions and bubble swap steps."
        category="Algorithms"
        difficulty="Easy"
        shortcut="Alt+Shift+H"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-muted-foreground uppercase">Heap Mode</span>
            <Select
              value={heapType}
              onChange={(e) => {
                setHeapType(e.target.value as "min" | "max");
                setHeapifyLogs([]);
              }}
            >
              <option value="min">Min Heap (Smallest at Root)</option>
              <option value="max">Max Heap (Largest at Root)</option>
            </Select>
          </div>

          <InputField label="Element Value" value={inputVal} onChange={setInputVal} />

          <div className="flex gap-2">
            <Button onClick={handleInsert} className="flex-1 justify-center cursor-pointer">
              Insert Value
            </Button>
            <Button onClick={handleExtract} variant="outline" className="flex-1 justify-center cursor-pointer">
              Extract Root
            </Button>
          </div>
        </CardContent>
      </Card>
    </TrLayout>
  );
}
