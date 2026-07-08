"use client";

import * as React from "react";
import { ToolHeader } from "../../shared/tool-header";
import { ToolLayout } from "../../shared/tool-layout";
import { InputEditor } from "../../shared/input-editor";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw, AlertCircle, CheckCircle2 } from "lucide-react";

interface DuplicateItem {
  val: string;
  count: number;
  positions: number[]; // 1-based indices
}

export function DuplicateFinderTool() {
  const [inputVal, setInputVal] = React.useState("");
  const [compared, setCompared] = React.useState(false);
  const [duplicates, setDuplicates] = React.useState<DuplicateItem[]>([]);

  const handleClear = () => {
    setInputVal("");
    setCompared(false);
    setDuplicates([]);
  };

  const handleEvaluate = () => {
    setCompared(true);
    setDuplicates([]);

    const tokens = inputVal.trim().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return;

    // Track counts and positions
    const map: Record<string, { count: number; positions: number[] }> = {};

    tokens.forEach((tok, idx) => {
      if (!map[tok]) {
        map[tok] = { count: 0, positions: [] };
      }
      map[tok].count++;
      map[tok].positions.push(idx + 1); // 1-based index
    });

    const resultList: DuplicateItem[] = [];
    for (const [key, value] of Object.entries(map)) {
      if (value.count > 1) {
        resultList.push({
          val: key,
          count: value.count,
          positions: value.positions,
        });
      }
    }

    // Sort by frequency descending
    resultList.sort((a, b) => b.count - a.count);
    setDuplicates(resultList);
  };

  const examples = [
    {
      input: "5 2 7 2 5 8 5 9",
      output: "5: count 3 at [1, 5, 7] | 2: count 2 at [2, 4]",
      description: "Integer list with multiple duplicates",
    },
    {
      input: "apple banana orange apple banana grape",
      output: "apple: count 2 at [1, 4] | banana: count 2 at [2, 5]",
      description: "String list duplicate tracker",
    },
  ];

  const notes = [
    "Supports tracking strings, words, or numbers separated by whitespace.",
    "Shows the frequency counts and 1-based occurrence index intervals.",
    "Duplicates list is sorted by frequency descending.",
  ];

  return (
    <ToolLayout
      examples={examples}
      notes={notes}
      timeComplexity="O(N)"
      spaceComplexity="O(N)"
      onSelectExample={(expr) => setInputVal(expr)}
    >
      <ToolHeader
        title="Duplicate Finder"
        description="Scan list items to locate duplicate values, their frequencies, and exact occurrences coordinates."
        category="Verification"
        difficulty="Easy"
        shortcut="Alt+Shift+6"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs">
        <CardHeader className="flex flex-row justify-between items-center pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Duplication Scan Panel
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
            label="Dataset Items (space separated)"
            value={inputVal}
            onChange={(val) => {
              setInputVal(val);
              setCompared(false);
            }}
            placeholder="e.g. 5 2 7 2 5 8 5 9"
          />

          <Button
            onClick={handleEvaluate}
            className="w-full justify-center mt-2 cursor-pointer"
          >
            Scan for Duplicates
          </Button>

          {compared && inputVal.trim() && (
            <div className="pt-4 border-t border-border/10 space-y-4">
              {duplicates.length === 0 ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center gap-3 text-sm font-bold">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <span>Verified: No duplicate elements detected. All elements are unique!</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg flex items-center gap-3 text-sm font-bold">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span>Duplicates found: {duplicates.length} unique values duplicated.</span>
                  </div>

                  <div className="border border-border/40 rounded-lg overflow-hidden bg-background/25">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-muted/80 text-muted-foreground uppercase text-[9px] font-bold">
                        <tr>
                          <th className="px-4 py-2.5">Value</th>
                          <th className="px-4 py-2.5 text-center">Frequency</th>
                          <th className="px-4 py-2.5">Occurrences (1-based index)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/10">
                        {duplicates.map((row, idx) => (
                          <tr key={idx} className="hover:bg-accent/15 transition-colors">
                            <td className="px-4 py-2.5 font-bold text-foreground">{row.val}</td>
                            <td className="px-4 py-2.5 text-center text-rose-500 font-bold">
                              {row.count}
                            </td>
                            <td className="px-4 py-2.5 text-muted-foreground">
                              [{row.positions.join(", ")}]
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
