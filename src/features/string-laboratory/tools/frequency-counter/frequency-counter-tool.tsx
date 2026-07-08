"use client";

import * as React from "react";
import { StHeader } from "../../shared/st-header";
import { StLayout } from "../../shared/st-layout";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export function FrequencyCounterTool() {
  const [inputVal, setInputVal] = React.useState("competitive programming");
  const [compared, setCompared] = React.useState(false);
  const [charCount, setCharCount] = React.useState(0);
  const [uniqueCount, setUniqueCount] = React.useState(0);
  const [freqMap, setFreqMap] = React.useState<[string, number][]>([]);
  const [duplicates, setDuplicates] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handleClear = () => {
    setInputVal("");
    setCompared(false);
    setCharCount(0);
    setUniqueCount(0);
    setFreqMap([]);
    setDuplicates([]);
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
    setCharCount(inputVal.length);

    const counts: Record<string, number> = {};
    for (const c of inputVal) {
      counts[c] = (counts[c] || 0) + 1;
    }

    const sortedFreq = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    setFreqMap(sortedFreq);
    setUniqueCount(sortedFreq.length);

    const dups = sortedFreq.filter(([_, count]) => count > 1).map(([char]) => char);
    setDuplicates(dups);
  };

  const definition = "Character Frequency Counter scans a string and tallies the occurrences of each individual character, sorting them in descending frequency orders.";
  const formula = "Iterate through string index i = 0..N-1. Increment counts[string[i]]. Sort map by counts desc.";
  const example = "For 'aba': 'a' appears 2 times, 'b' appears 1 time. Unique chars: 2, Duplicate chars: ['a'].";
  const applications = [
    "Huffman coding and compression trees.",
    "Anagram verifications.",
    "String pattern hashing."
  ];
  const mistakes = [
    "Not handling spaces and case sensitivity differences.",
    "Off-by-one loops on empty boundary characters."
  ];
  const cpTips = [
    "In competitive programming, use a fixed size integer array `int freq[256] = {0}` for O(N) counts instead of mapping hashes."
  ];

  return (
    <StLayout
      timeComplexity="O(N log U)"
      spaceComplexity="O(U)"
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
                Frequency Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3 font-mono text-xs text-left">
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground">Total Characters:</span>
                <span className="font-bold text-foreground">{charCount}</span>
              </div>
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground">Unique Characters:</span>
                <span className="font-bold text-foreground">{uniqueCount}</span>
              </div>
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground">Duplicates:</span>
                <span className="font-bold text-rose-500">
                  {duplicates.length > 0 ? duplicates.map(d => d === " " ? "space" : `'${d}'`).join(", ") : "none"}
                </span>
              </div>
              <div className="space-y-1 pt-1">
                <span className="text-muted-foreground font-semibold">Sorted Table:</span>
                <div className="p-3 bg-muted/20 border border-border/10 rounded-lg max-h-36 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-1">
                  {freqMap.map(([char, count]) => (
                    <div key={char} className="flex justify-between text-foreground/80">
                      <span>{char === " " ? "[space]" : `'${char}'`}:</span>
                      <span className="font-bold">{count} times</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      }
    >
      <StHeader
        title="Character Frequency Counter"
        description="Analyze total, unique, and duplicate character counts inside a given text string."
        category="Basic"
        difficulty="Easy"
        shortcut="Alt+Shift+Q"
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
            Calculate Frequency
          </Button>
        </CardContent>
      </Card>
    </StLayout>
  );
}
