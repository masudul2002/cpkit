"use client";

import * as React from "react";
import { GeneratorHeader } from "../../shared/generator-header";
import { GeneratorLayout } from "../../shared/generator-layout";
import { PreviewPanel } from "../../shared/preview-panel";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export function RandomArrayTool() {
  const [length, setLength] = React.useState("10");
  const [minVal, setMinVal] = React.useState("1");
  const [maxVal, setMaxVal] = React.useState("100");
  const [separator, setSeparator] = React.useState("space");
  const [allowDuplicate, setAllowDuplicate] = React.useState(true);
  const [sorted, setSorted] = React.useState(false);
  const [shuffled, setShuffled] = React.useState(false);

  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const handleGenerate = React.useCallback(() => {
    setError(null);
    setOutput("");

    let len = parseInt(length, 10);
    let min = parseInt(minVal, 10);
    let max = parseInt(maxVal, 10);

    if (isNaN(len) || isNaN(min) || isNaN(max)) {
      setError("Please enter valid parameters");
      return;
    }

    if (min > max) {
      setError("Min constraint must be less than or equal to Max constraint");
      return;
    }

    if (len < 1 || len > 100000) {
      setError("Array length must be in range 1 to 100,000");
      return;
    }

    const rangeSize = max - min + 1;
    if (!allowDuplicate && len > rangeSize) {
      setError(`Cannot generate unique array of length ${len} in a range of size ${rangeSize}`);
      return;
    }

    const nums: number[] = [];
    if (!allowDuplicate) {
      const set = new Set<number>();
      while (set.size < len) {
        const val = Math.floor(Math.random() * rangeSize) + min;
        set.add(val);
      }
      nums.push(...Array.from(set));
    } else {
      for (let i = 0; i < len; i++) {
        const val = Math.floor(Math.random() * rangeSize) + min;
        nums.push(val);
      }
    }

    if (sorted) {
      nums.sort((a, b) => a - b);
    }

    if (shuffled && !sorted) {
      // Fisher-Yates Shuffle
      for (let i = nums.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nums[i], nums[j]] = [nums[j], nums[i]];
      }
    }

    let sep = " ";
    if (separator === "comma") sep = ", ";
    if (separator === "newline") sep = "\n";

    setOutput(nums.join(sep));
  }, [length, minVal, maxVal, separator, allowDuplicate, sorted, shuffled]);

  React.useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  const notes = [
    "Useful for generating 1D vectors or arrays of inputs.",
    "Separator parameter sets space, comma, or newline spacing layout alignments.",
    "Uniqueness checks enforce standard boundary constraints.",
  ];

  return (
    <GeneratorLayout
      notes={notes}
      timeComplexity="O(N)"
      spaceComplexity="O(N)"
      previewChild={<PreviewPanel value={output} onRegenerate={handleGenerate} />}
    >
      <GeneratorHeader
        title="Random Array Generator"
        description="Generate formatted arrays/vectors of random values."
        category="Arrays"
        difficulty="Easy"
        shortcut="Alt+Ctrl+2"
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
            <InputField label="Array Length (N)" value={length} onChange={setLength} />
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">Separator Style</label>
              <Select value={separator} onChange={(e) => setSeparator(e.target.value)}>
                <option value="space">Space (" ")</option>
                <option value="comma">Comma (", ")</option>
                <option value="newline">New Line ("\n")</option>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="Min Element Value" value={minVal} onChange={setMinVal} />
            <InputField label="Max Element Value" value={maxVal} onChange={setMaxVal} />
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-1 select-none">
            <div className="flex items-center gap-1.5 text-xs">
              <Checkbox
                id="allow-dup-arr"
                checked={allowDuplicate}
                onCheckedChange={(checked) => setAllowDuplicate(!!checked)}
              />
              <label htmlFor="allow-dup-arr" className="cursor-pointer font-medium text-foreground/80">
                Allow Duplicate Values
              </label>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <Checkbox
                id="sorted-arr"
                checked={sorted}
                onCheckedChange={(checked) => {
                  setSorted(!!checked);
                  if (checked) setShuffled(false);
                }}
              />
              <label htmlFor="sorted-arr" className="cursor-pointer font-medium text-foreground/80">
                Sorted Output Ascending
              </label>
            </div>

            {!sorted && (
              <div className="flex items-center gap-1.5 text-xs">
                <Checkbox
                  id="shuffled-arr"
                  checked={shuffled}
                  onCheckedChange={(checked) => setShuffled(!!checked)}
                />
                <label htmlFor="shuffled-arr" className="cursor-pointer font-medium text-foreground/80">
                  Shuffle Values Array
                </label>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </GeneratorLayout>
  );
}
