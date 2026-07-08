"use client";

import * as React from "react";

export interface Point2D {
  x: number;
  y: number;
  label?: string;
}

interface GeometryCanvasProps {
  points: Point2D[];
  onPointsChange?: (points: Point2D[]) => void;
  // Overlays
  lines?: { fromIdx: number; toIdx: number; color?: string; dashed?: boolean }[];
  polygonIndices?: number[]; // indices of points forming a polygon
  circleOverlay?: { centerIdx: number; radius: number; color?: string }; // radius in grid units
  hullIndices?: number[];
  showGrid?: boolean;
}

export function GeometryCanvas({
  points,
  onPointsChange,
  lines = [],
  polygonIndices = [],
  circleOverlay,
  hullIndices = [],
  showGrid = true,
}: GeometryCanvasProps) {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const [activeDragIdx, setActiveDragIdx] = React.useState<number | null>(null);

  // Constants
  const width = 400;
  const height = 400;
  const scale = 20; // 1 unit = 20 pixels
  const originX = width / 2;
  const originY = height / 2;

  // Convert grid coordinates to SVG canvas coordinates
  const toSvgCoords = (pt: Point2D) => {
    return {
      x: originX + pt.x * scale,
      y: originY - pt.y * scale, // invert Y axis for standard math quadrant orientation
    };
  };

  // Convert SVG coordinates to grid coordinates (with grid snapping)
  const toGridCoords = (svgX: number, svgY: number) => {
    const rawX = (svgX - originX) / scale;
    const rawY = (originY - svgY) / scale;
    return {
      x: Math.round(rawX),
      y: Math.round(rawY),
    };
  };

  const handlePointerDown = (idx: number, e: React.PointerEvent) => {
    e.preventDefault();
    setActiveDragIdx(idx);
    if (svgRef.current) {
      svgRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (activeDragIdx === null || !onPointsChange || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    // Constrain inside SVG bounds
    const svgX = Math.max(0, Math.min(clientX, width));
    const svgY = Math.max(0, Math.min(clientY, height));

    const grid = toGridCoords(svgX, svgY);

    const updated = [...points];
    updated[activeDragIdx] = {
      ...updated[activeDragIdx],
      x: grid.x,
      y: grid.y,
    };

    onPointsChange(updated);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (activeDragIdx !== null && svgRef.current) {
      svgRef.current.releasePointerCapture(e.pointerId);
    }
    setActiveDragIdx(null);
  };

  // Draw grid lines
  const gridLines: React.ReactNode[] = [];
  if (showGrid) {
    // Vertical grid lines
    for (let x = -10; x <= 10; x++) {
      const pos = originX + x * scale;
      const isOrigin = x === 0;
      gridLines.push(
        <line
          key={`v-${x}`}
          x1={pos}
          y1={0}
          x2={pos}
          y2={height}
          stroke="currentColor"
          strokeWidth={isOrigin ? 1.5 : 0.5}
          className={isOrigin ? "text-muted-foreground/60" : "text-muted-foreground/15"}
        />
      );
    }
    // Horizontal grid lines
    for (let y = -10; y <= 10; y++) {
      const pos = originY - y * scale;
      const isOrigin = y === 0;
      gridLines.push(
        <line
          key={`h-${y}`}
          x1={0}
          y1={pos}
          x2={width}
          y2={pos}
          stroke="currentColor"
          strokeWidth={isOrigin ? 1.5 : 0.5}
          className={isOrigin ? "text-muted-foreground/60" : "text-muted-foreground/15"}
        />
      );
    }
  }

  // Draw polygon overlays
  let polygonD = "";
  if (polygonIndices.length > 0) {
    const pathPoints = polygonIndices
      .map((idx) => points[idx])
      .filter(Boolean)
      .map(toSvgCoords);
    if (pathPoints.length > 0) {
      polygonD = `M ${pathPoints.map((p) => `${p.x} ${p.y}`).join(" L ")} Z`;
    }
  }

  // Draw convex hull overlay
  let hullD = "";
  if (hullIndices.length > 0) {
    const pathPoints = hullIndices
      .map((idx) => points[idx])
      .filter(Boolean)
      .map(toSvgCoords);
    if (pathPoints.length > 0) {
      hullD = `M ${pathPoints.map((p) => `${p.x} ${p.y}`).join(" L ")} Z`;
    }
  }

  // Draw circle overlay
  let circleCenter = { x: 0, y: 0 };
  let circleRadiusPx = 0;
  if (circleOverlay && points[circleOverlay.centerIdx]) {
    circleCenter = toSvgCoords(points[circleOverlay.centerIdx]);
    circleRadiusPx = circleOverlay.radius * scale;
  }

  return (
    <div className="relative border border-border/40 rounded-2xl bg-muted/5 p-4 flex justify-center overflow-hidden select-none touch-none">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        className="w-full max-w-[360px] aspect-square rounded-xl bg-background/25 overflow-visible"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Draw Grid */}
        {gridLines}

        {/* Draw Polygon fill */}
        {polygonD && (
          <path d={polygonD} className="fill-primary/10 stroke-primary/30" strokeWidth={1} />
        )}

        {/* Draw Convex Hull overlay */}
        {hullD && (
          <path d={hullD} className="fill-emerald-500/10 stroke-emerald-500" strokeWidth={2} />
        )}

        {/* Draw Circle overlay */}
        {circleOverlay && circleRadiusPx > 0 && (
          <circle
            cx={circleCenter.x}
            cy={circleCenter.y}
            r={circleRadiusPx}
            className="fill-sky-500/10 stroke-sky-500"
            strokeWidth={1.5}
            strokeDasharray="4,4"
          />
        )}

        {/* Draw line segments overlays */}
        {lines.map((line, idx) => {
          const from = points[line.fromIdx];
          const to = points[line.toIdx];
          if (!from || !to) return null;
          const fromSvg = toSvgCoords(from);
          const toSvg = toSvgCoords(to);
          return (
            <line
              key={idx}
              x1={fromSvg.x}
              y1={fromSvg.y}
              x2={toSvg.x}
              y2={toSvg.y}
              stroke={line.color || "var(--color-primary)"}
              strokeWidth={1.5}
              strokeDasharray={line.dashed ? "4,4" : undefined}
            />
          );
        })}

        {/* Draw point labels and circles */}
        {points.map((pt, idx) => {
          const svgCoords = toSvgCoords(pt);
          const isDragging = activeDragIdx === idx;

          return (
            <g key={idx}>
              {/* Drag zone circle */}
              <circle
                cx={svgCoords.x}
                cy={svgCoords.y}
                r={12}
                className="fill-transparent hover:fill-primary/10 cursor-move"
                onPointerDown={(e) => handlePointerDown(idx, e)}
              />
              {/* Visible center circle */}
              <circle
                cx={svgCoords.x}
                cy={svgCoords.y}
                r={5.5}
                className={`${
                  isDragging
                    ? "fill-amber-500 stroke-amber-300 ring-4"
                    : "fill-primary stroke-background"
                } transition-colors`}
                strokeWidth={1.5}
              />
              {/* Point coordinate / label text */}
              <text
                x={svgCoords.x + 8}
                y={svgCoords.y - 8}
                className="font-mono text-[9px] fill-muted-foreground/80 pointer-events-none"
              >
                {pt.label || `P${idx + 1}`} ({pt.x}, {pt.y})
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
