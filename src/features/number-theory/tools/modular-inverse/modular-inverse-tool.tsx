"use client";

import * as React from "react";
import { NtHeader } from "../../shared/nt-header";
import { NtLayout } from "../../shared/nt-layout";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { RotateCcw } from "lucide-react";

export function ModularInverseTool() {
  const [valA, setValA] = React.useState("3");
  const [valM, setValM] = React.useState("11");
  const [algorithm, setAlgorithm] = React.useState<"euclid" | "fermat">("euclid");

  const [compared, setCompared] = React.useState(false);
  const [inverse, setInverse] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleClear = () => {
    setValA("");
    setValM("");
    setCompared(false);
    setInverse(null);
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

  const modPow = (base: number, exp: number, mod: number): number => {
    let res = 1;
    let b = base % mod;
    let e = exp;
    while (e > 0) {
      if (e % 2 === 1) res = (res * b) % mod;
      b = (b * b) % mod;
      e = Math.floor(e / 2);
    }
    return res;
  };

  const isPrime = (n: number): boolean => {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    for (let i = 5; i * i <= n; i += 6) {
      if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    return true;
  };

  const handleEvaluate = () => {
    setError(null);
    setCompared(false);

    const a = parseInt(valA, 10);
    const m = parseInt(valM, 10);

    if (isNaN(a) || isNaN(m) || a < 1 || m < 1) {
      setError("Please enter valid positive values");
      return;
    }

    if (getGcd(a, m) !== 1) {
      setError(`GCD(${a}, ${m}) = ${getGcd(a, m)} !== 1. Modular inverse does not exist.`);
      return;
    }

    setCompared(true);

    if (algorithm === "fermat") {
      if (!isPrime(m)) {
        setError(`Fermat's Little Theorem requires Modulus ${m} to be prime. Fallback calculations run below.`);
      }
      // a^(m-2) mod m
      const res = modPow(a, m - 2, m);
      setInverse(res);
    } else {
      const res = extGcd(a, m);
      const inv = ((res.x % m) + m) % m;
      setInverse(inv);
    }
  };

  const definition = "Modular Multiplicative Inverse is an integer x satisfying: ax ≡ 1 mod m. It exists if and only if a and m are coprime (gcd(a, m) = 1).";
  const formula = "Extended Euclid: ax + my = 1 => ax ≡ 1 mod m. Fermat's Little Theorem: a^(m-2) ≡ a^-1 mod m (if m is prime).";
  const example = "For a=3, m=11: 3 * 4 = 12 ≡ 1 mod 11. Inverse is 4.";
  const applications = [
    "Modular division in combinatorics (nCr % mod).",
    "RSA cryptography key setup decryptions.",
    "Solving system congruences."
  ];
  const mistakes = [
    "Trying to inverse numbers when gcd(a, m) != 1.",
    "Applying Fermat's Little Theorem on non-prime moduli."
  ];

  return (
    <NtLayout
      timeComplexity="O(log M)"
      spaceComplexity="O(log M)"
      definition={definition}
      formula={formula}
      example={example}
      applications={applications}
      mistakes={mistakes}
      resultChild={
        compared && inverse !== null && (
          <Card className="border-border/40 bg-card/65 shadow-xs">
            <CardHeader className="pb-2 border-b border-border/10">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Inverse Results
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3 font-mono text-xs text-left">
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground font-semibold">Modular Inverse (x):</span>
                <span className="font-bold text-emerald-500">{inverse}</span>
              </div>
              <div className="pt-2">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">
                  Congruence Relation Proof:
                </span>
                <div className="p-3 bg-muted/20 border border-border/10 rounded-lg text-[11px] leading-relaxed">
                  ({valA} * {inverse}) mod {valM} = {((parseInt(valA, 10) * inverse) % parseInt(valM, 10))} ≡ 1 mod {valM}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      }
    >
      <NtHeader
        title="Modular Inverse Solver"
        description="Calculate modular multiplicative inverses using Extended Euclid or Fermat's Little Theorem."
        category="Modulus"
        difficulty="Medium"
        shortcut="Alt+Shift+9"
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
              label="Integer (A)"
              value={valA}
              onChange={(val) => {
                setValA(val);
                setCompared(false);
              }}
            />
            <InputField
              label="Modulus (M)"
              value={valM}
              onChange={(val) => {
                setValM(val);
                setCompared(false);
              }}
            />
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">Algorithm Method</label>
              <Select value={algorithm} onChange={(e) => setAlgorithm(e.target.value as any)}>
                <option value="euclid">Extended Euclid (Any Modulus)</option>
                <option value="fermat">Fermat (Prime Modulus)</option>
              </Select>
            </div>
          </div>
          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Calculate Inverse
          </Button>
        </CardContent>
      </Card>
    </NtLayout>
  );
}
