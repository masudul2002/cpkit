"use client";

import * as React from "react";
import { GyHeader } from "../../shared/gy-header";
import { GyLayout } from "../../shared/gy-layout";
import { GeometryCanvas, Point2D } from "../../shared/geometry-canvas";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ConvexHullTool() {
  const [points, setPoints] = React.useState<Point2D[]>([
    { x: -3, y: -2, label: "P1" },
    { x: 3, y: -3, label: "P2" },
    { x: 1, y: 3, label: "P3" },
    { x: -4, y: 2, label: "P4" },
    { x: 0, y: 0, label: "P5" },
    { x: 2, y: 1, label: "P6" },
  ]);

  const [compared, setCompared] = React.useState(false);
  const [hullIndices, setHullIndices] = React.useState<number[]>([]);
  const [traceLogs, setTraceLogs] = React.useState<string[]>([]);

  const handleEvaluate = () => {
    setCompared(true);
    setTraceLogs([]);
    setHullIndices([]);

    const n = points.length;
    if (n < 3) {
      setTraceLogs(["• At least 3 points are required to compute a convex hull."]);
      return;
    }

    const logs: string[] = [];
    const pts = points.map((p, idx) => ({ ...p, origIdx: idx }));

    // 1. Find P0 (lowest Y, then lowest X)
    let p0Idx = 0;
    for (let i = 1; i < n; i++) {
      if (
        pts[i].y < pts[p0Idx].y ||
        (pts[i].y === pts[p0Idx].y && pts[i].x < pts[p0Idx].x)
      ) {
        p0Idx = i;
      }
    }

    const p0 = pts[p0Idx];
    logs.push(`• Selected P0 as origin: (${p0.x}, ${p0.y})`);

    // Swap P0 to front
    const temp = pts[0];
    pts[0] = pts[p0Idx];
    pts[p0Idx] = temp;

    // 2. Sort remaining by polar angle with P0
    const orientation = (a: Point2D, b: Point2D, c: Point2D) => {
      const val = (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);
      if (val === 0) return 0; // collinear
      return val > 0 ? 1 : 2; // CW or CCW
    };

    const distSq = (a: Point2D, b: Point2D) => {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      return dx * dx + dy * dy;
    };

    const candidates = pts.slice(1);
    candidates.sort((a, b) => {
      const o = orientation(p0, a, b);
      if (o === 0) {
        return distSq(p0, a) < distSq(p0, b) ? -1 : 1;
      }
      return o === 2 ? -1 : 1; // CCW comes first
    });

    logs.push(`• Sorted points by polar angle relative to P0.`);

    // 3. Graham Scan Stack Traversal
    const stack: typeof pts = [pts[0]];
    if (candidates.length > 0) stack.push(candidates[0]);
    if (candidates.length > 1) stack.push(candidates[1]);

    for (let i = 2; i < candidates.length; i++) {
      const curr = candidates[i];
      while (stack.length >= 2) {
        const top = stack[stack.length - 1];
        const nextToTop = stack[stack.length - 2];
        const turn = orientation(nextToTop, top, curr);

        if (turn === 2) {
          // CCW turn, valid boundary
          break;
        } else {
          logs.push(`  → CW/Collinear turn detected at point (${top.x}, ${top.y}). Popping it from hull.`);
          stack.pop();
        }
      }
      stack.push(curr);
      logs.push(`• Pushed point (${curr.x}, ${curr.y}) to hull candidate stack.`);
    }

    const resultIndices = stack.map((p) => p.origIdx);
    setHullIndices(resultIndices);
    setTraceLogs(logs);
  };

  const definition = "Convex Hull is the smallest convex polygon that contains all points of a given dataset, forming a boundary border enclosing the points.";
  const formula = "\\text{Orientation test (CCW): } (y_B - y_A)(x_C - x_B) - (x_B - x_A)(y_C - y_B) < 0";
  const pseudocode = `GrahamScan(points):
  P0 = point with lowest Y coordinate
  sort points by polar angle with P0
  stack = [points[0], points[1], points[2]]
  for i = 3 to N-1:
    while orientation(stack[-2], stack[-1], points[i]) != CCW:
      stack.pop()
    stack.push(points[i])
  return stack`;

  const applications = [
    "Collision detection bounding convex shapes.",
    "Pattern recognition and clustering analysis.",
    "Coordinates triangulation pre-processing."
  ];
  const mistakes = [
    "Not handling duplicate collinear points on the hull edge boundaries (leads to flat faces anomalies).",
    "Selecting origin point P0 incorrectly."
  ];
  const cpTips = [
    "Graham Scan runs in O(N log N) time due to polar angle sorting, while Monotone Chain (Andrew's algorithm) splits points by X/Y coordinates and handles upper/lower hulls, which is often faster and easier to code!"
  ];

  return (
    <GyLayout
      timeComplexity="O(N log N) sorting + O(N) stack sweeps"
      spaceComplexity="O(N) stack storage"
      definition={definition}
      formula={formula}
      pseudocode={pseudocode}
      applications={applications}
      mistakes={mistakes}
      cpTips={cpTips}
      visualizerChild={
        <Card className="border-border/40 bg-card/65 shadow-xs font-sans text-left">
          <CardHeader className="pb-2 border-b border-border/10">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Convex Hull Visual Border (Drag points to check dynamic updates)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <GeometryCanvas
              points={points}
              onPointsChange={(pts) => {
                setPoints(pts);
                setCompared(false);
              }}
              hullIndices={hullIndices}
            />

            <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
              Compute Convex Hull
            </Button>

            {compared && (
              <div className="border-t border-border/5 pt-3 space-y-3 font-mono text-xs text-left">
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Convex Hull Points Count:</span>
                  <span className="font-bold text-emerald-500">{hullIndices.length} points</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Graham Scan Tracing:
                  </span>
                  <div className="p-2.5 bg-muted/20 border border-border/10 rounded-lg max-h-40 overflow-y-auto font-mono text-[11px] leading-relaxed text-foreground/80 space-y-1">
                    {traceLogs.map((log, idx) => (
                      <div key={idx}>{log}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      }
    >
      <GyHeader
        title="Convex Hull Graham Scan"
        description="Compute the minimal enclosing boundary around coordinates points."
        category="Geometry"
        difficulty="Hard"
        shortcut="Alt+Shift+H"
      />
    </GyLayout>
  );
}
