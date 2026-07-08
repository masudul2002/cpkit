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

export function BigintCalculatorTool() {
  const [valA, setValA] = React.useState("");
  const [valB, setValB] = React.useState("");
  const [operator, setOperator] = React.useState<
    "ADD" | "SUB" | "MUL" | "DIV" | "MOD" | "POW" | "LT" | "LTE" | "EQ" | "NEQ" | "GT" | "GTE"
  >("ADD");
  
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
      let resValue = "";

      switch (operator) {
        case "ADD":
          resValue = (bigA + bigB).toString();
          break;
        case "SUB":
          resValue = (bigA - bigB).toString();
          break;
        case "MUL":
          resValue = (bigA * bigB).toString();
          break;
        case "DIV":
          if (bigB === BigInt(0)) throw new Error("Division by zero");
          resValue = (bigA / bigB).toString();
          break;
        case "MOD":
          if (bigB === BigInt(0)) throw new Error("Modulo by zero");
          resValue = (bigA % bigB).toString();
          break;
        case "POW":
          if (bigB < BigInt(0)) throw new Error("Exponentiation power cannot be negative");
          if (bigB > BigInt(1000)) throw new Error("Exponent power limit exceeded (max 1000)");
          resValue = (bigA ** bigB).toString();
          break;
        case "LT":
          resValue = String(bigA < bigB);
          break;
        case "LTE":
          resValue = String(bigA <= bigB);
          break;
        case "EQ":
          resValue = String(bigA === bigB);
          break;
        case "NEQ":
          resValue = String(bigA !== bigB);
          break;
        case "GT":
          resValue = String(bigA > bigB);
          break;
        case "GTE":
          resValue = String(bigA >= bigB);
          break;
      }

      setResult(resValue);
    } catch (err: unknown) {
      setErrors({ general: err instanceof Error ? err.message : "Failed to execute BigInt arithmetic" });
      setResult("Error");
    }
  };

  const handleSelectExample = (val: string) => {
    const [op, aStr, bStr] = val.split(",");
    setOperator(op as any);
    setValA(aStr);
    setValB(bStr);
  };

  const examples = [
    {
      input: "ADD,12345678901234567890,98765432109876543210",
      output: "111111111011111111100",
      description: "Large 20-digit summation",
    },
    {
      input: "MUL,9223372036854775807,2",
      output: "18446744073709551614",
      description: "Multiply max 64-bit int by 2",
    },
    {
      input: "GT,1000000000000000000,9223372036854775807",
      output: "false",
      description: "Check if 1e18 is greater than 2^63 - 1",
    },
  ];

  const notes = [
    "Uses native JavaScript BigInt logic to handle arbitrary-precision calculations.",
    "Exponent operations limit power base ranges to prevent browser locks (Max 1000).",
    "Comparison operators (==, !=, <, <=, >, >=) return standard boolean values.",
  ];

  return (
    <ToolLayout
      examples={examples}
      notes={notes}
      timeComplexity="O(N)"
      spaceComplexity="O(N)"
      onSelectExample={handleSelectExample}
    >
      <ToolHeader
        title="Big Integer Calculator"
        description="Compute standard operations and bitwise logical comparisons on integers exceeding standard numeric limits."
        category="Big Numbers"
        difficulty="Medium"
        shortcut="Alt+7"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs">
        <CardHeader className="flex flex-row justify-between items-center pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Calculation Panel
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
            <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg">
              {errors.general}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <InputField
                label="Integer A"
                placeholder="e.g. 12345678901234567890"
                value={valA}
                onChange={setValA}
                error={errors.valA}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">Operator</label>
              <Select value={operator} onChange={(e) => setOperator(e.target.value as any)}>
                <option value="ADD">Add (+)</option>
                <option value="SUB">Subtract (-)</option>
                <option value="MUL">Multiply (*)</option>
                <option value="DIV">Divide (/)</option>
                <option value="MOD">Modulo (%)</option>
                <option value="POW">Power (**)</option>
                <option value="LT">Less Than (&lt;)</option>
                <option value="LTE">Less or Equal (&lt;=)</option>
                <option value="EQ">Equal (==)</option>
                <option value="NEQ">Not Equal (!=)</option>
                <option value="GT">Greater Than (&gt;)</option>
                <option value="GTE">Greater or Equal (&gt;=)</option>
              </Select>
            </div>
          </div>

          <InputField
            label="Integer B"
            placeholder="e.g. 98765432109876543210"
            value={valB}
            onChange={setValB}
            error={errors.valB}
          />

          <Button
            onClick={handleEvaluate}
            className="w-full justify-center gap-1.5 mt-2 cursor-pointer"
          >
            <Equal className="h-4 w-4" />
            Compute BigInt
          </Button>

          <div className="pt-4 border-t border-border/10">
            <OutputField label="Result" value={result} isError={result === "Error"} />
          </div>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
