"use client";

import * as React from "react";
import { GyHeader } from "../../shared/gy-header";
import { GyLayout } from "../../shared/gy-layout";
import { GeometryCanvas, Point2D } from "../../shared/geometry-canvas";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function CircleTool() {
  const [points, setPoints] = React.useState<Point2D[]>([
    { x: 0, y: 0, label: "Center (A)" },
    { x: 3, y: 0, label: "Boundary (B)" },
    { x: 1, y: 2, label: "Test Point (C)" },
  ]);

  const pA = points[0];
  const pB = points[1];
  const pC = points[2];

  // Radius = dist(A, B)
  const dx = pB.x - pA.x;
  const dy = pB.y - pA.y;
  const radius = Math.sqrt(dx * dx + dy * dy);

  // Dist to test point C
  const dcx = pC.x - pA.x;
  const dcy = pC.y - pA.y;
  const distC = Math.sqrt(dcx * dcx + dcy * dcy);

  const isInside = distC <= radius;

  const area = Math.PI * radius * radius;
  const circumference = 2 * Math.PI * radius;

  const definition = "Circle calculations evaluate points inside boundary radii, areas, circumferences, and tangents intersections.";
  const formula = "Area = \\pi r^2 | Circumference = 2\\pi r | \\text{Inside if } (x_C - x_A)^2 + (y_C - y_A)^2 \\le r^2";
  const pseudocode = `IsInsideCircle(A, C, r):
  return (C.x - A.x)^2 + (C.y - A.y)^2 <= r^2`;

  const applications = [
    "Broadcast network towers coverage check.",
    "Billiards bounce tangent pathing.",
    "2D circle-circle collision sweeps."
  ];
  const mistakes = [
    "Using floating division comparison directly (which loses precision; use squared integers comparisons instead).",
    "Confusing diameter measurements with radius."
  ];
  const cpTips = [
    "To avoid floating-point errors when checking if a point is inside a circle, always use the squared distance inequality: dx^2 + dy^2 <= r_squared in integer types!"
  ];

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
              Circle Grid (Drag Center A, boundary B, or test point C)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <GeometryCanvas
              points={points}
              onPointsChange={setPoints}
              circleOverlay={{
                centerIdx: 0,
                radius,
              }}
            />

            <div className="border-t border-border/5 pt-3 space-y-2 font-mono text-xs text-left">
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span>Circle Radius (r):</span>
                <span className="font-bold text-primary">{radius.toFixed(4)}</span>
              </div>
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span>Circle Area:</span>
                <span className="font-bold text-emerald-500">{area.toFixed(4)}</span>
              </div>
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span>Circle Circumference:</span>
                <span className="font-bold text-primary">{circumference.toFixed(4)}</span>
              </div>
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span>Is Test Point C Inside:</span>
                <span className={`font-bold ${isInside ? "text-emerald-500" : "text-rose-500"}`}>
                  {isInside ? "Yes (Inside / On border)" : "No (Outside)"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      }
    >
      <GyHeader
        title="Circle Properties"
        description="Verify radius, area, circumference, and test point containment invariants."
        category="Geometry"
        difficulty="Easy"
        shortcut="Alt+Shift+C"
      />
    </GyLayout>
  );
}
