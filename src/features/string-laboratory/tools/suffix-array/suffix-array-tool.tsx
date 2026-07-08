"use client";

import * as React from "react";
import { StHeader } from "../../shared/st-header";
import { StLayout } from "../../shared/st-layout";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface SuffixItem {
  saIndex: number; // Index in suffix array
  startOffset: number; // Starting index in original string
  suffix: string;
}

export function SuffixArrayTool() {
  const [inputVal, setInputVal] = React.useState("banana");
  const [compared, setCompared] = React.useState(false);
  const [suffixArray, setSuffixArray] = React.useState<SuffixItem[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handleClear = () => {
    setInputVal("");
    setCompared(false);
    setSuffixArray([]);
    setError(null);
  };

  const handleEvaluate = () => {
    setError(null);
    setCompared(false);

    if (inputVal.length === 0) {
      setError("Please enter a non-empty string");
      return;
    }

    if (inputVal.length > 50) {
      setError("Please enter a string of length <= 50 to prevent layout issues.");
      return;
    }

    setCompared(true);
    const N = inputVal.length;

    // Generate suffixes with starting offsets
    const suffixes: { offset: number; suffix: string }[] = [];
    for (let i = 0; i < N; i++) {
      suffixes.push({ offset: i, suffix: inputVal.slice(i) });
    }

    // Sort suffixes lexicographically
    suffixes.sort((a, b) => a.suffix.localeCompare(b.suffix));

    const resultList: SuffixItem[] = suffixes.map((item, idx) => ({
      saIndex: idx,
      startOffset: item.offset,
      suffix: item.suffix,
    }));

    setSuffixArray(resultList);
  };

  const definition = "A Suffix Array is a sorted array of all suffixes of a string. It is a powerful data structure used in pattern matching, compression, and full-text indexing.";
  const formula = "Sort all S.slice(i) for i = 0..N-1. Suffix array stores the starting offsets of the sorted suffixes.";
  const example = "For 'banana': sorted suffixes are 'a', 'ana', 'anana', 'banana', 'na', 'nana'. Suffix array is [5, 3, 1, 0, 4, 2].";
  const applications = [
    "Substring search in O(M log N) via binary search on suffixes.",
    "Finding longest repeated substring.",
    "Burrows-Wheeler transform compression."
  ];
  const mistakes = [
    "Sorting suffixes directly with string comparisons in O(N^2 log N) on huge strings instead of prefix doubling in O(N log N) or DC3 in O(N).",
    "Not appending a unique character '$' at the end of the string in standard suffix sorting problems."
  ];
  const cpTips = [
    "To build a suffix array for massive strings up to 10^5, use the prefix doubling algorithm with suffix ranks, which runs in O(N log N) using sorting cycles."
  ];

  return (
    <StLayout
      timeComplexity="O(N^2 log N)"
      spaceComplexity="O(N^2) for suffix storage"
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
                Suffix Array Output
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 font-mono text-xs text-left">
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground">Suffix Array (SA):</span>
                <span className="font-bold text-emerald-500">
                  [{suffixArray.map((item) => item.startOffset).join(", ")}]
                </span>
              </div>
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground">LCP Array:</span>
                <span className="font-bold text-foreground/45">[placeholder]</span>
              </div>

              {/* Suffixes table */}
              <div className="border border-border/40 rounded-lg overflow-hidden bg-background/25">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead className="bg-muted/80 text-muted-foreground uppercase text-[9px] font-bold">
                    <tr>
                      <th className="px-4 py-2 border-b border-border/10 text-center">SA Index</th>
                      <th className="px-4 py-2 border-b border-border/10 text-center">Start Offset</th>
                      <th className="px-4 py-2 border-b border-border/10">Suffix Substring</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/10">
                    {suffixArray.map((item) => (
                      <tr key={item.saIndex} className="hover:bg-accent/10 transition-colors">
                        <td className="px-4 py-2 text-center text-primary font-bold">{item.saIndex}</td>
                        <td className="px-4 py-2 text-center text-foreground font-bold">{item.startOffset}</td>
                        <td className="px-4 py-2 text-foreground/80 break-all">{item.suffix}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )
      }
    >
      <StHeader
        title="Suffix Array"
        description="Generate lexicographically sorted suffix tables for a text string and build suffix arrays."
        category="Suffixes"
        difficulty="Hard"
        shortcut="Alt+Shift+S"
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
          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Generate Suffix Array
          </Button>
        </CardContent>
      </Card>
    </StLayout>
  );
}
