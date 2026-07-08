"use client";

import * as React from "react";
import { NtHeader } from "../../shared/nt-header";
import { NtLayout } from "../../shared/nt-layout";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export function ModularExponentiationTool() {
  const [baseVal, setBaseVal] = React.useState("2");
  const [powerVal, setPowerVal] = React.useState("10");
  const [modVal, setModVal] = React.useState("1000000007");

  const [compared, setCompared] = React.useState(false);
  const [result, setResult] = React.useState<number | null>(null);
  const [steps, setSteps] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handleClear = () => {
    setBaseVal("");
    setPowerVal("");
    setModVal("");
    setCompared(false);
    setResult(null);
    setSteps([]);
    setError(null);
  };

  const handleEvaluate = () => {
    setError(null);
    setCompared(false);
    setSteps([]);

    let base = parseInt(baseVal, 10);
    let power = parseInt(powerVal, 10);
    let mod = parseInt(modVal, 10);

    if (isNaN(base) || isNaN(power) || isNaN(mod) || power < 0 || mod < 1) {
      setError("Base must be an integer, power >= 0, and mod >= 1");
      return;
    }

    setCompared(true);
    const trace: string[] = [];

    let currentBase = base % mod;
    let currentPower = power;
    let res = 1;

    trace.push(`• Initial state: base = ${currentBase}, power = ${currentPower}, product = ${res}`);

    while (currentPower > 0) {
      if (currentPower % 2 === 1) {
        const prevRes = res;
        res = (res * currentBase) % mod;
        trace.push(`  - Power ${currentPower} is odd. Multiply: (${prevRes} * ${currentBase}) % ${mod} = ${res}`);
      } else {
        trace.push(`  - Power ${currentPower} is even. Skip multiply.`);
      }
      
      const prevBase = currentBase;
      currentBase = (currentBase * currentBase) % mod;
      currentPower = Math.floor(currentPower / 2);
      
      if (currentPower > 0) {
        trace.push(`  - Square base: (${prevBase} * ${prevBase}) % ${mod} = ${currentBase}. Halve power to ${currentPower}`);
      }
    }

    setResult(res);
    setSteps(trace);
  };

  const definition = "Modular exponentiation calculates (base^power) % mod using binary exponentiation, which reduces multiplication steps to logarithmic limits.";
  const formula = "Binary Exponentiation: a^b = (a^(b/2))^2 for even b; a * a^(b-1) for odd b.";
  const example = "2^10 mod 1000 = 1024 mod 1000 = 24. Resolves in 4 squaring passes.";
  const applications = [
    "Modular multiplication inverse checks.",
    "RSA cryptography key decryptions.",
    "Fast matrix exponentiation builders."
  ];
  const mistakes = [
    "Failing to mod the base at start, causing initial value overflows.",
    "Modulus division-by-zero checks."
  ];

  return (
    <NtLayout
      timeComplexity="O(log(power))"
      spaceComplexity="O(1)"
      definition={definition}
      formula={formula}
      example={example}
      applications={applications}
      mistakes={mistakes}
      resultChild={
        compared && result !== null && (
          <Card className="border-border/40 bg-card/65 shadow-xs">
            <CardHeader className="pb-2 border-b border-border/10">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Exponentiation Results
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 font-mono text-xs text-left">
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground font-semibold">Final Modulo Value:</span>
                <span className="font-bold text-emerald-500">{result}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                  Exponentiation Steps:
                </span>
                <div className="p-3 bg-muted/20 border border-border/10 rounded-lg max-h-48 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-1">
                  {steps.map((step, idx) => (
                    <div key={idx} className="text-foreground/80 whitespace-pre">{step}</div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      }
    >
      <NtHeader
        title="Modular Exponentiation"
        description="Compute modular powers (A^B) % M in logarithmic time steps."
        category="Operators"
        difficulty="Easy"
        shortcut="Alt+Shift+8"
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
          <div className="grid gap-4 sm:grid-cols-3">
            <InputField
              label="Base (A)"
              value={baseVal}
              onChange={(val) => {
                setBaseVal(val);
                setCompared(false);
              }}
            />
            <InputField
              label="Power (B)"
              value={powerVal}
              onChange={(val) => {
                setPowerVal(val);
                setCompared(false);
              }}
            />
            <InputField
              label="Modulus (M)"
              value={modVal}
              onChange={(val) => {
                setModVal(val);
                setCompared(false);
              }}
            />
          </div>
          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Run Fast Exponentiation
          </Button>
        </CardContent>
      </Card>
    </NtLayout>
  );
}
