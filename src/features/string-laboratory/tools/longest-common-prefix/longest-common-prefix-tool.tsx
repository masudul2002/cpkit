"use client";

import * as React from "react";
import { StHeader } from "../../shared/st-header";
import { StLayout } from "../../shared/st-layout";
import { InputEditor } from "@/features/debug-tools/shared/input-editor";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export function LcpTool() {
  const [inputVal, setInputVal] = React.useState("competitive\ncompetition\ncompetent");
  const [compared, setCompared] = React.useState(false);
  const [prefix, setPrefix] = React.useState("");
  const [list, setList] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handleClear = () => {
    setInputVal("");
    setCompared(false);
    setPrefix("");
    setList([]);
    setError(null);
  };

  const handleEvaluate = () => {
    setError(null);
    setCompared(false);

    const tokens = inputVal.split("\n").map((s) => s.trim()).filter(Boolean);
    if (tokens.length === 0) {
      setError("Please enter at least one non-empty string");
      return;
    }

    setCompared(true);
    setList(tokens);

    let lcp = tokens[0];
    for (let i = 1; i < tokens.length; i++) {
      let j = 0;
      while (j < lcp.length && j < tokens[i].length && lcp[j] === tokens[i][j]) {
        j++;
      }
      lcp = lcp.slice(0, j);
    }
    setPrefix(lcp);
  };

  const definition = "Longest Common Prefix (LCP) locates the longest starting substring that is shared across all strings in a given set.";
  const formula = "LCP(S1, S2, ..., Sk) = LCP(LCP(S1, S2), S3 ...). Characters match sequentially from index 0 until mismatch.";
  const example = "For ['competition', 'competent', 'competitive']: common characters start with 'compet'. LCP length is 6.";
  const applications = [
    "Suffix tree/array operations.",
    "String dictionary sorting setups.",
    "Fast lookup matching indices."
  ];
  const mistakes = [
    "Not checking empty string tokens causing pointer reference crashes.",
    "Failing to break early when LCP length reduces to 0."
  ];
  const cpTips = [
    "In competitive programming, you can compute the LCP of multiple strings efficiently by first sorting the array and then checking the LCP between only the first and last strings!"
  ];

  return (
    <StLayout
      timeComplexity="O(S) where S is sum of lengths"
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
                LCP Results
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3 font-mono text-xs text-left">
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground font-semibold">LCP Output:</span>
                <span className="font-bold text-emerald-500">
                  {prefix ? `"${prefix}"` : "[no common prefix]"}
                </span>
              </div>
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground">LCP Length:</span>
                <span className="font-bold text-foreground">{prefix.length}</span>
              </div>

              <div className="space-y-2 pt-1 font-sans">
                <span className="text-muted-foreground font-semibold text-xs font-mono">Matched Highlights:</span>
                <div className="space-y-1.5 font-mono text-[11px]">
                  {list.map((str, idx) => {
                    const matchPart = str.slice(0, prefix.length);
                    const restPart = str.slice(prefix.length);
                    return (
                      <div key={idx} className="p-2 bg-muted/20 border border-border/10 rounded-lg break-all">
                        {prefix.length > 0 ? (
                          <>
                            <span className="bg-emerald-500/20 border-b border-emerald-500 text-emerald-400 font-extrabold px-0.5">
                              {matchPart}
                            </span>
                            <span className="text-foreground/50">{restPart}</span>
                          </>
                        ) : (
                          <span className="text-foreground">{str}</span>
                        )}
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
        title="Longest Common Prefix"
        description="Find the longest shared prefix string among a set of multiple words."
        category="Algorithms"
        difficulty="Easy"
        shortcut="Alt+Shift+L"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs">
        <CardHeader className="flex flex-row justify-between items-center pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel (One per line)
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
          <InputEditor
            label="Enter Strings List"
            value={inputVal}
            onChange={(val) => {
              setInputVal(val);
              setCompared(false);
            }}
            placeholder="competitor..."
            rows={4}
          />
          {error && <div className="text-xs text-rose-500 font-semibold">{error}</div>}
          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Calculate LCP
          </Button>
        </CardContent>
      </Card>
    </StLayout>
  );
}
