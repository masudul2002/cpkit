"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { Copy, RotateCcw, Equal } from "lucide-react";

export function BigInteger() {
  const { toast } = useToast();
  
  const [valA, setValA] = React.useState("");
  const [valB, setValB] = React.useState("");
  const [operator, setOperator] = React.useState<"ADD" | "SUB" | "MUL" | "DIV" | "MOD" | "POW">("ADD");
  
  const [result, setResult] = React.useState("0");
  const [errors, setErrors] = React.useState<{ valA?: string; valB?: string; general?: string }>({});

  const handleClear = () => {
    setValA("");
    setValB("");
    setResult("0");
    setErrors({});
  };

  const handleEvaluate = () => {
    setErrors({});
    
    const cleanA = valA.trim();
    const cleanB = valB.trim();

    if (!cleanA) {
      setErrors({ valA: "Integer A is required" });
      return;
    }
    if (!cleanB) {
      setErrors({ valB: "Integer B is required" });
      return;
    }

    // BigInt must be pure digits (optionally prefixed by a minus sign)
    const bigIntRegex = /^\-?[0-9]+$/;

    if (!bigIntRegex.test(cleanA)) {
      setErrors({ valA: "Must be a valid integer (decimals or symbols not allowed)" });
      return;
    }
    if (!bigIntRegex.test(cleanB)) {
      setErrors({ valB: "Must be a valid integer (decimals or symbols not allowed)" });
      return;
    }

    try {
      const bigA = BigInt(cleanA);
      const bigB = BigInt(cleanB);
      let res = BigInt(0);

      switch (operator) {
        case "ADD":
          res = bigA + bigB;
          break;
        case "SUB":
          res = bigA - bigB;
          break;
        case "MUL":
          res = bigA * bigB;
          break;
        case "DIV":
          if (bigB === BigInt(0)) throw new Error("Division by zero");
          res = bigA / bigB;
          break;
        case "MOD":
          if (bigB === BigInt(0)) throw new Error("Modulo by zero");
          res = bigA % bigB;
          break;
        case "POW":
          if (bigB < BigInt(0)) throw new Error("Exponentiation power cannot be negative");
          // Cap exponentiation to avoid browser memory freeze (e.g. max exponent of 1000)
          if (bigB > BigInt(1000)) throw new Error("Exponent power limit exceeded (max 1000)");
          res = bigA ** bigB;
          break;
      }

      setResult(res.toString());
    } catch (err: any) {
      setErrors({ general: err.message || "Failed to execute BigInt arithmetic" });
      setResult("Error");
    }
  };

  const handleCopy = () => {
    if (result === "Error" || result === "0") return;
    navigator.clipboard.writeText(result);
    toast({
      title: "Copied to Clipboard",
      description: "BigInt result copied successfully.",
      variant: "success",
    });
  };

  return (
    <Card className="max-w-xl w-full mx-auto border-border/40 shadow-lg relative bg-card/65 backdrop-blur-md">
      <CardHeader className="pb-3 border-b border-border/10 flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-base">Big Integer Calculator</CardTitle>
          <CardDescription>
            Compute calculations on numbers exceeding JavaScript limits using native BigInt.
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
        {errors.general && (
          <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg">
            {errors.general}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          {/* Input A */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80">Integer A</label>
            <Input
              placeholder="e.g. 12345678901234567890"
              value={valA}
              onChange={(e) => setValA(e.target.value)}
              className={`font-mono text-sm ${errors.valA ? "border-rose-500/50 focus-visible:ring-rose-500" : ""}`}
            />
            {errors.valA && <p className="text-[10px] text-rose-500 font-semibold">{errors.valA}</p>}
          </div>

          {/* Operator */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80">Operation</label>
            <Select value={operator} onChange={(e) => setOperator(e.target.value as any)}>
              <option value="ADD">Add (+)</option>
              <option value="SUB">Subtract (-)</option>
              <option value="MUL">Multiply (*)</option>
              <option value="DIV">Divide (/)</option>
              <option value="MOD">Modulo (%)</option>
              <option value="POW">Power (**)</option>
            </Select>
          </div>
        </div>

        {/* Input B */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground/80">Integer B</label>
          <Input
            placeholder="e.g. 98765432109876543210"
            value={valB}
            onChange={(e) => setValB(e.target.value)}
            className={`font-mono text-sm ${errors.valB ? "border-rose-500/50 focus-visible:ring-rose-500" : ""}`}
          />
          {errors.valB && <p className="text-[10px] text-rose-500 font-semibold">{errors.valB}</p>}
        </div>

        <Button
          onClick={handleEvaluate}
          className="w-full justify-center gap-1.5 mt-2 cursor-pointer"
        >
          <Equal className="h-4 w-4" />
          Compute BigInt Expression
        </Button>

        {/* Output */}
        <div className="space-y-1.5 pt-4 border-t border-border/10">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-muted-foreground">Evaluation Result</span>
            {result !== "0" && result !== "Error" && (
              <button
                onClick={handleCopy}
                className="text-[10px] text-primary hover:underline font-bold cursor-pointer"
              >
                Copy Result
              </button>
            )}
          </div>
          <div className="p-3 bg-muted/40 rounded-lg border font-mono text-sm break-all font-bold">
            {result}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
