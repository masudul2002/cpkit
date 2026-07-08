"use client";

import * as React from "react";
import { ToolHeader } from "../../shared/tool-header";
import { ToolLayout } from "../../shared/tool-layout";
import { InputEditor } from "../../shared/input-editor";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
import { RotateCcw, CheckCircle2, XCircle } from "lucide-react";

interface SortMismatch {
  index: number; // 1-based index
  elementA: string;
  elementB: string;
  reason: string;
}

export function SortCheckerTool() {
  const [arrayInput, setArrayInput] = React.useState("");
  const [direction, setDirection] = React.useState<"asc" | "desc">("asc");
  const [strict, setStrict] = React.useState(false);
  const [compared, setCompared] = React.useState(false);
  const [mismatch, setMismatch] = React.useState<SortMismatch | null>(null);

  const handleClear = () => {
    setArrayInput("");
    setCompared(false);
    setMismatch(null);
  };

  const handleEvaluate = () => {
    setCompared(true);
    setMismatch(null);

    const tokens = arrayInput.trim().split(/\s+/).filter(Boolean);
    if (tokens.length <= 1) return;

    for (let i = 0; i < tokens.length - 1; i++) {
      const aStr = tokens[i];
      const bStr = tokens[i + 1];

      // Parse as BigInt or float if possible for numeric check, fallback to string compare
      const isNumA = /^\-?[0-9]+(\.[0-9]+)?$/.test(aStr);
      const isNumB = /^\-?[0-9]+(\.[0-9]+)?$/.test(bStr);

      let isSorted = true;
      let reason = "";

      if (isNumA && isNumB) {
        const aVal = parseFloat(aStr);
        const bVal = parseFloat(bStr);

        if (direction === "asc") {
          if (strict) {
            isSorted = aVal < bVal;
            reason = `Strict Ascending: expected ${aVal} < ${bVal}`;
          } else {
            isSorted = aVal <= bVal;
            reason = `Non-strict Ascending: expected ${aVal} <= ${bVal}`;
          }
        } else {
          if (strict) {
            isSorted = aVal > bVal;
            reason = `Strict Descending: expected ${aVal} > ${bVal}`;
          } else {
            isSorted = aVal >= bVal;
            reason = `Non-strict Descending: expected ${aVal} >= ${bVal}`;
          }
        }
      } else {
        // String compare fallback
        if (direction === "asc") {
          if (strict) {
            isSorted = aStr < bStr;
            reason = `Strict Alphabetic Ascending: expected "${aStr}" < "${bStr}"`;
          } else {
            isSorted = aStr <= bStr;
            reason = `Non-strict Alphabetic Ascending: expected "${aStr}" <= "${bStr}"`;
          }
        } else {
          if (strict) {
            isSorted = aStr > bStr;
            reason = `Strict Alphabetic Descending: expected "${aStr}" > "${bStr}"`;
          } else {
            isSorted = aStr >= bStr;
            reason = `Non-strict Alphabetic Descending: expected "${aStr}" >= "${bStr}"`;
          }
        }
      }

      if (!isSorted) {
        setMismatch({
          index: i + 2, // 1-based index of element B
          elementA: aStr,
          elementB: bStr,
          reason,
        });
        return;
      }
    }
  };

  const handleSelectExample = (exp: string) => {
    // example format: "dir,strict,arrayString"
    const [dir, strStrict, arr] = exp.split(";");
    setDirection(dir as any);
    setStrict(strStrict === "true");
    setArrayInput(arr);
    setCompared(false);
  };

  const examples = [
    { input: "asc;false;1 3 5 5 7 10", output: "Sorted (duplicates allowed)", description: "Non-strict Ascending Check" },
    { input: "asc;true;1 3 5 5 7 10", output: "Mismatch at Index 4 (5 is not strictly greater than 5)", description: "Strict Ascending Mismatch" },
    { input: "desc;true;10 8 5 3 1", output: "Sorted", description: "Strict Descending Check" },
  ];

  const notes = [
    "Numbers are parsed as floats dynamically for checking math sorted orders.",
    "Alphabetic character/string comparisons serve as backup when text arrays are checked.",
    "First wrong index is shown in 1-based index offset coordinates.",
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
        title="Sort Checker"
        description="Verify if a series of elements is sorted in ascending/descending order and check strict uniqueness."
        category="Verification"
        difficulty="Easy"
        shortcut="Alt+Shift+5"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs">
        <CardHeader className="flex flex-row justify-between items-center pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Sort Validation Panel
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
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">Sort Direction</label>
              <Select value={direction} onChange={(e) => setDirection(e.target.value as any)}>
                <option value="asc">Ascending (Small to Large)</option>
                <option value="desc">Descending (Large to Small)</option>
              </Select>
            </div>

            <div className="flex items-end gap-2 text-xs pb-3.5 select-none">
              <Checkbox
                id="strict-sort"
                checked={strict}
                onCheckedChange={(checked) => setStrict(!!checked)}
              />
              <label htmlFor="strict-sort" className="cursor-pointer font-medium text-foreground/80">
                Enforce Strict Sorting (No Duplicates Allowed)
              </label>
            </div>
          </div>

          <InputEditor
            label="Array Elements (space separated)"
            value={arrayInput}
            onChange={(val) => {
              setArrayInput(val);
              setCompared(false);
            }}
            placeholder="e.g. 1 3 5 8 12"
          />

          <Button
            onClick={handleEvaluate}
            className="w-full justify-center mt-2 cursor-pointer"
          >
            Check Sorted Order
          </Button>

          {compared && arrayInput.trim() && (
            <div className="pt-4 border-t border-border/10">
              {mismatch === null ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center gap-3 text-sm font-bold">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <span>Verified: Array elements are sorted correctly according to your bounds!</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg flex items-center gap-3 text-sm font-bold">
                    <XCircle className="h-5 w-5 shrink-0" />
                    <span>Failed: Element order is broken. Details below:</span>
                  </div>

                  <div className="p-4 rounded-xl border border-border/40 bg-card/40 space-y-3 font-mono text-xs">
                    <div className="flex justify-between border-b border-border/5 pb-1">
                      <span className="text-muted-foreground">Broken Position Index:</span>
                      <span className="font-bold text-foreground">Element {mismatch.index}</span>
                    </div>
                    <div className="flex justify-between border-b border-border/5 pb-1">
                      <span className="text-muted-foreground">Conflict Elements:</span>
                      <span className="font-bold text-foreground">
                        {mismatch.elementA} and {mismatch.elementB}
                      </span>
                    </div>
                    <div className="flex justify-between pb-1">
                      <span className="text-muted-foreground">Reason/Constraint:</span>
                      <span className="font-bold text-rose-500">{mismatch.reason}</span>
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
