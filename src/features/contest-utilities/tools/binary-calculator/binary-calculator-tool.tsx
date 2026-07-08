"use client";

import * as React from "react";
import { ToolHeader } from "../shared/tool-header";
import { ToolLayout } from "../shared/tool-layout";
import { InputField } from "../shared/input-field";
import { OutputField } from "../shared/output-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { RotateCcw, Equal } from "lucide-react";

export function BinaryCalculatorTool() {
  const [valA, setValA] = React.useState("");
  const [valB, setValB] = React.useState("");
  const [inputFormat, setInputFormat] = React.useState<"dec" | "bin" | "hex">("dec");
  const [operator, setOperator] = React.useState<"AND" | "OR" | "XOR" | "NOT" | "LSHIFT" | "RSHIFT">("AND");
  
  const [resultDec, setResultDec] = React.useState("0");
  const [resultBin, setResultBin] = React.useState("0");
  const [resultHex, setResultHex] = React.useState("0");
  const [errors, setErrors] = React.useState<{ valA?: string; valB?: string; general?: string }>({});

  const handleClear = () => {
    setValA("");
    setValB("");
    setResultDec("0");
    setResultBin("0");
    setResultHex("0");
    setErrors({});
  };

  const handleEvaluate = React.useCallback(() => {
    setErrors({});
    
    const cleanA = valA.trim();
    const cleanB = valB.trim();

    if (!cleanA) {
      setErrors({ valA: "Value A is required" });
      return;
    }

    if (operator !== "NOT" && !cleanB) {
      setErrors({ valB: "Value B is required for this operator" });
      return;
    }

    // Input validations based on selected system
    let decRegex = /^\-?[0-9]+$/;
    let binRegex = /^[01]+$/;
    let hexRegex = /^[0-9A-Fa-f]+$/;

    let regex = decRegex;
    let formatLabel = "decimal integer";

    if (inputFormat === "bin") {
      regex = binRegex;
      formatLabel = "binary digits (0 or 1)";
    } else if (inputFormat === "hex") {
      regex = hexRegex;
      formatLabel = "hexadecimal digits (0-9, A-F)";
    }

    if (!regex.test(cleanA)) {
      setErrors({ valA: `Value A must be a valid ${formatLabel}` });
      return;
    }

    if (operator !== "NOT" && !regex.test(cleanB)) {
      setErrors({ valB: `Value B must be a valid ${formatLabel}` });
      return;
    }

    try {
      let bigA = BigInt(0);
      let bigB = BigInt(0);

      if (inputFormat === "dec") {
        bigA = BigInt(cleanA);
      } else if (inputFormat === "bin") {
        bigA = BigInt("0b" + cleanA);
      } else {
        bigA = BigInt("0x" + cleanA);
      }

      if (operator !== "NOT") {
        if (inputFormat === "dec") {
          bigB = BigInt(cleanB);
        } else if (inputFormat === "bin") {
          bigB = BigInt("0b" + cleanB);
        } else {
          bigB = BigInt("0x" + cleanB);
        }
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
      setResultBin(res.toString(2));
      setResultHex(res.toString(16).toUpperCase());
    } catch (err: unknown) {
      setErrors({ general: err instanceof Error ? err.message : "Arithmetic bitwise error" });
      setResultDec("Error");
      setResultBin("Error");
      setResultHex("Error");
    }
  }, [valA, valB, inputFormat, operator]);

  const handleSelectExample = (val: string) => {
    // Example formatted as: "dec,AND,5,12" (format,operator,valB,valA)
    const [fmt, op, bVal, aVal] = val.split(",");
    setInputFormat(fmt as any);
    setOperator(op as any);
    setValA(aVal);
    setValB(bVal);
  };

  React.useEffect(() => {
    if (valA && (operator === "NOT" || valB)) {
      handleEvaluate();
    }
  }, [valA, valB, operator, inputFormat, handleEvaluate]);

  const examples = [
    { input: "dec,AND,5,12", output: "Dec: 4 | Bin: 100", description: "12 AND 5 bitwise intersection" },
    { input: "dec,LSHIFT,10,1", output: "Dec: 1024 | Hex: 400", description: "Bitwise Shift Left 10" },
    { input: "bin,XOR,0101,1100", output: "Dec: 9 | Bin: 1001", description: "XOR difference comparison" },
  ];

  const notes = [
    "Supports AND, OR, XOR, NOT, and bit shifts.",
    "Bidirectional conversions show results in Decimal, Binary, and Hex formats.",
    "NOT operations are calculated using two's complement signed representation.",
  ];

  return (
    <ToolLayout
      examples={examples}
      notes={notes}
      timeComplexity="O(1)"
      spaceComplexity="O(1)"
      onSelectExample={handleSelectExample}
    >
      <ToolHeader
        title="Binary Calculator"
        description="Logical bitwise operations and real-time mapping across binary, hex, and decimal representations."
        category="Logical Operations"
        difficulty="Medium"
        shortcut="Alt+3"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs">
        <CardHeader className="flex flex-row justify-between items-center pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
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
          {errors.general && (
            <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg animate-fade-in">
              {errors.general}
            </div>
          )}

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
                <option value="hex">Hexadecimal (Base 16)</option>
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

          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              label="Value A"
              placeholder={
                inputFormat === "dec" ? "e.g. 12" : inputFormat === "bin" ? "e.g. 1100" : "e.g. C"
              }
              value={valA}
              onChange={setValA}
              error={errors.valA}
            />

            {operator !== "NOT" && (
              <InputField
                label={operator === "LSHIFT" || operator === "RSHIFT" ? "Shift Count (B)" : "Value B"}
                placeholder={
                  operator === "LSHIFT" || operator === "RSHIFT"
                    ? "e.g. 2"
                    : inputFormat === "dec"
                    ? "e.g. 5"
                    : inputFormat === "bin"
                    ? "e.g. 0101"
                    : "e.g. 5"
                }
                value={valB}
                onChange={setValB}
                error={errors.valB}
              />
            )}
          </div>

          <Button
            onClick={handleEvaluate}
            className="w-full justify-center gap-1.5 mt-2 cursor-pointer"
          >
            <Equal className="h-4 w-4" />
            Compute Bitwise Operation
          </Button>

          {/* Outputs */}
          <div className="space-y-4 pt-4 border-t border-border/10">
            <OutputField label="Result (Decimal)" value={resultDec} isError={resultDec === "Error"} />
            <OutputField label="Result (Binary)" value={resultBin} isError={resultBin === "Error"} />
            <OutputField label="Result (Hexadecimal)" value={resultHex} isError={resultHex === "Error"} />
          </div>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
