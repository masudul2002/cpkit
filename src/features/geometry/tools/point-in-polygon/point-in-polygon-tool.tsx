"use client";

import * as React from "react";
import { GyHeader } from "../../shared/gy-header";
import { GyLayout } from "../../shared/gy-layout";
import { GeometryCanvas, Point2D } from "../../shared/geometry-canvas";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function PointInPolygonTool() {
  const [points, setPoints] = React.useState<Point2D[]>([
    { x: -3, y: 3, label: "A" },
    { x: 3, y: 2, label: "B" },
    { x: 2, y: -2, label: "C" },
    { x: -2, y: -3, label: "D" },
    { x: 0, y: 0, label: "Test Point (P)" },
  ]);

  const p = points[4];
  const poly = points.slice(0, 4);
  const n = poly.length;

  // Ray casting check: project horizontal ray to the right (y = p.y, x >= p.x)
  let inside = false;
  const intersectLogs: string[] = [];

  for (let i = 0; i < n; i++) {
    const p1 = poly[i];
    const p2 = poly[(i + 1) % n];

    // Check if ray crosses edge
    const intersect =
      p1.y > p.y !== p2.y > p.y &&
      p.x < ((p2.x - p1.x) * (p.y - p1.y)) / (p2.y - p1.y) + p1.x;

    if (intersect) {
      inside = !inside;
      intersectLogs.push(`• Ray crossed edge between ${p1.label} and ${p2.label}. Status toggled: ${inside ? "INSIDE" : "OUTSIDE"}`);
    }
  }

  const definition = "Point in Polygon checks if a coordinate lies inside a closed polygon using the Ray Casting algorithm (even-odd rule).";
  const formula = "\\text{Cross check: } y_{1} > y_{P} \\ne y_{2} > y_{P} \\text{ and } x_{P} < \\frac{(x_2-x_1)(y_P-y_1)}{y_2-y_1} + x_1";
  const pseudocode = `PointInPolygon(P, polygon):
  inside = false
  N = polygon.length
  for i = 0 to N-1:
    p1 = polygon[i], p2 = polygon[(i+1)%N]
    if (p1.y > P.y) != (p2.y > P.y):
      if P.x < (p2.x - p1.x) * (P.y - p1.y) / (p2.y - p1.y) + p1.x:
        inside = !inside
  return inside`;

  const applications = [
    "Geofencing and location boundary checking.",
    "Computer graphics rasterization paint fills.",
    "CAD modeling boundaries collision detections."
  ];
  const mistakes = [
    "Not handling ray intersection through vertices correctly (leads to double counting errors).",
    "Assuming convex shapes constraints only."
  ];
  const cpTips = [
    "The Ray Casting algorithm works on any simple polygon (convex or concave). If you need a faster check for convex polygons only, you can binary search orientations in O(log N)!"
  ];

  return (
    <GyLayout
      timeComplexity="O(N) linear sweep of edges"
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
              Ray Casting Crossing Grid (Drag Test Point P or polygon corners)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <GeometryCanvas
              points={points}
              onPointsChange={setPoints}
              polygonIndices={[0, 1, 2, 3]}
              lines={[{ fromIdx: 4, toIdx: 4, color: "#eab308" }]} // test ray (represented as dashed horizontal line in logs)
            />

            <div className="border-t border-border/5 pt-3 space-y-2 font-mono text-xs text-left">
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span>Containment Result:</span>
                <span className={`font-extrabold ${inside ? "text-emerald-500" : "text-rose-500"}`}>
                  {inside ? "INSIDE POLYGON" : "OUTSIDE POLYGON"}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                  Ray Crossings Log:
                </span>
                <div className="p-2.5 bg-muted/20 border border-border/10 rounded-lg max-h-36 overflow-y-auto font-mono text-[10px] leading-relaxed text-foreground/80 space-y-1">
                  {intersectLogs.length > 0 ? (
                    intersectLogs.map((log, idx) => <div key={idx}>{log}</div>)
                  ) : (
                    <div className="text-muted-foreground font-sans">No boundary crossings detected. Point is outside.</div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      }
    >
      <GyHeader
        title="Point in Polygon"
        description="Verify point containment in closed shapes using Ray Casting sweeps."
        category="Geometry"
        difficulty="Hard"
        shortcut="Alt+Shift+P"
      />
    </GyLayout>
  );
}
