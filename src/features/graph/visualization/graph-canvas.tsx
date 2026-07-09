"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import {
  MousePointer,
  Hand,
  CircleDot,
  GitCommit,
  Trash2,
  Undo2,
  Redo2,
  RefreshCw,
  Search,
  Download,
  Upload,
  Maximize2,
  Layers,
  LayoutGrid,
  Info,
  Play,
  RotateCcw,
  Sparkles,
  Lock,
  Unlock,
  Plus
} from "lucide-react";

export interface NodeItem {
  id: string;
  label: string;
  x: number;
  y: number;
  locked?: boolean;
}

export interface EdgeItem {
  id: string;
  from: string;
  to: string;
  weight: number;
  directed: boolean;
}

interface GraphCanvasProps {
  nodes: NodeItem[];
  edges: EdgeItem[];
  onChange: (nodes: NodeItem[], edges: EdgeItem[]) => void;
  activeNode?: string | null;
  visitedNodes?: string[];
  highlightedEdges?: string[];
  pathNodes?: string[];
}

type ActiveTool = "select" | "hand" | "add-vertex" | "add-edge" | "delete";

export function GraphCanvas({
  nodes,
  edges,
  onChange,
  activeNode,
  visitedNodes = [],
  highlightedEdges = [],
  pathNodes = [],
}: GraphCanvasProps) {
  const { toast } = useToast();
  const svgRef = React.useRef<SVGSVGElement>(null);
  
  // Selection & Modes
  const [activeTool, setActiveTool] = React.useState<ActiveTool>("select");
  const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = React.useState<string | null>(null);
  const [connectingNodeId, setConnectingNodeId] = React.useState<string | null>(null);
  const [draggingNodeId, setDraggingNodeId] = React.useState<string | null>(null);
  
  // Weights / Inline editors
  const [editingNodeId, setEditingNodeId] = React.useState<string | null>(null);
  const [nodeRenameVal, setNodeRenameVal] = React.useState("");
  const [edgeWeightVal, setEdgeWeightVal] = React.useState("1");
  const [isDirected, setIsDirected] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [snapToGrid, setSnapToGrid] = React.useState(true);

  // Canvas Viewport Pan/Zoom
  const [pan, setPan] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [isPanning, setIsPanning] = React.useState(false);
  const [panStart, setPanStart] = React.useState({ x: 0, y: 0 });

  // History Stack (Undo/Redo)
  const [history, setHistory] = React.useState<{ nodes: NodeItem[]; edges: EdgeItem[] }[]>([]);
  const [historyIdx, setHistoryIdx] = React.useState(-1);

  // Push state to history helper
  const pushState = React.useCallback((newNodes: NodeItem[], newEdges: EdgeItem[]) => {
    const nextHist = history.slice(0, historyIdx + 1);
    nextHist.push({ nodes: newNodes, edges: newEdges });
    setHistory(nextHist);
    setHistoryIdx(nextHist.length - 1);
  }, [history, historyIdx]);

  // Deletions
  const handleDeleteNode = React.useCallback((nodeId: string) => {
    const nextNodes = nodes.filter((n) => n.id !== nodeId);
    const nextEdges = edges.filter((e) => e.from !== nodeId && e.to !== nodeId);
    onChange(nextNodes, nextEdges);
    pushState(nextNodes, nextEdges);
    if (selectedNodeId === nodeId) setSelectedNodeId(null);
  }, [nodes, edges, onChange]);

  const handleDeleteEdge = React.useCallback((edgeId: string) => {
    const nextEdges = edges.filter((e) => e.id !== edgeId);
    onChange(nodes, nextEdges);
    pushState(nodes, nextEdges);
    if (selectedEdgeId === edgeId) setSelectedEdgeId(null);
  }, [nodes, edges, onChange]);

  const handleClearGraph = React.useCallback(() => {
    onChange([], []);
    pushState([], []);
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    setConnectingNodeId(null);
  }, [onChange, pushState]);

  // Undo / Redo
  const handleUndo = React.useCallback(() => {
    if (historyIdx > 0) {
      const prevIdx = historyIdx - 1;
      setHistoryIdx(prevIdx);
      onChange(history[prevIdx].nodes, history[prevIdx].edges);
    }
  }, [history, historyIdx, onChange]);

  const handleRedo = React.useCallback(() => {
    if (historyIdx < history.length - 1) {
      const nextIdx = historyIdx + 1;
      setHistoryIdx(nextIdx);
      onChange(history[nextIdx].nodes, history[nextIdx].edges);
    }
  }, [history, historyIdx, onChange]);

  // Keyboard events listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      if (e.key === "v" || e.key === "V") setActiveTool("select");
      else if (e.key === "h" || e.key === "H") setActiveTool("hand");
      else if (e.key === "a" || e.key === "A") setActiveTool("add-vertex");
      else if (e.key === "e" || e.key === "E") setActiveTool("add-edge");
      else if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedNodeId) handleDeleteNode(selectedNodeId);
        else if (selectedEdgeId) handleDeleteEdge(selectedEdgeId);
      } else if (e.key === "Escape") {
        setSelectedNodeId(null);
        setSelectedEdgeId(null);
        setConnectingNodeId(null);
      } else if (e.ctrlKey && (e.key === "z" || e.key === "Z")) {
        e.preventDefault();
        handleUndo();
      } else if (e.ctrlKey && (e.key === "y" || e.key === "Y")) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedNodeId, selectedEdgeId, nodes, edges, history, historyIdx, handleDeleteNode, handleDeleteEdge, handleUndo, handleRedo]);

  // Mouse drag logic
  const handleMouseDownNode = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeTool === "delete") {
      handleDeleteNode(nodeId);
      return;
    }
    if (activeTool === "add-edge") {
      if (!connectingNodeId) {
        setConnectingNodeId(nodeId);
        toast({ title: "Connecting Edge", description: "Click target node to connect." });
      } else {
        createEdgeConnection(connectingNodeId, nodeId);
      }
      return;
    }
    setSelectedNodeId(nodeId);
    setSelectedEdgeId(null);
    const node = nodes.find((n) => n.id === nodeId);
    if (node && !node.locked) {
      setDraggingNodeId(nodeId);
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (activeTool === "hand" || e.button === 1 || e.button === 0) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingNodeId && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      let rawX = (e.clientX - rect.left - pan.x) / zoom;
      let rawY = (e.clientY - rect.top - pan.y) / zoom;

      if (snapToGrid) {
        rawX = Math.round(rawX / 20) * 20;
        rawY = Math.round(rawY / 20) * 20;
      }

      const nextNodes = nodes.map((n) =>
        n.id === draggingNodeId ? { ...n, x: Math.round(rawX), y: Math.round(rawY) } : n
      );
      onChange(nextNodes, edges);
    } else if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    if (draggingNodeId) {
      pushState(nodes, edges);
      setDraggingNodeId(null);
    }
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const nextZoom = e.deltaY < 0 ? zoom + 0.05 : zoom - 0.05;
    setZoom(Math.max(0.4, Math.min(3, nextZoom)));
  };

  // Add Vertex
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!svgRef.current) return;
    if (activeTool !== "add-vertex" && e.detail !== 2) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    let x = (e.clientX - rect.left - pan.x) / zoom;
    let y = (e.clientY - rect.top - pan.y) / zoom;

    if (snapToGrid) {
      x = Math.round(x / 20) * 20;
      y = Math.round(y / 20) * 20;
    }

    const nextId = nodes.length > 0 ? (Math.max(...nodes.map((n) => parseInt(n.id, 10))) + 1).toString() : "0";
    const newNode: NodeItem = {
      id: nextId,
      label: `N${nextId}`,
      x: Math.round(x),
      y: Math.round(y),
    };

    const nextNodes = [...nodes, newNode];
    onChange(nextNodes, edges);
    pushState(nextNodes, edges);
    setSelectedNodeId(nextId);
    
    if (activeTool === "add-vertex") {
      setActiveTool("select");
    }
  };

  // Create Connection
  const createEdgeConnection = (fromId: string, toId: string) => {
    if (fromId === toId) {
      setConnectingNodeId(null);
      return;
    }
    const edgeId = `${fromId}-${toId}`;
    const exists = edges.some((e) => e.id === edgeId || (!isDirected && e.id === `${toId}-${fromId}`));

    if (!exists) {
      const weight = parseInt(edgeWeightVal, 10) || 1;
      const newEdge: EdgeItem = {
        id: edgeId,
        from: fromId,
        to: toId,
        weight,
        directed: isDirected,
      };
      const nextEdges = [...edges, newEdge];
      onChange(nodes, nextEdges);
      pushState(nodes, nextEdges);
      toast({ title: "Edge Connected", description: `Linked ${fromId} ➜ ${toId}.` });
    }
    setConnectingNodeId(null);
  };

  // Deletions / Connections completed

  // Node Renaming
  const handleRenameNodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNodeId || !nodeRenameVal.trim()) return;
    const nextNodes = nodes.map((n) => (n.id === editingNodeId ? { ...n, label: nodeRenameVal } : n));
    onChange(nextNodes, edges);
    pushState(nextNodes, edges);
    setEditingNodeId(null);
  };

  // Layout Algorithms
  const applyLayout = (type: "circular" | "grid" | "tree" | "layered") => {
    if (nodes.length === 0) return;
    const center = { x: 300, y: 200 };
    let nextNodes = [...nodes];

    if (type === "circular") {
      const radius = 120;
      nextNodes = nodes.map((node, i) => {
        const angle = (i * 2 * Math.PI) / nodes.length;
        return {
          ...node,
          x: Math.round(center.x + radius * Math.cos(angle)),
          y: Math.round(center.y + radius * Math.sin(angle)),
        };
      });
    } else if (type === "grid") {
      const cols = Math.ceil(Math.sqrt(nodes.length));
      const spacing = 100;
      nextNodes = nodes.map((node, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        return {
          ...node,
          x: 100 + c * spacing,
          y: 100 + r * spacing,
        };
      });
    } else if (type === "tree") {
      const spacingY = 80;
      nextNodes = nodes.map((node, i) => {
        const level = Math.floor(Math.log2(i + 1));
        const pos = i + 1 - Math.pow(2, level);
        const count = Math.pow(2, level);
        const spacingX = 500 / (count + 1);
        return {
          ...node,
          x: Math.round((pos + 1) * spacingX),
          y: 70 + level * spacingY,
        };
      });
    }

    onChange(nextNodes, edges);
    pushState(nextNodes, edges);
    toast({ title: "Layout Applied", description: `${type} arrangement completed.` });
  };

  // Node Lock/Unlock toggle
  const toggleNodeLock = (nodeId: string) => {
    const nextNodes = nodes.map((n) => (n.id === nodeId ? { ...n, locked: !n.locked } : n));
    onChange(nextNodes, edges);
    pushState(nextNodes, edges);
  };

  // Undo / Redo registers completed

  // Node Coordinates
  const getNodeCoords = (id: string) => {
    const node = nodes.find((n) => n.id === id);
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
  };

  // Selected details
  const selectedNodeDetails = nodes.find((n) => n.id === selectedNodeId);
  const selectedEdgeDetails = edges.find((e) => e.id === selectedEdgeId);

  // Auto layout triggers
  React.useEffect(() => {
    if (history.length === 0 && nodes.length > 0) {
      setHistory([{ nodes, edges }]);
      setHistoryIdx(0);
    }
  }, [nodes, edges]);

  return (
    <div className="flex flex-col gap-4 font-sans text-left pb-16 select-none animate-fade-in">
      
      {/* 1. TOP TOOLBAR PANEL */}
      <div className="flex flex-wrap items-center justify-between gap-4 border border-border/40 bg-card/60 p-3 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search vertex label..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const node = nodes.find((n) => n.label.toLowerCase() === searchQuery.toLowerCase());
                  if (node) {
                    setSelectedNodeId(node.id);
                    setPan({ x: 300 - node.x * zoom, y: 200 - node.y * zoom });
                  }
                }
              }}
              className="pl-9 h-8 text-xs w-48 bg-background/40"
            />
          </div>

          <div className="flex items-center gap-2 border-l border-border/10 pl-3">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleUndo} disabled={historyIdx <= 0}>
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleRedo} disabled={historyIdx >= history.length - 1}>
              <Redo2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Layout algorithms and actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => applyLayout("circular")} className="h-8 text-xs gap-1 cursor-pointer">
            <RefreshCw className="h-3.5 w-3.5" /> Circular
          </Button>
          <Button variant="outline" size="sm" onClick={() => applyLayout("tree")} className="h-8 text-xs gap-1 cursor-pointer">
            <Layers className="h-3.5 w-3.5" /> Tree
          </Button>
          <Button variant="outline" size="sm" onClick={() => applyLayout("grid")} className="h-8 text-xs gap-1 cursor-pointer">
            <LayoutGrid className="h-3.5 w-3.5" /> Grid
          </Button>
          
          <div className="flex items-center gap-1.5 border-l border-border/10 pl-3">
            <label className="text-xs font-semibold text-foreground/80">Directed:</label>
            <input
              type="checkbox"
              checked={isDirected}
              onChange={(e) => {
                const nextVal = e.target.checked;
                setIsDirected(nextVal);
                onChange(nodes, edges.map((edge) => ({ ...edge, directed: nextVal })));
              }}
              className="rounded border-border/40 accent-primary"
            />
          </div>
        </div>
      </div>

      {/* 2. MAIN LAYOUT SHELL (Left toolbox, center canvas, right inspector) */}
      <div className="grid gap-4 md:grid-cols-12">
        
        {/* Left floating toolbox */}
        <div className="md:col-span-1 flex flex-row md:flex-col justify-start items-center gap-2 bg-card/65 border border-border/40 p-2.5 rounded-2xl h-fit">
          <Button
            variant={activeTool === "select" ? "primary" : "outline"}
            size="icon"
            onClick={() => setActiveTool("select")}
            title="Pointer Select (V)"
            className="h-9 w-9 rounded-xl"
          >
            <MousePointer className="h-4.5 w-4.5" />
          </Button>
          <Button
            variant={activeTool === "hand" ? "primary" : "outline"}
            size="icon"
            onClick={() => setActiveTool("hand")}
            title="Hand Pan Canvas (H)"
            className="h-9 w-9 rounded-xl"
          >
            <Hand className="h-4.5 w-4.5" />
          </Button>
          <Button
            variant={activeTool === "add-vertex" ? "primary" : "outline"}
            size="icon"
            onClick={() => setActiveTool("add-vertex")}
            title="Add Vertex Node (A)"
            className="h-9 w-9 rounded-xl"
          >
            <CircleDot className="h-4.5 w-4.5" />
          </Button>
          <Button
            variant={activeTool === "add-edge" ? "primary" : "outline"}
            size="icon"
            onClick={() => setActiveTool("add-edge")}
            title="Link Edge Path (E)"
            className="h-9 w-9 rounded-xl"
          >
            <GitCommit className="h-4.5 w-4.5" />
          </Button>
          <Button
            variant={activeTool === "delete" ? "primary" : "outline"}
            size="icon"
            onClick={() => {
              if (selectedNodeId) handleDeleteNode(selectedNodeId);
              else if (selectedEdgeId) handleDeleteEdge(selectedEdgeId);
              else setActiveTool("delete");
            }}
            title="Delete Selected Element"
            className="h-9 w-9 rounded-xl text-rose-500 hover:text-rose-600"
          >
            <Trash2 className="h-4.5 w-4.5" />
          </Button>
        </div>

        {/* Center Canvas */}
        <div className="md:col-span-8 relative">
          <svg
            ref={svgRef}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            onClick={handleCanvasClick}
            className="w-full h-[420px] border border-border/40 rounded-2xl bg-zinc-950/45 relative shadow-inner overflow-hidden"
          >
            {/* SVG Grid pattern */}
            <defs>
              <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1" fill="rgba(255,255,255,0.06)" />
              </pattern>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="23"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#52525b" />
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

            <rect width="100%" height="100%" fill="url(#gridPattern)" />

            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
              {/* Edges Link paths */}
              {edges.map((edge) => {
                const fromCoords = getNodeCoords(edge.from);
                const toCoords = getNodeCoords(edge.to);
                const isEdgeHighlighted = highlightedEdges.includes(edge.id) || highlightedEdges.includes(`${edge.to}-${edge.from}`);
                const isSelected = selectedEdgeId === edge.id;

                const midX = (fromCoords.x + toCoords.x) / 2;
                const midY = (fromCoords.y + toCoords.y) / 2;

                return (
                  <g key={edge.id} onClick={(e) => { e.stopPropagation(); setSelectedEdgeId(edge.id); setSelectedNodeId(null); }}>
                    <line
                      x1={fromCoords.x}
                      y1={fromCoords.y}
                      x2={toCoords.x}
                      y2={toCoords.y}
                      className={`stroke-2 cursor-pointer transition-all ${
                        isEdgeHighlighted ? "stroke-amber-500 stroke-[3px] animate-pulse" : isSelected ? "stroke-purple-500 stroke-2" : "stroke-zinc-700 hover:stroke-zinc-500"
                      }`}
                      markerEnd={edge.directed ? (isEdgeHighlighted ? "url(#arrow-active)" : "url(#arrow)") : undefined}
                    />
                    <g transform={`translate(${midX}, ${midY})`}>
                      <circle r="9" className="fill-zinc-950/80 stroke-border/20 stroke" />
                      <text
                        className="font-mono text-[9px] font-bold text-center fill-muted-foreground select-none"
                        textAnchor="middle"
                        y="3"
                      >
                        {edge.weight}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Node shapes */}
              {nodes.map((node) => {
                const isSelected = selectedNodeId === node.id;
                const isConnecting = connectingNodeId === node.id;
                const isActive = activeNode === node.id;
                const isVisited = visitedNodes.includes(node.id);
                const isPath = pathNodes.includes(node.id);

                let nodeColorClass = "fill-zinc-900 stroke-zinc-700 text-zinc-300";
                if (isActive) nodeColorClass = "fill-amber-500 stroke-amber-500 text-black";
                else if (isPath) nodeColorClass = "fill-emerald-500 stroke-emerald-500 text-black";
                else if (isVisited) nodeColorClass = "fill-primary/10 stroke-primary/30 text-primary/70";
                else if (isSelected || isConnecting) nodeColorClass = "fill-zinc-800 stroke-purple-500 text-purple-500";

                return (
                  <g
                    key={node.id}
                    onMouseDown={(e) => handleMouseDownNode(node.id, e)}
                    className="cursor-pointer group"
                    onDoubleClick={() => { setEditingNodeId(node.id); setNodeRenameVal(node.label); }}
                  >
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="16"
                      className={`transition-all ${nodeColorClass} stroke-2 group-hover:stroke-primary/50 shadow-lg`}
                    />
                    <text
                      x={node.x}
                      y={node.y + 3.5}
                      className="font-mono text-[9px] text-center font-bold pointer-events-none fill-current"
                      textAnchor="middle"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Node Rename popover */}
          {editingNodeId && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border p-4 rounded-xl shadow-2xl space-y-3 z-50">
              <span className="text-xs font-semibold text-foreground">Rename Node Vertex:</span>
              <form onSubmit={handleRenameNodeSubmit} className="flex gap-2">
                <Input
                  value={nodeRenameVal}
                  onChange={(e) => setNodeRenameVal(e.target.value)}
                  className="h-8 text-xs w-32"
                  autoFocus
                />
                <Button type="submit" size="sm" className="h-8 text-xs">Save</Button>
              </form>
            </div>
          )}

          <div className="absolute bottom-2 left-3 flex gap-4 text-[9px] text-muted-foreground/60 select-none">
            <span>🖱️ Middle-drag to Pan</span>
            <span>🎡 Scroll wheel to Zoom</span>
            <span>⌨️ Shift-drag snap to 20px grid</span>
          </div>
        </div>

        {/* Right Inspector & Stats Column */}
        <div className="md:col-span-3 space-y-4 text-xs">
          
          {/* Element Inspector panel */}
          <div className="border border-border/40 bg-card/65 p-4 rounded-2xl space-y-3">
            <h4 className="font-bold text-foreground flex items-center gap-1.5 pb-2 border-b border-border/10">
              <Info className="h-4 w-4 text-primary" />
              Inspector Panel
            </h4>
            
            {selectedNodeDetails ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Vertex Label:</span>
                  <span className="font-bold text-foreground">{selectedNodeDetails.label}</span>
                </div>
                <div className="flex justify-between items-center border-t border-border/5 pt-2">
                  <span className="text-muted-foreground">Coordinates:</span>
                  <span className="font-mono text-foreground">{selectedNodeDetails.x}, {selectedNodeDetails.y}</span>
                </div>
                <div className="flex justify-between items-center border-t border-border/5 pt-2">
                  <span className="text-muted-foreground">Status:</span>
                  <button
                    onClick={() => toggleNodeLock(selectedNodeDetails.id)}
                    className="flex items-center gap-1 text-primary hover:underline cursor-pointer"
                  >
                    {selectedNodeDetails.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                    <span>{selectedNodeDetails.locked ? "Locked" : "Unlocked"}</span>
                  </button>
                </div>
              </div>
            ) : selectedEdgeDetails ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">From Path:</span>
                  <span className="font-bold text-foreground">{selectedEdgeDetails.from}</span>
                </div>
                <div className="flex justify-between items-center border-t border-border/5 pt-2">
                  <span className="text-muted-foreground">To Path:</span>
                  <span className="font-bold text-foreground">{selectedEdgeDetails.to}</span>
                </div>
                <div className="flex justify-between items-center border-t border-border/5 pt-2">
                  <span className="text-muted-foreground">Weight:</span>
                  <input
                    type="number"
                    value={selectedEdgeDetails.weight}
                    onChange={(e) => {
                      const nextW = parseInt(e.target.value, 10) || 1;
                      onChange(
                        nodes,
                        edges.map((edge) => (edge.id === selectedEdgeId ? { ...edge, weight: nextW } : edge))
                      );
                    }}
                    className="w-12 h-6 text-center border border-border/30 rounded bg-background text-foreground text-[10px]"
                  />
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground/60 italic text-center py-2">Select a vertex or edge to inspect details.</p>
            )}
          </div>

          {/* Quick wizard template inserts */}
          <div className="border border-border/40 bg-card/65 p-4 rounded-2xl space-y-3">
            <h4 className="font-bold text-foreground flex items-center gap-1.5 pb-2 border-b border-border/10">
              <Sparkles className="h-4 w-4 text-primary" />
              Graph Wizard
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs cursor-pointer"
                onClick={() => {
                  const defaultNodes: NodeItem[] = [
                    { id: "0", label: "0", x: 120, y: 150 },
                    { id: "1", label: "1", x: 280, y: 80 },
                    { id: "2", label: "2", x: 150, y: 260 },
                    { id: "3", label: "3", x: 320, y: 240 },
                  ];
                  const defaultEdges: EdgeItem[] = [
                    { id: "0-1", from: "0", to: "1", weight: 4, directed: isDirected },
                    { id: "0-2", from: "0", to: "2", weight: 2, directed: isDirected },
                    { id: "1-3", from: "1", to: "3", weight: 5, directed: isDirected },
                    { id: "2-3", from: "2", to: "3", weight: 8, directed: isDirected },
                  ];
                  onChange(defaultNodes, defaultEdges);
                  pushState(defaultNodes, defaultEdges);
                  toast({ title: "Template Loaded", description: "Default graph template established." });
                }}
              >
                Default Graph
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs cursor-pointer text-rose-500"
                onClick={handleClearGraph}
              >
                Clear Graph
              </Button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
