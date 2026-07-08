"use client";

import * as React from "react";
import { NtHeader } from "../../shared/nt-header";
import { NtLayout } from "../../shared/nt-layout";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export function SegmentedSieveTool() {
  const [lowerVal, setLowerVal] = React.useState("90");
  const [upperVal, setUpperVal] = React.useState("150");
  const [compared, setCompared] = React.useState(false);
  const [primes, setPrimes] = React.useState<number[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handleClear = () => {
    setLowerVal("");
    setUpperVal("");
    setCompared(false);
    setPrimes([]);
    setError(null);
  };

  const handleEvaluate = () => {
    setError(null);
    setCompared(false);

    const L = parseInt(lowerVal, 10);
    const R = parseInt(upperVal, 10);

    if (isNaN(L) || isNaN(R) || L < 1 || R < L) {
      setError("Please enter valid positive bounds where L <= R");
      return;
    }

    if (R - L > 100000) {
      setError("Segment range size (R - L) cannot exceed 100,000");
      return;
    }

    if (R > 1000000000) {
      setError("Upper bound R must be at most 10^9");
      return;
    }

    setCompared(true);
    
    // 1. Generate primes up to sqrt(R)
    const limit = Math.floor(Math.sqrt(R));
    const isPrimeSqrt = new Array(limit + 1).fill(true);
    if (limit >= 0) isPrimeSqrt[0] = false;
    if (limit >= 1) isPrimeSqrt[1] = false;

    for (let i = 2; i * i <= limit; i++) {
      if (isPrimeSqrt[i]) {
        for (let j = i * i; j <= limit; j += i) {
          isPrimeSqrt[j] = false;
        }
      }
    }

    const basePrimes: number[] = [];
    for (let i = 2; i <= limit; i++) {
      if (isPrimeSqrt[i]) basePrimes.push(i);
    }

    // 2. Segmented sieve mapping
    const rangeSize = R - L + 1;
    const isPrimeRange = new Array(rangeSize).fill(true);

    if (L === 1) {
      isPrimeRange[0] = false; // 1 is not prime
    }

    for (const p of basePrimes) {
      // Find the first multiple of p >= L
      let start = Math.floor((L + p - 1) / p) * p;
      if (start < p * p) {
        start = p * p; // start from p^2 to avoid marking p itself
      }

      for (let j = start; j <= R; j += p) {
        isPrimeRange[j - L] = false;
      }
    }

    const list: number[] = [];
    for (let i = 0; i < rangeSize; i++) {
      if (isPrimeRange[i]) {
        list.push(L + i);
      }
    }
    setPrimes(list);
  };

  const definition = "Segmented Sieve finds primes in a specific range [L, R] using space proportional only to the square root of R, rather than R itself, saving substantial memory.";
  const formula = "Sieve up to sqrt(R) to collect base primes, then map offset indexes (j - L) for range marking.";
  const example = "For [90, 100], sqrt(100) = 10. Base primes: [2, 3, 5, 7]. Mark multiples: 90, 92.. (by 2), 90, 93.. (by 3), 90, 95.. (by 5), 91, 98 (by 7). Unmarked: 97.";
  const applications = [
    "Range query primes listings.",
    "Counting primes inside large ranges.",
    "Goldbach conjecture validations."
  ];
  const mistakes = [
    "Not handling L = 1 corner case correctly.",
    "Overflow in start offset calculations when L is near 10^9."
  ];

  return (
    <NtLayout
      timeComplexity="O((R - L + 1) log log R + sqrt(R) log log sqrt(R))"
      spaceComplexity="O(R - L + 1 + sqrt(R))"
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
                Sieve Results
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3 text-xs font-mono">
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground">Range Primes Count:</span>
                <span className="font-bold text-foreground">{primes.length}</span>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground font-semibold">Primes in [L, R]:</span>
                <div className="p-3 bg-muted/20 border border-border/10 rounded-lg max-h-36 overflow-y-auto font-mono text-[11px] leading-relaxed break-all">
                  {primes.join(", ") || "No primes in this range."}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      }
    >
      <NtHeader
        title="Segmented Sieve"
        description="Generate prime numbers within a range [L, R] using optimized segmented intervals."
        category="Primes"
        difficulty="Medium"
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
        <CardContent className="p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              label="Lower Bound (L)"
              value={lowerVal}
              onChange={(val) => {
                setLowerVal(val);
                setCompared(false);
              }}
            />
            <InputField
              label="Upper Bound (R)"
              value={upperVal}
              onChange={(val) => {
                setUpperVal(val);
                setCompared(false);
              }}
            />
          </div>

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Run Segmented Sieve
          </Button>
        </CardContent>
      </Card>
    </NtLayout>
  );
}
