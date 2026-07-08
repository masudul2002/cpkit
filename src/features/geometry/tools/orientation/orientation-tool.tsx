"use client";

import * as React from "react";
import { GyHeader } from "../../shared/gy-header";
import { GyLayout } from "../../shared/gy-layout";
import { GeometryCanvas, Point2D } from "../../shared/geometry-canvas";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function OrientationTool() {
  const [points, setPoints] = React.useState<Point2D[]>([
    { x: -3, y: -2, label: "A" },
    { x: 1, y: 2, label: "B" },
    { x: 4, y: 1, label: "C" },
  ]);

  const pA = points[0];
  const pB = points[1];
  const pC = points[2];

  // val = (y2 - y1)*(x3 - x2) - (x2 - x1)*(y3 - y2)
  const val = (pB.y - pA.y) * (pC.x - pB.x) - (pB.x - pA.x) * (pC.y - pB.y);
  let stateResult = "Collinear";
  let colorClass = "text-amber-500";

  if (val > 0) {
    stateResult = "Clockwise (CW)";
    colorClass = "text-rose-500";
  } else if (val < 0) {
    stateResult = "Counter Clockwise (CCW)";
    colorClass = "text-emerald-500";
  }

  const definition = "Orientation of three ordered points in a 2D plane determines if they form a collinear line segment, a clockwise turn, or a counter-clockwise turn.";
  const formula = "val = (y_B - y_A)(x_C - x_B) - (x_B - x_A)(y_C - y_B) \\\\ \\text{CW if } val > 0, \\text{ CCW if } val < 0, \\text{ Collinear if } val = 0";
  const pseudocode = `Orientation(A, B, C):
  val = (B.y - A.y) * (C.x - B.x) - (B.x - A.x) * (C.y - B.y)
  if val == 0: return "Collinear"
  return val > 0 ? "CW" : "CCW"`;

  const applications = [
    "Used as a building block for Graham's Scan Convex Hull.",
    "Checking line segment intersections.",
    "Ray-casting point in polygon checks."
  ];
  const mistakes = [
    "Mixing up standard coordinate Y invert transformations.",
    "Failing to handle collinear tolerance checks on floating points."
  ];
  const cpTips = [
    "Always use cross product cross orientations in integer maths to prevent floating precision bugs in competition judges!"
  ];

  return (
    <GyLayout
      timeComplexity="O(1) direct equations"
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
              Orientation Interactive Grid (Drag A, B, or C)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <GeometryCanvas
              points={points}
              onPointsChange={setPoints}
              lines={[
                { fromIdx: 0, toIdx: 1 },
                { fromIdx: 1, toIdx: 2 },
              ]}
            />

            <div className="border-t border-border/5 pt-3 space-y-2 font-mono text-xs text-left">
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span>Determinant Cross Value:</span>
                <span className="font-bold">{val}</span>
              </div>
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span>Resulting Orientation:</span>
                <span className={`font-bold ${colorClass}`}>{stateResult}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      }
    >
      <GyHeader
        title="Orientation"
        description="Verify Clockwise, Counter Clockwise, or Collinear relationships of three coordinates."
        category="Geometry"
        difficulty="Easy"
        shortcut="Alt+Shift+O"
      />
    </GyLayout>
  );
}
