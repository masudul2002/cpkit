"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import {
  Trash2,
  Plus,
  Shuffle,
  RefreshCw,
  Search,
  Download,
  LayoutGrid,
  Maximize2,
  Layers,
  Sparkles,
  Settings,
  HelpCircle
} from "lucide-react";

export interface NodeItem {
  id: string;
  label: string;
  x: number;
  y: number;
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
  
  // States
  const [selectedNode, setSelectedNode] = React.useState<string | null>(null);
  const [connectingNode, setConnectingNode] = React.useState<string | null>(null);
  const [draggingNode, setDraggingNode] = React.useState<string | null>(null);
  const [edgeWeightVal, setEdgeWeightVal] = React.useState("1");
  const [isDirected, setIsDirected] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Canvas Pan & Zoom
  const [pan, setPan] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [isPanning, setIsPanning] = React.useState(false);
  const [panStart, setPanStart] = React.useState({ x: 0, y: 0 });

  // Deletions
  const handleDeleteNode = React.useCallback(() => {
    if (!selectedNode) return;
    const nextNodes = nodes.filter((n) => n.id !== selectedNode);
    const nextEdges = edges.filter((edge) => edge.from !== selectedNode && edge.to !== selectedNode);
    onChange(nextNodes, nextEdges);
    setSelectedNode(null);
    setConnectingNode(null);
  }, [selectedNode, nodes, edges, onChange]);

