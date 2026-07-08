"use client";

import * as React from "react";
import { StHeader } from "../../shared/st-header";
import { StLayout } from "../../shared/st-layout";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export function ZFunctionTool() {
  const [inputVal, setInputVal] = React.useState("aaaaa");
  const [compared, setCompared] = React.useState(false);
  const [zArray, setZArray] = React.useState<number[]>([]);
  const [steps, setSteps] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handleClear = () => {
    setInputVal("");
    setCompared(false);
    setZArray([]);
    setSteps([]);
    setError(null);
  };

  const handleEvaluate = () => {
    setError(null);
    setCompared(false);
    setSteps([]);

    if (inputVal.length === 0) {
      setError("Please enter a non-empty string");
      return;
    }

    setCompared(true);
    const N = inputVal.length;
    const z = new Array(N).fill(0);
    const trace: string[] = [];

    let l = 0;
    let r = 0;
    trace.push(`• Initial state: search window bounds [l, r] = [0, 0]`);

    for (let i = 1; i < N; i++) {
      trace.push(`- Index ${i} ('${inputVal[i]}'): current window [l, r] = [${l}, ${r}]`);
      if (i <= r) {
        const offset = z[i - l];
        const remaining = r - i + 1;
        z[i] = Math.min(remaining, offset);
        trace.push(`  * Index falls inside window. Preset Z[${i}] = min(r - i + 1, Z[i - l]) = min(${remaining}, ${offset}) = ${z[i]}`);
      }

      // Linear extension comparison
      const startCheck = z[i];
      while (i + z[i] < N && inputVal[z[i]] === inputVal[i + z[i]]) {
        z[i]++;
      }
      
      if (z[i] > startCheck) {
        trace.push(`  * Extends match: matched ${z[i] - startCheck} extra characters starting from matching index ${startCheck}`);
      }

      if (i + z[i] - 1 > r) {
        l = i;
        r = i + z[i] - 1;
        trace.push(`  * Window boundary updated: new [l, r] = [${l}, ${r}]`);
      }
      trace.push(`• Final Z[${i}] = ${z[i]}`);
    }

    setZArray(z);
    setSteps(trace);
  };

  const definition = "The Z-array for string S of length N contains at each index S[i] the length of the longest common prefix of S and S[i..N-1]. Z-Algorithm computes it in O(N) by maintaining active search windows.";
  const formula = "Z[i] = LCP(S, S[i..N-1]). Maintains search segment [l, r] representing rightmost matching substring.";
  const example = "For 'aaaaa': Z = [0, 4, 3, 2, 1]. Z[1] = 4 because suffix 'aaaa' matches prefix 'aaaa'.";
  const applications = [
    "O(N) exact pattern matching (by finding Z on Pattern + '$' + Text).",
    "String periodicity matching.",
    "Lexicographical suffix sorting."
  ];
  const mistakes = [
    "Boundary index overflows when accessing s[z[i] + i] without length checks.",
    "Updating l/r boundaries on smaller values instead of strictly increasing sweeps."
  ];
  const cpTips = [
    "Always place a unique delimiter character like '$' or '#' between search pattern and source text so Z values do not exceed pattern boundaries."
  ];

  return (
    <StLayout
      timeComplexity="O(N)"
      spaceComplexity="O(N) Z-array size"
      definition={definition}
      formula={formula}
      example={example}
      applications={applications}
      mistakes={mistakes}
      cpTips={cpTips}
      resultChild={
        compared && (
          <Card className="border-border/40 bg-card/65 shadow-xs">
            <CardHeader className="pb-2 border-b border-border/10">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Z-Function Results
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 font-mono text-xs text-left">
              {/* Visualized block list */}
              <div className="flex flex-wrap gap-2 justify-center select-none pt-1 pb-3">
                {inputVal.split("").map((char, idx) => (
                  <div key={idx} className="flex flex-col items-center border border-border/40 rounded-lg p-1.5 min-w-[36px] bg-background/25">
                    <span className="text-[10px] text-muted-foreground/60">i={idx}</span>
                    <span className="font-bold text-foreground text-sm py-1 font-sans">{char}</span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-extrabold text-xs">
                      {zArray[idx]}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                  Interactive Trace:
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
      <StHeader
        title="Z Function"
        description="Compute longest common prefix matching lengths for all suffixes (Z-array) in linear time."
        category="Algorithms"
        difficulty="Medium"
        shortcut="Alt+Shift+I"
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
            label="Enter String (N <= 1,000)"
            value={inputVal}
            onChange={(val) => {
              setInputVal(val);
              setCompared(false);
            }}
            error={error || undefined}
          />
          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Generate Z Array
          </Button>
        </CardContent>
      </Card>
    </StLayout>
  );
}
