"use client";

import * as React from "react";
import { ToolHeader } from "../../shared/tool-header";
import { ToolLayout } from "../../shared/tool-layout";
import { InputEditor } from "../../shared/input-editor";
import { DiffViewer } from "../../shared/diff-viewer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RotateCcw, Check, AlertTriangle } from "lucide-react";

export function OutputComparerTool() {
  const [expected, setExpected] = React.useState("");
  const [received, setReceived] = React.useState("");
  const [ignoreTrailing, setIgnoreTrailing] = React.useState(true);
  const [compared, setCompared] = React.useState(false);

  const handleClear = () => {
    setExpected("");
    setReceived("");
    setCompared(false);
  };

  const handleSelectExample = (exp: string, rec?: string) => {
    setExpected(exp);
    setReceived(rec || "");
    setCompared(true);
  };

  const hasMismatch = React.useMemo(() => {
    if (!compared) return false;
    let expStr = expected;
    let recStr = received;
    if (ignoreTrailing) {
      expStr = expStr.replace(/\r?\n$/, "");
      recStr = recStr.replace(/\r?\n$/, "");
    }
    return expStr !== recStr;
  }, [expected, received, ignoreTrailing, compared]);

  const examples = [
    {
      input: "1\n2\n3\n",
      input2: "1\n2\n3",
      output: "Matches (with trailing newline ignored)",
      description: "Ignore Trailing Whitespace Match",
    },
    {
      input: "10 20 30\nYES\n",
      input2: "10 20 30\nNO\n",
      output: "Mismatch on Line 2 (YES vs NO)",
      description: "Codeforces Wrong Answer case",
    },
  ];

  const notes = [
    "Useful for checking solution outputs against contest checker output files.",
    "Trailing newlines and carriage returns (\\r) can be ignored automatically.",
    "Renders a colored line block summary showing the exact indices of mismatches.",
  ];

  return (
    <ToolLayout
      examples={examples}
      notes={notes}
      timeComplexity="O(N)"
      spaceComplexity="O(N)"
      onSelectExample={handleSelectExample}
    >
      <ToolHeader
        title="Output Comparer"
        description="Verify correctness by comparing Expected program outputs against actual outputs line-by-line."
        category="Output Check"
        difficulty="Easy"
        shortcut="Alt+Shift+1"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs">
        <CardHeader className="flex flex-row justify-between items-center pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Comparison Editors
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
              label="Expected (Correct Output)"
              value={expected}
              onChange={(val) => {
                setExpected(val);
                setCompared(false);
              }}
              placeholder="Paste correct sample output here..."
            />
            <InputEditor
              label="Received (Your Solution Output)"
              value={received}
              onChange={(val) => {
                setReceived(val);
                setCompared(false);
              }}
              placeholder="Paste candidate output here..."
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1 select-none">
            <Checkbox
              id="ignore-newline"
              checked={ignoreTrailing}
              onCheckedChange={(checked) => setIgnoreTrailing(!!checked)}
            />
            <label htmlFor="ignore-newline" className="cursor-pointer font-medium">
              Ignore trailing newline (\n) at end of files
            </label>
          </div>

          <Button
            onClick={() => setCompared(true)}
            className="w-full justify-center mt-2 cursor-pointer"
          >
            Compare Outputs
          </Button>

          {compared && (expected || received) && (
            <div className="space-y-4 pt-4 border-t border-border/10">
              {/* Verdict banner */}
              {!hasMismatch ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center gap-3 text-sm font-bold">
                  <Check className="h-5 w-5 shrink-0" />
                  <span>Acceptable Match: Outputs match completely!</span>
                </div>
              ) : (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg flex items-center gap-3 text-sm font-bold">
                  <AlertTriangle className="h-5 w-5 shrink-0" />
                  <span>Wrong Answer: Output differences detected. See line diff below.</span>
                </div>
              )}

              {/* Diffs visualization */}
              <DiffViewer
                expected={expected}
                received={received}
                ignoreTrailingNewline={ignoreTrailing}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
