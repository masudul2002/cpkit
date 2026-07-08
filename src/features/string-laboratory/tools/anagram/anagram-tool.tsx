"use client";

import * as React from "react";
import { StHeader } from "../../shared/st-header";
import { StLayout } from "../../shared/st-layout";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export function AnagramTool() {
  const [valA, setValA] = React.useState("listen");
  const [valB, setValB] = React.useState("silent");

  const [compared, setCompared] = React.useState(false);
  const [isAnagram, setIsAnagram] = React.useState(false);
  const [diffMap, setDiffMap] = React.useState<{ char: string; countA: number; countB: number }[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handleClear = () => {
    setValA("");
    setValB("");
    setCompared(false);
    setDiffMap([]);
    setError(null);
  };

  const handleEvaluate = () => {
    setError(null);
    setCompared(false);

    if (valA.length === 0 || valB.length === 0) {
      setError("Please enter non-empty strings");
      return;
    }

    setCompared(true);

    const countA: Record<string, number> = {};
    const countB: Record<string, number> = {};

    for (const c of valA) countA[c] = (countA[c] || 0) + 1;
    for (const c of valB) countB[c] = (countB[c] || 0) + 1;

    // Verify anagram status
    let ok = valA.length === valB.length;
    const allChars = Array.from(new Set([...Object.keys(countA), ...Object.keys(countB)]));

    const diffList: typeof diffMap = [];

    for (const c of allChars) {
      const aVal = countA[c] || 0;
      const bVal = countB[c] || 0;
      if (aVal !== bVal) {
        ok = false;
      }
      diffList.push({ char: c, countA: aVal, countB: bVal });
    }

    setIsAnagram(ok);
    setDiffMap(diffList.sort((x, y) => x.char.localeCompare(y.char)));
  };

  const definition = "Two strings are anagrams if they contain the exact same set of characters with identical frequencies, rearranged in a different order.";
  const formula = "Verify: StringA.length == StringB.length AND freqCount(StringA) == freqCount(StringB).";
  const example = "For 'listen' and 'silent': all characters ('l', 'i', 's', 't', 'e', 'n') appear exactly once in both, making them anagrams.";
  const applications = [
    "Cyclic shift equivalence problems.",
    "Lexicographical sorting checks.",
    "Anagram grouping (using sorted strings as map keys)."
  ];
  const mistakes = [
    "Forgetting that spaces or casing differences count as mismatches unless stripped first.",
    "Assuming equal distinct character sets guarantees anagram status (powers/frequencies must match!)."
  ];

  return (
    <StLayout
      timeComplexity="O(N + M)"
      spaceComplexity="O(U) unique character table"
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
                Anagram Check Result
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 font-mono text-xs text-left">
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground">Verdict:</span>
                <span className={`font-bold ${isAnagram ? "text-emerald-500" : "text-rose-500"}`}>
                  {isAnagram ? "ANAGRAMS" : "NOT ANAGRAMS"}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-muted-foreground font-semibold">Character Frequency Comparison:</span>
                <div className="p-3 bg-muted/20 border border-border/10 rounded-lg max-h-48 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-2">
                  {diffMap.map((d) => {
                    const diff = Math.abs(d.countA - d.countB);
                    return (
                      <div key={d.char} className="flex justify-between items-center text-foreground/80 border-b border-border/5 pb-1">
                        <span>'{d.char}':</span>
                        <span className="flex gap-2 items-center">
                          <span>A: <strong className="text-primary">{d.countA}</strong></span>
                          <span>B: <strong className="text-amber-500">{d.countB}</strong></span>
                          {diff > 0 && <span className="text-rose-500 text-[10px] font-bold">(diff: {diff})</span>}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      }
    >
      <StHeader
        title="Anagram Checker"
        description="Verify if two strings are anagrams of each other and compare character frequency distribution side-by-side."
        category="Basic"
        difficulty="Easy"
        shortcut="Alt+Shift+T"
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
          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Check Anagram
          </Button>
        </CardContent>
      </Card>
    </StLayout>
  );
}
