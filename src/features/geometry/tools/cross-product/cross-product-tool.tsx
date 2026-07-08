"use client";

import * as React from "react";
import { GyHeader } from "../../shared/gy-header";
import { GyLayout } from "../../shared/gy-layout";
import { GeometryCanvas, Point2D } from "../../shared/geometry-canvas";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function CrossProductTool() {
  const [points, setPoints] = React.useState<Point2D[]>([
    { x: 0, y: 0, label: "Origin (A)" },
    { x: 4, y: 2, label: "Vector U (B)" },
    { x: 1, y: 4, label: "Vector V (C)" },
  ]);

  const pA = points[0];
  const pB = points[1];
  const pC = points[2];

  // Vectors relative to origin A
  const ux = pB.x - pA.x;
  const uy = pB.y - pA.y;
  const vx = pC.x - pA.x;
  const vy = pC.y - pA.y;

  const cross = ux * vy - uy * vx;

  const definition = "The 2D Vector Cross Product (or skew product) U × V computes the signed area of the parallelogram spanned by the two vectors.";
  const formula = "U \\times V = U.x \\cdot V.y - U.y \\cdot V.x = |U||V|\\sin(\\theta)";
  const pseudocode = `CrossProduct2D(u, v):
  return u.x * v.y - u.y * v.x`;

  const applications = [
    "Calculating signed area of polygons.",
    "Checking point-line boundary sides.",
    "Evaluating clockwise angle orientations."
  ];
  const mistakes = [
    "Assuming U × V is commutative (it is anti-commutative: U × V = - (V × U)).",
    "Confusing cross product with dot product formulas."
  ];
  const cpTips = [
    "A positive cross product indicates Vector V is CCW from Vector U, whereas a negative cross product indicates V is CW from U!"
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
              Cross Product Vector Grid (Drag Origin A, U head, or V head)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <GeometryCanvas
              points={points}
              onPointsChange={setPoints}
              lines={[
                { fromIdx: 0, toIdx: 1, color: "#3b82f6" }, // Vector U
                { fromIdx: 0, toIdx: 2, color: "#10b981" }, // Vector V
              ]}
            />

            <div className="border-t border-border/5 pt-3 space-y-2 font-mono text-xs text-left">
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span>Vector U:</span>
                <span className="font-semibold text-blue-500">[{ux}, {uy}]</span>
              </div>
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span>Vector V:</span>
                <span className="font-semibold text-emerald-500">[{vx}, {vy}]</span>
              </div>
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span>Cross Product magnitude (signed area):</span>
                <span className="font-bold text-primary">{cross}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      }
    >
      <GyHeader
        title="Vector Cross Product"
        description="Compute signed area magnitude spanned by 2D vectors."
        category="Geometry"
        difficulty="Easy"
        shortcut="Alt+Shift+C"
      />
    </GyLayout>
  );
}
