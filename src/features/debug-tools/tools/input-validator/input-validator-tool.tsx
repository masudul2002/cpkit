"use client";

import * as React from "react";
import { ToolHeader } from "../../shared/tool-header";
import { ToolLayout } from "../../shared/tool-layout";
import { InputEditor } from "../../shared/input-editor";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";

export function InputValidatorTool() {
  const [inputText, setInputText] = React.useState("");
  const [typeMode, setTypeMode] = React.useState<"int" | "float" | "string" | "array" | "matrix">("array");
  const [minVal, setMinVal] = React.useState("1");
  const [maxVal, setMaxVal] = React.useState("1000000000");
  const [expectedSize, setExpectedSize] = React.useState("5"); // length for array, rows for matrix
  const [expectedCols, setExpectedCols] = React.useState("3"); // columns for matrix

  const [compared, setCompared] = React.useState(false);
  const [errors, setErrors] = React.useState<string[]>([]);

  const handleClear = () => {
    setInputText("");
    setCompared(false);
    setErrors([]);
  };

  const handleEvaluate = () => {
    setCompared(true);
    const errs: string[] = [];

    const trimmed = inputText.trim();
    if (!trimmed) {
      setErrors(["Input is empty"]);
      return;
    }

    const minNum = parseFloat(minVal);
    const maxNum = parseFloat(maxVal);
    const sizeNum = parseInt(expectedSize, 10);
    const colsNum = parseInt(expectedCols, 10);

    const checkValueBounds = (valStr: string, label: string): boolean => {
      const val = parseFloat(valStr);
      if (isNaN(val)) {
        errs.push(`${label} is not a valid number: "${valStr}"`);
        return false;
      }
      if (!isNaN(minNum) && val < minNum) {
        errs.push(`${label} violates min constraint: ${val} < ${minNum}`);
        return false;
      }
      if (!isNaN(maxNum) && val > maxNum) {
        errs.push(`${label} violates max constraint: ${val} > ${maxNum}`);
        return false;
      }
      return true;
    };

    if (typeMode === "int") {
      if (!/^\-?[0-9]+$/.test(trimmed)) {
        errs.push(`Input is not a valid integer format: "${trimmed}"`);
      } else {
        checkValueBounds(trimmed, "Integer Value");
      }
    } else if (typeMode === "float") {
      if (!/^\-?[0-9]+(\.[0-9]+)?$/.test(trimmed)) {
        errs.push(`Input is not a valid decimal float format: "${trimmed}"`);
      } else {
        checkValueBounds(trimmed, "Float Value");
      }
    } else if (typeMode === "string") {
      if (!isNaN(minNum) && trimmed.length < minNum) {
        errs.push(`String length is below min constraint: ${trimmed.length} < ${minNum}`);
      }
      if (!isNaN(maxNum) && trimmed.length > maxNum) {
        errs.push(`String length exceeds max constraint: ${trimmed.length} > ${maxNum}`);
      }
    } else if (typeMode === "array") {
      const tokens = trimmed.split(/\s+/).filter(Boolean);
      
      if (!isNaN(sizeNum) && tokens.length !== sizeNum) {
        errs.push(`Array length mismatch: expected size ${sizeNum}, got ${tokens.length} elements`);
      }

      tokens.forEach((t, idx) => {
        if (!/^\-?[0-9]+$/.test(t)) {
          errs.push(`Element at index ${idx + 1} is not a valid integer: "${t}"`);
        } else {
          checkValueBounds(t, `Element at index ${idx + 1} (${t})`);
        }
      });
    } else if (typeMode === "matrix") {
      const lines = trimmed.split(/\n/).filter(Boolean);
      
      if (!isNaN(sizeNum) && lines.length !== sizeNum) {
        errs.push(`Matrix row count mismatch: expected ${sizeNum} rows, got ${lines.length} rows`);
      }

      lines.forEach((line, rIdx) => {
        const cols = line.trim().split(/\s+/).filter(Boolean);
        if (!isNaN(colsNum) && cols.length !== colsNum) {
          errs.push(`Row ${rIdx + 1} columns mismatch: expected ${colsNum} elements, got ${cols.length}`);
        }

        cols.forEach((t, cIdx) => {
          if (!/^\-?[0-9]+$/.test(t)) {
            errs.push(`Matrix element at [Row ${rIdx + 1}, Col ${cIdx + 1}] is not an integer: "${t}"`);
          } else {
            checkValueBounds(t, `Matrix element at [Row ${rIdx + 1}, Col ${cIdx + 1}] (${t})`);
          }
        });
      });
    }

    setErrors(errs);
  };

  const handleSelectExample = (exp: string) => {
    // example format: "mode;min;max;size;cols;input"
    const [mode, min, max, size, cols, input] = exp.split(";");
    setTypeMode(mode as any);
    setMinVal(min);
    setMaxVal(max);
    setExpectedSize(size);
    setExpectedCols(cols);
    setInputText(input.replace(/\\n/g, "\n"));
    setCompared(false);
  };

  const examples = [
    {
      input: "array;1;100;5;0;10 20 15 99 105",
      output: "Invalid: Element at index 5 violates max constraint (105 > 100)",
      description: "1D Array Constraints Check",
    },
    {
      input: "matrix;1;1000;3;3;1 2 3\\n4 5 6\\n7 8 9",
      output: "Valid: fits 3x3 matrix constraints",
      description: "2D Matrix Grid Validation",
    },
  ];

  const notes = [
    "Validates formatting types (Integers, Floats, Strings, Arrays, Matrices).",
    "Provides index tracking pointing to the exact cell or position of failures.",
    "Useful for local stress test runs where wrong output formatting halts tests.",
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
        title="Input Validator"
        description="Verify test case configurations by validating structures and integer bounds constraints."
        category="Verification"
        difficulty="Medium"
        shortcut="Alt+Shift+9"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs">
        <CardHeader className="flex flex-row justify-between items-center pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Validation Parameters
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
              <label className="text-xs font-semibold text-foreground/80">Input Format Type</label>
              <Select value={typeMode} onChange={(e) => setTypeMode(e.target.value as any)}>
                <option value="int">Single Integer</option>
                <option value="float">Single Float Decimal</option>
                <option value="string">String (character length check)</option>
                <option value="array">1D Array (space separated integers)</option>
                <option value="matrix">2D Matrix Grid (newlined integer rows)</option>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <InputField label="Min Constraint" value={minVal} onChange={setMinVal} />
              <InputField label="Max Constraint" value={maxVal} onChange={setMaxVal} />
            </div>
          </div>

          {(typeMode === "array" || typeMode === "matrix") && (
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                label={typeMode === "array" ? "Expected Array Size (N)" : "Expected Matrix Rows (N)"}
                value={expectedSize}
                onChange={setExpectedSize}
              />
              {typeMode === "matrix" && (
                <InputField
                  label="Expected Matrix Columns (M)"
                  value={expectedCols}
                  onChange={setExpectedCols}
                />
              )}
            </div>
          )}

          <InputEditor
            label="Input Value Dataset"
            value={inputText}
            onChange={(val) => {
              setInputText(val);
              setCompared(false);
            }}
            placeholder="Paste input values to validate..."
          />

          <Button
            onClick={handleEvaluate}
            className="w-full justify-center mt-2 cursor-pointer"
          >
            Validate Input Bounds
          </Button>

          {compared && inputText.trim() && (
            <div className="pt-4 border-t border-border/10">
              {errors.length === 0 ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center gap-3 text-sm font-bold">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <span>Verified: Input values conform to all constraints!</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg flex items-center gap-3 text-sm font-bold">
                    <XCircle className="h-5 w-5 shrink-0" />
                    <span>Failed: Found {errors.length} formatting errors:</span>
                  </div>

                  <div className="p-4 rounded-xl border border-border/40 bg-rose-500/[0.02] text-xs font-mono space-y-1.5 max-h-48 overflow-y-auto">
                    {errors.map((err, idx) => (
                      <div key={idx} className="text-rose-500 flex items-start gap-1">
                        <span>•</span>
                        <span>{err}</span>
                      </div>
                    ))}
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
