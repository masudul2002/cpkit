"use client";

import * as React from "react";
import { StHeader } from "../../shared/st-header";
import { StLayout } from "../../shared/st-layout";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export function LongestPalindromeTool() {
  const [inputVal, setInputVal] = React.useState("babad");
  const [compared, setCompared] = React.useState(false);
  const [subStr, setSubStr] = React.useState("");
  const [startIndex, setStartIndex] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);

  const handleClear = () => {
    setInputVal("");
    setCompared(false);
    setSubStr("");
    setStartIndex(0);
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
    const s = inputVal;
    let start = 0;
    let maxLength = 1;

    const expandAroundCenter = (l: number, r: number) => {
      while (l >= 0 && r < s.length && s[l] === s[r]) {
        const len = r - l + 1;
        if (len > maxLength) {
          start = l;
          maxLength = len;
        }
        l--;
        r++;
      }
    };

    for (let i = 0; i < s.length; i++) {
      expandAroundCenter(i, i);      // Odd length palindromes
      expandAroundCenter(i, i + 1);  // Even length palindromes
    }

    setStartIndex(start);
    setSubStr(s.slice(start, start + maxLength));
  };

  const definition = "Longest Palindromic Substring (LPS) finds the longest contiguous substring inside string S that reads identically forwards and backwards.";
  const formula = "Center Expansion Algorithm: For each index i, expand outward as long as S[left] == S[right]. Checks odd and even centers.";
  const example = "For 'babad': centers expand odd at 'a' (index 1) to find 'bab' (length 3) or at 'a' (index 2) to find 'aba' (length 3).";
  const applications = [
    "Bioinformatics sequence reflections.",
    "Pattern parsing compilers.",
    "Palindromic sequence factorizations."
  ];
  const mistakes = [
    "Failing to expand even-length palindromes (i, i+1 centers), missing answers.",
    "Boundary index out-of-bound errors during expansion."
  ];
  const cpTips = [
    "For O(N) linear time on huge strings (N up to 10^6), use Manacher's Algorithm which tracks mirror radius boundaries."
  ];

  return (
    <StLayout
      timeComplexity="O(N^2)"
      spaceComplexity="O(1)"
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
                LPS Result Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3 font-mono text-xs text-left">
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground">LPS Substring:</span>
                <span className="font-bold text-emerald-500">"{subStr}"</span>
              </div>
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground">Start Index:</span>
                <span className="font-bold text-foreground">{startIndex}</span>
              </div>
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground">LPS Length:</span>
                <span className="font-bold text-foreground">{subStr.length}</span>
              </div>

              <div className="space-y-1 pt-1 font-sans">
                <span className="text-muted-foreground font-semibold text-xs font-mono">Matched Highlights:</span>
                <div className="p-3 bg-muted/20 border border-border/10 rounded-lg font-mono text-xs leading-relaxed break-all">
                  {inputVal.split("").map((char, idx) => {
                    const isMatched = idx >= startIndex && idx < startIndex + subStr.length;
                    return (
                      <span
                        key={idx}
                        className={isMatched ? "bg-emerald-500/25 border-b-2 border-emerald-500 font-extrabold text-emerald-400 px-0.5" : "text-foreground/85"}
                      >
                        {char}
                      </span>
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
        title="Longest Palindromic Substring"
        description="Extract the longest palindromic substring, highlighting it inside the text sequence."
        category="Algorithms"
        difficulty="Medium"
        shortcut="Alt+Shift+P"
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
            Calculate LPS
          </Button>
        </CardContent>
      </Card>
    </StLayout>
  );
}
