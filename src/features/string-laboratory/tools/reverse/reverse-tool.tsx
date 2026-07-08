"use client";

import * as React from "react";
import { StHeader } from "../../shared/st-header";
import { StLayout } from "../../shared/st-layout";
import { InputEditor } from "@/features/debug-tools/shared/input-editor";
import { OutputViewer } from "@/features/debug-tools/shared/output-viewer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { RotateCcw } from "lucide-react";

export function ReverseTool() {
  const [inputVal, setInputVal] = React.useState("first line words\nsecond line letters");
  const [mode, setMode] = React.useState<"char" | "words" | "lines">("char");

  const [compared, setCompared] = React.useState(false);
  const [result, setResult] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const handleClear = () => {
    setInputVal("");
    setCompared(false);
    setResult("");
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

    if (mode === "char") {
      setResult(inputVal.split("").reverse().join(""));
    } else if (mode === "words") {
      const lines = inputVal.split("\n");
      const revLines = lines.map((l) => l.split(/\s+/).reverse().join(" "));
      setResult(revLines.join("\n"));
    } else {
      setResult(inputVal.split("\n").reverse().join("\n"));
    }
  };

  const definition = "Reversing a string rearranges its components in reverse index order. Modes allow reversing characters, words on each line, or entire line vectors.";
  const formula = "Character reversal: swapping index i and N-1-i. Word reversal: parsing line tokens by space and reversing array. Line reversal: newlines split.";
  const example = "For 'ab cd' (Word mode): reverses words to 'cd ab'. Characters mode: 'dc ba'.";
  const applications = [
    "String matching optimizations (e.g. reverse suffix checks).",
    "Suffix automaton builders.",
    "Palindrome validations."
  ];
  const mistakes = [
    "Retaining incorrect line break offsets after multi-line word reversals.",
    "Unexpected space drops during regex word splits."
  ];

  return (
    <StLayout
      timeComplexity="O(N)"
      spaceComplexity="O(N)"
      definition={definition}
      formula={formula}
      example={example}
      applications={applications}
      mistakes={mistakes}
      resultChild={
        compared && (
          <div className="space-y-4">
            <OutputViewer label="Reversal Output" value={result} />
          </div>
        )
      }
    >
      <StHeader
        title="Reverse String"
        description="Invert character order, word sequences, or line structures within a multiline text bloc."
        category="Basic"
        difficulty="Easy"
        shortcut="Alt+Shift+E"
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
          <InputEditor
            label="Enter Text"
            value={inputVal}
            onChange={(val) => {
              setInputVal(val);
              setCompared(false);
            }}
            placeholder="Type your multiline string..."
            rows={4}
          />
          {error && <div className="text-xs text-rose-500 font-semibold">{error}</div>}
          
          <div className="space-y-1.5 max-w-[200px]">
            <label className="text-xs font-semibold text-foreground/80">Reversal Mode</label>
            <Select value={mode} onChange={(e) => { setMode(e.target.value as any); setCompared(false); }}>
              <option value="char">Reverse Characters (Raw)</option>
              <option value="words">Reverse Words</option>
              <option value="lines">Reverse Lines</option>
            </Select>
          </div>

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Run Reversal
          </Button>
        </CardContent>
      </Card>
    </StLayout>
  );
}
