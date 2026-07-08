"use client";

import * as React from "react";
import { ToolHeader } from "../../shared/tool-header";
import { ToolLayout } from "../../shared/tool-layout";
import { InputEditor } from "../../shared/input-editor";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw, AlertCircle, CheckCircle2 } from "lucide-react";

interface CharacterDiffResult {
  index: number;
  line: number;
  col: number;
  expectedChar: string;
  expectedCode: number;
  receivedChar: string;
  receivedCode: number;
}

export function CharacterDiffTool() {
  const [expected, setExpected] = React.useState("");
  const [received, setReceived] = React.useState("");
  const [compared, setCompared] = React.useState(false);
  const [mismatch, setMismatch] = React.useState<CharacterDiffResult | null>(null);

  const handleClear = () => {
    setExpected("");
    setReceived("");
    setCompared(false);
    setMismatch(null);
  };

  const handleEvaluate = () => {
    setCompared(true);
    setMismatch(null);

    const len = Math.max(expected.length, received.length);
    let line = 1;
    let col = 1;

    for (let i = 0; i < len; i++) {
      const expChar = expected[i] ?? null;
      const recChar = received[i] ?? null;

      if (expChar !== recChar) {
        setMismatch({
          index: i,
          line,
          col,
          expectedChar: expChar === null ? "EOF" : expChar,
          expectedCode: expChar === null ? -1 : expChar.charCodeAt(0),
          receivedChar: recChar === null ? "EOF" : recChar,
          receivedCode: recChar === null ? -1 : recChar.charCodeAt(0),
        });
        return;
      }

      if (expChar === "\n") {
        line++;
        col = 1;
      } else {
        col++;
      }
    }
  };

  const handleSelectExample = (exp: string, rec?: string) => {
    setExpected(exp);
    setReceived(rec || "");
    setCompared(false);
  };

  const formatCharDisplay = (char: string, code: number) => {
    if (code === -1) return "EOF (End of File)";
    if (char === "\n") return "\\n (Newline)";
    if (char === "\r") return "\\r (Carriage Return)";
    if (char === "\t") return "\\t (Tab)";
    if (char === " ") return "' ' (Space)";
    return `'${char}' (code ${code})`;
  };

  const examples = [
    {
      input: "codeforces",
      input2: "codeforcesX",
      output: "Mismatch at Index 10: Received 'X' vs Expected EOF",
      description: "Appended Character Mismatch",
    },
    {
      input: "expected output\nline 2",
      input2: "expected output\r\nline 2",
      output: "Mismatch at Index 15: Received '\\r' vs Expected '\\n'",
      description: "Line Ending CR/LF Mismatch",
    },
  ];

  const notes = [
    "Checks single characters sequentially to isolate exact typographic errors.",
    "Shows character ASCII codes to detect invisible chars (tabs, returns, spaces).",
    "Reports the line and column number of the first mismatch.",
  ];

  return (
    <ToolLayout
      examples={examples}
      notes={notes}
      timeComplexity="O(N)"
      spaceComplexity="O(1)"
      onSelectExample={handleSelectExample}
    >
      <ToolHeader
        title="Character Difference Locator"
        description="Pinpoint the exact index, line, column, and ASCII code of the first mismatching character."
        category="Difference"
        difficulty="Easy"
        shortcut="Alt+Shift+3"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs">
        <CardHeader className="flex flex-row justify-between items-center pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Character Comparison Panel
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="h-7 w-7 p-0 cursor-pointer"
            title="Reset"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </CardHeader>
        <CardContent className="p-6 space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <InputEditor
              label="Expected Output String"
              value={expected}
              onChange={(val) => {
                setExpected(val);
                setCompared(false);
              }}
            />
            <InputEditor
              label="Received Output String"
              value={received}
              onChange={(val) => {
                setReceived(val);
                setCompared(false);
              }}
            />
          </div>

          <Button
            onClick={handleEvaluate}
            className="w-full justify-center mt-2 cursor-pointer"
          >
            Find Mismatch Character
          </Button>

          {compared && (
            <div className="pt-4 border-t border-border/10">
              {mismatch === null ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center gap-3 text-sm font-bold">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <span>Acceptable Match: All characters match completely!</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg flex items-center gap-3 text-sm font-bold">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span>First mismatch detected! Details provided below:</span>
                  </div>

                  <div className="p-4 rounded-xl border border-border/40 bg-card/40 space-y-3 font-mono text-xs">
                    <div className="flex justify-between border-b border-border/5 pb-1">
                      <span className="text-muted-foreground">Character Index:</span>
                      <span className="font-bold text-foreground">{mismatch.index}</span>
                    </div>
                    <div className="flex justify-between border-b border-border/5 pb-1">
                      <span className="text-muted-foreground">Line / Column Location:</span>
                      <span className="font-bold text-foreground">
                        Line {mismatch.line}, Col {mismatch.col}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-border/5 pb-1">
                      <span className="text-muted-foreground">Expected:</span>
                      <span className="font-bold text-emerald-500">
                        {formatCharDisplay(mismatch.expectedChar, mismatch.expectedCode)}
                      </span>
                    </div>
                    <div className="flex justify-between pb-1">
                      <span className="text-muted-foreground">Received:</span>
                      <span className="font-bold text-rose-500">
                        {formatCharDisplay(mismatch.receivedChar, mismatch.receivedCode)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
