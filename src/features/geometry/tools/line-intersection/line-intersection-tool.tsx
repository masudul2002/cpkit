"use client";

import * as React from "react";
import { GyHeader } from "../../shared/gy-header";
import { GyLayout } from "../../shared/gy-layout";
import { GeometryCanvas, Point2D } from "../../shared/geometry-canvas";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function LineIntersectionTool() {
  const [points, setPoints] = React.useState<Point2D[]>([
    { x: -4, y: 3, label: "A" },
    { x: 4, y: -1, label: "B" },
    { x: -2, y: -4, label: "C" },
    { x: 2, y: 4, label: "D" },
  ]);

  const pA = points[0];
  const pB = points[1];
  const pC = points[2];
  const pD = points[3];

  // Line 1: A1*x + B1*y = C1
  const a1 = pB.y - pA.y;
  const b1 = pA.x - pB.x;
  const c1 = a1 * pA.x + b1 * pA.y;

  // Line 2: A2*x + B2*y = C2
  const a2 = pD.y - pC.y;
  const b2 = pC.x - pD.x;
  const c2 = a2 * pC.x + b2 * pC.y;

  const det = a1 * b2 - a2 * b1;
  const isParallel = Math.abs(det) < 1e-9;

  let intersectPt: Point2D | null = null;
  let onSegments = false;

  if (!isParallel) {
    const x = (b2 * c1 - b1 * c2) / det;
    const y = (a1 * c2 - a2 * c1) / det;
    intersectPt = { x, y, label: "Intersect" };

    // Check if on segment AB
    const onAB =
      x >= Math.min(pA.x, pB.x) - 1e-9 &&
      x <= Math.max(pA.x, pB.x) + 1e-9 &&
      y >= Math.min(pA.y, pB.y) - 1e-9 &&
      y <= Math.max(pA.y, pB.y) + 1e-9;

    // Check if on segment CD
    const onCD =
      x >= Math.min(pC.x, pD.x) - 1e-9 &&
      x <= Math.max(pC.x, pD.x) + 1e-9 &&
      y >= Math.min(pC.y, pD.y) - 1e-9 &&
      y <= Math.max(pC.y, pD.y) + 1e-9;

    onSegments = onAB && onCD;
  }

  const definition = "Line Intersection determines if two lines (infinite or finite segments) meet at a common coordinate, detecting parallel/coincident states.";
  const formula = "a_1 x + b_1 y = c_1 \\\\ a_2 x + b_2 y = c_2 \\\\ x = \\frac{b_2 c_1 - b_1 c_2}{a_1 b_2 - a_2 b_1}, \\ y = \\frac{a_1 c_2 - a_2 c_1}{a_1 b_2 - a_2 b_1}";
  const pseudocode = `LineIntersection(A, B, C, D):
  a1 = B.y - A.y, b1 = A.x - B.x, c1 = a1*A.x + b1*A.y
  a2 = D.y - C.y, b2 = C.x - D.x, c2 = a2*C.x + b2*C.y
  det = a1*b2 - a2*b1
  if det == 0: return "Parallel"
  x = (b2*c1 - b1*c2) / det
  y = (a1*c2 - a2*c1) / det
  return Point(x, y)`;

  const applications = [
    "Geometric sweeps for line segment intersection.",
    "Ray-casting polygon intersections.",
    "Billiards bounce path planning."
  ];
  const mistakes = [
    "Not checking for parallel slope cases (leads to division-by-zero errors).",
    "Assuming infinite line intersection point lies on finite segment boundaries."
  ];
  const cpTips = [
    "To test segment intersection without finding coordinates, use orientation tests: Segments intersect if (A,B,C) and (A,B,D) have opposite orientations, AND (C,D,A) and (C,D,B) have opposite orientations!"
  ];

  // Draw intersection point if it exists
  const overlayPoints = [...points];
  if (intersectPt) {
    overlayPoints.push(intersectPt);
  }

  return (
    <GyLayout
      timeComplexity="O(1) direct equation"
      spaceComplexity="O(1) auxiliary"
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
              Segment Intersection Grid (Drag A, B, C, or D)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <GeometryCanvas
              points={overlayPoints}
              onPointsChange={(pts) => setPoints(pts.slice(0, 4))}
              lines={[
                { fromIdx: 0, toIdx: 1, color: "#3b82f6" }, // Segment 1 (A-B)
                { fromIdx: 2, toIdx: 3, color: "#10b981" }, // Segment 2 (C-D)
              ]}
            />

            <div className="border-t border-border/5 pt-3 space-y-2 font-mono text-xs text-left">
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span>Determinant slope check:</span>
                <span className="font-semibold">{det}</span>
              </div>
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span>Lines Status:</span>
                <span className={`font-bold ${isParallel ? "text-rose-500" : "text-emerald-500"}`}>
                  {isParallel ? "Parallel / Coincident" : "Intersecting"}
                </span>
              </div>
              {intersectPt && (
                <>
                  <div className="flex justify-between border-b border-border/5 pb-1">
                    <span>Intersection Point:</span>
                    <span className="font-extrabold text-primary">
                      ({intersectPt.x.toFixed(2)}, {intersectPt.y.toFixed(2)})
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border/5 pb-1">
                    <span>Lies Within Finite Segments:</span>
                    <span className={`font-bold ${onSegments ? "text-emerald-500" : "text-amber-500"}`}>
                      {onSegments ? "Yes (Segments intersect)" : "No (Lines intersect outside segments)"}
                    </span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      }
    >
      <GyHeader
        title="Line Intersection"
        description="Verify slope intersections of segments and infinite lines."
        category="Geometry"
        difficulty="Medium"
        shortcut="Alt+Shift+I"
      />
    </GyLayout>
  );
}
