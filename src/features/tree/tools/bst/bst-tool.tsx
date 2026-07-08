"use client";

import * as React from "react";
import { TrHeader } from "../../shared/tr-header";
import { TrLayout } from "../../shared/tr-layout";
import { TreeCanvas, TreeNode, TreeEdge } from "../../visualization/tree-canvas";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

class BstNode {
  key: number;
  left: BstNode | null = null;
  right: BstNode | null = null;

  constructor(key: number) {
    this.key = key;
  }
}

export function BstTool() {
  const { toast } = useToast();
  const [keys, setKeys] = React.useState<number[]>([15, 10, 20, 8, 12, 17, 25]);
  const [inputKey, setInputKey] = React.useState("16");
  const [searchKey, setSearchKey] = React.useState("12");

  const [nodes, setNodes] = React.useState<TreeNode[]>([]);
  const [edges, setEdges] = React.useState<TreeEdge[]>([]);
  const [highlightNode, setHighlightNode] = React.useState<string[]>([]);
  const [compared, setCompared] = React.useState(false);
  const [searchResult, setSearchResult] = React.useState<string | null>(null);

  // Build tree from keys list
  const rebuildTree = (currentKeys: number[]) => {
    if (currentKeys.length === 0) {
      setNodes([]);
      setEdges([]);
      return;
    }

    let rootNode: BstNode | null = null;

    const insertBST = (root: BstNode | null, k: number): BstNode => {
      if (!root) return new BstNode(k);
      if (k < root.key) {
        root.left = insertBST(root.left, k);
      } else if (k > root.key) {
        root.right = insertBST(root.right, k);
      }
      return root;
    };

    currentKeys.forEach((k) => {
      rootNode = insertBST(rootNode, k);
    });

    // Traverse and assign node coordinates
    const newNodes: TreeNode[] = [];
    const newEdges: TreeEdge[] = [];
    let leafX = 50;

    const positionSubtree = (node: BstNode | null, depth: number): { left: number; right: number } => {
      if (!node) return { left: leafX, right: leafX };

      const uId = node.key.toString();
      const nodeObj: TreeNode = {
        id: uId,
        label: uId,
        x: 0,
        y: 50 + depth * 70,
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

    // Apply offset shift to center tree on canvas
    const maxX = Math.max(...newNodes.map((n) => n.x), 100);
    const shift = Math.max((600 - maxX) / 2, 20);
    newNodes.forEach((node) => {
      node.x += shift;
    });

    setNodes(newNodes);
    setEdges(newEdges);
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
        description: `Key ${k} already exists in the BST.`,
        variant: "warning",
      });
      return;
    }
    const nextKeys = [...keys, k];
    setKeys(nextKeys);
    toast({
      title: "Key Inserted",
      description: `Key ${k} added to BST.`,
      variant: "success",
    });
  };

  const handleDelete = () => {
    const k = parseInt(inputKey, 10);
    if (isNaN(k)) return;
    if (!keys.includes(k)) {
      toast({
        title: "Key Not Found",
        description: `Key ${k} does not exist in the BST.`,
        variant: "warning",
      });
      return;
    }
    const nextKeys = keys.filter((key) => key !== k);
    setKeys(nextKeys);
    toast({
      title: "Key Deleted",
      description: `Key ${k} removed from BST.`,
      variant: "info",
    });
  };

  const handleSearch = () => {
    setCompared(true);
    const k = parseInt(searchKey, 10);
    if (isNaN(k)) {
      setSearchResult("Please enter a valid key to search.");
      return;
    }

    const path: string[] = [];
    let curr = keys.length > 0 ? keys[0] : null;

    // Simulate search path
    const setOfKeys = new Set(keys);
    const keyOrder = [...keys]; // insertion order to construct root/structure
    let found = false;

    // Reconstruct BST search path manually
    let rootKey = keyOrder[0];
    const leftChildMap: Record<number, number> = {};
    const rightChildMap: Record<number, number> = {};

    const insertBST = (r: number, val: number) => {
      if (val < r) {
        if (leftChildMap[r] !== undefined) {
          insertBST(leftChildMap[r], val);
        } else {
          leftChildMap[r] = val;
        }
      } else {
        if (rightChildMap[r] !== undefined) {
          insertBST(rightChildMap[r], val);
        } else {
          rightChildMap[r] = val;
        }
      }
    };

    for (let i = 1; i < keyOrder.length; i++) {
      insertBST(rootKey, keyOrder[i]);
    }

    let temp: number | undefined = rootKey;
    while (temp !== undefined) {
      path.push(temp.toString());
      if (k === temp) {
        found = true;
        break;
      }
      if (k < temp) {
        temp = leftChildMap[temp];
      } else {
        temp = rightChildMap[temp];
      }
    }

    setHighlightNode(path);
    if (found) {
      setSearchResult(`Key ${k} found! Path: ${path.join(" → ")}`);
    } else {
      setSearchResult(`Key ${k} not found. Traversal path: ${path.join(" → ")}`);
    }
  };

  const definition = "A Binary Search Tree (BST) is a node-based binary tree data structure where for each node, its left subtree contains only nodes with keys less than the node's key, and its right subtree contains only nodes with keys greater than the node's key.";
  const idea = "Supports lookup, insertion, and deletion operations. When balanced, operations take logarithmic time; however, skewed insertions degrade runtime performance to linear.";
  const pseudocode = `Search(root, key):
  if root is null or root.key == key:
    return root
  if key < root.key:
    return Search(root.left, key)
  return Search(root.right, key)`;

  const applications = [
    "Used to implement sorted sets and associative dictionary maps.",
    "Efficient binary index bounds search.",
    "Foundation structure for self-balancing AVL/Red-Black trees."
  ];
  const mistakes = [
    "Inserting pre-sorted keys, which creates a skewed linear degenerate tree and reduces search speed to O(N).",
    "Incorrect left/right comparisons when dealing with duplicate keys."
  ];
  const cpTips = [
    "CP platforms rarely require coding manual BSTs because the standard libraries (e.g. `std::set` in C++ or `TreeMap` in Java) are pre-balanced Red-Black tree wrappers."
  ];

  return (
    <TrLayout
      timeComplexity="O(log N) average / O(N) worst case"
      spaceComplexity="O(N) storage size"
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
              highlightedNodes={highlightNode}
            />

            {compared && searchResult && (
              <div className="border-t border-border/5 pt-3 font-mono text-xs text-left">
                <div className="p-2.5 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 rounded-lg">
                  {searchResult}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      }
    >
      <TrHeader
        title="Binary Search Tree (BST)"
        description="Insert, delete, and lookup keys in BST arrays, monitoring traversal paths."
        category="Algorithms"
        difficulty="Easy"
        shortcut="Alt+Shift+B"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <div className="grid gap-2 grid-cols-2">
            <InputField label="Input Key" value={inputKey} onChange={setInputKey} />
            <div className="flex gap-1.5 mt-6">
              <Button onClick={handleInsert} className="flex-1 justify-center cursor-pointer text-xs h-9">
                Insert
              </Button>
              <Button onClick={handleDelete} variant="danger" className="flex-1 justify-center cursor-pointer text-xs h-9">
                Delete
              </Button>
            </div>
          </div>

          <div className="grid gap-4 grid-cols-2">
            <InputField label="Search Key" value={searchKey} onChange={setSearchKey} />
            <Button onClick={handleSearch} variant="outline" className="mt-6 justify-center cursor-pointer h-9">
              Search Key
            </Button>
          </div>
        </CardContent>
      </Card>
    </TrLayout>
  );
}
