"use client";

import * as React from "react";
import { NtHeader } from "../../shared/nt-header";
import { NtLayout } from "../../shared/nt-layout";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export function GcdLcmTool() {
  const [inputVal, setInputVal] = React.useState("12 18 24");
  const [compared, setCompared] = React.useState(false);
  const [gcdResult, setGcdResult] = React.useState(0);
  const [lcmResult, setLcmResult] = React.useState(0);
  const [steps, setSteps] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handleClear = () => {
    setInputVal("");
    setCompared(false);
    setGcdResult(0);
    setLcmResult(0);
    setSteps([]);
    setError(null);
  };

  const getGcd = (a: number, b: number): number => {
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  };

  const getLcm = (a: number, b: number): number => {
    if (a === 0 || b === 0) return 0;
    return (a * b) / getGcd(a, b);
  };

  const handleEvaluate = () => {
    setError(null);
    setCompared(false);
    setSteps([]);

    const tokens = inputVal.trim().split(/\s+/).filter(Boolean);
    if (tokens.length < 2) {
      setError("Please enter at least 2 positive integers");
      return;
    }

    const nums: number[] = [];
    for (const t of tokens) {
      const parsed = parseInt(t, 10);
      if (isNaN(parsed) || parsed < 1) {
        setError(`Invalid positive integer: "${t}"`);
        return;
      }
      nums.push(parsed);
    }

    setCompared(true);
    const trace: string[] = [];
    
    let currentGcd = nums[0];
    let currentLcm = nums[0];

    for (let i = 1; i < nums.length; i++) {
      const prevGcd = currentGcd;
      const prevLcm = currentLcm;
      
      currentGcd = getGcd(currentGcd, nums[i]);
      currentLcm = getLcm(currentLcm, nums[i]);
      
      trace.push(`• gcd(${prevGcd}, ${nums[i]}) = ${currentGcd} | lcm(${prevLcm}, ${nums[i]}) = ${currentLcm}`);
    }

    setGcdResult(currentGcd);
    setLcmResult(currentLcm);
    setSteps(trace);
  };

  const definition = "Greatest Common Divisor (GCD) is the largest positive integer dividing all inputs. Least Common Multiple (LCM) is the smallest positive integer divisible by all inputs.";
  const formula = "Euclidean remainder algorithm: gcd(a, b) = gcd(b, a % b). Relation: lcm(a, b) = (a * b) / gcd(a, b)";
  const example = "For [12, 18, 24]: gcd(12, 18) = 6. gcd(6, 24) = 6. gcd result is 6.";
  const applications = [
    "Simplifying modular rational fractions.",
    "Coprimality checks.",
    "Diophantine equations integer solvers."
  ];
  const mistakes = [
    "Handling negative inputs without absolute values.",
    "Direct multiplication a * b causing integer overflows before divisor division."
  ];

  return (
    <NtLayout
      timeComplexity="O(N log(min(A, B)))"
      spaceComplexity="O(1)"
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
                Calculation Results
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 font-mono text-xs text-left">
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground font-semibold">Total GCD:</span>
                <span className="font-bold text-emerald-500">{gcdResult}</span>
              </div>
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground font-semibold">Total LCM:</span>
                <span className="font-bold text-emerald-500">{lcmResult}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                  Step-by-step Trace:
                </span>
                <div className="p-3 bg-muted/20 border border-border/10 rounded-lg max-h-36 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-1">
                  {steps.map((step, idx) => (
                    <div key={idx} className="text-foreground/80">{step}</div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      }
    >
      <NtHeader
        title="GCD & LCM Calculator"
        description="Compute Greatest Common Divisor and Least Common Multiple for a set of values."
        category="Operators"
        difficulty="Easy"
        shortcut="Alt+Shift+6"
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
          <InputField
            label="Enter Integers (space separated)"
            value={inputVal}
            onChange={(val) => {
              setInputVal(val);
              setCompared(false);
            }}
            error={error || undefined}
          />
          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Calculate GCD & LCM
          </Button>
        </CardContent>
      </Card>
    </NtLayout>
  );
}