  // Keyboard Shortcuts listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedNode) {
          handleDeleteNode();
        }
      } else if (e.key === "Escape") {
        setConnectingNode(null);
        setSelectedNode(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedNode, handleDeleteNode]);

  // Mouse Drag / Panning logic
  const handleMouseDown = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDraggingNode(nodeId);
    setSelectedNode(nodeId);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      // Left click on empty space starts panning
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingNode && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const rawX = (e.clientX - rect.left - pan.x) / zoom;
      const rawY = (e.clientY - rect.top - pan.y) / zoom;
      
      const nextNodes = nodes.map((n) =>
        n.id === draggingNode ? { ...n, x: Math.round(rawX), y: Math.round(rawY) } : n
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
    setDraggingNode(null);
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomIntensity = 0.05;
    const nextZoom = e.deltaY < 0 ? zoom + zoomIntensity : zoom - zoomIntensity;
    setZoom(Math.max(0.5, Math.min(2.5, nextZoom)));
  };

  // Add node
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.detail !== 2 || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.round((e.clientX - rect.left - pan.x) / zoom);
    const y = Math.round((e.clientY - rect.top - pan.y) / zoom);

    const nextId = nodes.length > 0 ? (Math.max(...nodes.map((n) => parseInt(n.id, 10))) + 1).toString() : "0";
    const newNode: NodeItem = {
      id: nextId,
      label: `N${nextId}`,
      x,
      y,
    };
    onChange([...nodes, newNode], edges);
    setSelectedNode(nextId);
  };

  // Connect Nodes
  const handleNodeClick = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (connectingNode) {
      if (connectingNode === nodeId) {
        setConnectingNode(null);
        return;
      }
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
        toast({ title: "Connected", description: "New edge path established." });
      }
      setConnectingNode(null);
    } else {
      setSelectedNode(nodeId);
    }
  };

  // Deletions & Layouts

  const handleClearGraph = () => {
    onChange([], []);
    setSelectedNode(null);
    setConnectingNode(null);
  };

  // Pre-configured arrangements layout
  const applyLayout = (type: "circular" | "grid" | "tree") => {
    if (nodes.length === 0) return;
    const center = { x: 250, y: 180 };
    let nextNodes = [...nodes];

    if (type === "circular") {
      const radius = 100;
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
      const spacing = 80;
      nextNodes = nodes.map((node, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        return {
          ...node,
          x: 100 + c * spacing,
          y: 80 + r * spacing,
        };
      });
    } else if (type === "tree") {
      const spacingY = 70;
      nextNodes = nodes.map((node, i) => {
        const level = Math.floor(Math.log2(i + 1));
        const pos = i + 1 - Math.pow(2, level);
        const count = Math.pow(2, level);
        const width = 400;
        const spacingX = width / (count + 1);
        return {
          ...node,
          x: Math.round((pos + 1) * spacingX),
          y: 60 + level * spacingY,
        };
      });
    }

    onChange(nextNodes, edges);
    toast({ title: "Layout Applied", description: `Graph arranged in ${type} layout.` });
  };

  // Node search highlight
  const handleSearch = () => {
    const found = nodes.find((n) => n.label.toLowerCase() === searchQuery.toLowerCase() || n.id === searchQuery);
    if (found) {
      setSelectedNode(found.id);
      setPan({ x: 250 - found.x * zoom, y: 180 - found.y * zoom });
      toast({ title: "Found Node", description: `Centered view on ${found.label}.` });
    } else {
      toast({ title: "Not Found", description: "No node matches label search query.", variant: "warning" });
    }
  };

  // Graph Properties & Statistics
  const connectedComponents = React.useMemo(() => {
    const visited = new Set<string>();
    let count = 0;
    const adj = new Map<string, string[]>();
    nodes.forEach((n) => adj.set(n.id, []));
    edges.forEach((e) => {
      adj.get(e.from)?.push(e.to);
      if (!e.directed) adj.get(e.to)?.push(e.from);
    });

    const dfs = (u: string) => {
      visited.add(u);
      adj.get(u)?.forEach((v) => {
        if (!visited.has(v)) dfs(v);
      });
    };

    nodes.forEach((n) => {
      if (!visited.has(n.id)) {
        count++;
        dfs(n.id);
      }
    });
    return count;
  }, [nodes, edges]);

  // Export options
  const exportJSON = () => {
    const data = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cpkit_graph_export.json";
    a.click();
  };

  const getNodeCoords = (id: string) => {
    const node = nodes.find((n) => n.id === id);
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
  };

  return (
    <div className="space-y-4 font-sans select-none text-left pb-16">
      {/* Editor Controls Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-card/65 border border-border/40 p-4 rounded-2xl justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-44">
            <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search node label..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-8 text-xs h-8 bg-background/50"
            />
          </div>

          <div className="flex items-center gap-1.5 border-r border-border/10 pr-3">
            <label className="text-xs font-semibold text-foreground/80">Weight:</label>
            <input
              type="number"
              value={edgeWeightVal}
              onChange={(e) => setEdgeWeightVal(e.target.value)}
              className="w-12 h-8 text-xs border border-border/20 rounded-lg text-center bg-background text-foreground"
            />
          </div>

          <div className="flex items-center gap-1.5 pr-3">
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

        {/* Layout arrange buttons */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => applyLayout("circular")} className="gap-1 cursor-pointer">
            <RefreshCw className="h-3.5 w-3.5" />
            Circular
          </Button>
          <Button variant="outline" size="sm" onClick={() => applyLayout("tree")} className="gap-1 cursor-pointer">
            <Layers className="h-3.5 w-3.5" />
            Tree Layout
          </Button>
          <Button variant="outline" size="sm" onClick={() => applyLayout("grid")} className="gap-1 cursor-pointer">
            <LayoutGrid className="h-3.5 w-3.5" />
            Grid
          </Button>
          <Button variant="outline" size="sm" onClick={exportJSON} className="gap-1 cursor-pointer text-xs">
            <Download className="h-3.5 w-3.5" />
            JSON
          </Button>
        </div>
      </div>

      {/* Main Canvas & Statistics side */}
      <div className="grid gap-4 md:grid-cols-12">
        {/* Left: Interactive Canvas */}
        <div className="md:col-span-8 relative">
          <svg
            ref={svgRef}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            onClick={handleCanvasClick}
            className="w-full h-[400px] border border-border/40 rounded-2xl bg-zinc-950/45 cursor-grab active:cursor-grabbing relative shadow-inner overflow-hidden"
          >
            {/* Grid Pattern Background */}
            <defs>
              <pattern id="gridPattern" width="30" height="30" patternUnits="userSpaceOnUse">
                <circle cx="15" cy="15" r="1" fill="rgba(255,255,255,0.07)" />
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

            {/* Grid fills */}
            <rect width="100%" height="100%" fill="url(#gridPattern)" />

            {/* Transformed groups containing nodes/edges */}
            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
              {/* Edges */}
              {edges.map((edge) => {
                const fromCoords = getNodeCoords(edge.from);
                const toCoords = getNodeCoords(edge.to);
                const isEdgeHighlighted = highlightedEdges.includes(edge.id) || highlightedEdges.includes(`${edge.to}-${edge.from}`);

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

              {/* Nodes */}
              {nodes.map((node) => {
                const isSelected = selectedNode === node.id;
                const isConnecting = connectingNode === node.id;
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
                    onMouseDown={(e) => handleMouseDown(node.id, e)}
                    onClick={(e) => handleNodeClick(node.id, e)}
                    className="cursor-grab active:cursor-grabbing group"
                  >
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="16"
                      className={`transition-all ${nodeColorClass} stroke-2 group-hover:stroke-primary/50`}
                    />
                    <text
                      x={node.x}
                      y={node.y + 4}
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
          <span className="absolute bottom-2 left-3 text-[9px] text-muted-foreground/60 select-none">
            💡 Scroll wheel to zoom. Double-click empty canvas to add nodes. Drag canvas to pan.
          </span>
        </div>

        {/* Right: Stats & Properties panels */}
        <div className="md:col-span-4 space-y-4 text-xs">
          <div className="border border-border/40 bg-card/65 p-4 rounded-2xl space-y-3">
            <h4 className="font-bold text-foreground flex items-center gap-1.5 pb-2 border-b border-border/10">
              <Sparkles className="h-4 w-4 text-primary" />
              Graph Statistics
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vertices Count:</span>
                <span className="font-bold text-foreground">{nodes.length}</span>
              </div>
              <div className="flex justify-between border-t border-border/5 pt-2">
                <span className="text-muted-foreground">Edges Count:</span>
                <span className="font-bold text-foreground">{edges.length}</span>
              </div>
              <div className="flex justify-between border-t border-border/5 pt-2">
                <span className="text-muted-foreground">Connected Components:</span>
                <span className="font-bold text-foreground">{connectedComponents}</span>
              </div>
            </div>
          </div>

          <div className="border border-border/40 bg-card/65 p-4 rounded-2xl space-y-3">
            <h4 className="font-bold text-foreground flex items-center gap-1.5 pb-2 border-b border-border/10">
              <Settings className="h-4 w-4 text-primary" />
              Quick Actions
            </h4>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setConnectingNode(selectedNode)} disabled={!selectedNode} className="w-full cursor-pointer">
                Add Edge path
              </Button>
              <Button variant="outline" size="sm" onClick={handleDeleteNode} disabled={!selectedNode} className="w-full cursor-pointer text-rose-500">
                Remove Node
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={handleClearGraph} className="w-full cursor-pointer">
              Clear All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
