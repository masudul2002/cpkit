"use client";

import * as React from "react";
import { GeneratorHeader } from "../../shared/generator-header";
import { GeneratorLayout } from "../../shared/generator-layout";
import { PreviewPanel } from "../../shared/preview-panel";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

export function RandomIntegerTool() {
  const [minVal, setMinVal] = React.useState("1");
  const [maxVal, setMaxVal] = React.useState("100");
  const [quantity, setQuantity] = React.useState("10");
  const [allowNegative, setAllowNegative] = React.useState(true);
  const [allowDuplicate, setAllowDuplicate] = React.useState(true);
  const [sorted, setSorted] = React.useState(false);

  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const handleGenerate = React.useCallback(() => {
    setError(null);
    setOutput("");

    let min = parseInt(minVal, 10);
    let max = parseInt(maxVal, 10);
    let qty = parseInt(quantity, 10);

    if (isNaN(min) || isNaN(max) || isNaN(qty)) {
      setError("Please enter valid numeric parameters");
      return;
    }

    if (!allowNegative && min < 0) {
      setError("Min constraint cannot be negative when negative numbers are disabled");
      return;
    }

    if (min > max) {
      setError("Min constraint must be less than or equal to Max constraint");
      return;
    }

    if (qty < 1 || qty > 100000) {
      setError("Quantity must be in range 1 to 100,000");
      return;
    }

    const rangeSize = max - min + 1;
    if (!allowDuplicate && qty > rangeSize) {
      setError(`Cannot generate ${qty} unique values in a range of size ${rangeSize}`);
      return;
    }

    const nums: number[] = [];
    if (!allowDuplicate) {
      const set = new Set<number>();
      while (set.size < qty) {
        const val = Math.floor(Math.random() * rangeSize) + min;
        set.add(val);
      }
      nums.push(...Array.from(set));
    } else {
      for (let i = 0; i < qty; i++) {
        const val = Math.floor(Math.random() * rangeSize) + min;
        nums.push(val);
      }
    }

    if (sorted) {
      nums.sort((a, b) => a - b);
    }

    setOutput(nums.join("\n"));
  }, [minVal, maxVal, quantity, allowNegative, allowDuplicate, sorted]);

  React.useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  const notes = [
    "Useful for generating list values or inputs for single integer arrays.",
    "Quantity bounds are restricted up to 100,000 to prevent browser locks.",
    "Unique numbers are generated using a backing hashing set.",
  ];

  return (
    <GeneratorLayout
      notes={notes}
      timeComplexity="O(Quantity log Quantity)"
      spaceComplexity="O(Quantity)"
      previewChild={<PreviewPanel value={output} onRegenerate={handleGenerate} />}
    >
      <GeneratorHeader
        title="Random Integer Generator"
        description="Generate multiple random integer values within constraints."
        category="Integers"
        difficulty="Easy"
        shortcut="Alt+Ctrl+1"
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

          <div className="grid gap-4 sm:grid-cols-3">
            <InputField label="Minimum Value" value={minVal} onChange={setMinVal} />
            <InputField label="Maximum Value" value={maxVal} onChange={setMaxVal} />
            <InputField label="Quantity" value={quantity} onChange={setQuantity} />
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-1 select-none">
            <div className="flex items-center gap-1.5 text-xs">
              <Checkbox
                id="allow-negative"
                checked={allowNegative}
                onCheckedChange={(checked) => setAllowNegative(!!checked)}
              />
              <label htmlFor="allow-negative" className="cursor-pointer font-medium text-foreground/80">
                Allow Negative Values
              </label>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <Checkbox
                id="allow-dup"
                checked={allowDuplicate}
                onCheckedChange={(checked) => setAllowDuplicate(!!checked)}
              />
              <label htmlFor="allow-dup" className="cursor-pointer font-medium text-foreground/80">
                Allow Duplicates
              </label>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <Checkbox
                id="sorted-out"
                checked={sorted}
                onCheckedChange={(checked) => setSorted(!!checked)}
              />
              <label htmlFor="sorted-out" className="cursor-pointer font-medium text-foreground/80">
                Sorted Output Ascending
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </GeneratorLayout>
  );
}
