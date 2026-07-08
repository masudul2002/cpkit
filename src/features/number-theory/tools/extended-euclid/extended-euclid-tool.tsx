"use client";

import * as React from "react";
import { NtHeader } from "../../shared/nt-header";
import { NtLayout } from "../../shared/nt-layout";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface EuclidResult {
  gcd: number;
  x: number;
  y: number;
}

export function ExtendedEuclidTool() {
  const [valA, setValA] = React.useState("30");
  const [valB, setValB] = React.useState("20");
  const [compared, setCompared] = React.useState(false);
  const [result, setResult] = React.useState<EuclidResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleClear = () => {
    setValA("");
    setValB("");
    setCompared(false);
    setResult(null);
    setError(null);
  };

  const extGcd = (a: number, b: number): EuclidResult => {
    if (b === 0) {
      return { gcd: a, x: 1, y: 0 };
    }
    const res = extGcd(b, a % b);
    return {
      gcd: res.gcd,
      x: res.y,
      y: res.x - Math.floor(a / b) * res.y,
    };
  };

  const handleEvaluate = () => {
    setError(null);
    setCompared(false);

    const a = parseInt(valA, 10);
    const b = parseInt(valB, 10);

    if (isNaN(a) || isNaN(b) || a < 1 || b < 1) {
      setError("Please enter positive integers");
      return;
    }

    setCompared(true);
    setResult(extGcd(a, b));
  };

  const definition = "Extended Euclidean Algorithm finds integer coefficients (x, y) satisfying Bézout's identity: ax + by = gcd(a, b), which is useful for modular inverses.";
  const formula = "Recursion: x = y1, y = x1 - floor(a/b) * y1 where x1, y1 are coefficients of (b, a % b).";
  const example = "For a=30, b=20: gcd(30, 20)=10. Coefficients: x=1, y=-1. Verify: 30(1) + 20(-1) = 30 - 20 = 10.";
  const applications = [
    "Computing modular multiplicative inverse.",
    "Solving linear Diophantine equations.",
    "Bézout's coefficients factorization."
  ];
  const mistakes = [
    "Failing to handle negative signs on coefficients correctly.",
    "Infinite loops if b is never reduced."
  ];

  return (
    <NtLayout
      timeComplexity="O(log(min(A, B)))"
      spaceComplexity="O(log(min(A, B)))"
      definition={definition}
      formula={formula}
      example={example}
      applications={applications}
      mistakes={mistakes}
      resultChild={
        compared && result && (
          <Card className="border-border/40 bg-card/65 shadow-xs">
            <CardHeader className="pb-2 border-b border-border/10">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Extended GCD Results
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3 font-mono text-xs text-left">
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground">GCD (d):</span>
                <span className="font-bold text-foreground">{result.gcd}</span>
              </div>
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground">Coefficient x:</span>
                <span className="font-bold text-foreground">{result.x}</span>
              </div>
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground">Coefficient y:</span>
                <span className="font-bold text-foreground">{result.y}</span>
              </div>
              <div className="pt-2">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">
                  Bézout Identity Proof:
                </span>
                <div className="p-3 bg-muted/20 border border-border/10 rounded-lg text-[11px] leading-relaxed">
                  {valA}({result.x}) + {valB}({result.y}) = {result.gcd}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      }
    >
      <NtHeader
        title="Extended Euclidean Solver"
        description="Compute Greatest Common Divisor and Bézout coefficients (x, y) satisfying Diophantine relations."
        category="Operators"
        difficulty="Medium"
        shortcut="Alt+Shift+7"
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
              label="Integer A"
              value={valA}
              onChange={(val) => {
                setValA(val);
                setCompared(false);
              }}
            />
            <InputField
              label="Integer B"
              value={valB}
              onChange={(val) => {
                setValB(val);
                setCompared(false);
              }}
            />
          </div>
          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Run Extended Euclid
          </Button>
        </CardContent>
      </Card>
    </NtLayout>
  );
}
