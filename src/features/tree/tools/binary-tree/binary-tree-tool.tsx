"use client";

import * as React from "react";
import { TrHeader } from "../../shared/tr-header";
import { TrLayout } from "../../shared/tr-layout";
import { TreeCanvas, TreeNode, TreeEdge } from "../../visualization/tree-canvas";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function BinaryTreeTool() {
  const [nodes, setNodes] = React.useState<TreeNode[]>([
    { id: "1", label: "A", x: 300, y: 50 },
    { id: "2", label: "B", x: 200, y: 120, parentId: "1" },
    { id: "3", label: "C", x: 400, y: 120, parentId: "1" },
    { id: "4", label: "D", x: 150, y: 190, parentId: "2" },
    { id: "5", label: "E", x: 250, y: 190, parentId: "2" },
  ]);
  const [edges, setEdges] = React.useState<TreeEdge[]>([
    { id: "1-2", from: "1", to: "2" },
    { id: "1-3", from: "1", to: "3" },
    { id: "2-4", from: "2", to: "4" },
    { id: "2-5", from: "2", to: "5" },
  ]);

  const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(null);
  const [compared, setCompared] = React.useState(false);

  const [preOrder, setPreOrder] = React.useState<string[]>([]);
  const [inOrder, setInOrder] = React.useState<string[]>([]);
  const [postOrder, setPostOrder] = React.useState<string[]>([]);
  const [levelOrder, setLevelOrder] = React.useState<string[]>([]);

  const handleEvaluate = () => {
    setCompared(true);

    if (nodes.length === 0) {
      setPreOrder([]);
      setInOrder([]);
      setPostOrder([]);
      setLevelOrder([]);
      return;
    }

    // Build binary relationships
    const leftChild: Record<string, string> = {};
    const rightChild: Record<string, string> = {};

    // Group children by parent
    const childMap: Record<string, string[]> = {};
    nodes.forEach((n) => { childMap[n.id] = []; });
    edges.forEach((e) => {
      childMap[e.from]?.push(e.to);
    });

    nodes.forEach((n) => {
      const children = childMap[n.id] || [];
      if (children[0]) leftChild[n.id] = children[0];
      if (children[1]) rightChild[n.id] = children[1];
    });

    // Find Root
    const childSet = new Set(edges.map((e) => e.to));
    const roots = nodes.filter((n) => !childSet.has(n.id));
    const rootId = roots[0]?.id || nodes[0].id;

    // Traversals
    const preRes: string[] = [];
    const inRes: string[] = [];
    const postRes: string[] = [];
    const lvlRes: string[] = [];

    const labelOf = (id: string) => nodes.find((n) => n.id === id)?.label || id;

    const traverse = (u: string) => {
      if (!u) return;
      preRes.push(labelOf(u));
      if (leftChild[u]) traverse(leftChild[u]);
      inRes.push(labelOf(u));
      if (rightChild[u]) traverse(rightChild[u]);
      postRes.push(labelOf(u));
    };

    traverse(rootId);

    // BFS Level-Order
    const q: string[] = [rootId];
    while (q.length > 0) {
      const curr = q.shift()!;
      lvlRes.push(labelOf(curr));
      if (leftChild[curr]) q.push(leftChild[curr]);
      if (rightChild[curr]) q.push(rightChild[curr]);
    }

    setPreOrder(preRes);
    setInOrder(inRes);
    setPostOrder(postRes);
    setLevelOrder(lvlRes);
  };

  const definition = "Binary tree traversals refer to systematic processes of visiting all nodes in a binary tree exactly once, classified by the order of visiting parent and children.";
  const idea = "Evaluates depth-first Preorder (Root-L-R), Inorder (L-Root-R), Postorder (L-R-Root), and breadth-first Level-Order (layer queues).";
  const pseudocode = `Preorder(u):
  if u is null: return
  visit(u)
  Preorder(u.left)
  Preorder(u.right)

Inorder(u):
  if u is null: return
  Inorder(u.left)
  visit(u)
  Inorder(u.right)

Postorder(u):
  if u is null: return
  Postorder(u.left)
  Postorder(u.right)
  visit(u)`;

  const applications = [
    "Inorder traversals yield sorted element sequences on BSTs.",
    "Postorder traversal computes subdirectory sizes recursively.",
    "Preorder traversal clones tree structures or serializes tree formats."
  ];
  const mistakes = [
    "Confusing child ordering on general tree nodes.",
    "Stack overflow on heavily unbalanced skewed tree heights."
  ];
  const cpTips = [
    "Store tree child configurations inside simple indices `L[u]` and `R[u]` arrays to avoid object allocation recursion overhead."
  ];

  return (
    <TrLayout
      timeComplexity="O(N)"
      spaceComplexity="O(N) traversal stack size"
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
              onChange={(n, e) => {
                setNodes(n);
                setEdges(e);
                setCompared(false);
              }}
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
            />

            {compared && (
              <div className="border-t border-border/5 pt-3 space-y-3 font-mono text-xs text-left">
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Preorder Traversal:</span>
                  <span className="font-bold text-primary">{preOrder.join(" → ")}</span>
                </div>
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Inorder Traversal:</span>
                  <span className="font-bold text-emerald-500">{inOrder.join(" → ")}</span>
                </div>
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Postorder Traversal:</span>
                  <span className="font-bold text-amber-500">{postOrder.join(" → ")}</span>
                </div>
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Level-Order Traversal:</span>
                  <span className="font-bold text-blue-500">{levelOrder.join(" → ")}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      }
    >
      <TrHeader
        title="Tree Traversals"
        description="Visualize DFS preorder, inorder, postorder, and BFS level-order traversals."
        category="Traversals"
        difficulty="Easy"
        shortcut="Alt+Shift+T"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <p className="text-xs text-muted-foreground">
            Edit your tree on the canvas, select nodes to add children, or run auto-layout, then hit evaluate to generate all traversal lists.
          </p>
          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Run Traversals
          </Button>
        </CardContent>
      </Card>
    </TrLayout>
  );
}
