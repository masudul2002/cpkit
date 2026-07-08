"use client";

import * as React from "react";
import { MxHeader } from "../../shared/mx-header";
import { MxLayout } from "../../shared/mx-layout";
import { MatrixInput } from "../../shared/matrix-input";
import { MatrixGrid } from "../../shared/matrix-grid";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { RotateCcw } from "lucide-react";

export function RotationTool() {
  const [rows, setRows] = React.useState(3);
  const [cols, setCols] = React.useState(3);
  const [angle, setAngle] = React.useState<"90" | "180" | "270">("90");
  const [direction, setDirection] = React.useState<"cw" | "ccw">("cw");

  const [matrix, setMatrix] = React.useState<number[][]>([]);
  const [rotated, setRotated] = React.useState<number[][]>([]);
  const [compared, setCompared] = React.useState(false);

  const handleClear = () => {
    setRows(3);
    setCols(3);
    setMatrix([]);
    setRotated([]);
    setCompared(false);
  };

  const rotate90Cw = (mat: number[][]): number[][] => {
    const R = mat.length;
    const C = mat[0]?.length || 0;
    const nextMat = Array.from({ length: C }, () => new Array(R).fill(0));
    for (let i = 0; i < R; i++) {
      for (let j = 0; j < C; j++) {
        nextMat[j][R - 1 - i] = mat[i][j];
      }
    }
    return nextMat;
  };

  const rotate90Ccw = (mat: number[][]): number[][] => {
    const R = mat.length;
    const C = mat[0]?.length || 0;
    const nextMat = Array.from({ length: C }, () => new Array(R).fill(0));
    for (let i = 0; i < R; i++) {
      for (let j = 0; j < C; j++) {
        nextMat[C - 1 - j][i] = mat[i][j];
      }
    }
    return nextMat;
  };

  const handleEvaluate = () => {
    setCompared(true);
    let nextMat = matrix;

    const steps = angle === "90" ? 1 : angle === "180" ? 2 : 3;

    for (let k = 0; k < steps; k++) {
      if (direction === "cw") {
        nextMat = rotate90Cw(nextMat);
      } else {
        nextMat = rotate90Ccw(nextMat);
      }
    }

    setRotated(nextMat);
  };

  const definition = "Matrix rotation shifts all elements cyclic-wise by 90°, 180°, or 270° clockwise or counter-clockwise. For rectangular matrices, dimensions are transposed.";
  const formula = "90 CW: Rot[j][R-1-i] = Mat[i][j]. 90 CCW: Rot[C-1-j][i] = Mat[i][j]. 180: Rot[R-1-i][C-1-j] = Mat[i][j].";
  const example = "Rotated 3x2 matrix by 90° CW results in a 2x3 matrix where elements are cyclically shifted.";
  const applications = [
    "Image processing grids rotation.",
    "Bivector search direction offsets.",
    "Cyclic shift matrices equivalences."
  ];
  const mistakes = [
    "Not updating row/column sizes when rotating rectangular grids.",
    "Wrong cell alignments due to index flips."
  ];
  const cpTips = [
    "Rotating a matrix by 180 degrees is equivalent to reversing all rows and then reversing all columns, which can be done in-place!"
  ];

  return (
    <MxLayout
      timeComplexity="O(R * C)"
      spaceComplexity="O(R * C) rotated buffer"
      definition={definition}
      formula={formula}
      example={example}
      applications={applications}
      mistakes={mistakes}
      cpTips={cpTips}
      resultChild={
        compared && rotated.length > 0 && (
          <Card className="border-border/40 bg-card/65 shadow-xs">
            <CardHeader className="pb-2 border-b border-border/10">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Rotated Matrix Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex justify-center">
              <MatrixGrid matrix={rotated} />
            </CardContent>
          </Card>
        )
      }
    >
      <MxHeader
        title="Matrix Rotation"
        description="Rotate matrices cyclically by 90°, 180°, or 270° clockwise or counter-clockwise."
        category="Operations"
        difficulty="Easy"
        shortcut="Alt+Shift+3"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs">
        <CardHeader className="flex flex-row justify-between items-center pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="h-7 w-7 p-0 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </CardHeader>
        <CardContent className="p-6 space-y-4 font-sans">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="space-y-1.5 max-w-[80px]">
              <label className="text-xs font-semibold text-foreground/80">Rows</label>
              <Select value={rows.toString()} onChange={(e) => { setRows(parseInt(e.target.value, 10)); setCompared(false); }}>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </Select>
            </div>
            <div className="space-y-1.5 max-w-[80px]">
              <label className="text-xs font-semibold text-foreground/80">Columns</label>
              <Select value={cols.toString()} onChange={(e) => { setCols(parseInt(e.target.value, 10)); setCompared(false); }}>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </Select>
            </div>
            <div className="space-y-1.5 max-w-[80px]">
              <label className="text-xs font-semibold text-foreground/80">Angle</label>
              <Select value={angle} onChange={(e) => { setAngle(e.target.value as any); setCompared(false); }}>
                <option value="90">90°</option>
                <option value="180">180°</option>
                <option value="270">270°</option>
              </Select>
            </div>
            <div className="space-y-1.5 max-w-[120px]">
              <label className="text-xs font-semibold text-foreground/80">Direction</label>
              <Select value={direction} onChange={(e) => { setDirection(e.target.value as any); setCompared(false); }}>
                <option value="cw">Clockwise</option>
                <option value="ccw">Counter-Clockwise</option>
              </Select>
            </div>
          </div>

          <MatrixInput
            rows={rows}
            cols={cols}
            value={matrix}
            onChange={(val) => {
              setMatrix(val);
              setCompared(false);
            }}
          />

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Rotate Matrix
          </Button>
        </CardContent>
      </Card>
    </MxLayout>
  );
}
