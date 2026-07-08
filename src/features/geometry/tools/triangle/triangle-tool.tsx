"use client";

import * as React from "react";
import { GyHeader } from "../../shared/gy-header";
import { GyLayout } from "../../shared/gy-layout";
import { GeometryCanvas, Point2D } from "../../shared/geometry-canvas";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function TriangleTool() {
  const [points, setPoints] = React.useState<Point2D[]>([
    { x: -3, y: -2, label: "A" },
    { x: 3, y: -2, label: "B" },
    { x: 0, y: 3, label: "C" },
  ]);

  const pA = points[0];
  const pB = points[1];
  const pC = points[2];

  // 1. Centroid calculation
  const centroidX = (pA.x + pB.x + pC.x) / 3;
  const centroidY = (pA.y + pB.y + pC.y) / 3;

  // 2. Area using determinant coordinates formula
  const area = 0.5 * Math.abs(
    pA.x * (pB.y - pC.y) + pB.x * (pC.y - pA.y) + pC.x * (pA.y - pB.y)
  );

  // 3. Perimeter and Type Detection
  const dist = (p1: Point2D, p2: Point2D) => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const sideAB = dist(pA, pB);
  const sideBC = dist(pB, pC);
  const sideCA = dist(pC, pA);
  const perimeter = sideAB + sideBC + sideCA;

  // Type checks with floating tolerance
  const eps = 1e-4;
  const eq = (x: number, y: number) => Math.abs(x - y) < eps;

  let triangleType = "Scalene";
  if (eq(sideAB, sideBC) && eq(sideBC, sideCA)) {
    triangleType = "Equilateral";
  } else if (eq(sideAB, sideBC) || eq(sideBC, sideCA) || eq(sideCA, sideAB)) {
    triangleType = "Isosceles";
  }

  const definition = "Triangle properties analyze vertices bounds, centroid intersections, areas, and side lengths types categorization.";
  const formula = "Area = \\frac{1}{2} |x_A(y_B - y_C) + x_B(y_C - y_A) + x_C(y_A - y_B)| \\\\ \\text{Centroid} = \\left(\\frac{x_A+x_B+x_C}{3}, \\frac{y_A+y_B+y_C}{3}\\right)";
  const pseudocode = `TriangleCentroid(A, B, C):
  return Point((A.x + B.x + C.x)/3, (A.y + B.y + C.y)/3)`;

  const applications = [
    "Delaunay Triangulation pre-processing.",
    "Mesh bounds grids indexing.",
    "Finite element analysis boundaries."
  ];
  const mistakes = [
    "Assuming collinear vertices form a valid triangle (Area = 0 check).",
    "Failing to handle roundoff tolerances on float values comparisons."
  ];
  const cpTips = [
    "Heron's formula is excellent for computing triangle area given only side lengths: sqrt(s * (s-a) * (s-b) * (s-c)) where s is the semi-perimeter!"
  ];

  const overlayPoints = [...points, { x: centroidX, y: centroidY, label: "Centroid" }];

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
              Triangle Grid (Drag A, B, or C)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <GeometryCanvas
              points={overlayPoints}
              onPointsChange={(pts) => setPoints(pts.slice(0, 3))}
              polygonIndices={[0, 1, 2]}
            />

            <div className="border-t border-border/5 pt-3 space-y-2 font-mono text-xs text-left">
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span>Centroid Coordinate:</span>
                <span className="font-extrabold text-primary">
                  ({centroidX.toFixed(2)}, {centroidY.toFixed(2)})
                </span>
              </div>
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span>Triangle Area:</span>
                <span className="font-bold text-emerald-500">{area.toFixed(2)} sq units</span>
              </div>
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span>Triangle Perimeter:</span>
                <span className="font-bold text-primary">{perimeter.toFixed(4)} units</span>
              </div>
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span>Triangle Category Type:</span>
                <span className="font-bold text-primary">{triangleType}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      }
    >
      <GyHeader
        title="Triangle Properties"
        description="Verify centroid coordinate, area, perimeter, and side type structures."
        category="Geometry"
        difficulty="Easy"
        shortcut="Alt+Shift+T"
      />
    </GyLayout>
  );
}
