"use client";

import * as React from "react";
import { NtHeader } from "../../shared/nt-header";
import { NtLayout } from "../../shared/nt-layout";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export function EulerPhiTool() {
  const [inputVal, setInputVal] = React.useState("9");
  const [compared, setCompared] = React.useState(false);
  const [phiResult, setPhiResult] = React.useState(0);
  const [primesFound, setPrimesFound] = React.useState<number[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handleClear = () => {
    setInputVal("");
    setCompared(false);
    setPhiResult(0);
    setPrimesFound([]);
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
    let result = val;
    let temp = val;
    const basePrimes: number[] = [];

    for (let i = 2; i * i <= temp; i++) {
      if (temp % i === 0) {
        while (temp % i === 0) {
          temp /= i;
        }
        result -= result / i;
        basePrimes.push(i);
      }
    }
    if (temp > 1) {
      result -= result / temp;
      basePrimes.push(temp);
    }

    setPhiResult(result);
    setPrimesFound(basePrimes);
  };

  const definition = "Euler's totient function φ(N) counts positive integers up to N that are relatively prime (coprime) to N (i.e. gcd(i, N) = 1).";
  const formula = "Euler's Product Formula: φ(N) = N * product(1 - 1/p) for each distinct prime divisor p.";
  const example = "For N = 9: distinct prime divisor is 3. φ(9) = 9 * (1 - 1/3) = 9 * (2/3) = 6. Coprimes list: [1, 2, 4, 5, 7, 8].";
  const applications = [
    "Euler's theorem check a^φ(m) ≡ 1 mod m.",
    "RSA cryptography key setup formulas.",
    "Reduced residue systems sizes."
  ];
  const mistakes = [
    "Not dividing N correctly in modular fractions.",
    "Counting duplicate prime factors twice in product terms."
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
                Totient Results
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3 font-mono text-xs text-left">
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground font-semibold">φ({inputVal}):</span>
                <span className="font-bold text-emerald-500">{phiResult}</span>
              </div>
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground">Distinct prime divisors:</span>
                <span className="font-bold text-foreground">[{primesFound.join(", ") || "none"}]</span>
              </div>
              <div className="pt-2">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">
                  Product Formula Expansion:
                </span>
                <div className="p-3 bg-muted/20 border border-border/10 rounded-lg text-[11px] leading-relaxed">
                  φ({inputVal}) = {inputVal} {primesFound.map((p) => `* (1 - 1/${p})`).join(" ")} = {phiResult}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      }
    >
      <NtHeader
        title="Euler Totient Solver"
        description="Compute Euler's Totient function φ(N) values and expand prime products."
        category="Functions"
        difficulty="Medium"
        shortcut="Alt+Shift+0"
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
            Calculate φ(N)
          </Button>
        </CardContent>
      </Card>
    </NtLayout>
  );
}
