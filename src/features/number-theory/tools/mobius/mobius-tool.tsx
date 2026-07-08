"use client";

import * as React from "react";
import { NtHeader } from "../../shared/nt-header";
import { NtLayout } from "../../shared/nt-layout";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export function MobiusTool() {
  const [inputVal, setInputVal] = React.useState("30");
  const [compared, setCompared] = React.useState(false);
  const [mobiusResult, setMobiusResult] = React.useState(0);
  const [primesCount, setPrimesCount] = React.useState(0);
  const [hasSquareFactor, setHasSquareFactor] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleClear = () => {
    setInputVal("");
    setCompared(false);
    setMobiusResult(0);
    setPrimesCount(0);
    setHasSquareFactor(false);
    setError(null);
  };

  const handleEvaluate = () => {
    setError(null);
    setCompared(false);

    let val = parseInt(inputVal, 10);
    if (isNaN(val) || val < 1 || val > 1000000000) {
      setError("Please enter a valid positive integer up to 10^9");
      return;
    }

    setCompared(true);
    let temp = val;
    let pCount = 0;
    let squareFree = true;

    for (let i = 2; i * i <= temp; i++) {
      if (temp % i === 0) {
        pCount++;
        let count = 0;
        while (temp % i === 0) {
          count++;
          temp /= i;
        }
        if (count > 1) {
          squareFree = false;
        }
      }
    }

    if (temp > 1) {
      pCount++;
    }

    setPrimesCount(pCount);
    setHasSquareFactor(!squareFree);

    if (!squareFree) {
      setMobiusResult(0);
    } else {
      setMobiusResult(pCount % 2 === 0 ? 1 : -1);
    }
  };

  const definition = "The Möbius function μ(N) is an important multiplicative function in number theory, evaluating to 1, -1, or 0 depending on the prime factorization of N.";
  const formula = "μ(N) = 1 if N square-free with even prime factors; -1 if odd prime factors; 0 if N is divisible by a prime square.";
  const example = "For N = 30: 30 = 2 * 3 * 5. Distinct prime factors = 3 (odd). Square-free. μ(30) = -1.";
  const applications = [
    "Möbius inversion formula applications.",
    "Coprime pair count listings.",
    "Dirichlet convolutions conversions."
  ];
  const mistakes = [
    "Not flagging division by squares (e.g. 4, 9, 25) correctly.",
    "Sign calculation errors on large factor offsets."
  ];

  return (
    <NtLayout
      timeComplexity="O(sqrt(N))"
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
                Möbius Results
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3 font-mono text-xs text-left">
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground font-semibold">μ({inputVal}):</span>
                <span className={`font-bold ${mobiusResult === 1 ? "text-emerald-500" : mobiusResult === -1 ? "text-amber-500" : "text-rose-500"}`}>
                  {mobiusResult}
                </span>
              </div>
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground">Square-free status:</span>
                <span className="font-bold text-foreground">{hasSquareFactor ? "No (Divisible by p^2)" : "Yes"}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-muted-foreground">Number of prime factors:</span>
                <span className="font-bold text-foreground">{primesCount}</span>
              </div>
            </CardContent>
          </Card>
        )
      }
    >
      <NtHeader
        title="Möbius Function Solver"
        description="Compute Möbius μ(N) values and determine square-free prime counts."
        category="Functions"
        difficulty="Medium"
        shortcut="Alt+Shift+H"
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
            label="Enter Integer (N <= 10^9)"
            value={inputVal}
            onChange={(val) => {
              setInputVal(val);
              setCompared(false);
            }}
            error={error || undefined}
          />
          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Calculate μ(N)
          </Button>
        </CardContent>
      </Card>
    </NtLayout>
  );
}
