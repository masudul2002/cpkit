"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

export interface TreeNode {
  id: string;
  label: string;
  x: number;
  y: number;
  parentId?: string;
  val?: string; // dynamic tag for segment ranges or values
}

export interface TreeEdge {
  id: string;
  from: string;
  to: string;
}

interface TreeCanvasProps {
  nodes: TreeNode[];
  edges: TreeEdge[];
  onChange?: (nodes: TreeNode[], edges: TreeEdge[]) => void;
  highlightedNodes?: string[];
  highlightedEdges?: string[];
  selectedNodeId?: string | null;
  onSelectNode?: (nodeId: string | null) => void;
  showValues?: boolean;
}

export function TreeCanvas({
  nodes,
  edges,
  onChange,
  highlightedNodes = [],
  highlightedEdges = [],
  selectedNodeId = null,
  onSelectNode,
  showValues = true,
}: TreeCanvasProps) {
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const [draggingNodeId, setDraggingNodeId] = React.useState<string | null>(null);

  // Auto-layout utility to position nodes hierarchically
  const runAutoLayout = () => {
    if (!onChange || nodes.length === 0) return;

    // Build children relationships
    const adj: Record<string, string[]> = {};
    nodes.forEach((n) => { adj[n.id] = []; });
    edges.forEach((e) => {
      // Direct edges parent -> child
      adj[e.from]?.push(e.to);
    });

    // Find roots: nodes with no incoming edges
    const childSet = new Set(edges.map((e) => e.to));
    const roots = nodes.filter((n) => !childSet.has(n.id)).map((n) => n.id);

    if (roots.length === 0 && nodes.length > 0) {
      // Cycle or fallback: pick first node
      roots.push(nodes[0].id);
    }

    const nextNodes = [...nodes];
    const nodeMap = new Map(nextNodes.map((n) => [n.id, n]));

    let currentX = 50;
    const levelHeight = 70;
    const canvasWidth = 600;

    // Helper to traverse and assign positions
    const layoutSubtree = (u: string, depth: number): { left: number; right: number } => {
      const node = nodeMap.get(u);
      const children = adj[u] || [];

      if (!node) return { left: currentX, right: currentX };

      node.y = 50 + depth * levelHeight;

      if (children.length === 0) {
        node.x = currentX;
        const xPos = currentX;
        currentX += 70; // spacing between leaves
        return { left: xPos, right: xPos };
      }

      const childBounds = children.map((c) => layoutSubtree(c, depth + 1));
      const leftBound = childBounds[0].left;
      const rightBound = childBounds[childBounds.length - 1].right;

      node.x = (leftBound + rightBound) / 2;
      return { left: leftBound, right: rightBound };
    };

    roots.forEach((root) => {
      layoutSubtree(root, 0);
    });

    // Translate coordinates to center within canvas if width permits
    const maxX = Math.max(...nextNodes.map((n) => n.x), 100);
    const shift = Math.max((canvasWidth - maxX) / 2, 20);
    nextNodes.forEach((node) => {
      node.x += shift;
    });

    onChange(nextNodes, edges);
  };

  const handleSvgDoubleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!onChange) return;
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicked near an existing node
    const clickedNear = nodes.some(
      (n) => Math.hypot(n.x - x, n.y - y) < 25
    );
    if (clickedNear) return;

    const nextId = nodes.length > 0 ? (Math.max(...nodes.map((n) => parseInt(n.id, 10) || 0)) + 1).toString() : "0";
    const newNode: TreeNode = {
      id: nextId,
      label: nextId,
      x,
      y,
      parentId: undefined,
    };

    // If a node was selected, make this new node its child
    let nextEdges = [...edges];
    if (selectedNodeId !== null) {
      newNode.parentId = selectedNodeId;
      newNode.y = (nodes.find((n) => n.id === selectedNodeId)?.y || 0) + 70;
      nextEdges.push({
        id: `${selectedNodeId}-${nextId}`,
        from: selectedNodeId,
        to: nextId,
      });
    }

    onChange([...nodes, newNode], nextEdges);
    if (onSelectNode) {
      onSelectNode(nextId);
    }
  };

  const handleNodeMouseDown = (nodeId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setDraggingNodeId(nodeId);
    if (onSelectNode) {
      onSelectNode(nodeId);
    }
  };

  const handleSvgMouseMove = (e: React.MouseEvent) => {
    if (!draggingNodeId || !onChange) return;
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const nextNodes = nodes.map((node) =>
      node.id === draggingNodeId ? { ...node, x, y } : node
    );
    onChange(nextNodes, edges);
  };

  const handleSvgMouseUp = () => {
    setDraggingNodeId(null);
  };

  const handleAddChild = () => {
    if (selectedNodeId === null || !onChange) return;
    const parentNode = nodes.find((n) => n.id === selectedNodeId);
    if (!parentNode) return;

    const nextId = nodes.length > 0 ? (Math.max(...nodes.map((n) => parseInt(n.id, 10) || 0)) + 1).toString() : "0";
    const newNode: TreeNode = {
      id: nextId,
      label: nextId,
      x: parentNode.x + (Math.random() * 40 - 20),
      y: parentNode.y + 70,
      parentId: selectedNodeId,
    };

    const newEdge: TreeEdge = {
      id: `${selectedNodeId}-${nextId}`,
      from: selectedNodeId,
      to: nextId,
    };

    onChange([...nodes, newNode], [...edges, newEdge]);
  };

  const handleDeleteNode = () => {
    if (selectedNodeId === null || !onChange) return;

    // Filter out node and all its recursive children
    const toDelete = new Set<string>([selectedNodeId]);
    let sizeBefore = 0;
    while (toDelete.size !== sizeBefore) {
      sizeBefore = toDelete.size;
      edges.forEach((e) => {
        if (toDelete.has(e.from)) {
          toDelete.add(e.to);
        }
      });
    }

    const nextNodes = nodes.filter((n) => !toDelete.has(n.id));
    const nextEdges = edges.filter((e) => !toDelete.has(e.from) && !toDelete.has(e.to));

    onChange(nextNodes, nextEdges);
    if (onSelectNode) {
      onSelectNode(null);
    }
  };

  const handleClear = () => {
    if (onChange) {
      onChange([], []);
    }
    if (onSelectNode) {
      onSelectNode(null);
    }
  };

  return (
    <div className="space-y-3 font-sans text-left">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/10 pb-3">
        <span className="text-xs text-muted-foreground">
          Double-click empty canvas to create root, select node to add child or delete.
        </span>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={runAutoLayout} className="cursor-pointer">
            Hierarchical Auto-Layout
          </Button>
          <Button size="sm" variant="outline" onClick={handleAddChild} disabled={selectedNodeId === null} className="cursor-pointer">
            Add Child Node
          </Button>
          <Button size="sm" variant="danger" onClick={handleDeleteNode} disabled={selectedNodeId === null} className="cursor-pointer">
            Delete Subtree
          </Button>
          <Button size="sm" variant="outline" onClick={handleClear} className="cursor-pointer">
            Clear Tree
          </Button>
        </div>
      </div>

      <div className="border border-border/40 rounded-2xl bg-muted/5 relative overflow-hidden h-[340px] select-none">
        <svg
          ref={svgRef}
          className="w-full h-full cursor-crosshair"
          onDoubleClick={handleSvgDoubleClick}
          onMouseMove={handleSvgMouseMove}
          onMouseUp={handleSvgMouseUp}
          onMouseLeave={handleSvgMouseUp}
        >
          {/* Grid background markers */}
          <defs>
            <pattern id="tree-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground/5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tree-grid)" />

          {/* Render paths / edges */}
          {edges.map((edge) => {
            const fromNode = nodes.find((n) => n.id === edge.from);
            const toNode = nodes.find((n) => n.id === edge.to);

            if (!fromNode || !toNode) return null;

            const isHigh = highlightedEdges.includes(edge.id) ||
              highlightedEdges.includes(`${edge.from}-${edge.to}`) ||
              highlightedEdges.includes(`${edge.to}-${edge.from}`);

            return (
              <g key={edge.id}>
                {/* Connect parent and child with a line */}
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={isHigh ? "#f59e0b" : "currentColor"}
                  strokeWidth={isHigh ? 3 : 1.5}
                  className={isHigh ? "" : "text-muted-foreground/35"}
                />
              </g>
            );
          })}

          {/* Render nodes */}
          {nodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            const isHigh = highlightedNodes.includes(node.id);

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
                className="cursor-grab active:cursor-grabbing group"
              >
                <circle
                  r="16"
                  fill={isHigh ? "#f59e0b" : isSelected ? "var(--color-primary)" : "var(--color-background)"}
                  stroke={isSelected || isHigh ? "transparent" : "currentColor"}
                  strokeWidth="1.5"
                  className={isSelected || isHigh ? "" : "text-border/80 group-hover:text-primary transition-colors"}
                />
                <text
                  textAnchor="middle"
                  dy=".3em"
                  fontSize="10"
                  fontWeight="bold"
                  className={isSelected || isHigh ? "fill-primary-foreground font-mono" : "fill-foreground font-mono"}
                >
                  {node.label}
                </text>

                {/* Optional range values label tags below nodes (e.g. for segment tree queries) */}
                {showValues && node.val && (
                  <g transform="translate(0, 26)">
                    <rect
                      x="-25"
                      y="-7"
                      width="50"
                      height="14"
                      rx="4"
                      fill="var(--color-muted)"
                      className="opacity-75 stroke-border/40"
                      strokeWidth="0.5"
                    />
                    <text
                      textAnchor="middle"
                      fontSize="8"
                      className="fill-muted-foreground font-mono font-bold"
                    >
                      {node.val}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
