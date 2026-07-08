"use client";

import * as React from "react";
import { NtHeader } from "../../shared/nt-header";
import { NtLayout } from "../../shared/nt-layout";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export function SieveTool() {
  const [inputVal, setInputVal] = React.useState("100");
  const [compared, setCompared] = React.useState(false);
  const [primes, setPrimes] = React.useState<number[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handleClear = () => {
    setInputVal("");
    setCompared(false);
    setPrimes([]);
    setError(null);
  };

  const handleEvaluate = () => {
    setError(null);
    setCompared(false);

    const N = parseInt(inputVal, 10);
    if (isNaN(N) || N < 1 || N > 100000) {
      setError("Please enter a valid positive integer up to 100,000");
      return;
    }

    setCompared(true);
    const isPrime = new Array(N + 1).fill(true);
    isPrime[0] = isPrime[1] = false;

    for (let i = 2; i * i <= N; i++) {
      if (isPrime[i]) {
        for (let j = i * i; j <= N; j += i) {
          isPrime[j] = false;
        }
      }
    }

    const list: number[] = [];
    for (let i = 2; i <= N; i++) {
      if (isPrime[i]) list.push(i);
    }
    setPrimes(list);
  };

  const definition = "The Sieve of Eratosthenes is an ancient algorithm for finding all prime numbers up to any given limit by iteratively marking composites.";
  const formula = "Mark multiples of each prime i starting from i^2 up to N.";
  const example = "For N = 10: Primes list: [2, 3, 5, 7]. 4 primes found.";
  const applications = [
    "Fast prime generation for offline queries.",
    "Preprocessing prime factor limits.",
    "Euler totient precomputations."
  ];
  const mistakes = [
    "Declaring sieves exceeding memory capacities.",
    "Failing to offset composite index checks correctly."
  ];

  return (
    <NtLayout
      timeComplexity="O(N log log N)"
      spaceComplexity="O(N)"
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
            <CardContent className="p-6 space-y-3 text-xs">
              <div className="flex justify-between border-b border-border/5 pb-1 font-mono">
                <span className="text-muted-foreground">Primes Count:</span>
                <span className="font-bold text-foreground">{primes.length}</span>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground font-semibold">Primes List:</span>
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
        title="Sieve of Eratosthenes"
        description="Generate all prime numbers up to a specified limit N using Eratosthenes sieve algorithm."
        category="Primes"
        difficulty="Easy"
        shortcut="Alt+Shift+2"
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
            label="Enter Limit (N <= 100,000)"
            value={inputVal}
            onChange={(val) => {
              setInputVal(val);
              setCompared(false);
            }}
            error={error || undefined}
          />
          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Run Sieve Algorithm
          </Button>
        </CardContent>
      </Card>
    </NtLayout>
  );
}
