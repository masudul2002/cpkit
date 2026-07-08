"use client";

import * as React from "react";
import { GyHeader } from "../../shared/gy-header";
import { GyLayout } from "../../shared/gy-layout";
import { GeometryCanvas, Point2D } from "../../shared/geometry-canvas";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function PolygonTool() {
  const [points, setPoints] = React.useState<Point2D[]>([
    { x: -3, y: 3, label: "A" },
    { x: 3, y: 3, label: "B" },
    { x: 4, y: -2, label: "C" },
    { x: -2, y: -3, label: "D" },
  ]);

  const n = points.length;

  // 1. Calculate Area using Shoelace Formula
  let areaSum = 0;
  for (let i = 0; i < n; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    areaSum += p1.x * p2.y - p2.x * p1.y;
  }
  const area = 0.5 * Math.abs(areaSum);

  // 2. Calculate Perimeter
  let perimeter = 0;
  for (let i = 0; i < n; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    perimeter += Math.sqrt(dx * dx + dy * dy);
  }

  // 3. Convexity check
  const getOrientationSign = (a: Point2D, b: Point2D, c: Point2D) => {
    const val = (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);
    if (val === 0) return 0;
    return val > 0 ? 1 : -1; // 1 for CW, -1 for CCW
  };

  let isConvex = true;
  let firstSign = 0;

  for (let i = 0; i < n; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];
    const sign = getOrientationSign(p1, p2, p3);

    if (sign !== 0) {
      if (firstSign === 0) {
        firstSign = sign;
      } else if (sign !== firstSign) {
        isConvex = false;
        break;
      }
    }
  }

  const definition = "Polygon calculations evaluate boundaries closed segments, computing signed areas, perimeters, and validating convexity shapes.";
  const formula = "Area = \\frac{1}{2} \\left| \\sum_{i=1}^{n} (x_i y_{i+1} - x_{i+1} y_i) \\right|";
  const pseudocode = `ShoelaceArea(points):
  area = 0
  N = points.length
  for i = 0 to N-1:
    j = (i + 1) % N
    area += points[i].x * points[j].y - points[j].x * points[i].y
  return abs(area) / 2`;

  const applications = [
    "Polygon coordinates range queries.",
    "Map GIS territory area bounds.",
    "Billiards bounce limits calculations."
  ];
  const mistakes = [
    "Not wrapping indices around modulo loops (e.g. index N-1 connects back to 0).",
    "Assuming self-intersecting loops are simple polygons."
  ];
  const cpTips = [
    "Always remember to sort points in counter-clockwise order if you are constructing custom shapes, otherwise the Shoelace formula may yield incorrect values!"
  ];

  return (
    <GyLayout
      timeComplexity="O(N) linear sweep calculations"
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
              Polygon Grid (Drag A, B, C, or D)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <GeometryCanvas
              points={points}
              onPointsChange={setPoints}
              polygonIndices={Array.from({ length: n }, (_, i) => i)}
            />

            <div className="border-t border-border/5 pt-3 space-y-2 font-mono text-xs text-left">
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span>Polygon Area (Shoelace):</span>
                <span className="font-bold text-emerald-500">{area.toFixed(2)} sq units</span>
              </div>
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span>Polygon Perimeter:</span>
                <span className="font-bold text-primary">{perimeter.toFixed(4)} units</span>
              </div>
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span>Is Convex Shape:</span>
                <span className={`font-bold ${isConvex ? "text-emerald-500" : "text-rose-500"}`}>
                  {isConvex ? "Yes (Convex)" : "No (Concave)"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      }
    >
      <GyHeader
        title="Polygon Properties"
        description="Verify Shoelace Area, Perimeter, and Convexity of closed coordinate shapes."
        category="Geometry"
        difficulty="Medium"
        shortcut="Alt+Shift+P"
      />
    </GyLayout>
  );
}
