"use client";

import * as React from "react";
import { NtHeader } from "../../shared/nt-header";
import { NtLayout } from "../../shared/nt-layout";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export function DivisorsTool() {
  const [inputVal, setInputVal] = React.useState("12");
  const [compared, setCompared] = React.useState(false);
  const [divisors, setDivisors] = React.useState<number[]>([]);
  const [divisorSum, setDivisorSum] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);

  const handleClear = () => {
    setInputVal("");
    setCompared(false);
    setDivisors([]);
    setDivisorSum(0);
    setError(null);
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
    const list: number[] = [];
    let sum = 0;

    for (let i = 1; i * i <= val; i++) {
      if (val % i === 0) {
        list.push(i);
        sum += i;
        if (i * i !== val) {
          list.push(val / i);
          sum += val / i;
        }
      }
    }

    list.sort((a, b) => a - b);
    setDivisors(list);
    setDivisorSum(sum);
  };

  const definition = "A divisor of N is an integer which divides N without leaving a remainder. The sum of divisors counts all natural numbers dividing N.";
  const formula = "Iterate i from 1 to sqrt(N). If N % i == 0, add both i and N / i to the divisors list.";
  const example = "For N = 12: Divisors are [1, 2, 3, 4, 6, 12]. Count: 6. Sum: 28.";
  const applications = [
    "Perfect number checks.",
    "Highly composite numbers listings.",
    "Sum divisor DP preprocessing."
  ];
  const mistakes = [
    "Adding sqrt(N) twice when N is a perfect square.",
    "Incomplete divisor collections when loop exits before sqrt(N) exactly."
  ];

  return (
    <NtLayout
      timeComplexity="O(sqrt(N))"
      spaceComplexity="O(sqrt(N))"
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
                Divisors Results
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3 text-xs font-mono">
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground">Number of Divisors:</span>
                <span className="font-bold text-foreground">{divisors.length}</span>
              </div>
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground">Sum of Divisors:</span>
                <span className="font-bold text-foreground">{divisorSum}</span>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground font-semibold">Sorted Divisors:</span>
                <div className="p-3 bg-muted/20 border border-border/10 rounded-lg max-h-36 overflow-y-auto font-mono text-[11px] leading-relaxed break-all">
                  {divisors.join(", ")}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      }
    >
      <NtHeader
        title="Divisors Calculator"
        description="Compute all divisors, their total count, and their summation for N."
        category="Decomposition"
        difficulty="Easy"
        shortcut="Alt+Shift+5"
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
            Calculate Divisors
          </Button>
        </CardContent>
      </Card>
    </NtLayout>
  );
}
