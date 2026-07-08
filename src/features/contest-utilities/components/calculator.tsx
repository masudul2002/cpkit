"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Copy, RotateCcw, ArrowLeft, Equal } from "lucide-react";

export function Calculator() {
  const { toast } = useToast();
  const [expression, setExpression] = React.useState("");
  const [result, setResult] = React.useState("0");
  const [error, setError] = React.useState<string | null>(null);

  // Focus keybinds for arithmetic
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
  }, [expression]);

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

  const handleEvaluate = () => {
    if (!expression.trim()) return;
    try {
      // Safe math evaluation
      // Replace % with /100 where needed or treat as modulo.
      // In competitive programming, '%' is usually modulo. Let's support JavaScript modulo (%) operator!
      // We will perform a simple sanitization check to make it safe to evaluate.
      const sanitized = expression.replace(/[^0-9\+\-\*\/\%\.\(\)\s]/g, "");
      
      // Prevent eval on division by zero
      if (/\/0(?![0-9\.])/.test(sanitized)) {
        throw new Error("Division by zero");
      }

      const evalResult = new Function(`return (${sanitized})`)();
      
      if (evalResult === null || evalResult === undefined || isNaN(evalResult)) {
        throw new Error("Invalid expression");
      }
      
      setResult(String(evalResult));
      setError(null);
    } catch (err: any) {
      setError(err.message || "Invalid expression");
      setResult("Error");
    }
  };

  const handleCopy = () => {
    if (result === "Error" || result === "0") return;
    navigator.clipboard.writeText(result);
    toast({
      title: "Copied to Clipboard",
      description: `Result ${result} copied successfully.`,
      variant: "success",
    });
  };

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

  return (
    <Card className="max-w-md w-full mx-auto border-border/40 shadow-lg relative overflow-hidden bg-card/65 backdrop-blur-md">
      <CardHeader className="pb-3 border-b border-border/10">
        <CardTitle className="text-base flex items-center justify-between">
          <span>Standard Calculator</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="h-8 w-8 p-0 cursor-pointer"
              title="Copy Result"
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="h-8 w-8 p-0 cursor-pointer"
              title="Reset Calculator"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          Type on your physical keyboard or press visual keys to evaluate expressions.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4">
        {/* Output Panel */}
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

        {/* Buttons Grid */}
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
          
          {/* Equal evaluate button spanned across all 4 columns */}
          <Button
            onClick={handleEvaluate}
            className="col-span-4 h-12 text-sm font-bold bg-primary hover:bg-primary/95 text-primary-foreground flex justify-center items-center gap-1.5 cursor-pointer shadow-md shadow-primary/10"
          >
            <Equal className="h-4 w-4" />
            Evaluate Expression
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
