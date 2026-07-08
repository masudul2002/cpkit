"use client";

import * as React from "react";
import { NtHeader } from "../../shared/nt-header";
import { NtLayout } from "../../shared/nt-layout";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { RotateCcw } from "lucide-react";

export function XorPlaygroundTool() {
  const [mode, setMode] = React.useState<"array" | "range_n">("range_n");
  const [arrayInput, setArrayInput] = React.useState("2 4 8 3 9");
  const [queryL, setQueryL] = React.useState("2");
  const [queryR, setQueryR] = React.useState("4");
  const [lBound, setLBound] = React.useState("5");
  const [rBound, setRBound] = React.useState("12");

  const [compared, setCompared] = React.useState(false);
  const [xorResult, setXorResult] = React.useState(0);
  const [prefixList, setPrefixList] = React.useState<number[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handleClear = () => {
    setArrayInput("2 4 8 3 9");
    setQueryL("2");
    setQueryR("4");
    setLBound("5");
    setRBound("12");
    setCompared(false);
    setXorResult(0);
    setPrefixList([]);
    setError(null);
  };

  const getPrefixXorN = (n: number): number => {
    const rem = n % 4;
    if (rem === 0) return n;
    if (rem === 1) return 1;
    if (rem === 2) return n + 1;
    return 0;
  };

  const handleEvaluate = () => {
    setError(null);
    setCompared(false);

    if (mode === "range_n") {
      const l = parseInt(lBound, 10);
      const r = parseInt(rBound, 10);
      if (isNaN(l) || isNaN(r) || l < 0 || r < l || r > 1000000000) {
        setError("Please enter valid positive bounds where L <= R <= 10^9");
        return;
      }
      setCompared(true);
      const ans = getPrefixXorN(r) ^ getPrefixXorN(l - 1);
      setXorResult(ans);
    } else {
      const tokens = arrayInput.trim().split(/\s+/).filter(Boolean);
      const l = parseInt(queryL, 10);
      const r = parseInt(queryR, 10);

      if (tokens.length === 0) {
        setError("Array input cannot be empty");
        return;
      }

      const nums: number[] = [];
      for (const t of tokens) {
        const val = parseInt(t, 10);
        if (isNaN(val) || val < 0) {
          setError(`Invalid non-negative array integer: "${t}"`);
          return;
        }
        nums.push(val);
      }

      if (isNaN(l) || isNaN(r) || l < 1 || r < l || r > nums.length) {
        setError(`Query bounds [L, R] must be in range 1 to ${nums.length} (1-based index)`);
        return;
      }

      setCompared(true);
      const pref: number[] = [];
      let current = 0;
      for (let i = 0; i < nums.length; i++) {
        current = current ^ nums[i];
        pref.push(current);
      }
      setPrefixList(pref);

      // Range XOR is prefix[R - 1] ^ prefix[L - 2]
      const rVal = pref[r - 1];
      const lVal = l > 1 ? pref[l - 2] : 0;
      setXorResult(rVal ^ lVal);
    }
  };

  const definition = "XOR (exclusive OR) operations satisfy commutative and associative properties. An key CP property is: A ⊕ A = 0 and A ⊕ 0 = A. Prefix XOR allows range queries in O(1) time.";
  const formula = "Range XOR: L ⊕ ... ⊕ R = PrefixXor(R) ⊕ PrefixXor(L - 1). O(1) values 1..N XOR uses modulo 4 cycles.";
  const example = "For integers range [5, 12]: PrefixXor(12) = 12, PrefixXor(4) = 4. Range XOR = 12 ⊕ 4 = 8.";
  const applications = [
    "Range XOR query solvers (Segment tree / Fenwick / Prefix arrays).",
    "Finding the single unique element where other items repeat twice.",
    "Gray code ordering computations."
  ];
  const mistakes = [
    "Incorrect index offsets when evaluating range queries.",
    "Forgetting that 1-based ranges require querying prefix index L-2."
  ];

  return (
    <NtLayout
      timeComplexity="O(1) / O(N)"
      spaceComplexity="O(1) / O(N)"
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
                XOR Results
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3 font-mono text-xs text-left">
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground font-semibold">Range XOR Result:</span>
                <span className="font-bold text-emerald-500">{xorResult}</span>
              </div>
              {mode === "array" && prefixList.length > 0 && (
                <div className="space-y-1">
                  <span className="text-muted-foreground font-semibold">Prefix XOR Array:</span>
                  <div className="p-3 bg-muted/20 border border-border/10 rounded-lg max-h-36 overflow-y-auto font-mono text-[11px] leading-relaxed break-all">
                    [{prefixList.join(", ")}]
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )
      }
    >
      <NtHeader
        title="XOR Playground"
        description="Compute array prefix XORs, range XORs, and evaluate O(1) integer range XOR cycles."
        category="Bits"
        difficulty="Easy"
        shortcut="Alt+Shift+X"
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
          <div className="space-y-1.5 max-w-[200px]">
            <label className="text-xs font-semibold text-foreground/80">Playground Mode</label>
            <Select value={mode} onChange={(e) => setMode(e.target.value as any)}>
              <option value="range_n">Integers Range L..R (O(1))</option>
              <option value="array">Array Prefix/Range XOR</option>
            </Select>
          </div>

          {mode === "range_n" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                label="Lower Limit (L)"
                value={lBound}
                onChange={(val) => {
                  setLBound(val);
                  setCompared(false);
                }}
              />
              <InputField
                label="Upper Limit (R)"
                value={rBound}
                onChange={(val) => {
                  setRBound(val);
                  setCompared(false);
                }}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <InputField
                label="Array Elements (space separated)"
                value={arrayInput}
                onChange={(val) => {
                  setArrayInput(val);
                  setCompared(false);
                }}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField
                  label="Query Left (L) (1-based)"
                  value={queryL}
                  onChange={(val) => {
                    setQueryL(val);
                    setCompared(false);
                  }}
                />
                <InputField
                  label="Query Right (R) (1-based)"
                  value={queryR}
                  onChange={(val) => {
                    setQueryR(val);
                    setCompared(false);
                  }}
                />
              </div>
            </div>
          )}

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Calculate XOR
          </Button>
        </CardContent>
      </Card>
    </NtLayout>
  );
}
