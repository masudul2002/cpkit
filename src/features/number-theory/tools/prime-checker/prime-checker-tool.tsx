"use client";

import * as React from "react";
import { NtHeader } from "../../shared/nt-header";
import { NtLayout } from "../../shared/nt-layout";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export function PrimeCheckerTool() {
  const [inputVal, setInputVal] = React.useState("97");
  const [compared, setCompared] = React.useState(false);
  const [isPrime, setIsPrime] = React.useState<boolean | null>(null);
  const [nearest, setNearest] = React.useState<number | null>(null);
  const [factors, setFactors] = React.useState<number[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handleClear = () => {
    setInputVal("");
    setCompared(false);
    setIsPrime(null);
    setNearest(null);
    setFactors([]);
    setError(null);
  };

  const checkPrimality = (n: number): boolean => {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    for (let i = 5; i * i <= n; i += 6) {
      if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    return true;
  };

  const getNearestPrime = (n: number): number => {
    if (n <= 2) return 2;
    let lower = n;
    let upper = n;
    while (lower > 1) {
      if (checkPrimality(lower)) return lower;
      lower--;
    }
    while (true) {
      if (checkPrimality(upper)) return upper;
      upper++;
    }
  };

  const getFactors = (n: number): number[] => {
    const list: number[] = [];
    let temp = n;
    for (let i = 2; i * i <= temp; i++) {
      while (temp % i === 0) {
        list.push(i);
        temp /= i;
      }
    }
    if (temp > 1) list.push(temp);
    return list;
  };

  const handleEvaluate = () => {
    setError(null);
    setCompared(false);

    const val = parseInt(inputVal, 10);
    if (isNaN(val) || val < 1 || val > 1000000000) {
      setError("Please enter a valid positive integer up to 10^9");
      return;
    }

    setCompared(true);
    const res = checkPrimality(val);
    setIsPrime(res);
    setNearest(getNearestPrime(val));
    setFactors(getFactors(val));
  };

  const definition = "A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself. A composite number has other positive divisors.";
  const formula = "Trial Division Algorithm: Check divisors up to sqrt(N) using 6k +/- 1 optimizations.";
  const example = "For N = 97, sqrt(97) ≈ 9.8. Checking divisors 2, 3, 5, 7. None divide 97, so 97 is prime.";
  const applications = [
    "Used in RSA cryptography key generations.",
    "Hashing function prime moduli selection.",
    "Divisor counts and modular arithmetic algorithms."
  ];
  const mistakes = [
    "Handling values <= 1 (they are neither prime nor composite).",
    "Failing to check sqrt(N) boundaries correctly causing TLE errors."
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
                Primality Results
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground">Verdict:</span>
                <span className={`font-bold ${isPrime ? "text-emerald-500" : "text-rose-500"}`}>
                  {isPrime ? "PRIME" : "COMPOSITE"}
                </span>
              </div>
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground">Nearest Prime:</span>
                <span className="font-bold text-foreground">{nearest}</span>
              </div>
              {!isPrime && factors.length > 0 && (
                <div className="flex justify-between pb-1">
                  <span className="text-muted-foreground">Prime Factors:</span>
                  <span className="font-bold text-foreground">{factors.join(" × ")}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )
      }
    >
      <NtHeader
        title="Prime Checker"
        description="Verify if a number is prime or composite, locate nearest primes, and check prime factors."
        category="Primes"
        difficulty="Easy"
        shortcut="Alt+Shift+1"
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
            Check Primality
          </Button>
        </CardContent>
      </Card>
    </NtLayout>
  );
}
