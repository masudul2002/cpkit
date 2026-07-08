"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Copy, RotateCcw, Activity } from "lucide-react";

export function ExpressionEvaluator() {
  const { toast } = useToast();
  
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
    for (let char of expr) {
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

    // 1. Bracket balancing check
    if (!checkBracketBalance(trimmed)) {
      setError("Unbalanced parentheses/brackets detected");
      return;
    }

    // 2. Syntax sanitization
    // Allow digits, spaces, decimal dots, and + - * / % ( )
    if (/[^0-9\+\-\*\/\%\.\(\)\s]/.test(trimmed)) {
      setError("Expression contains invalid symbols or alphabetical letters");
      return;
    }

    // 3. Division by zero check
    if (/\/0(?![0-9\.])/.test(trimmed)) {
      setError("Division by zero is undefined");
      return;
    }

    try {
      // Safe function evaluation
      const cleanExpr = trimmed.replace(/\s+/g, "");
      
      // Tokenize for display helper
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

  const handleCopy = () => {
    if (!result || result === "Error") return;
    navigator.clipboard.writeText(result);
    toast({
      title: "Copied to Clipboard",
      description: `Result value ${result} copied successfully.`,
      variant: "success",
    });
  };

  return (
    <Card className="max-w-xl w-full mx-auto border-border/40 shadow-lg relative bg-card/65 backdrop-blur-md">
      <CardHeader className="pb-3 border-b border-border/10 flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-base">Safe Expression Evaluator</CardTitle>
          <CardDescription>
            Evaluate complex mathematical formulae containing standard arithmetic precedence.
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClear}
          className="h-8 w-8 p-0 cursor-pointer"
          title="Reset"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      </CardHeader>
      
      <CardContent className="p-6 space-y-5">
        {/* Input field */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground/80">Mathematical Formula</label>
          <Input
            placeholder="e.g. ((5 * 4) + 12 - 3) / 2.5"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            className={`font-mono text-sm ${error ? "border-rose-500/50 focus-visible:ring-rose-500" : ""}`}
          />
          {error && <p className="text-[10px] text-rose-500 font-semibold">{error}</p>}
        </div>

        <Button
          onClick={handleEvaluate}
          className="w-full justify-center gap-1.5 cursor-pointer"
        >
          <Activity className="h-4 w-4" />
          Evaluate Formula
        </Button>

        {/* Output blocks */}
        {result && (
          <div className="space-y-4 pt-4 border-t border-border/10">
            {/* Parsed Formula Breakdown */}
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

            {/* Evaluated Value */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-muted-foreground">Evaluation Result</span>
                {result !== "Error" && (
                  <button
                    onClick={handleCopy}
                    className="text-[10px] text-primary hover:underline font-bold cursor-pointer"
                  >
                    Copy Value
                  </button>
                )}
              </div>
              <div className="p-3 bg-muted/40 rounded-lg border font-mono text-sm break-all font-bold">
                {result}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
