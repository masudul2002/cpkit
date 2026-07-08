"use client";

import * as React from "react";
import { ToolHeader } from "../../shared/tool-header";
import { ToolLayout } from "../../shared/tool-layout";
import { InputEditor } from "../../shared/input-editor";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, RotateCcw } from "lucide-react";

interface FormattingError {
  lineNum: number;
  type: "trailing" | "tab" | "mixed" | "consecutive_empty" | "leading";
  desc: string;
}

export function WhitespaceCheckerTool() {
  const [inputText, setInputText] = React.useState("");
  const [compared, setCompared] = React.useState(false);
  const [warnings, setWarnings] = React.useState<FormattingError[]>([]);

  const handleClear = () => {
    setInputText("");
    setCompared(false);
    setWarnings([]);
  };

  const handleEvaluate = () => {
    setCompared(true);
    const lines = inputText.split(/\r?\n/);
    const list: FormattingError[] = [];

    let hasSpacesLeading = false;
    let hasTabsLeading = false;
    let consecutiveEmpty = 0;

    lines.forEach((line, idx) => {
      const lineNum = idx + 1;

      // 1. Trailing spaces check
      if (/[ \t]+$/.test(line)) {
        list.push({
          lineNum,
          type: "trailing",
          desc: "Trailing whitespace (spaces or tabs at end of line)",
        });
      }

      // 2. Tab character checks
      if (/\t/.test(line)) {
        list.push({
          lineNum,
          type: "tab",
          desc: "Contains tab characters (prefer spaces for cross-platform visual alignment)",
        });
      }

      // 3. Indentation tracking (mixed check)
      const leading = line.match(/^([ \t]+)/);
      if (leading) {
        const indentStr = leading[1];
        if (indentStr.includes(" ") && indentStr.includes("\t")) {
          list.push({
            lineNum,
            type: "mixed",
            desc: "Mixed spaces and tabs in leading indentation on the same line",
          });
        }

        if (indentStr.includes(" ")) hasSpacesLeading = true;
        if (indentStr.includes("\t")) hasTabsLeading = true;
      }

      // 4. Consecutive blank lines check
      if (line.trim() === "") {
        consecutiveEmpty++;
        if (consecutiveEmpty > 1) {
          list.push({
            lineNum,
            type: "consecutive_empty",
            desc: "Extra blank line detected (multiple consecutive empty lines)",
          });
        }
      } else {
        consecutiveEmpty = 0;
      }
    });

    // 5. Global mixed check (across lines)
    if (hasSpacesLeading && hasTabsLeading) {
      list.push({
        lineNum: 0,
        type: "mixed",
        desc: "Global Mixed Indentation: Some lines use spaces while others use tabs for indenting",
      });
    }

    setWarnings(list);
  };

  const examples = [
    {
      input: "line1    \nline2\n\n\nline3",
      output: "Trailing spaces on line 1 | Consecutive empty on line 4",
      description: "Trailing space & double newlines",
    },
    {
      input: "\tline1\n  line2",
      output: "Tab on line 1 | Mixed Indentation global warning",
      description: "Mixed spaces & tabs indentations",
    },
  ];

  const notes = [
    "Checks for trailing spaces, raw tabs, consecutive newlines, and mixed indentations.",
    "Important to clear Presentation Errors (PE) on picky contest judges.",
    "Clicking a row highlight details standard formatting solutions.",
  ];

  return (
    <ToolLayout
      examples={examples}
      notes={notes}
      timeComplexity="O(N)"
      spaceComplexity="O(N)"
      onSelectExample={(expr) => setInputText(expr)}
    >
      <ToolHeader
        title="Whitespace Checker"
        description="Verify string formats and source indentations by scanning for tabs, trailing spaces, and blank lines."
        category="Formatting"
        difficulty="Easy"
        shortcut="Alt+Shift+8"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs">
        <CardHeader className="flex flex-row justify-between items-center pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Formatting Panel
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
          <InputEditor
            label="Source Code / Output Text"
            value={inputText}
            onChange={(val) => {
              setInputText(val);
              setCompared(false);
            }}
            placeholder="Paste code or output here..."
          />

          <Button
            onClick={handleEvaluate}
            className="w-full justify-center mt-2 cursor-pointer"
          >
            Scan Whitespaces
          </Button>

          {compared && inputText.trim() && (
            <div className="pt-4 border-t border-border/10 space-y-4">
              {warnings.length === 0 ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center gap-3 text-sm font-bold">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <span>Verified: Clean formatting! No whitespace bugs detected.</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg flex items-center gap-3 text-sm font-bold">
                    <AlertTriangle className="h-5 w-5 shrink-0" />
                    <span>Scan complete: {warnings.length} layout warnings found.</span>
                  </div>

                  <div className="border border-border/40 rounded-lg overflow-hidden bg-background/25">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-muted/80 text-muted-foreground uppercase text-[9px] font-bold">
                        <tr>
                          <th className="px-4 py-2.5">Line</th>
                          <th className="px-4 py-2.5">Warning Detail</th>
                          <th className="px-4 py-2.5">Type</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/10">
                        {warnings.map((row, idx) => (
                          <tr
                            key={idx}
                            className="hover:bg-accent/15 transition-colors bg-amber-500/[0.01]"
                          >
                            <td className="px-4 py-2.5 font-bold text-foreground">
                              {row.lineNum === 0 ? "Global" : `Line ${row.lineNum}`}
                            </td>
                            <td className="px-4 py-2.5 text-foreground/80 font-sans">{row.desc}</td>
                            <td className="px-4 py-2.5 text-center">
                              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded border border-amber-500/20 bg-amber-500/10 text-amber-500 uppercase">
                                {row.type}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
