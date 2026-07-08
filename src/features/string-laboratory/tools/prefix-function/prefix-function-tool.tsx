"use client";

import * as React from "react";
import { StHeader } from "../../shared/st-header";
import { StLayout } from "../../shared/st-layout";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export function PrefixFunctionTool() {
  const [inputVal, setInputVal] = React.useState("abcabcd");
  const [compared, setCompared] = React.useState(false);
  const [piArray, setPiArray] = React.useState<number[]>([]);
  const [steps, setSteps] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handleClear = () => {
    setInputVal("");
    setCompared(false);
    setPiArray([]);
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
    const pi = new Array(N).fill(0);
    const trace: string[] = [];

    trace.push(`• pi[0] = 0 (proper prefix length of a single character is always 0)`);

    for (let i = 1; i < N; i++) {
      let j = pi[i - 1];
      trace.push(`- Index ${i} ('${inputVal[i]}'): start checks from j = pi[${i - 1}] = ${j}`);
      
      while (j > 0 && inputVal[i] !== inputVal[j]) {
        const prevJ = j;
        j = pi[j - 1];
        trace.push(`  * Mismatch: '${inputVal[i]}' !== '${inputVal[prevJ]}'. Fallback to pi[${prevJ - 1}] = ${j}`);
      }

      if (inputVal[i] === inputVal[j]) {
        j++;
        trace.push(`  * Match: '${inputVal[i]}' === '${inputVal[j - 1]}'. Increment matching length to ${j}`);
      } else {
        trace.push(`  * Mismatch at j=0. Longest matching prefix suffix length is 0`);
      }

      pi[i] = j;
      trace.push(`• Final pi[${i}] = ${j}`);
    }

    setPiArray(pi);
    setSteps(trace);
  };

  const definition = "The prefix function (KMP pi array) computes for each prefix of the string the length of its longest proper prefix that is also its suffix. It forms the core of the Knuth-Morris-Pratt pattern matching algorithm.";
  const formula = "Recursive definition: pi[i] = max { k : s[0..k-1] == s[i-k+1..i] } where k < i + 1.";
  const example = "For 'abcabcd': pi = [0, 0, 0, 1, 2, 3, 0]. At index 5 ('c'), 'abc' matches prefix 'abc', so pi[5] = 3.";
  const applications = [
    "KMP substring searching in O(N + M) time.",
    "String period and compression checks.",
    "Finding number of unique substrings."
  ];
  const mistakes = [
    "Infinite loops if while condition index check 'j > 0' is omitted.",
    "Not dividing index checks correctly when resetting prefix pointers."
  ];
  const cpTips = [
    "Always use the dynamic programming optimization loop: `while (j > 0 && s[i] != s[j]) j = pi[j-1];` to maintain O(N) linear time."
  ];

  return (
    <StLayout
      timeComplexity="O(N)"
      spaceComplexity="O(N) prefix array size"
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
                Prefix Table Results
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 font-mono text-xs text-left">
              {/* Visualized block list */}
              <div className="flex flex-wrap gap-2 justify-center select-none pt-1 pb-3">
                {inputVal.split("").map((char, idx) => (
                  <div key={idx} className="flex flex-col items-center border border-border/40 rounded-lg p-1.5 min-w-[36px] bg-background/25">
                    <span className="text-[10px] text-muted-foreground/60">i={idx}</span>
                    <span className="font-bold text-foreground text-sm py-1 font-sans">{char}</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-extrabold text-xs">
                      {piArray[idx]}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                  Step-by-step Execution Log:
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
        title="Prefix Function (KMP)"
        description="Compute the proper prefix-suffix matching table (pi array) and visualize index skips."
        category="Algorithms"
        difficulty="Medium"
        shortcut="Alt+Shift+U"
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
            Generate Prefix Table
          </Button>
        </CardContent>
      </Card>
    </StLayout>
  );
}
