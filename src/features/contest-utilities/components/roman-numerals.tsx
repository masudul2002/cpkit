"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { RotateCcw } from "lucide-react";

export function RomanNumerals() {
  const { toast } = useToast();
  
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

    // Roman Validation Regex
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
    <Card className="max-w-md w-full mx-auto border-border/40 shadow-lg relative bg-card/65 backdrop-blur-md">
      <CardHeader className="pb-3 border-b border-border/10 flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-base">Roman Numerals Converter</CardTitle>
          <CardDescription>
            Convert between Roman numerals and decimal integers in range 1 to 3999.
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
        {/* Roman Numeral Input */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-foreground/80">Roman Numeral</label>
            {roman && !errors.roman && (
              <button
                onClick={() => handleCopy(roman, "Roman numeral")}
                className="text-[10px] text-primary hover:underline font-bold cursor-pointer"
              >
                Copy
              </button>
            )}
          </div>
          <Input
            placeholder="e.g. XIV"
            value={roman}
            onChange={(e) => handleRomanChange(e.target.value)}
            className={`font-mono text-sm uppercase ${errors.roman ? "border-rose-500/50 focus-visible:ring-rose-500" : ""}`}
          />
          {errors.roman && <p className="text-[10px] text-rose-500 font-semibold">{errors.roman}</p>}
        </div>

        {/* Integer Input */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-foreground/80">Decimal Integer</label>
            {integer && !errors.integer && (
              <button
                onClick={() => handleCopy(integer, "Decimal integer")}
                className="text-[10px] text-primary hover:underline font-bold cursor-pointer"
              >
                Copy
              </button>
            )}
          </div>
          <Input
            placeholder="e.g. 14"
            value={integer}
            onChange={(e) => handleIntegerChange(e.target.value)}
            className={`font-mono text-sm ${errors.integer ? "border-rose-500/50 focus-visible:ring-rose-500" : ""}`}
          />
          {errors.integer && <p className="text-[10px] text-rose-500 font-semibold">{errors.integer}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
