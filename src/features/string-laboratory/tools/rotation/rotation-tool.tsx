"use client";

import * as React from "react";
import { StHeader } from "../../shared/st-header";
import { StLayout } from "../../shared/st-layout";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export function RotationTool() {
  const [valA, setValA] = React.useState("algorithm");
  const [valB, setValB] = React.useState("rithmalgo");
  const [shiftCount, setShiftCount] = React.useState("3");

  const [compared, setCompared] = React.useState(false);
  const [leftRot, setLeftRot] = React.useState("");
  const [rightRot, setRightRot] = React.useState("");
  const [isValidRotation, setIsValidRotation] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleClear = () => {
    setValA("");
    setValB("");
    setShiftCount("");
    setCompared(false);
    setError(null);
  };

  const handleEvaluate = () => {
    setError(null);
    setCompared(false);

    if (valA.length === 0) {
      setError("Base string A cannot be empty");
      return;
    }

    const shift = parseInt(shiftCount, 10);
    if (isNaN(shift) || shift < 0) {
      setError("Please enter a valid positive shift offset integer");
      return;
    }

    setCompared(true);
    const N = valA.length;
    const modShift = shift % N;

    // Left rotation: move modShift chars from front to back
    const left = valA.slice(modShift) + valA.slice(0, modShift);
    setLeftRot(left);

    // Right rotation: move modShift chars from back to front
    const right = valA.slice(N - modShift) + valA.slice(0, N - modShift);
    setRightRot(right);

    // Rotation Validation: B is a rotation of A if B.length === A.length and (A + A) contains B!
    const valid = valA.length === valB.length && (valA + valA).includes(valB);
    setIsValidRotation(valid);
  };

  const definition = "String rotation moves characters from one end of a string to the other. In competitive programming, validating if B is a rotation of A is solved in O(N) by checking if (A + A) contains B.";
  const formula = "Left Rot: A[k..N-1] + A[0..k-1]. Right Rot: A[N-k..N-1] + A[0..N-k-1]. Validation: (A + A).contains(B).";
  const example = "For 'algo', left rotation of 1 is 'lgoa'. 'algoalgo' contains 'goal', so 'goal' is a valid rotation.";
  const applications = [
    "Cyclic shift problem matches.",
    "Lexicographical smallest cyclic shift (Suffix Array/Booth's Algorithm).",
    "Hashing circular patterns."
  ];
  const mistakes = [
    "Not modding shift count by string length, leading to slice index errors.",
    "Failing to verify lengths before applying substring check on (A+A)."
  ];

  return (
    <StLayout
      timeComplexity="O(N)"
      spaceComplexity="O(N) for string buffers"
      definition={definition}
      formula={formula}
      example={example}
      applications={applications}
      mistakes={mistakes}
      resultChild={
        compared && (
          <Card className="border-border/40 bg-card/65 shadow-xs">
            <CardHeader className="pb-2 border-b border-border/10">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Rotation Results
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3 font-mono text-xs text-left">
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground">Left Rotated ({shiftCount}):</span>
                <span className="font-bold text-foreground">{leftRot}</span>
              </div>
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground">Right Rotated ({shiftCount}):</span>
                <span className="font-bold text-foreground">{rightRot}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-muted-foreground">Is B a rotation of A?</span>
                <span className={`font-bold ${isValidRotation ? "text-emerald-500" : "text-rose-500"}`}>
                  {isValidRotation ? "YES" : "NO"}
                </span>
              </div>
            </CardContent>
          </Card>
        )
      }
    >
      <StHeader
        title="String Rotation"
        description="Shift characters cyclically to the left or right, and validate if two strings are cyclic rotations of each other."
        category="Basic"
        difficulty="Easy"
        shortcut="Alt+Shift+R"
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
        <CardContent className="p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              label="Base String (A)"
              value={valA}
              onChange={(val) => {
                setValA(val);
                setCompared(false);
              }}
              error={error || undefined}
            />
            <InputField
              label="Rotation Target (B)"
              value={valB}
              onChange={(val) => {
                setValB(val);
                setCompared(false);
              }}
            />
          </div>
          <InputField
            label="Rotation Shift Count"
            value={shiftCount}
            onChange={(val) => {
              setShiftCount(val);
              setCompared(false);
            }}
          />
          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Calculate Rotations
          </Button>
        </CardContent>
      </Card>
    </StLayout>
  );
}
