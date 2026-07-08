"use client";

import * as React from "react";
import { ToolHeader } from "../shared/tool-header";
import { ToolLayout } from "../shared/tool-layout";
import { InputField } from "../shared/input-field";
import { OutputField } from "../shared/output-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw, Activity } from "lucide-react";

export function ExpressionEvaluatorTool() {
  const [expression, setExpression] = React.useState("");
  const [result, setResult] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [parsedTokens, setParsedTokens] = React.useState<string[]>([]);

  const handleClear = () => {
    setExpression("");
    setResult("");
    setError(null);
    setParsedTokens([]);
  };

  const checkBracketBalance = (expr: string): boolean => {
    const stack: string[] = [];
    for (const char of expr) {
      if (char === "(") {
        stack.push(char);
      } else if (char === ")") {
        if (stack.length === 0) return false;
        stack.pop();
      }
    }
    return stack.length === 0;
  };

  const handleEvaluate = () => {
    setError(null);
    setResult("");
    setParsedTokens([]);

    const trimmed = expression.trim();
    if (!trimmed) return;

    if (!checkBracketBalance(trimmed)) {
      setError("Unbalanced parentheses detected");
      return;
    }

    if (/[^0-9\+\-\*\/\%\.\(\)\s]/.test(trimmed)) {
      setError("Expression contains invalid characters or letters");
      return;
    }

    if (/\/0(?![0-9\.])/.test(trimmed)) {
      setError("Division by zero is undefined");
      return;
    }

    try {
      const cleanExpr = trimmed.replace(/\s+/g, "");
      
      const tokens = cleanExpr.split(/([\+\-\*\/\%\(\)])/).filter(Boolean);
      setParsedTokens(tokens);

      const val = new Function(`return (${cleanExpr})`)();

      if (val === null || val === undefined || isNaN(val) || !isFinite(val)) {
        throw new Error("Invalid equation evaluation");
      }

      setResult(String(val));
    } catch {
      setError("Syntax error: could not evaluate expression");
      setResult("Error");
    }
  };

  const examples = [
    { input: "(3 + 5) * (10 - 2)", output: "64", description: "Parentheses grouping" },
    { input: "2.5 * 4 + (15 / 3)", output: "15", description: "Float products and division priorities" },
    { input: "100 - (20 + 30) / 2", output: "75", description: "Nested priorities" },
  ];

  const notes = [
    "Supports parentheses priorities, decimal values, and operators (+, -, *, /, %).",
    "Inputs are parsed securely using strict regex filters.",
    "Parentheses pairing is verified before execution to prevent compile errors.",
  ];

  return (
    <ToolLayout
      examples={examples}
      notes={notes}
      timeComplexity="O(N)"
      spaceComplexity="O(N)"
      onSelectExample={(expr) => setExpression(expr)}
    >
      <ToolHeader
        title="Expression Evaluator"
        description="Safely parse and evaluate mathematical equations containing priorities and float divisions."
        category="Arithmetic"
        difficulty="Medium"
        shortcut="Alt+6"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs">
        <CardHeader className="flex flex-row justify-between items-center pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Evaluation Panel
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
          <InputField
            label="Mathematical Formula"
            placeholder="e.g. ((5 * 4) + 12 - 3) / 2.5"
            value={expression}
            onChange={setExpression}
            error={error || undefined}
          />

          <Button
            onClick={handleEvaluate}
            className="w-full justify-center gap-1.5 mt-2 cursor-pointer"
          >
            <Activity className="h-4 w-4" />
            Evaluate Formula
          </Button>

          {result && (
            <div className="space-y-4 pt-4 border-t border-border/10">
              {parsedTokens.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Parsed Equation Tokens
                  </span>
                  <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                    {parsedTokens.map((t, idx) => {
                      const isOp = /[\+\-\*\/\%\(\)]/.test(t);
                      return (
                        <span
                          key={idx}
                          className={`px-1.5 py-0.5 rounded border ${
                            isOp
                              ? "bg-primary/5 text-primary border-primary/25 font-bold"
                              : "bg-muted/40 text-foreground border-border/40"
                          }`}
                        >
                          {t}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              <OutputField label="Result" value={result} isError={result === "Error"} />
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
