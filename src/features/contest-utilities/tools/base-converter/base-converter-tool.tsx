"use client";

import * as React from "react";
import { ToolHeader } from "../shared/tool-header";
import { ToolLayout } from "../shared/tool-layout";
import { InputField } from "../shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export function BaseConverterTool() {
  const [binary, setBinary] = React.useState("");
  const [octal, setOctal] = React.useState("");
  const [decimal, setDecimal] = React.useState("");
  const [hexadecimal, setHexadecimal] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleClear = () => {
    setBinary("");
    setOctal("");
    setDecimal("");
    setHexadecimal("");
    setErrors({});
  };

  const handleInputChange = (value: string, base: "bin" | "oct" | "dec" | "hex") => {
    setErrors({});
    const cleanValue = value.trim();

    if (!cleanValue) {
      handleClear();
      return;
    }

    let isValid = true;
    let decimalValue = BigInt(0);

    try {
      if (base === "bin") {
        setBinary(cleanValue);
        if (!/^[01]+$/.test(cleanValue)) {
          setErrors({ bin: "Invalid binary digit (only 0 and 1 allowed)" });
          isValid = false;
        } else {
          decimalValue = BigInt("0b" + cleanValue);
        }
      } else if (base === "oct") {
        setOctal(cleanValue);
        if (!/^[0-7]+$/.test(cleanValue)) {
          setErrors({ oct: "Invalid octal digit (only 0-7 allowed)" });
          isValid = false;
        } else {
          decimalValue = BigInt("0o" + cleanValue);
        }
      } else if (base === "dec") {
        setDecimal(cleanValue);
        if (!/^[0-9]+$/.test(cleanValue)) {
          setErrors({ dec: "Invalid decimal digit (only 0-9 allowed)" });
          isValid = false;
        } else {
          decimalValue = BigInt(cleanValue);
        }
      } else if (base === "hex") {
        setHexadecimal(cleanValue.toUpperCase());
        if (!/^[0-9A-Fa-f]+$/.test(cleanValue)) {
          setErrors({ hex: "Invalid hexadecimal digit (only 0-9, A-F allowed)" });
          isValid = false;
        } else {
          decimalValue = BigInt("0x" + cleanValue);
        }
      }

      if (isValid) {
        if (base !== "bin") setBinary(decimalValue.toString(2));
        if (base !== "oct") setOctal(decimalValue.toString(8));
        if (base !== "dec") setDecimal(decimalValue.toString(10));
        if (base !== "hex") setHexadecimal(decimalValue.toString(16).toUpperCase());
      }
    } catch {
      setErrors({ [base]: "Number out of bounds or invalid format" });
    }
  };

  const handleLoadExample = (val: string) => {
    handleInputChange(val, "dec");
  };

  const examples = [
    { input: "42", output: "Bin: 101010 | Hex: 2A", description: "Standard Integer" },
    { input: "1024", output: "Bin: 10000000000 | Hex: 400", description: "Power of Two kilobytes" },
    { input: "65535", output: "Bin: 1111111111111111 | Hex: FFFF", description: "Max 16-bit Unsigned Short" },
  ];

  const notes = [
    "Supports extremely large values using JavaScript native BigInt parsing.",
    "Real-time bidirectional updates map changes across all bases instantly.",
    "Decimals or negative formatting is omitted for consistency.",
  ];

  return (
    <ToolLayout
      examples={examples}
      notes={notes}
      timeComplexity="O(log N)"
      spaceComplexity="O(1)"
      onSelectExample={handleLoadExample}
    >
      <ToolHeader
        title="Base Converter"
        description="Convert integer values between Binary, Octal, Decimal, and Hexadecimal representations in real-time."
        category="Base Conversion"
        difficulty="Easy"
        shortcut="Alt+2"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs">
        <CardHeader className="flex flex-row justify-between items-center pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Conversions Panel
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="h-7 w-7 p-0 cursor-pointer"
            title="Reset All"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </CardHeader>
        <CardContent className="p-6 space-y-5">
          <InputField
            label="Decimal (Base 10)"
            placeholder="e.g. 42"
            value={decimal}
            onChange={(val) => handleInputChange(val, "dec")}
            error={errors.dec}
            actionLabel="Copy"
            onAction={() => navigator.clipboard.writeText(decimal)}
          />

          <InputField
            label="Binary (Base 2)"
            placeholder="e.g. 101010"
            value={binary}
            onChange={(val) => handleInputChange(val, "bin")}
            error={errors.bin}
            actionLabel="Copy"
            onAction={() => navigator.clipboard.writeText(binary)}
          />

          <InputField
            label="Hexadecimal (Base 16)"
            placeholder="e.g. 2A"
            value={hexadecimal}
            onChange={(val) => handleInputChange(val, "hex")}
            error={errors.hex}
            actionLabel="Copy"
            onAction={() => navigator.clipboard.writeText(hexadecimal)}
          />

          <InputField
            label="Octal (Base 8)"
            placeholder="e.g. 52"
            value={octal}
            onChange={(val) => handleInputChange(val, "oct")}
            error={errors.oct}
            actionLabel="Copy"
            onAction={() => navigator.clipboard.writeText(octal)}
          />
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
