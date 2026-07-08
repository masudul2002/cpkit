"use client";

import * as React from "react";
import { NtHeader } from "../../shared/nt-header";
import { NtLayout } from "../../shared/nt-layout";
import { InputEditor } from "@/features/debug-tools/shared/input-editor";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export function CrtTool() {
  const [inputVal, setInputVal] = React.useState("2 3\n3 5\n2 7");
  const [compared, setCompared] = React.useState(false);
  const [solution, setSolution] = React.useState<number | null>(null);
  const [modulus, setModulus] = React.useState<number | null>(null);
  const [steps, setSteps] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handleClear = () => {
    setInputVal("");
    setCompared(false);
    setSolution(null);
    setModulus(null);
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

  const extGcd = (a: number, b: number): { gcd: number; x: number; y: number } => {
    if (b === 0) return { gcd: a, x: 1, y: 0 };
    const res = extGcd(b, a % b);
    return {
      gcd: res.gcd,
      x: res.y,
      y: res.x - Math.floor(a / b) * res.y,
    };
  };

  const modInverse = (a: number, m: number): number => {
    const res = extGcd(a, m);
    return ((res.x % m) + m) % m;
  };

  const handleEvaluate = () => {
    setError(null);
    setCompared(false);
    setSteps([]);

    const lines = inputVal.trim().split(/\n/).filter(Boolean);
    if (lines.length < 2) {
      setError("Please enter at least 2 congruence equations (rows)");
      return;
    }

    const equations: { a: number; m: number }[] = [];
    for (let i = 0; i < lines.length; i++) {
      const tokens = lines[i].trim().split(/\s+/).filter(Boolean);
      if (tokens.length !== 2) {
        setError(`Line ${i + 1} must contain exactly 'a' and 'm': "${lines[i]}"`);
        return;
      }
      const a = parseInt(tokens[0], 10);
      const m = parseInt(tokens[1], 10);

      if (isNaN(a) || isNaN(m) || m < 2) {
        setError(`Invalid parameters on line ${i + 1}: a=${tokens[0]}, m=${tokens[1]}`);
        return;
      }
      equations.push({ a: a % m, m });
    }

    // Verify coprimality of moduli pairwise
    for (let i = 0; i < equations.length; i++) {
      for (let j = i + 1; j < equations.length; j++) {
        if (getGcd(equations[i].m, equations[j].m) !== 1) {
          setError(`Moduli are not pairwise coprime: gcd(${equations[i].m}, ${equations[j].m}) !== 1`);
          return;
        }
      }
    }

    setCompared(true);
    const trace: string[] = [];

    // Calculate total Modulus M
    let M = 1;
    for (const eq of equations) M *= eq.m;
    trace.push(`• Total Modulus M = product(m_i) = ${equations.map((e) => e.m).join(" × ")} = ${M}`);

    let x = 0;
    for (let i = 0; i < equations.length; i++) {
      const eq = equations[i];
      const Mi = M / eq.m;
      const Ni = modInverse(Mi, eq.m);
      const term = eq.a * Mi * Ni;
      x = (x + term) % M;

      trace.push(
        `  - Eq ${i + 1} (x ≡ ${eq.a} mod ${eq.m}): M_${i + 1} = ${M}/${eq.m} = ${Mi}. Inverse N_${i + 1} = ${Mi}^-1 mod ${eq.m} = ${Ni}. Term = ${eq.a}*${Mi}*${Ni} = ${term}`
      );
    }

    const finalX = ((x % M) + M) % M;
    trace.push(`• Sum terms mod M = ${x} ≡ ${finalX} mod ${M}`);

    setSolution(finalX);
    setModulus(M);
    setSteps(trace);
  };

  const definition = "Chinese Remainder Theorem (CRT) states that if one knows the remainders of a division of an integer n by several pairwise coprime integers, then the remainder of the division of n by the product of these integers is uniquely determined.";
  const formula = "Formula: x = sum(a_i * M_i * N_i) mod M, where M_i = M/m_i and N_i = M_i^-1 mod m_i.";
  const example = "For x ≡ 2 mod 3, x ≡ 3 mod 5, x ≡ 2 mod 7. Solution is 23 mod 105.";
  const applications = [
    "Large modulus arithmetic solvers.",
    "Bivector index mapping grids.",
    "RSA cryptography decryption speedups."
  ];
  const mistakes = [
    "Failing to verify moduli are pairwise coprime.",
    "Multiplication overflows during modular sum checks."
  ];

  return (
    <NtLayout
      timeComplexity="O(K log M)"
      spaceComplexity="O(K)"
      definition={definition}
      formula={formula}
      example={example}
      applications={applications}
      mistakes={mistakes}
      resultChild={
        compared && solution !== null && modulus !== null && (
          <Card className="border-border/40 bg-card/65 shadow-xs">
            <CardHeader className="pb-2 border-b border-border/10">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                CRT Results
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 font-mono text-xs text-left">
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground font-semibold">Solution (x):</span>
                <span className="font-bold text-emerald-500">{solution}</span>
              </div>
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground font-semibold">Modulus (M):</span>
                <span className="font-bold text-foreground">{modulus}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                  Intermediate Calculations:
                </span>
                <div className="p-3 bg-muted/20 border border-border/10 rounded-lg max-h-48 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-1">
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
        title="Chinese Remainder Theorem"
        description="Solve systems of simultaneous congruences for pairwise coprime moduli."
        category="Modulus"
        difficulty="Hard"
        shortcut="Alt+Shift+C"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs">
        <CardHeader className="flex flex-row justify-between items-center pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Congruences (Enter 'a m' per line)
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
          <InputEditor
            label="Congruence System Equations"
            value={inputVal}
            onChange={(val) => {
              setInputVal(val);
              setCompared(false);
            }}
            placeholder="e.g. 2 3 (means x ≡ 2 mod 3)"
            rows={5}
          />
          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Solve Congruences System
          </Button>
        </CardContent>
      </Card>
    </NtLayout>
  );
}
