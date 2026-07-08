"use client";

import * as React from "react";
import { TrHeader } from "../../shared/tr-header";
import { TrLayout } from "../../shared/tr-layout";
import { TreeCanvas, TreeNode, TreeEdge } from "../../visualization/tree-canvas";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

class AvlNode {
  key: number;
  height: number = 1;
  left: AvlNode | null = null;
  right: AvlNode | null = null;

  constructor(key: number) {
    this.key = key;
  }
}

export function AvlTool() {
  const { toast } = useToast();
  const [keys, setKeys] = React.useState<number[]>([10, 20, 30, 40, 50, 25]);
  const [inputKey, setInputKey] = React.useState("15");

  const [nodes, setNodes] = React.useState<TreeNode[]>([]);
  const [edges, setEdges] = React.useState<TreeEdge[]>([]);
  const [rotationSteps, setRotationSteps] = React.useState<string[]>([]);

  const getHeight = (n: AvlNode | null): number => (n ? n.height : 0);
  const getBalance = (n: AvlNode | null): number => (n ? getHeight(n.left) - getHeight(n.right) : 0);

  const rightRotate = (y: AvlNode, logs: string[]): AvlNode => {
    logs.push(`• Right rotation performed at node ${y.key}`);
    const x = y.left!;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
    x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;

    return x;
  };

  const leftRotate = (x: AvlNode, logs: string[]): AvlNode => {
    logs.push(`• Left rotation performed at node ${x.key}`);
    const y = x.right!;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
    y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;

    return y;
  };

  const rebuildTree = (currentKeys: number[]) => {
    if (currentKeys.length === 0) {
      setNodes([]);
      setEdges([]);
      setRotationSteps([]);
      return;
    }

    let rootNode: AvlNode | null = null;
    const logs: string[] = [];

    const insertAVL = (node: AvlNode | null, key: number): AvlNode => {
      if (!node) return new AvlNode(key);

      if (key < node.key) {
        node.left = insertAVL(node.left, key);
      } else if (key > node.key) {
        node.right = insertAVL(node.right, key);
      } else {
        return node;
      }

      node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1;
      const balance = getBalance(node);

      // LL Case
      if (balance > 1 && key < node.left!.key) {
        return rightRotate(node, logs);
      }

      // RR Case
      if (balance < -1 && key > node.right!.key) {
        return leftRotate(node, logs);
      }

      // LR Case
      if (balance > 1 && key > node.left!.key) {
        node.left = leftRotate(node.left!, logs);
        return rightRotate(node, logs);
      }

      // RL Case
      if (balance < -1 && key < node.right!.key) {
        node.right = rightRotate(node.right!, logs);
        return leftRotate(node, logs);
      }

      return node;
    };

    currentKeys.forEach((key) => {
      rootNode = insertAVL(rootNode, key);
    });

    // Layout nodes
    const newNodes: TreeNode[] = [];
    const newEdges: TreeEdge[] = [];
    let leafX = 50;

    const positionSubtree = (node: AvlNode | null, depth: number): { left: number; right: number } => {
      if (!node) return { left: leafX, right: leafX };

      const uId = node.key.toString();
      const bal = getBalance(node);
      const nodeObj: TreeNode = {
        id: uId,
        label: uId,
        x: 0,
        y: 50 + depth * 70,
        val: `BF: ${bal}`,
      };

      if (!node.left && !node.right) {
        nodeObj.x = leafX;
        newNodes.push(nodeObj);
        const xPos = leafX;
        leafX += 70;
        return { left: xPos, right: xPos };
      }

      const leftBounds = positionSubtree(node.left, depth + 1);
      if (node.left) {
        newEdges.push({
          id: `${uId}-${node.left.key}`,
          from: uId,
          to: node.left.key.toString(),
        });
      }

      const rightBounds = positionSubtree(node.right, depth + 1);
      if (node.right) {
        newEdges.push({
          id: `${uId}-${node.right.key}`,
          from: uId,
          to: node.right.key.toString(),
        });
      }

      const leftX = node.left ? newNodes.find((n) => n.id === node.left!.key.toString())!.x : leftBounds.left;
      const rightX = node.right ? newNodes.find((n) => n.id === node.right!.key.toString())!.x : rightBounds.right;

      nodeObj.x = (leftX + rightX) / 2;
      newNodes.push(nodeObj);
      return { left: leftBounds.left, right: rightBounds.right };
    };

    positionSubtree(rootNode, 0);

    const maxX = Math.max(...newNodes.map((n) => n.x), 100);
    const shift = Math.max((600 - maxX) / 2, 20);
    newNodes.forEach((node) => {
      node.x += shift;
    });

    setNodes(newNodes);
    setEdges(newEdges);
    setRotationSteps(logs);
  };

  React.useEffect(() => {
    rebuildTree(keys);
  }, [keys]);

  const handleInsert = () => {
    const k = parseInt(inputKey, 10);
    if (isNaN(k)) return;
    if (keys.includes(k)) {
      toast({
        title: "Key Exists",
        description: `Key ${k} already exists.`,
        variant: "warning",
      });
      return;
    }
    const nextKeys = [...keys, k];
    setKeys(nextKeys);
    toast({
      title: "Key Added",
      description: `Key ${k} inserted into AVL tree.`,
      variant: "success",
    });
  };

  const handleClear = () => {
    setKeys([]);
    toast({
      title: "Tree Cleared",
      description: "AVL tree nodes cleared.",
      variant: "info",
    });
  };

  const definition = "An AVL Tree is a self-balancing binary search tree where the heights of the two child subtrees of any node differ by at most one. Self-balancing rotations are performed when insertion violates this balance factor limit.";
  const idea = "Tracks heights for all nodes. When balance factor BF = height(left) - height(right) exceeds 1 or drops below -1, triggers Left/Right rotations to restore logarithmic depth bounds.";
  const pseudocode = `LeftRotate(x):
  y = x.right
  x.right = y.left
  y.left = x
  update_heights(x, y)
  return y`;

  const applications = [
    "High-lookup database indexing collections.",
    "Efficient storage sorted map dictionary indices.",
    "Standard library collections."
  ];
  const mistakes = [
    "Forgetting to update heights of rotated nodes, leading to incorrect subsequent balance computations.",
    "Incorrect double rotation checks LR/RL."
  ];
  const cpTips = [
    "AVL coding footprint is large. In CP, if dynamic balance is needed, utilize `std::set` in C++ or coordinate-compressed segment trees to bypass tree node pointer manipulation entirely."
  ];

  return (
    <TrLayout
      timeComplexity="O(log N) guaranteed"
      spaceComplexity="O(N) storage space"
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

            {rotationSteps.length > 0 && (
              <div className="border-t border-border/5 pt-3 space-y-2 font-mono text-xs text-left">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                  Self-Balancing Rotations Log:
                </span>
                <div className="p-2.5 bg-muted/20 border border-border/10 rounded-lg max-h-36 overflow-y-auto font-mono text-[11px] leading-relaxed text-foreground/80 space-y-1">
                  {rotationSteps.map((log, idx) => (
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
        title="AVL Balanced Tree"
        description="Insert elements in AVL trees with automatic LL, RR, LR, RL balancing rotations."
        category="Algorithms"
        difficulty="Hard"
        shortcut="Alt+Shift+V"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <InputField label="New Node Key" value={inputKey} onChange={setInputKey} />

          <div className="flex gap-2">
            <Button onClick={handleInsert} className="flex-1 justify-center cursor-pointer">
              Insert Key
            </Button>
            <Button onClick={handleClear} variant="outline" className="flex-1 justify-center cursor-pointer">
              Clear Tree
            </Button>
          </div>
        </CardContent>
      </Card>
    </TrLayout>
  );
}
