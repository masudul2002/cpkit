"use client";

import * as React from "react";
import { ToolHeader } from "../shared/tool-header";
import { ToolLayout } from "../shared/tool-layout";
import { InputField } from "../shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export function RomanConverterTool() {
  const [roman, setRoman] = React.useState("");
  const [integer, setInteger] = React.useState("");
  const [errors, setErrors] = React.useState<{ roman?: string; integer?: string }>({});

  const handleClear = () => {
    setRoman("");
    setInteger("");
    setErrors({});
  };

  const romanToInteger = (val: string): number => {
    const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
    let sum = 0;
    for (let i = 0; i < val.length; i++) {
      const curr = map[val[i]];
      const next = map[val[i + 1]];
      if (next && curr < next) {
        sum += (next - curr);
        i++;
      } else {
        sum += curr;
      }
    }
    return sum;
  };

  const integerToRoman = (num: number): string => {
    const lookup: [string, number][] = [
      ["M", 1000], ["CM", 900], ["D", 500], ["CD", 400],
      ["C", 100], ["XC", 90], ["L", 50], ["XL", 40],
      ["X", 10], ["IX", 9], ["V", 5], ["IV", 4], ["I", 1]
    ];
    let res = "";
    let temp = num;
    for (const [letter, value] of lookup) {
      while (temp >= value) {
        res += letter;
        temp -= value;
      }
    }
    return res;
  };

  const handleRomanChange = (val: string) => {
    setErrors({});
    const clean = val.toUpperCase().trim();
    setRoman(clean);

    if (!clean) {
      setInteger("");
      return;
    }

    const romanRegex = /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;

    if (!/^[IVXLCDM]+$/.test(clean)) {
      setErrors({ roman: "Invalid characters (only I, V, X, L, C, D, M allowed)" });
      setInteger("");
      return;
    }

    if (!romanRegex.test(clean)) {
      setErrors({ roman: "Invalid Roman numeral format" });
      setInteger("");
      return;
    }

    try {
      const result = romanToInteger(clean);
      setInteger(String(result));
    } catch {
      setErrors({ roman: "Error translating Roman numeral" });
      setInteger("");
    }
  };

  const handleIntegerChange = (val: string) => {
    setErrors({});
    const clean = val.trim();
    setInteger(clean);

    if (!clean) {
      setRoman("");
      return;
    }

    if (!/^[0-9]+$/.test(clean)) {
      setErrors({ integer: "Invalid integer (only positive numbers allowed)" });
      setRoman("");
      return;
    }

    const numVal = parseInt(clean, 10);
    if (numVal < 1 || numVal > 3999) {
      setErrors({ integer: "Integer must be in range 1 to 3999" });
      setRoman("");
      return;
    }

    try {
      const result = integerToRoman(numVal);
      setRoman(result);
    } catch {
      setErrors({ integer: "Error translating integer" });
      setRoman("");
    }
  };

  const handleLoadExample = (val: string) => {
    if (/^[0-9]+$/.test(val)) {
      handleIntegerChange(val);
    } else {
      handleRomanChange(val);
    }
  };

  const examples = [
    { input: "XIV", output: "14", description: "Standard subtraction (10 + (5 - 1))" },
    { input: "1970", output: "MCMLXX", description: "Standard translation (1000 + 900 + 50 + 20)" },
    { input: "2026", output: "MMXXVI", description: "Future reference (2000 + 20 + 5 + 1)" },
  ];

  const notes = [
    "Supports bidirectional real-time translations as you type.",
    "Input values are validated against standard Roman numeral syntax limits.",
    "Integer bounds are restricted to 1 through 3999 (standard Roman limits).",
  ];

  return (
    <ToolLayout
      examples={examples}
      notes={notes}
      timeComplexity="O(N)"
      spaceComplexity="O(1)"
      onSelectExample={handleLoadExample}
    >
      <ToolHeader
        title="Roman Numeral Converter"
        description="Translate Roman numeral strings to decimal integers and vice versa."
        category="Base Conversion"
        difficulty="Easy"
        shortcut="Alt+5"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs">
        <CardHeader className="flex flex-row justify-between items-center pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Converter Panel
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
            label="Roman Numeral"
            placeholder="e.g. XIV"
            value={roman}
            onChange={handleRomanChange}
            error={errors.roman}
            actionLabel="Copy"
            onAction={() => navigator.clipboard.writeText(roman)}
          />

          <InputField
            label="Decimal Integer"
            placeholder="e.g. 14"
            value={integer}
            onChange={handleIntegerChange}
            error={errors.integer}
            actionLabel="Copy"
            onAction={() => navigator.clipboard.writeText(integer)}
          />
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
