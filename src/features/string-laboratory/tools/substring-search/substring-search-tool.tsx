"use client";

import * as React from "react";
import { StHeader } from "../../shared/st-header";
import { StLayout } from "../../shared/st-layout";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export function SubstringSearchTool() {
  const [text, setText] = React.useState("ABABDABACDABABCABAB");
  const [pattern, setPattern] = React.useState("ABABCABAB");

  const [compared, setCompared] = React.useState(false);
  const [occurrences, setOccurrences] = React.useState<number[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handleClear = () => {
    setText("");
    setPattern("");
    setCompared(false);
    setOccurrences([]);
    setError(null);
  };

  const handleEvaluate = () => {
    setError(null);
    setCompared(false);

    if (text.length === 0 || pattern.length === 0) {
      setError("Please enter non-empty text and pattern strings");
      return;
    }

    setCompared(true);
    const indices: number[] = [];
    const N = text.length;
    const M = pattern.length;

    // Naive search O(N * M)
    for (let i = 0; i <= N - M; i++) {
      let match = true;
      for (let j = 0; j < M; j++) {
        if (text[i + j] !== pattern[j]) {
          match = false;
          break;
        }
      }
      if (match) {
        indices.push(i);
      }
    }

    setOccurrences(indices);
  };

  const definition = "Substring search locates all occurrences of a pattern string inside a text string. Naive search aligns the pattern and tests characters sequentially.";
  const formula = "Iterate i = 0..N-M. For each alignment, match pattern[j] with text[i+j] for j = 0..M-1.";
  const example = "For Text 'AABA' and Pattern 'BA': index 2 starts a match. Occurrences: [2].";
  const applications = [
    "Text search features.",
    "DNA sequencing alignment.",
    "Pattern match filtering."
  ];
  const mistakes = [
    "Checking beyond index N-M, causing out-of-bounds errors.",
    "Using naive search instead of KMP or Rabin-Karp on massive datasets causing TLE."
  ];

  return (
    <StLayout
      timeComplexity="O(N * M)"
      spaceComplexity="O(1)"
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
                Search Results
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 font-mono text-xs text-left">
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground">Total Occurrences:</span>
                <span className="font-bold text-emerald-500">{occurrences.length}</span>
              </div>
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground">Match Indices (0-based):</span>
                <span className="font-bold text-foreground">
                  {occurrences.length > 0 ? occurrences.join(", ") : "none"}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-muted-foreground font-semibold">Visualized Highlights:</span>
                <div className="p-3 bg-muted/20 border border-border/10 rounded-lg font-mono text-xs leading-relaxed break-all">
                  {/* Highlight text matching segments */}
                  {text.split("").map((char, idx) => {
                    // Check if char is inside any matching pattern span
                    const isMatched = occurrences.some((start) => idx >= start && idx < start + pattern.length);
                    return (
                      <span
                        key={idx}
                        className={isMatched ? "bg-emerald-500/25 border-b-2 border-emerald-500 font-extrabold text-emerald-400 px-0.5" : "text-foreground/80"}
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
        title="Substring Search"
        description="Locate character patterns inside text blocks using naive linear alignment scans."
        category="Searching"
        difficulty="Easy"
        shortcut="Alt+Shift+Y"
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
          <div className="space-y-4">
            <InputField
              label="Text String"
              value={text}
              onChange={(val) => {
                setText(val);
                setCompared(false);
              }}
              error={error || undefined}
            />
            <InputField
              label="Search Pattern"
              value={pattern}
              onChange={(val) => {
                setPattern(val);
                setCompared(false);
              }}
            />
          </div>
          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Run Search
          </Button>
        </CardContent>
      </Card>
    </StLayout>
  );
}
