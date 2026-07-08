"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Shuffle, RefreshCw } from "lucide-react";

export interface NodeItem {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface EdgeItem {
  id: string; // usually "from-to"
  from: string;
  to: string;
  weight: number;
  directed: boolean;
}

interface GraphCanvasProps {
  nodes: NodeItem[];
  edges: EdgeItem[];
  onChange: (nodes: NodeItem[], edges: EdgeItem[]) => void;

  // Highlights for algorithm execution animations
  activeNode?: string | null;
  visitedNodes?: string[];
  highlightedEdges?: string[]; // IDs of highlighted edges
  pathNodes?: string[];
}

export function GraphCanvas({
  nodes,
  edges,
  onChange,
  activeNode,
  visitedNodes = [],
  highlightedEdges = [],
  pathNodes = [],
}: GraphCanvasProps) {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = React.useState<string | null>(null);
  const [connectingNode, setConnectingNode] = React.useState<string | null>(null);
  const [draggingNode, setDraggingNode] = React.useState<string | null>(null);
  const [edgeWeightVal, setEdgeWeightVal] = React.useState("1");
  const [isDirected, setIsDirected] = React.useState(false);

  // Dragging support
  const handleMouseDown = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDraggingNode(nodeId);
    setSelectedNode(nodeId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingNode || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.max(20, Math.min(rect.width - 20, e.clientX - rect.left));
    const y = Math.max(20, Math.min(rect.height - 20, e.clientY - rect.top));

    const nextNodes = nodes.map((n) => (n.id === draggingNode ? { ...n, x, y } : n));
    onChange(nextNodes, edges);
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
  };

  // Add a new node on canvas click / double click
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.detail !== 2 || !svgRef.current) {
      // Must be a double-click to add node
      return;
    }
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const nextId = nodes.length > 0 ? (Math.max(...nodes.map((n) => parseInt(n.id, 10))) + 1).toString() : "0";
    const newNode: NodeItem = {
      id: nextId,
      label: nextId,
      x,
      y,
    };

