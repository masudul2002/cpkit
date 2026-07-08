"use client";

import * as React from "react";
import { NtHeader } from "../../shared/nt-header";
import { NtLayout } from "../../shared/nt-layout";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface FactorPair {
  prime: number;
  power: number;
}

export function FactorizationTool() {
  const [inputVal, setInputVal] = React.useState("360");
  const [compared, setCompared] = React.useState(false);
  const [factors, setFactors] = React.useState<FactorPair[]>([]);
  const [totalPowers, setTotalPowers] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);

  const handleClear = () => {
    setInputVal("");
    setCompared(false);
    setFactors([]);
    setTotalPowers(0);
    setError(null);
  };

  const handleEvaluate = () => {
    setError(null);
    setCompared(false);

    let val = parseInt(inputVal, 10);
    if (isNaN(val) || val < 2 || val > 1000000000) {
      setError("Please enter a valid positive integer between 2 and 10^9");
      return;
    }

    setCompared(true);
    const list: FactorPair[] = [];
    let temp = val;
    let sumPowers = 0;

    for (let i = 2; i * i <= temp; i++) {
      if (temp % i === 0) {
        let count = 0;
        while (temp % i === 0) {
          count++;
          temp /= i;
        }
        list.push({ prime: i, power: count });
        sumPowers += count;
      }
    }

    if (temp > 1) {
      list.push({ prime: temp, power: 1 });
      sumPowers += 1;
    }

    setFactors(list);
    setTotalPowers(sumPowers);
  };

  const definition = "Prime factorization decomposition breaks down any composite integer into a unique set product sequence of prime number factors raised to integer powers.";
  const formula = "Fundamental Theorem of Arithmetic: N = p1^a1 * p2^a2 * ... * pk^ak";
  const example = "For N = 360: 360 = 2^3 × 3^2 × 5^1. Prime powers total exponents sum: 3 + 2 + 1 = 6.";
  const applications = [
    "Divisor counts calculations.",
    "Greatest common divisor matching.",
    "Euler totient product formulas."
  ];
  const mistakes = [
    "Not checking prime division up to sqrt(N) bound correctly.",
    "Infinite loops if dividing divisor decreases value incorrectly."
  ];

  return (
    <NtLayout
      timeComplexity="O(sqrt(N))"
      spaceComplexity="O(log N)"
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
                Factorization Results
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground">Decomposition Form:</span>
                <span className="font-bold text-foreground">
                  {factors.map((f) => `${f.prime}^${f.power}`).join(" × ")}
                </span>
              </div>
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground">Distinct Primes:</span>
                <span className="font-bold text-foreground">{factors.length}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-muted-foreground">Total prime factors (Sum of exponents):</span>
                <span className="font-bold text-foreground">{totalPowers}</span>
              </div>
            </CardContent>
          </Card>
        )
      }
    >
      <NtHeader
        title="Prime Factorization"
        description="Decompose a positive integer N into its constituent prime factor exponents representation."
        category="Decomposition"
        difficulty="Easy"
        shortcut="Alt+Shift+4"
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
            Factorize Integer
          </Button>
        </CardContent>
      </Card>
    </NtLayout>
  );
}
