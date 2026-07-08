"use client";

import * as React from "react";
import { ToolHeader } from "../shared/tool-header";
import { ToolLayout } from "../shared/tool-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Copy, RotateCcw, Equal, Trash2 } from "lucide-react";

export function CalculatorTool() {
  const { toast } = useToast();
  const [expression, setExpression] = React.useState("");
  const [result, setResult] = React.useState("0");
  const [error, setError] = React.useState<string | null>(null);
  
  // History local state, cached in localStorage
  const [history, setHistory] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cpkit_calc_history");
      if (saved) {
        try {
          setHistory(JSON.parse(saved));
        } catch {}
      }
    }
  }, []);

  const handleInput = (char: string) => {
    setError(null);
    setExpression((prev) => prev + char);
  };

  const handleClear = () => {
    setExpression("");
    setResult("0");
    setError(null);
  };

  const handleBackspace = () => {
    setError(null);
    setExpression((prev) => prev.slice(0, -1));
  };

  const handleEvaluate = React.useCallback(() => {
    if (!expression.trim()) return;
    try {
      const sanitized = expression.replace(/[^0-9\+\-\*\/\%\.\(\)\s]/g, "");
      
      if (/\/0(?![0-9\.])/.test(sanitized)) {
        throw new Error("Division by zero");
      }

      const evalResult = new Function(`return (${sanitized})`)();
      
      if (evalResult === null || evalResult === undefined || isNaN(evalResult)) {
        throw new Error("Invalid expression");
      }
      
      const resStr = String(evalResult);
      setResult(resStr);
      setError(null);

      // Add to history
      const newEntry = `${expression} = ${resStr}`;
      setHistory((prev) => {
        const next = [newEntry, ...prev.slice(0, 9)];
        localStorage.setItem("cpkit_calc_history", JSON.stringify(next));
        return next;
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid expression");
      setResult("Error");
    }
  }, [expression]);

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("cpkit_calc_history");
    toast({
      title: "History Cleared",
      description: "Calculator operation logs purged.",
      variant: "info",
    });
  };

  const handleCopy = () => {
    if (result === "Error" || result === "0") return;
    navigator.clipboard.writeText(result);
    toast({
      title: "Copied to Clipboard",
      description: `Result value ${result} copied.`,
      variant: "success",
    });
  };

  // Keyboard support
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement;
      if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA")) return;

      const key = e.key;

      if (/[0-9\+\-\*\/\%\.\(\)]/.test(key)) {
        e.preventDefault();
        handleInput(key);
      } else if (key === "Enter" || key === "=") {
        e.preventDefault();
        handleEvaluate();
      } else if (key === "Backspace") {
        e.preventDefault();
        handleBackspace();
      } else if (key === "Escape" || key.toLowerCase() === "c") {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expression, handleEvaluate]);

  const buttons = [
    { label: "(", type: "op" },
    { label: ")", type: "op" },
    { label: "%", type: "op" },
    { label: "C", type: "clear", action: handleClear },
    
    { label: "7", type: "num" },
    { label: "8", type: "num" },
    { label: "9", type: "num" },
    { label: "/", type: "op" },
    
    { label: "4", type: "num" },
    { label: "5", type: "num" },
    { label: "6", type: "num" },
    { label: "*", type: "op" },
    
    { label: "1", type: "num" },
    { label: "2", type: "num" },
    { label: "3", type: "num" },
    { label: "-", type: "op" },
    
    { label: "0", type: "num" },
    { label: ".", type: "num" },
    { label: "⌫", type: "back", action: handleBackspace },
    { label: "+", type: "op" },
  ];

  const examples = [
    { input: "(5 + 3) * 2", output: "16", description: "Parentheses Precedence" },
    { input: "15 % 4", output: "3", description: "Modulo Divisor Remainder" },
    { input: "10 / 3", output: "3.3333333333333335", description: "Float Quotient" },
  ];

  const notes = [
    "Supports parentheses priorities and floats calculation.",
    "Physical numeric keys are mapped automatically for faster input entry.",
    "Modulo % computes standard remainder checks.",
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
        title="Fast Calculator"
        description="Standard pocket calculator equipped with full physical keyboard captures and history tracing."
        category="Arithmetic"
        difficulty="Easy"
        shortcut="Alt+1"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs overflow-hidden">
        <CardContent className="p-6 space-y-5">
          {/* Screen Output Display */}
          <div className="p-4 bg-muted/40 rounded-xl border border-border/20 text-right space-y-1 relative min-h-[96px] flex flex-col justify-end">
            <div className="text-xs text-muted-foreground font-mono break-all leading-normal select-all">
              {expression || "0"}
            </div>
            <div className={`text-2xl font-bold font-mono tracking-tight break-all ${error ? "text-rose-500" : "text-foreground"}`}>
              {result}
            </div>
            {error && (
              <span className="absolute left-3 bottom-2 text-[10px] font-semibold text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded">
                {error}
              </span>
            )}
          </div>

          {/* Grid buttons */}
          <div className="grid grid-cols-4 gap-2.5">
            {buttons.map((btn, idx) => (
              <Button
                key={idx}
                variant={
                  btn.type === "clear"
                    ? "outline"
                    : btn.type === "op"
                    ? "outline"
                    : undefined
                }
                className={`h-12 font-mono text-sm font-bold cursor-pointer transition-all ${
                  btn.type === "clear"
                    ? "text-rose-500 hover:bg-rose-500/10 border-rose-500/25"
                    : btn.type === "op"
                    ? "bg-accent/40 hover:bg-accent/65"
                    : ""
                }`}
                onClick={btn.action || (() => handleInput(btn.label))}
              >
                {btn.label}
              </Button>
            ))}
            
            <Button
              onClick={handleEvaluate}
              className="col-span-4 h-12 text-sm font-bold bg-primary hover:bg-primary/95 text-primary-foreground flex justify-center items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Equal className="h-4 w-4" />
              Evaluate Expression
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* History panel */}
      {history.length > 0 && (
        <Card className="border-border/40 shadow-xs">
          <CardHeader className="flex flex-row justify-between items-center pb-2 border-b border-border/10">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Calculation History
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={clearHistory}
              className="h-7 gap-1 text-[10px] cursor-pointer"
            >
              <Trash2 className="h-3 w-3" />
              Clear Log
            </Button>
          </CardHeader>
          <CardContent className="pt-4 max-h-48 overflow-y-auto space-y-2 text-xs font-mono">
            {history.map((h, idx) => (
              <div
                key={idx}
                className="flex justify-between border-b border-border/5 pb-1 cursor-pointer hover:text-primary transition-colors"
                onClick={() => {
                  const parts = h.split(" = ");
                  setExpression(parts[0]);
                  setResult(parts[1]);
                }}
              >
                <span className="text-muted-foreground">{h.split(" = ")[0]}</span>
                <span className="font-bold text-foreground">{h.split(" = ")[1]}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </ToolLayout>
  );
}
