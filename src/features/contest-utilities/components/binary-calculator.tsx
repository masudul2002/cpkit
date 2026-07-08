"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { Copy, RotateCcw, Equal } from "lucide-react";

export function BinaryCalculator() {
  const { toast } = useToast();
  
  const [valA, setValA] = React.useState("");
  const [valB, setValB] = React.useState("");
  const [inputFormat, setInputFormat] = React.useState<"dec" | "bin">("dec");
  const [operator, setOperator] = React.useState<"AND" | "OR" | "XOR" | "NOT" | "LSHIFT" | "RSHIFT">("AND");
  
  const [resultDec, setResultDec] = React.useState("0");
  const [resultBin, setResultBin] = React.useState("0");
  const [errors, setErrors] = React.useState<{ valA?: string; valB?: string; general?: string }>({});

  const handleClear = () => {
    setValA("");
    setValB("");
    setResultDec("0");
    setResultBin("0");
    setErrors({});
  };

  const handleEvaluate = () => {
    setErrors({});
    
    if (!valA.trim()) {
      setErrors({ valA: "Value A is required" });
      return;
    }

    if (operator !== "NOT" && !valB.trim()) {
      setErrors({ valB: "Value B is required for this operator" });
      return;
    }

    // Regular Expression validation
    const decRegex = /^\-?[0-9]+$/;
    const binRegex = /^[01]+$/;

    const regex = inputFormat === "dec" ? decRegex : binRegex;
    const formatName = inputFormat === "dec" ? "decimal integer" : "binary digits";

    if (!regex.test(valA.trim())) {
      setErrors({ valA: `Value A must be a valid ${formatName}` });
      return;
    }

    if (operator !== "NOT" && !regex.test(valB.trim())) {
      setErrors({ valB: `Value B must be a valid ${formatName}` });
      return;
    }

    try {
      // Parse values based on format
      const base = inputFormat === "dec" ? 10 : 2;
      
      // We will parse with BigInt to support large bits.
      // However, bitwise shifts in JS are limited or require custom logic for BigInt.
      // BigInt bitwise operations: A & B, A | B, A ^ B, ~A, A << B, A >> B are supported in ES2020!
      const bigA = inputFormat === "dec" ? BigInt(valA.trim()) : BigInt("0b" + valA.trim());
      let bigB = BigInt(0);

      if (operator !== "NOT") {
        bigB = inputFormat === "dec" ? BigInt(valB.trim()) : BigInt("0b" + valB.trim());
      }

      let res = BigInt(0);

      switch (operator) {
        case "AND":
          res = bigA & bigB;
          break;
        case "OR":
          res = bigA | bigB;
          break;
        case "XOR":
          res = bigA ^ bigB;
          break;
        case "NOT":
          res = ~bigA;
          break;
        case "LSHIFT":
          if (bigB < BigInt(0)) throw new Error("Shift count cannot be negative");
          res = bigA << bigB;
          break;
        case "RSHIFT":
          if (bigB < BigInt(0)) throw new Error("Shift count cannot be negative");
          res = bigA >> bigB;
          break;
      }

      setResultDec(res.toString(10));
      
      // If result is negative, toString(2) returns standard minus binary.
      // We can format it nicely.
      setResultBin(res.toString(2));
    } catch (err: any) {
      setErrors({ general: err.message || "Arithmetic bitwise error occurred" });
      setResultDec("Error");
      setResultBin("Error");
    }
  };

  const handleCopy = (val: string, label: string) => {
    if (val === "Error" || val === "0") return;
    navigator.clipboard.writeText(val);
    toast({
      title: "Copied to Clipboard",
      description: `${label} result copied successfully.`,
      variant: "success",
    });
  };

  return (
    <Card className="max-w-xl w-full mx-auto border-border/40 shadow-lg relative bg-card/65 backdrop-blur-md">
      <CardHeader className="pb-3 border-b border-border/10 flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-base">Binary Calculator</CardTitle>
          <CardDescription>
            Compute bitwise AND, OR, XOR, NOT, and shift operations on numbers.
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

        {/* Input format selector & operator selector */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80">Input Number System</label>
            <Select
              value={inputFormat}
              onChange={(e) => {
                setInputFormat(e.target.value as any);
                handleClear();
              }}
            >
              <option value="dec">Decimal (Base 10)</option>
              <option value="bin">Binary (Base 2)</option>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80">Bitwise Operator</label>
            <Select value={operator} onChange={(e) => setOperator(e.target.value as any)}>
              <option value="AND">AND (&)</option>
              <option value="OR">OR (|)</option>
              <option value="XOR">XOR (^)</option>
              <option value="NOT">NOT (~)</option>
              <option value="LSHIFT">Left Shift (&lt;&lt;)</option>
              <option value="RSHIFT">Right Shift (&gt;&gt;)</option>
            </Select>
          </div>
        </div>

        {/* Inputs A & B */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80">Value A</label>
            <Input
              placeholder={inputFormat === "dec" ? "e.g. 12" : "e.g. 1100"}
              value={valA}
              onChange={(e) => setValA(e.target.value)}
              className={`font-mono text-sm ${errors.valA ? "border-rose-500/50 focus-visible:ring-rose-500" : ""}`}
            />
            {errors.valA && <p className="text-[10px] text-rose-500 font-semibold">{errors.valA}</p>}
          </div>

          {operator !== "NOT" && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">
                {operator === "LSHIFT" || operator === "RSHIFT" ? "Shift Count (B)" : "Value B"}
              </label>
              <Input
                placeholder={
                  operator === "LSHIFT" || operator === "RSHIFT"
                    ? "e.g. 2"
                    : inputFormat === "dec"
                    ? "e.g. 5"
                    : "e.g. 0101"
                }
                value={valB}
                onChange={(e) => setValB(e.target.value)}
                className={`font-mono text-sm ${errors.valB ? "border-rose-500/50 focus-visible:ring-rose-500" : ""}`}
              />
              {errors.valB && <p className="text-[10px] text-rose-500 font-semibold">{errors.valB}</p>}
            </div>
          )}
        </div>

        <Button
          onClick={handleEvaluate}
          className="w-full justify-center gap-1.5 mt-2 cursor-pointer"
        >
          <Equal className="h-4 w-4" />
          Compute Bitwise Operation
        </Button>

        {/* Results Block */}
        <div className="space-y-4 pt-4 border-t border-border/10">
          {/* Decimal Result */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-muted-foreground">Result (Decimal)</span>
              {resultDec !== "0" && resultDec !== "Error" && (
                <button
                  onClick={() => handleCopy(resultDec, "Decimal result")}
                  className="text-[10px] text-primary hover:underline font-bold cursor-pointer"
                >
                  Copy
                </button>
              )}
            </div>
            <div className="p-3 bg-muted/40 rounded-lg border font-mono text-sm break-all font-bold">
              {resultDec}
            </div>
          </div>

          {/* Binary Result */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-muted-foreground">Result (Binary)</span>
              {resultBin !== "0" && resultBin !== "Error" && (
                <button
                  onClick={() => handleCopy(resultBin, "Binary result")}
                  className="text-[10px] text-primary hover:underline font-bold cursor-pointer"
                >
                  Copy
                </button>
              )}
            </div>
            <div className="p-3 bg-muted/40 rounded-lg border font-mono text-sm break-all font-bold">
              {resultBin}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
