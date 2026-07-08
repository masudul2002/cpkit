"use client";

import * as React from "react";
import { NtHeader } from "../../shared/nt-header";
import { NtLayout } from "../../shared/nt-layout";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export function GrayCodeTool() {
  const [valDec, setValDec] = React.useState("5");
  const [compared, setCompared] = React.useState(false);
  const [binaryStr, setBinaryStr] = React.useState("");
  const [grayStr, setGrayStr] = React.useState("");
  const [grayDec, setGrayDec] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);

  const handleClear = () => {
    setValDec("");
    setCompared(false);
    setBinaryStr("");
    setGrayStr("");
    setGrayDec(0);
    setError(null);
  };

  const toGray = (num: number): number => {
    return num ^ (num >> 1);
  };

  const toBinary = (gray: number): number => {
    let num = gray;
    let mask = num >> 1;
    while (mask !== 0) {
      num = num ^ mask;
      mask = mask >> 1;
    }
    return num;
  };

  const handleEvaluate = () => {
    setError(null);
    setCompared(false);

    const val = parseInt(valDec, 10);
    if (isNaN(val) || val < 0 || val > 1000000) {
      setError("Please enter a valid positive decimal up to 1,000,000");
      return;
    }

    setCompared(true);
    const gVal = toGray(val);
    setGrayDec(gVal);
    setBinaryStr(val.toString(2));
    setGrayStr(gVal.toString(2));
  };

  const definition = "Gray Code is an ordering of the binary numeral system such that two successive values differ in only one bit (binary digit). It is also called reflected binary code.";
  const formula = "Binary to Gray: G = B ^ (B >> 1). Gray to Binary: Keep XOR-ing shifted values until mask is zero.";
  const example = "For decimal 5 (Binary 101): G = 101 ^ 010 = 111 (Decimal 7). Consecutive decimal 4 (Binary 100): G = 110 (differs by 1 bit from 111!).";
  const applications = [
    "Karnaugh maps optimization ordering.",
    "Preventing spurious states in clock-domain crossings.",
    "Hamming distance and hardware encoder setups."
  ];
  const mistakes = [
    "Forgetting that Gray codes are ordering-specific representations and cannot be added directly.",
    "Unsigned shift overflows."
  ];

  return (
    <NtLayout
      timeComplexity="O(log N)"
      spaceComplexity="O(1)"
      definition={definition}
      formula={formula}
      example={example}
      applications={applications}
      mistakes={mistakes}
      resultChild={
        compared && (
          <Card className="border-border/40 bg-card/65 shadow-xs">
            <CardHeader className="pb-2 border-b border-border/10">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Conversion Results
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3 font-mono text-xs text-left">
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground">Decimal input (Binary):</span>
                <span className="font-bold text-foreground">{valDec} ({binaryStr})</span>
              </div>
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span className="text-muted-foreground">Gray Code Output (Binary):</span>
                <span className="font-bold text-emerald-500">{grayDec} ({grayStr})</span>
              </div>
              <div className="pt-2">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">
                  Bit Difference Verification:
                </span>
                <div className="p-3 bg-muted/20 border border-border/10 rounded-lg text-[11px] leading-relaxed">
                  Dec {valDec}: <span className="font-bold">{binaryStr}</span> → Gray <span className="font-bold text-emerald-500">{grayStr}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      }
    >
      <NtHeader
        title="Gray Code Generator"
        description="Convert standard binary values to reflected Gray code values bidirectionally."
        category="Bits"
        difficulty="Easy"
        shortcut="Alt+Shift+G"
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
          <InputField
            label="Enter Decimal Integer (N <= 10^6)"
            value={valDec}
            onChange={(val) => {
              setValDec(val);
              setCompared(false);
            }}
            error={error || undefined}
          />
          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Convert to Gray Code
          </Button>
        </CardContent>
      </Card>
    </NtLayout>
  );
}
