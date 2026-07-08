"use client";

import * as React from "react";
import { StHeader } from "../../shared/st-header";
import { StLayout } from "../../shared/st-layout";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { RotateCcw } from "lucide-react";

export function RollingHashTool() {
  const [valA, setValA] = React.useState("abc");
  const [valB, setValB] = React.useState("abc");
  const [baseVal, setBaseVal] = React.useState("31");
  const [modVal, setModVal] = React.useState("1000000007");

  const [compared, setCompared] = React.useState(false);
  const [hashA, setHashA] = React.useState<number | null>(null);
  const [hashB, setHashB] = React.useState<number | null>(null);
  const [isMatch, setIsMatch] = React.useState(false);
  const [isCollision, setIsCollision] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleClear = () => {
    setValA("");
    setValB("");
    setCompared(false);
    setHashA(null);
    setHashB(null);
    setIsMatch(false);
    setIsCollision(false);
    setError(null);
  };

  const getHash = (s: string, p: number, m: number): number => {
    let hash = 0;
    let power = 1;
    for (let i = 0; i < s.length; i++) {
      const code = s.charCodeAt(i) - 96; // 1-based character code for lower alphabets
      hash = (hash + code * power) % m;
      power = (power * p) % m;
    }
    return hash;
  };

  const handleEvaluate = () => {
    setError(null);
    setCompared(false);

    if (valA.length === 0 || valB.length === 0) {
      setError("Please enter non-empty strings");
      return;
    }

    const p = parseInt(baseVal, 10);
    const m = parseInt(modVal, 10);

    if (isNaN(p) || isNaN(m)) {
      setError("Invalid base or mod parameter");
      return;
    }

    setCompared(true);
    const hA = getHash(valA, p, m);
    const hB = getHash(valB, p, m);

    setHashA(hA);
    setHashB(hB);
    setIsMatch(hA === hB);
    setIsCollision(hA === hB && valA !== valB);
  };

  const definition = "Polynomial rolling hash computes a modular integer checksum of a string using a base coefficient prime p and a large modulus m. It enables fast string comparisons.";
  const formula = "Hash(S) = sum(S[i] * p^i) mod m. Modulo arithmetic ensures hashes fit in integer registers.";
  const example = "For 'abc' with p=31, m=10^9+7: Hash = (1*31^0 + 2*31^1 + 3*31^2) = 1 + 62 + 2883 = 2946.";
  const applications = [
    "Rabin-Karp pattern searching in O(N + M) time.",
    "Palindromic substring detection via forward-backward hashes comparison.",
    "Checking suffix-prefix matching in O(1)."
  ];
  const mistakes = [
    "Not using prime values for base p, increasing hash collision probabilities.",
    "Integer overflow bounds errors prior to modular division evaluations."
  ];
  const cpTips = [
    "To fully protect against hashing hacks in Codeforces, use a double hash (a pair of hashes using two different mod values like 10^9+7 and 10^9+9)."
  ];

  return (
    <StLayout
      timeComplexity="O(N)"
      spaceComplexity="O(1)"
      definition={definition}
      formula={formula}
      example={example}
      applications={applications}
      mistakes={mistakes}
      cpTips={cpTips}
      resultChild={
        compared && hashA !== null && hashB !== null && (
          <Card className="border-border/40 bg-card/65 shadow-xs">
            <CardHeader className="pb-2 border-b border-border/10">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Hashing Results
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3 font-mono text-xs text-left">
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground">Hash value A:</span>
                <span className="font-bold text-foreground">{hashA}</span>
              </div>
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground">Hash value B:</span>
                <span className="font-bold text-foreground">{hashB}</span>
              </div>
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground">Do hashes match?</span>
                <span className={`font-bold ${isMatch ? "text-emerald-500" : "text-rose-500"}`}>
                  {isMatch ? "MATCH" : "NO MATCH"}
                </span>
              </div>

              {isCollision && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-500 font-sans leading-relaxed text-xs">
                  ⚠️ <strong>Collision Alert!</strong> Both strings share hash {hashA} but contain different characters. Increase base values or change moduli.
                </div>
              )}
            </CardContent>
          </Card>
        )
      }
    >
      <StHeader
        title="Rolling Hash"
        description="Compute polynomial rolling checksum hashes of strings and audit for mathematical collisions."
        category="Hashing"
        difficulty="Medium"
        shortcut="Alt+Shift+O"
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
              label="String A"
              value={valA}
              onChange={(val) => {
                setValA(val);
                setCompared(false);
              }}
              error={error || undefined}
            />
            <InputField
              label="String B"
              value={valB}
              onChange={(val) => {
                setValB(val);
                setCompared(false);
              }}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">Base Prime (p)</label>
              <Select value={baseVal} onChange={(e) => { setBaseVal(e.target.value); setCompared(false); }}>
                <option value="31">31 (Lowercase English)</option>
                <option value="53">53 (Mixed-case English)</option>
                <option value="97">97 (Larger alphabet set)</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">Modulus (m)</label>
              <Select value={modVal} onChange={(e) => { setModVal(e.target.value); setCompared(false); }}>
                <option value="1000000007">10^9 + 7</option>
                <option value="1000000009">10^9 + 9</option>
                <option value="998244353">998,244,353</option>
              </Select>
            </div>
          </div>

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Run Hashing Checks
          </Button>
        </CardContent>
      </Card>
    </StLayout>
  );
}
