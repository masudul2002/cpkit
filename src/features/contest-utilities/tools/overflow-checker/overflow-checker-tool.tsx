"use client";

import * as React from "react";
import { ToolHeader } from "../shared/tool-header";
import { ToolLayout } from "../shared/tool-layout";
import { InputField } from "../shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, RotateCcw } from "lucide-react";

interface TypeSpec {
  name: string;
  alias: string;
  min: bigint;
  max: bigint;
  bits: number;
}

const TYPE_SPECS: TypeSpec[] = [
  { name: "int8", alias: "char / int8_t", min: BigInt(-128), max: BigInt(127), bits: 8 },
  { name: "uint8", alias: "unsigned char / uint8_t", min: BigInt(0), max: BigInt(255), bits: 8 },
  { name: "int16", alias: "short / int16_t", min: BigInt(-32768), max: BigInt(32767), bits: 16 },
  { name: "uint16", alias: "unsigned short / uint16_t", min: BigInt(0), max: BigInt(65535), bits: 16 },
  { name: "int32", alias: "int / int32_t", min: BigInt(-2147483648), max: BigInt(2147483647), bits: 32 },
  { name: "uint32", alias: "unsigned int / uint32_t", min: BigInt(0), max: BigInt(4294967295), bits: 32 },
  {
    name: "int64",
    alias: "long long / int64_t",
    min: BigInt("-9223372036854775808"),
    max: BigInt("9223372036854775807"),
    bits: 64,
  },
  {
    name: "uint64",
    alias: "unsigned long long / uint64_t",
    min: BigInt(0),
    max: BigInt("18446744073709551615"),
    bits: 64,
  },
];

export function OverflowCheckerTool() {
  const [inputValue, setInputValue] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const handleClear = () => {
    setInputValue("");
    setError(null);
  };

  // Perform parse checks in render flow to avoid setting state in render or memo warnings
  const parsedValue = React.useMemo(() => {
    const trimmed = inputValue.trim();
    if (!trimmed) return null;

    if (!/^\-?[0-9]+$/.test(trimmed)) {
      // Return null, let render show a helper error, but do not set state inside useMemo
      return null;
    }

    try {
      return BigInt(trimmed);
    } catch {
      return null;
    }
  }, [inputValue]);

  // Validation message derived on render
  const validationError = React.useMemo(() => {
    const trimmed = inputValue.trim();
    if (!trimmed) return null;
    if (!/^\-?[0-9]+$/.test(trimmed)) {
      return "Please enter a valid signed integer digits sequence";
    }
    try {
      BigInt(trimmed);
      return null;
    } catch {
      return "Number exceeds safe parser constraints";
    }
  }, [inputValue]);

  const examples = [
    { input: "127", output: "Fits in int8", description: "Signed 8-bit Max Limit" },
    { input: "32768", output: "Overflows int16, fits in uint16", description: "16-bit Bound Transition" },
    { input: "2147483648", output: "Overflows int32, fits in uint32", description: "32-bit Bound Transition" },
  ];

  const notes = [
    "Evaluates integer overflow bounds for standard 8, 16, 32, and 64-bit types.",
    "Decimals, variables, or floating values are ignored in check calculations.",
    "Aliases show equivalents for char, short, int, long long and unsigned variations in C++.",
  ];

  return (
    <ToolLayout
      examples={examples}
      notes={notes}
      timeComplexity="O(1)"
      spaceComplexity="O(1)"
      onSelectExample={(expr) => setInputValue(expr)}
    >
      <ToolHeader
        title="Integer Overflow Checker"
        description="Verify which standard signed and unsigned data types can fit a specific integer without wrapping or overflows."
        category="Memory Check"
        difficulty="Medium"
        shortcut="Alt+8"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs">
        <CardHeader className="flex flex-row justify-between items-center pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Overflow Comparison Panel
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
          <InputField
            label="Integer Numeric Value"
            placeholder="e.g. 2147483648"
            value={inputValue}
            onChange={setInputValue}
            error={validationError || undefined}
          />

          <div className="border border-border/40 rounded-xl overflow-hidden bg-background/25">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-muted/80 text-muted-foreground uppercase text-[9px] font-bold">
                <tr>
                  <th className="px-4 py-2.5">Type</th>
                  <th className="px-4 py-2.5">Alias (C++)</th>
                  <th className="px-4 py-2.5">Bounds Range</th>
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
                      <td className="px-4 py-2.5 font-bold text-foreground/90">{type.name}</td>
                      <td className="px-4 py-2.5 text-muted-foreground/60">{type.alias}</td>
                      <td className="px-4 py-2.5 text-muted-foreground/45 text-[10px] truncate max-w-[200px]">
                        {type.min.toString()} to {type.max.toString()}
                      </td>
                      <td className="px-4 py-2.5 text-center">
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
    </ToolLayout>
  );
}
