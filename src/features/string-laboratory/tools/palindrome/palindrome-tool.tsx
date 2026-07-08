"use client";

import * as React from "react";
import { StHeader } from "../../shared/st-header";
import { StLayout } from "../../shared/st-layout";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RotateCcw } from "lucide-react";

export function PalindromeTool() {
  const [inputVal, setInputVal] = React.useState("A man, a plan, a canal: Panama");
  const [caseSensitive, setCaseSensitive] = React.useState(false);
  const [ignoreSpaces, setIgnoreSpaces] = React.useState(true);
  const [ignorePunc, setIgnorePunc] = React.useState(true);

  const [compared, setCompared] = React.useState(false);
  const [isPal, setIsPal] = React.useState(false);
  const [mismatchIndex, setMismatchIndex] = React.useState<number | null>(null);
  const [processedStr, setProcessedStr] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const handleClear = () => {
    setInputVal("");
    setCompared(false);
    setError(null);
  };

  const handleEvaluate = () => {
    setError(null);
    setCompared(false);

    if (inputVal.length === 0) {
      setError("Please enter a non-empty string");
      return;
    }

    setCompared(true);
    let s = inputVal;

    if (!caseSensitive) {
      s = s.toLowerCase();
    }

    if (ignoreSpaces) {
      s = s.replace(/\s+/g, "");
    }

    if (ignorePunc) {
      s = s.replace(/[^\w\s]|_/g, "");
    }

    setProcessedStr(s);

    let left = 0;
    let right = s.length - 1;
    let ok = true;
    let firstMismatch: number | null = null;

    while (left < right) {
      if (s[left] !== s[right]) {
        ok = false;
        firstMismatch = left;
        break;
      }
      left++;
      right--;
    }

    setIsPal(ok);
    setMismatchIndex(firstMismatch);
  };

  const definition = "A palindrome is a string that reads the same backward as forward. Filters permit ignoring punctuation, casing differences, or spacing gaps.";
  const formula = "Dual index loop: Compare left=0 and right=N-1 pointers moving inward. Mismatch index tracks left pointer value when string[left] !== string[right].";
  const example = "For 'Racecar' (case-insensitive): processed to 'racecar'. left=r, right=r; matches. verdict: Palindrome.";
  const applications = [
    "Lexicographical mirror validations.",
    "Dynamic programming state references.",
    "Manacher's palindromic radius matches."
  ];
  const mistakes = [
    "Not handling punctuation filters properly, leading to incorrect mismatch verdict logs.",
    "Loop pointer bounds checks causing index exceptions."
  ];

  return (
    <StLayout
      timeComplexity="O(N)"
      spaceComplexity="O(N) processed buffer"
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
                Verification Results
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3 font-mono text-xs text-left">
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground">Verdict:</span>
                <span className={`font-bold ${isPal ? "text-emerald-500" : "text-rose-500"}`}>
                  {isPal ? "PALINDROME" : "NOT A PALINDROME"}
                </span>
              </div>
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground">Processed Length:</span>
                <span className="font-bold text-foreground">{processedStr.length}</span>
              </div>
              {!isPal && mismatchIndex !== null && (
                <div className="space-y-1">
                  <span className="text-rose-500 font-semibold">First Mismatch Index:</span>
                  <div className="p-3 bg-rose-500/5 border border-rose-500/20 rounded-lg text-rose-500 font-mono text-[11px] leading-relaxed break-all">
                    Mismatch at processed index <span className="font-bold font-sans">{mismatchIndex}</span>: 
                    char <span className="font-bold text-foreground">'{processedStr[mismatchIndex]}'</span> vs 
                    char <span className="font-bold text-foreground">'{processedStr[processedStr.length - 1 - mismatchIndex]}'</span>.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )
      }
    >
      <StHeader
        title="Palindrome Checker"
        description="Verify if a word, phrase, or sentence is palindromic, supporting case and spacing configurations."
        category="Basic"
        difficulty="Easy"
        shortcut="Alt+Shift+W"
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
            label="Enter String"
            value={inputVal}
            onChange={(val) => {
              setInputVal(val);
              setCompared(false);
            }}
            error={error || undefined}
          />
          
          <div className="flex flex-wrap gap-4 text-xs select-none">
            <label className="flex items-center gap-2 font-semibold text-foreground/80 cursor-pointer">
              <Checkbox checked={caseSensitive} onCheckedChange={(val) => { setCaseSensitive(!!val); setCompared(false); }} />
              Case Sensitive
            </label>
            <label className="flex items-center gap-2 font-semibold text-foreground/80 cursor-pointer">
              <Checkbox checked={ignoreSpaces} onCheckedChange={(val) => { setIgnoreSpaces(!!val); setCompared(false); }} />
              Ignore Spaces
            </label>
            <label className="flex items-center gap-2 font-semibold text-foreground/80 cursor-pointer">
              <Checkbox checked={ignorePunc} onCheckedChange={(val) => { setIgnorePunc(!!val); setCompared(false); }} />
              Ignore Punctuation
            </label>
          </div>

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Run Verification
          </Button>
        </CardContent>
      </Card>
    </StLayout>
  );
}