    onChange([...nodes, newNode], edges);
    setSelectedNode(nextId);
  };

  // Connect or Select Nodes
  const handleNodeClick = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (connectingNode) {
      if (connectingNode === nodeId) {
        setConnectingNode(null);
        return;
      }
      // Add edge between connectingNode and nodeId
      const edgeId = `${connectingNode}-${nodeId}`;
      const exists = edges.some((edge) => edge.id === edgeId || edge.id === `${nodeId}-${connectingNode}`);

      if (!exists) {
        const w = parseInt(edgeWeightVal, 10) || 1;
        const newEdge: EdgeItem = {
          id: edgeId,
          from: connectingNode,
          to: nodeId,
          weight: w,
          directed: isDirected,
        };
        onChange(nodes, [...edges, newEdge]);
      }
      setConnectingNode(null);
    } else {
      setSelectedNode(nodeId);
    }
  };

  const startConnecting = () => {
    if (selectedNode) {
      setConnectingNode(selectedNode);
    }
  };

  // Deletions
  const handleDeleteNode = () => {
    if (!selectedNode) return;
    const nextNodes = nodes.filter((n) => n.id !== selectedNode);
    const nextEdges = edges.filter((edge) => edge.from !== selectedNode && edge.to !== selectedNode);
    onChange(nextNodes, nextEdges);
    setSelectedNode(null);
    setConnectingNode(null);
  };

  const handleClearGraph = () => {
    onChange([], []);
    setSelectedNode(null);
    setConnectingNode(null);
  };

  const handleRandomGraph = () => {
    const defaultNodes: NodeItem[] = [
      { id: "0", label: "0", x: 100, y: 100 },
      { id: "1", label: "1", x: 280, y: 80 },
      { id: "2", label: "2", x: 120, y: 260 },
      { id: "3", label: "3", x: 300, y: 240 },
      { id: "4", label: "4", x: 200, y: 170 },
    ];
    const defaultEdges: EdgeItem[] = [
      { id: "0-1", from: "0", to: "1", weight: 4, directed: isDirected },
      { id: "0-2", from: "0", to: "2", weight: 2, directed: isDirected },
      { id: "1-3", from: "1", to: "3", weight: 5, directed: isDirected },
      { id: "2-3", from: "2", to: "3", weight: 8, directed: isDirected },
      { id: "2-4", from: "2", to: "4", weight: 3, directed: isDirected },
      { id: "4-3", from: "4", to: "3", weight: 1, directed: isDirected },
    ];
    onChange(defaultNodes, defaultEdges);
    setSelectedNode(null);
    setConnectingNode(null);
  };

  // Find node coordinates helper
  const getNodeCoords = (id: string) => {
    const node = nodes.find((n) => n.id === id);
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
  };

  return (
    <div className="space-y-4 font-sans select-none text-left">
      {/* Editor Controls Bar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-border/10 pb-3">
        <Button variant="outline" size="sm" onClick={handleRandomizeWeights} className="gap-1 cursor-pointer">
          <Shuffle className="h-3.5 w-3.5" />
          Random Weights
        </Button>

        <div className="flex items-center gap-1.5">
          <label className="text-xs font-semibold text-foreground/80">Edge Weight:</label>
          <input
            type="number"
            value={edgeWeightVal}
            onChange={(e) => setEdgeWeightVal(e.target.value)}
            className="w-12 h-7 text-xs border border-border/40 rounded-lg text-center bg-card text-foreground"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <label className="text-xs font-semibold text-foreground/80">Directed:</label>
          <input
            type="checkbox"
            checked={isDirected}
            onChange={(e) => {
              const nextVal = e.target.checked;
              setIsDirected(nextVal);
              const nextEdges = edges.map((edge) => ({ ...edge, directed: nextVal }));
              onChange(nodes, nextEdges);
            }}
            className="rounded border-border/40 accent-primary"
          />
        </div>

        <div className="flex gap-2 ml-auto">
          <Button variant="outline" size="sm" onClick={startConnecting} disabled={!selectedNode} className="cursor-pointer gap-1">
            <Plus className="h-3.5 w-3.5" />
            Add Edge
          </Button>
          <Button variant="outline" size="sm" onClick={handleDeleteNode} disabled={!selectedNode} className="cursor-pointer text-rose-500 hover:text-rose-600 gap-1">
            <Trash2 className="h-3.5 w-3.5" />
            Delete Node
          </Button>
          <Button variant="outline" size="sm" onClick={handleClearGraph} className="cursor-pointer gap-1">
            <RefreshCw className="h-3.5 w-3.5" />
            Reset Canvas
          </Button>
          <Button variant="primary" size="sm" onClick={handleRandomGraph} className="cursor-pointer">
            Default Graph
          </Button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative">
        <svg
          ref={svgRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleCanvasClick}
          className="w-full h-[360px] border border-border/40 rounded-2xl bg-zinc-950/45 cursor-crosshair relative shadow-inner"
        >
          {/* Arrowhead markers defs for directed graphs */}
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="23"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#71717a" />
            </marker>
            <marker
              id="arrow-active"
              viewBox="0 0 10 10"
              refX="23"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
            </marker>
          </defs>

          {/* 1. Render Edges (Lines) */}
          {edges.map((edge) => {
            const fromCoords = getNodeCoords(edge.from);
            const toCoords = getNodeCoords(edge.to);
            const isEdgeHighlighted = highlightedEdges.includes(edge.id) || highlightedEdges.includes(`${edge.to}-${edge.from}`);

            // Calculate midpoint for weight label text positioning
            const midX = (fromCoords.x + toCoords.x) / 2;
            const midY = (fromCoords.y + toCoords.y) / 2;

            return (
              <g key={edge.id}>
                <line
                  x1={fromCoords.x}
                  y1={fromCoords.y}
                  x2={toCoords.x}
                  y2={toCoords.y}
                  className={`stroke-2 transition-all ${
                    isEdgeHighlighted ? "stroke-amber-500 stroke-[3px]" : "stroke-zinc-700"
                  }`}
                  markerEnd={edge.directed ? (isEdgeHighlighted ? "url(#arrow-active)" : "url(#arrow)") : undefined}
                />
                {/* Weight Label background block */}
                <circle cx={midX} cy={midY - 1} r="9" className="fill-zinc-950/80 stroke-border/10" />
                <text
                  x={midX}
                  y={midY + 2}
                  className="font-mono text-[9px] font-bold text-center fill-muted-foreground select-none"
                  textAnchor="middle"
                >
                  {edge.weight}
                </text>
              </g>
            );
          })}

          {/* 2. Render Nodes (Circles) */}
          {nodes.map((node) => {
            const isSelected = selectedNode === node.id;
            const isConnecting = connectingNode === node.id;
            const isActive = activeNode === node.id;
            const isVisited = visitedNodes.includes(node.id);
            const isPath = pathNodes.includes(node.id);

            let nodeFill = "fill-zinc-900 stroke-zinc-700 text-zinc-300";
            if (isActive) nodeFill = "fill-primary stroke-primary text-primary-foreground font-extrabold";
            else if (isPath) nodeFill = "fill-amber-500/25 stroke-amber-500 text-amber-400 font-extrabold";
            else if (isVisited) nodeFill = "fill-primary/10 stroke-primary/30 text-primary/70";
            else if (isSelected || isConnecting) nodeFill = "fill-zinc-800 stroke-amber-500 border-amber-500 text-amber-500 font-bold";

            return (
              <g
                key={node.id}
                onMouseDown={(e) => handleMouseDown(node.id, e)}
                onClick={(e) => handleNodeClick(node.id, e)}
                className="cursor-grab active:cursor-grabbing group"
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="15"
                  className={`transition-all ${nodeFill} stroke-2 group-hover:stroke-primary/50`}
                />
                <text
                  x={node.x}
                  y={node.y + 4}
                  className={`font-mono text-[10px] text-center font-bold pointer-events-none fill-current`}
                  textAnchor="middle"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
        <span className="absolute bottom-2 left-3 text-[10px] text-muted-foreground/60 select-none">
          💡 Double click on empty space to spawn nodes. Click a node, click "Add Edge", then click another node to connect.
        </span>
      </div>
    </div>
  );

  function handleRandomizeWeights() {
    const nextEdges = edges.map((e) => ({
      ...e,
      weight: Math.floor(Math.random() * 9) + 1,
    }));
    onChange(nodes, nextEdges);
  }
}
