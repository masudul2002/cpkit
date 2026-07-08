"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Copy, RotateCcw } from "lucide-react";

export function BaseConverter() {
  const { toast } = useToast();
  
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

  const convertFromDecimal = (decStr: string) => {
    if (!decStr.trim()) {
      setBinary("");
      setOctal("");
      setHexadecimal("");
      return;
    }

    try {
      const decVal = BigInt(decStr);
      setBinary(decVal.toString(2));
      setOctal(decVal.toString(8));
      setHexadecimal(decVal.toString(16).toUpperCase());
    } catch {
      // BigInt parsing failed or values out of bounds
    }
  };

  const handleInputChange = (value: string, base: "bin" | "oct" | "dec" | "hex") => {
    setErrors({});
    const cleanValue = value.trim();

    if (!cleanValue) {
      handleClear();
      return;
    }

    // Input Validation
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

  const handleCopy = (val: string, label: string) => {
    if (!val) return;
    navigator.clipboard.writeText(val);
    toast({
      title: "Copied to Clipboard",
      description: `${label} value copied successfully.`,
      variant: "success",
    });
  };

  return (
    <Card className="max-w-xl w-full mx-auto border-border/40 shadow-lg relative bg-card/65 backdrop-blur-md">
      <CardHeader className="pb-3 border-b border-border/10 flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-base">Base Converter</CardTitle>
          <CardDescription>
            Type in any numeric representation to convert values in real-time.
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClear}
          className="h-8 w-8 p-0 cursor-pointer"
          title="Reset All"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      </CardHeader>
      
      <CardContent className="p-6 space-y-5">
        {/* Decimal Input */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-foreground/80">Decimal (Base 10)</label>
            {decimal && (
              <button
                onClick={() => handleCopy(decimal, "Decimal")}
                className="text-[10px] text-primary hover:underline font-bold cursor-pointer"
              >
                Copy
              </button>
            )}
          </div>
          <Input
            placeholder="e.g. 42"
            value={decimal}
            onChange={(e) => handleInputChange(e.target.value, "dec")}
            className={`font-mono text-sm ${errors.dec ? "border-rose-500/50 focus-visible:ring-rose-500" : ""}`}
          />
          {errors.dec && <p className="text-[10px] text-rose-500 font-semibold">{errors.dec}</p>}
        </div>

        {/* Binary Input */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-foreground/80">Binary (Base 2)</label>
            {binary && (
              <button
                onClick={() => handleCopy(binary, "Binary")}
                className="text-[10px] text-primary hover:underline font-bold cursor-pointer"
              >
                Copy
              </button>
            )}
          </div>
          <Input
            placeholder="e.g. 101010"
            value={binary}
            onChange={(e) => handleInputChange(e.target.value, "bin")}
            className={`font-mono text-sm ${errors.bin ? "border-rose-500/50 focus-visible:ring-rose-500" : ""}`}
          />
          {errors.bin && <p className="text-[10px] text-rose-500 font-semibold">{errors.bin}</p>}
        </div>

        {/* Hexadecimal Input */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-foreground/80">Hexadecimal (Base 16)</label>
            {hexadecimal && (
              <button
                onClick={() => handleCopy(hexadecimal, "Hexadecimal")}
                className="text-[10px] text-primary hover:underline font-bold cursor-pointer"
              >
                Copy
              </button>
            )}
          </div>
          <Input
            placeholder="e.g. 2A"
            value={hexadecimal}
            onChange={(e) => handleInputChange(e.target.value, "hex")}
            className={`font-mono text-sm ${errors.hex ? "border-rose-500/50 focus-visible:ring-rose-500" : ""}`}
          />
          {errors.hex && <p className="text-[10px] text-rose-500 font-semibold">{errors.hex}</p>}
        </div>

        {/* Octal Input */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-foreground/80">Octal (Base 8)</label>
            {octal && (
              <button
                onClick={() => handleCopy(octal, "Octal")}
                className="text-[10px] text-primary hover:underline font-bold cursor-pointer"
              >
                Copy
              </button>
            )}
          </div>
          <Input
            placeholder="e.g. 52"
            value={octal}
            onChange={(e) => handleInputChange(e.target.value, "oct")}
            className={`font-mono text-sm ${errors.oct ? "border-rose-500/50 focus-visible:ring-rose-500" : ""}`}
          />
          {errors.oct && <p className="text-[10px] text-rose-500 font-semibold">{errors.oct}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
