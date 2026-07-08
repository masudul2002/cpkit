"use client";

import * as React from "react";
import { GyHeader } from "../../shared/gy-header";
import { GyLayout } from "../../shared/gy-layout";
import { GeometryCanvas, Point2D } from "../../shared/geometry-canvas";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function PointDistanceTool() {
  const [points, setPoints] = React.useState<Point2D[]>([
    { x: -3, y: 4, label: "P1" },
    { x: 3, y: -2, label: "P2" },
  ]);

  const [z1, setZ1] = React.useState("0");
  const [z2, setZ2] = React.useState("0");

  const [compared, setCompared] = React.useState(false);
  const [dist2D, setDist2D] = React.useState<number | null>(null);
  const [dist3D, setDist3D] = React.useState<number | null>(null);
  const [distManhattan, setDistManhattan] = React.useState<number | null>(null);
  const [distChebyshev, setDistChebyshev] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleEvaluate = () => {
    setError(null);
    setCompared(true);

    const valZ1 = parseFloat(z1);
    const valZ2 = parseFloat(z2);

    if (isNaN(valZ1) || isNaN(valZ2)) {
      setError("Please check your 3D Z coordinates.");
      return;
    }

    const p1 = points[0];
    const p2 = points[1];

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dz = valZ2 - valZ1;

    setDist2D(Math.sqrt(dx * dx + dy * dy));
    setDist3D(Math.sqrt(dx * dx + dy * dy + dz * dz));
    setDistManhattan(Math.abs(dx) + Math.abs(dy));
    setDistChebyshev(Math.max(Math.abs(dx), Math.abs(dy)));
  };

  const definition = "Point Distance measures the interval span between two coordinates in 2D or 3D coordinate space under various metrics (Euclidean, Manhattan, Chebyshev).";
  const formula = "Euclidean 2D: \\sqrt{dx^2 + dy^2} | Manhattan: |dx| + |dy| | Chebyshev: \\max(|dx|, |dy|)";
  const pseudocode = `Distance2D(p1, p2):
  return sqrt((p2.x - p1.x)^2 + (p2.y - p1.y)^2)
DistanceManhattan(p1, p2):
  return abs(p2.x - p1.x) + abs(p2.y - p1.y)`;

  const applications = [
    "Shortest paths bounding boxes calculations.",
    "A* pathfinder distance heuristics (Manhattan/Chebyshev).",
    "Collision detection bounding checks."
  ];
  const mistakes = [
    "Using Manhattan distance instead of Chebyshev on grid spaces where diagonal moves are permitted.",
    "Integer overflow during coordinate squaring multiplications."
  ];
  const cpTips = [
    "Always remember Manhattan distance is optimal for 4-directional grid movements, while Chebyshev distance is optimal for 8-directional king movements in chessboards!"
  ];

  return (
    <GyLayout
      timeComplexity="O(1) direct mathematical calculations"
      spaceComplexity="O(1) coordinates memory storage"
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
              Interactive Grid coordinates (Drag Points to reposition)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <GeometryCanvas
              points={points}
              onPointsChange={(pts) => {
                setPoints(pts);
                setCompared(false); // reset evaluation trace on change
              }}
              lines={[{ fromIdx: 0, toIdx: 1, dashed: true }]}
            />

            {compared && dist2D !== null && (
              <div className="border-t border-border/5 pt-3 space-y-2 font-mono text-xs text-left">
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>2D Euclidean Distance:</span>
                  <span className="font-bold text-emerald-500">{dist2D.toFixed(4)}</span>
                </div>
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>3D Euclidean Distance:</span>
                  <span className="font-bold text-emerald-500">{dist3D?.toFixed(4)}</span>
                </div>
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Manhattan Distance (L1 norm):</span>
                  <span className="font-bold text-primary">{distManhattan}</span>
                </div>
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Chebyshev Distance (L∞ norm):</span>
                  <span className="font-bold text-primary">{distChebyshev}</span>
                </div>
              </div>
            )}
            {error && <div className="text-xs text-rose-500 font-semibold font-mono">{error}</div>}
          </CardContent>
        </Card>
      }
    >
      <GyHeader
        title="Point Distance"
        description="Calculate Euclidean, Manhattan, and Chebyshev distances between coordinate points."
        category="Geometry"
        difficulty="Easy"
        shortcut="Alt+Shift+D"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <InputField label="Z Coordinate Point 1 (for 3D)" value={z1} onChange={setZ1} />
          <InputField label="Z Coordinate Point 2 (for 3D)" value={z2} onChange={setZ2} />

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Calculate Distances
          </Button>
        </CardContent>
      </Card>
    </GyLayout>
  );
}
