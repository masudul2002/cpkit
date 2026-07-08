"use client";

import * as React from "react";
import { GyHeader } from "../../shared/gy-header";
import { GyLayout } from "../../shared/gy-layout";
import { GeometryCanvas, Point2D } from "../../shared/geometry-canvas";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function CoordinateTransformTool() {
  const [points, setPoints] = React.useState<Point2D[]>([
    { x: 3, y: 2, label: "Original (P)" },
  ]);

  const [translateX, setTranslateX] = React.useState("2");
  const [translateY, setTranslateY] = React.useState("1");
  const [rotationAngle, setRotationAngle] = React.useState("90");

  const [compared, setCompared] = React.useState(false);
  const [transformedPoint, setTransformedPoint] = React.useState<Point2D | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleEvaluate = () => {
    setError(null);
    setCompared(true);

    const tx = parseFloat(translateX);
    const ty = parseFloat(translateY);
    const angle = parseFloat(rotationAngle);

    if (isNaN(tx) || isNaN(ty) || isNaN(angle)) {
      setError("Please check translation and rotation values inputs.");
      return;
    }

    const rad = (angle * Math.PI) / 180;
    const p = points[0];

    // Combine Translate + Rotate
    // Translated coordinates
    const translatedX = p.x + tx;
    const translatedY = p.y + ty;

    // Rotate translated point around origin
    const rotatedX = translatedX * Math.cos(rad) - translatedY * Math.sin(rad);
    const rotatedY = translatedX * Math.sin(rad) + translatedY * Math.cos(rad);

    setTransformedPoint({
      x: Math.round(rotatedX),
      y: Math.round(rotatedY),
      label: "Transformed (P')",
    });
  };

  const definition = "Coordinate Transformation maps points from one system to another using linear algebra matrices (Translation, Rotation, Scaling, Reflection).";
  const formula = "\\begin{bmatrix} x' \\\\ y' \\end{bmatrix} = \\begin{bmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{bmatrix} \\begin{bmatrix} x + t_x \\\\ y + t_y \\end{bmatrix}";
  const pseudocode = `TransformPoint(P, tx, ty, theta):
  translatedX = P.x + tx
  translatedY = P.y + ty
  rotatedX = translatedX * cos(theta) - translatedY * sin(theta)
  rotatedY = translatedX * sin(theta) + translatedY * cos(theta)
  return Point(rotatedX, rotatedY)`;

  const applications = [
    "Matrix projection conversions in graphics engines.",
    "Rotating frames of reference coordinates checks.",
    "Shape translations and reflections."
  ];
  const mistakes = [
    "Confusing rotation direction (CCW vs CW) which changes the sign of trigonometric values.",
    "Applying transformations out of order (Translation then Rotation is different from Rotation then Translation)."
  ];
  const cpTips = [
    "To rotate a vector by 90 degrees CCW, you can use the simple identity: x' = -y, y' = x. For 90 degrees CW, use: x' = y, y' = -x. No trigonometry needed!"
  ];

  const overlayPoints = [...points];
  if (transformedPoint) {
    overlayPoints.push(transformedPoint);
  }

  return (
    <GyLayout
      timeComplexity="O(1) matrix calculations"
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
              Coordinate Transform Grid (Drag original P)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <GeometryCanvas
              points={overlayPoints}
              onPointsChange={(pts) => {
                setPoints(pts.slice(0, 1));
                setCompared(false);
              }}
              lines={transformedPoint ? [{ fromIdx: 0, toIdx: 1, dashed: true }] : []}
            />

            {compared && transformedPoint && (
              <div className="border-t border-border/5 pt-3 space-y-2 font-mono text-xs text-left">
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Original point P:</span>
                  <span className="font-bold">({points[0].x}, {points[0].y})</span>
                </div>
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Transformed point P':</span>
                  <span className="font-extrabold text-emerald-500">
                    ({transformedPoint.x}, {transformedPoint.y})
                  </span>
                </div>
              </div>
            )}
            {error && <div className="text-xs text-rose-500 font-semibold font-mono">{error}</div>}
          </CardContent>
        </Card>
      }
    >
      <GyHeader
        title="Coordinate Transformation"
        description="Translate, rotate, and reflect coordinates on linear matrices."
        category="Geometry"
        difficulty="Easy"
        shortcut="Alt+Shift+C"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <InputField label="Translate X (dx)" value={translateX} onChange={setTranslateX} />
          <InputField label="Translate Y (dy)" value={translateY} onChange={setTranslateY} />
          <InputField label="Rotation Angle (θ degrees CCW)" value={rotationAngle} onChange={setRotationAngle} />

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Apply Transformations
          </Button>
        </CardContent>
      </Card>
    </GyLayout>
  );
}
