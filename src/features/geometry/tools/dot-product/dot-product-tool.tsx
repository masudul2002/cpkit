"use client";

import * as React from "react";
import { GyHeader } from "../../shared/gy-header";
import { GyLayout } from "../../shared/gy-layout";
import { GeometryCanvas, Point2D } from "../../shared/geometry-canvas";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function DotProductTool() {
  const [points, setPoints] = React.useState<Point2D[]>([
    { x: 0, y: 0, label: "Origin (A)" },
    { x: 5, y: 0, label: "Vector U (B)" },
    { x: 3, y: 4, label: "Vector V (C)" },
  ]);

  const pA = points[0];
  const pB = points[1];
  const pC = points[2];

  // Vectors relative to origin A
  const ux = pB.x - pA.x;
  const uy = pB.y - pA.y;
  const vx = pC.x - pA.x;
  const vy = pC.y - pA.y;

  const dot = ux * vx + uy * vy;
  const lenU = Math.sqrt(ux * ux + uy * uy);
  const lenV = Math.sqrt(vx * vx + vy * vy);

  let angleDeg = 0;
  if (lenU > 0 && lenV > 0) {
    const cosTheta = Math.max(-1, Math.min(1, dot / (lenU * lenV)));
    angleDeg = (Math.acos(cosTheta) * 180) / Math.PI;
  }

  const definition = "The Vector Dot Product U · V computes the projection scaling of V onto U. It is key for checking orthogonality and calculating segment angles.";
  const formula = "U \\cdot V = U.x \\cdot V.x + U.y \\cdot V.y = |U||V|\\cos(\\theta)";
  const pseudocode = `DotProduct(u, v):
  return u.x * v.x + u.y * v.y`;

  const applications = [
    "Checking perpendicular status (U · V = 0).",
    "Projecting vectors onto arbitrary axes.",
    "Evaluating line of sight visibility directions."
  ];
  const mistakes = [
    "Dividing by zero when calculating angles of zero-length vectors.",
    "Confusing negative dot products (obtuse angle) with positive ones (acute angle)."
  ];
  const cpTips = [
    "A positive dot product implies the angle between vectors is acute (< 90°), zero implies perpendicular (90°), and negative implies obtuse (> 90°)!"
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
              Dot Product Vector Grid (Drag Origin A, U head, or V head)
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
                <span>Dot Product value:</span>
                <span className="font-bold text-primary">{dot}</span>
              </div>
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span>Angle Between (θ):</span>
                <span className="font-bold text-primary">{angleDeg.toFixed(2)}°</span>
              </div>
            </div>
          </CardContent>
        </Card>
      }
    >
      <GyHeader
        title="Vector Dot Product"
        description="Compute scalar projections and angles between vectors."
        category="Geometry"
        difficulty="Easy"
        shortcut="Alt+Shift+D"
      />
    </GyLayout>
  );
}
