"use client";

import * as React from "react";
import { NtHeader } from "../../shared/nt-header";
import { NtLayout } from "../../shared/nt-layout";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export function BitwisePlaygroundTool() {
  const [valA, setValA] = React.useState("12");
  const [valB, setValB] = React.useState("5");
  const [error, setError] = React.useState<string | null>(null);

  const handleClear = () => {
    setValA("");
    setValB("");
    setError(null);
  };

  const a = parseInt(valA, 10);
  const b = parseInt(valB, 10);

  const isValids = !isNaN(a) && !isNaN(b);

  const formatBinary = (num: number): string => {
    // 32-bit unsigned representation
    const str = (num >>> 0).toString(2).padStart(32, "0");
    // Group by 8 bits for readability
    return `${str.slice(0, 8)} ${str.slice(8, 16)} ${str.slice(16, 24)} ${str.slice(24, 32)}`;
  };

  const formatHex = (num: number): string => {
    return `0x${(num >>> 0).toString(16).toUpperCase().padStart(8, "0")}`;
  };

  const definition = "Bitwise operators perform calculations directly on the binary digit representation (bits) of integers. They are extremely fast operations CPU-wise.";
  const formula = "Logic tables: AND (&) outputs 1 if both bits are 1; OR (|) outputs 1 if either is 1; XOR (^) outputs 1 if bits differ.";
  const example = "12 (1100) & 5 (0101) = 4 (0100). Bitwise shift 12 << 1 doubles it to 24.";
  const applications = [
    "Bitmask representation of subsets.",
    "Efficient multiplication/division by powers of 2 (shifts).",
    "Fast property toggles and states."
  ];
  const mistakes = [
    "Forgetting operator precedence (e.g. 'a & b == c' parses as 'a & (b == c)' due to low priority).",
    "Shift overflows exceeding 31-bit limits in standard JavaScript bit manipulations."
  ];

  return (
    <NtLayout
      timeComplexity="O(1)"
      spaceComplexity="O(1)"
      definition={definition}
      formula={formula}
      example={example}
      applications={applications}
      mistakes={mistakes}
      resultChild={
        isValids && (
          <Card className="border-border/40 bg-card/65 shadow-xs">
            <CardHeader className="pb-2 border-b border-border/10">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Bitwise Operations Matrix
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 font-mono text-xs text-left">
              {/* Table showing inputs and results */}
              <div className="border border-border/40 rounded-lg overflow-hidden bg-background/25">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-muted/80 text-muted-foreground uppercase text-[9px] font-bold">
                    <tr>
                      <th className="px-4 py-2.5">Operation</th>
                      <th className="px-4 py-2.5 text-center">Decimal</th>
                      <th className="px-4 py-2.5 text-center">Hexadecimal</th>
                      <th className="px-4 py-2.5">Binary (32-bit blocks)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/10">
                    <tr className="hover:bg-accent/10 transition-colors">
                      <td className="px-4 py-2 font-bold text-foreground">Value A</td>
                      <td className="px-4 py-2 text-center text-muted-foreground">{a}</td>
                      <td className="px-4 py-2 text-center text-muted-foreground">{formatHex(a)}</td>
                      <td className="px-4 py-2 text-muted-foreground">{formatBinary(a)}</td>
                    </tr>
                    <tr className="hover:bg-accent/10 transition-colors">
                      <td className="px-4 py-2 font-bold text-foreground">Value B</td>
                      <td className="px-4 py-2 text-center text-muted-foreground">{b}</td>
                      <td className="px-4 py-2 text-center text-muted-foreground">{formatHex(b)}</td>
                      <td className="px-4 py-2 text-muted-foreground">{formatBinary(b)}</td>
                    </tr>
                    <tr className="hover:bg-accent/10 transition-colors bg-emerald-500/[0.02]">
                      <td className="px-4 py-2 font-bold text-emerald-500">A & B (AND)</td>
                      <td className="px-4 py-2 text-center text-foreground font-bold">{a & b}</td>
                      <td className="px-4 py-2 text-center text-foreground">{formatHex(a & b)}</td>
                      <td className="px-4 py-2 text-foreground">{formatBinary(a & b)}</td>
                    </tr>
                    <tr className="hover:bg-accent/10 transition-colors bg-emerald-500/[0.02]">
                      <td className="px-4 py-2 font-bold text-emerald-500">A | B (OR)</td>
                      <td className="px-4 py-2 text-center text-foreground font-bold">{a | b}</td>
                      <td className="px-4 py-2 text-center text-foreground">{formatHex(a | b)}</td>
                      <td className="px-4 py-2 text-foreground">{formatBinary(a | b)}</td>
                    </tr>
                    <tr className="hover:bg-accent/10 transition-colors bg-emerald-500/[0.02]">
                      <td className="px-4 py-2 font-bold text-emerald-500">A ^ B (XOR)</td>
                      <td className="px-4 py-2 text-center text-foreground font-bold">{a ^ b}</td>
                      <td className="px-4 py-2 text-center text-foreground">{formatHex(a ^ b)}</td>
                      <td className="px-4 py-2 text-foreground">{formatBinary(a ^ b)}</td>
                    </tr>
                    <tr className="hover:bg-accent/10 transition-colors bg-emerald-500/[0.02]">
                      <td className="px-4 py-2 font-bold text-emerald-500">~A (NOT A)</td>
                      <td className="px-4 py-2 text-center text-foreground font-bold">{~a}</td>
                      <td className="px-4 py-2 text-center text-foreground">{formatHex(~a)}</td>
                      <td className="px-4 py-2 text-foreground">{formatBinary(~a)}</td>
                    </tr>
                    <tr className="hover:bg-accent/10 transition-colors bg-emerald-500/[0.02]">
                      <td className="px-4 py-2 font-bold text-emerald-500">A &lt;&lt; 1 (LShift)</td>
                      <td className="px-4 py-2 text-center text-foreground font-bold">{a << 1}</td>
                      <td className="px-4 py-2 text-center text-foreground">{formatHex(a << 1)}</td>
                      <td className="px-4 py-2 text-foreground">{formatBinary(a << 1)}</td>
                    </tr>
                    <tr className="hover:bg-accent/10 transition-colors bg-emerald-500/[0.02]">
                      <td className="px-4 py-2 font-bold text-emerald-500">A &gt;&gt; 1 (RShift)</td>
                      <td className="px-4 py-2 text-center text-foreground font-bold">{a >> 1}</td>
                      <td className="px-4 py-2 text-center text-foreground">{formatHex(a >> 1)}</td>
                      <td className="px-4 py-2 text-foreground">{formatBinary(a >> 1)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )
      }
    >
      <NtHeader
        title="Bitwise Playground"
        description="Analyze logical AND, OR, XOR, NOT, and shift operations in decimal, hexadecimal, and binary configurations."
        category="Bits"
        difficulty="Easy"
        shortcut="Alt+Shift+P"
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
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              label="Integer A"
              value={valA}
              onChange={(val) => {
                setValA(val);
                if (isNaN(parseInt(val, 10))) setError("Invalid integer A");
                else setError(null);
              }}
            />
            <InputField
              label="Integer B"
              value={valB}
              onChange={(val) => {
                setValB(val);
                if (isNaN(parseInt(val, 10))) setError("Invalid integer B");
                else setError(null);
              }}
            />
          </div>
        </CardContent>
      </Card>
    </NtLayout>
  );
}
