"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X, RotateCcw } from "lucide-react";

interface TypeSpec {
  name: string;
  min: bigint;
  max: bigint;
  bits: number;
  signed: boolean;
}

const TYPE_SPECS: TypeSpec[] = [
  { name: "char", min: BigInt(-128), max: BigInt(127), bits: 8, signed: true },
  { name: "unsigned char", min: BigInt(0), max: BigInt(255), bits: 8, signed: false },
  { name: "short", min: BigInt(-32768), max: BigInt(32767), bits: 16, signed: true },
  { name: "unsigned short", min: BigInt(0), max: BigInt(65535), bits: 16, signed: false },
  { name: "int", min: BigInt(-2147483648), max: BigInt(2147483647), bits: 32, signed: true },
  { name: "unsigned int", min: BigInt(0), max: BigInt(4294967295), bits: 32, signed: false },
  {
    name: "long long",
    min: BigInt("-9223372036854775808"),
    max: BigInt("9223372036854775807"),
    bits: 64,
    signed: true,
  },
  {
    name: "unsigned long long",
    min: BigInt(0),
    max: BigInt("18446744073709551615"),
    bits: 64,
    signed: false,
  },
];

export function OverflowChecker() {
  const [inputValue, setInputValue] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [parsedValue, setParsedValue] = React.useState<bigint | null>(null);

  const handleClear = () => {
    setInputValue("");
    setError(null);
    setParsedValue(null);
  };

  React.useEffect(() => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      setError(null);
      setParsedValue(null);
      return;
    }

    if (!/^\-?[0-9]+$/.test(trimmed)) {
      setError("Please enter a valid signed integer digits sequence");
      setParsedValue(null);
      return;
    }

    try {
      const val = BigInt(trimmed);
      setError(null);
      setParsedValue(val);
    } catch {
      setError("Number exceeds safe parser constraints");
      setParsedValue(null);
    }
  }, [inputValue]);

  return (
    <Card className="max-w-2xl w-full mx-auto border-border/40 shadow-lg relative bg-card/65 backdrop-blur-md">
      <CardHeader className="pb-3 border-b border-border/10 flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-base">Integer Overflow Checker</CardTitle>
          <CardDescription>
            Input an integer to check which standard C++ variable primitives it fits into.
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
        {/* Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground/80">Numeric Value</label>
          <Input
            placeholder="e.g. 2147483648"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className={`font-mono text-sm ${error ? "border-rose-500/50 focus-visible:ring-rose-500" : ""}`}
          />
          {error && <p className="text-[10px] text-rose-500 font-semibold">{error}</p>}
        </div>

        {/* Comparison Table */}
        <div className="border border-border/40 rounded-xl overflow-hidden bg-background/25">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-muted/80 text-muted-foreground uppercase text-[9px] font-bold">
              <tr>
                <th className="px-4 py-2.5">C++ Type</th>
                <th className="px-4 py-2.5">Size (Bits)</th>
                <th className="px-4 py-2.5">Range Bounds</th>
                <th className="px-4 py-2.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {TYPE_SPECS.map((type) => {
                let status: "empty" | "fits" | "overflows" = "empty";
                if (parsedValue !== null) {
                  status = parsedValue >= type.min && parsedValue <= type.max ? "fits" : "overflows";
                }

                return (
                  <tr key={type.name} className="hover:bg-accent/15 transition-colors">
                    <td className="px-4 py-3 font-bold text-foreground/90">{type.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{type.bits}-bit</td>
                    <td className="px-4 py-3 text-muted-foreground/60 text-[10px] truncate max-w-[220px]">
                      {type.min.toString()} to {type.max.toString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {status === "empty" ? (
                        <span className="text-[10px] text-muted-foreground/45">—</span>
                      ) : status === "fits" ? (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-500 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <Check className="h-3 w-3" />
                          Fits
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-rose-500/10 text-rose-500 font-semibold px-2 py-0.5 rounded-full border border-rose-500/20">
                          <X className="h-3 w-3" />
                          Overflows
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
