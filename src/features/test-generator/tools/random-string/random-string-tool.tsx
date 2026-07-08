"use client";

import * as React from "react";
import { GeneratorHeader } from "../../shared/generator-header";
import { GeneratorLayout } from "../../shared/generator-layout";
import { PreviewPanel } from "../../shared/preview-panel";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";

export function RandomStringTool() {
  const [lengthMode, setLengthMode] = React.useState<"fixed" | "random">("fixed");
  const [lengthVal, setLengthVal] = React.useState("15");
  const [minLength, setMinLength] = React.useState("5");
  const [maxLength, setMaxLength] = React.useState("30");

  const [useLower, setUseLower] = React.useState(true);
  const [useUpper, setUseUpper] = React.useState(false);
  const [useDigits, setUseDigits] = React.useState(false);
  const [useSymbols, setUseSymbols] = React.useState(false);
  const [customCharset, setCustomCharset] = React.useState("");

  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const handleGenerate = React.useCallback(() => {
    setError(null);
    setOutput("");

    let len = 0;
    if (lengthMode === "fixed") {
      len = parseInt(lengthVal, 10);
      if (isNaN(len) || len < 1 || len > 100000) {
        setError("Fixed length must be in range 1 to 100,000");
        return;
      }
    } else {
      const min = parseInt(minLength, 10);
      const max = parseInt(maxLength, 10);
      if (isNaN(min) || isNaN(max) || min < 1 || max < min || max > 100000) {
        setError("Min/Max range must be valid and max cannot exceed 100,000");
        return;
      }
      len = Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Build charset pool
    let pool = "";
    if (customCharset.trim()) {
      pool = customCharset;
    } else {
      if (useLower) pool += "abcdefghijklmnopqrstuvwxyz";
      if (useUpper) pool += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      if (useDigits) pool += "0123456789";
      if (useSymbols) pool += "!@#$%^&*()_+-=[]{}|;':\",./<>?";
    }

    if (!pool) {
      setError("Please enable at least one character set or define a custom charset");
      return;
    }

    let result = "";
    for (let i = 0; i < len; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      result += pool[idx];
    }

    setOutput(result);
  }, [lengthMode, lengthVal, minLength, maxLength, useLower, useUpper, useDigits, useSymbols, customCharset]);

  React.useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  const notes = [
    "Useful for generating random string values (words, DNA bases, paths).",
    "Selecting Custom Charset takes precedence and ignores checkboxes.",
    "RNG picks pool characters uniformly with replacement.",
  ];

  return (
    <GeneratorLayout
      notes={notes}
      timeComplexity="O(N)"
      spaceComplexity="O(N)"
      previewChild={<PreviewPanel value={output} onRegenerate={handleGenerate} />}
    >
      <GeneratorHeader
        title="Random String Generator"
        description="Generate random text sequences matching custom length boundaries."
        category="Strings"
        difficulty="Easy"
        shortcut="Alt+Ctrl+3"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Constraints Config
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-500 font-semibold rounded-lg">
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">Length Options</label>
              <Select value={lengthMode} onChange={(e) => setLengthMode(e.target.value as any)}>
                <option value="fixed">Fixed String Length</option>
                <option value="random">Random Length Range</option>
              </Select>
            </div>

            {lengthMode === "fixed" ? (
              <InputField label="String Length" value={lengthVal} onChange={setLengthVal} />
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <InputField label="Min Length" value={minLength} onChange={setMinLength} />
                <InputField label="Max Length" value={maxLength} onChange={setMaxLength} />
              </div>
            )}
          </div>

          <InputField
            label="Custom Charset (Overrides checkboxes below)"
            placeholder="e.g. abcde (empty to use standard)"
            value={customCharset}
            onChange={setCustomCharset}
          />

          {!customCharset.trim() && (
            <div className="flex flex-wrap items-center gap-6 pt-1 select-none">
              <div className="flex items-center gap-1.5 text-xs">
                <Checkbox
                  id="use-lower"
                  checked={useLower}
                  onCheckedChange={(checked) => setUseLower(!!checked)}
                />
                <label htmlFor="use-lower" className="cursor-pointer font-medium text-foreground/80">
                  Lowercase (a-z)
                </label>
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <Checkbox
                  id="use-upper"
                  checked={useUpper}
                  onCheckedChange={(checked) => setUseUpper(!!checked)}
                />
                <label htmlFor="use-upper" className="cursor-pointer font-medium text-foreground/80">
                  Uppercase (A-Z)
                </label>
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <Checkbox
                  id="use-digits"
                  checked={useDigits}
                  onCheckedChange={(checked) => setUseDigits(!!checked)}
                />
                <label htmlFor="use-digits" className="cursor-pointer font-medium text-foreground/80">
                  Digits (0-9)
                </label>
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <Checkbox
                  id="use-symbols"
                  checked={useSymbols}
                  onCheckedChange={(checked) => setUseSymbols(!!checked)}
                />
                <label htmlFor="use-symbols" className="cursor-pointer font-medium text-foreground/80">
                  Symbols
                </label>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </GeneratorLayout>
  );
}
