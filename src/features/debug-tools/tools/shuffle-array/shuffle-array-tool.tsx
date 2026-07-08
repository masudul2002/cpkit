"use client";

import * as React from "react";
import { ToolHeader } from "../../shared/tool-header";
import { ToolLayout } from "../../shared/tool-layout";
import { InputEditor } from "../../shared/input-editor";
import { OutputViewer } from "../../shared/output-viewer";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RotateCcw, Shuffle } from "lucide-react";

// Linear Congruential Generator for seeded randomness
class LCG {
  private state: number;
  constructor(seed: number) {
    this.state = seed;
  }
  next(): number {
    this.state = (this.state * 1664525 + 1013904223) % 4294967296;
    return this.state / 4294967296;
  }
}

export function ShuffleArrayTool() {
  const [arrayInput, setArrayInput] = React.useState("");
  const [useSeed, setUseSeed] = React.useState(false);
  const [seedVal, setSeedVal] = React.useState("1337");
  const [shuffledOutput, setShuffledOutput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const handleClear = () => {
    setArrayInput("");
    setShuffledOutput("");
    setError(null);
  };

  const handleShuffle = () => {
    setError(null);
    setShuffledOutput("");

    const tokens = arrayInput.trim().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return;

    let rng: LCG | null = null;
    if (useSeed) {
      const parsedSeed = parseInt(seedVal, 10);
      if (isNaN(parsedSeed)) {
        setError("Seed must be a valid integer");
        return;
      }
      rng = new LCG(parsedSeed);
    }

    const getRandom = () => (rng ? rng.next() : Math.random());

    const result = [...tokens];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(getRandom() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }

    setShuffledOutput(result.join(" "));
  };

  const handleSelectExample = (exp: string) => {
    const [useS, seed, input] = exp.split(";");
    setUseSeed(useS === "true");
    setSeedVal(seed);
    setArrayInput(input);
    setShuffledOutput("");
  };

  const examples = [
    { input: "false;0;1 2 3 4 5 6 7 8 9 10", output: "Shuffled Array (Random)", description: "Unseeded Random Shuffle" },
    { input: "true;1337;1 2 3 4 5 6 7 8 9 10", output: "8 4 9 7 2 5 3 6 1 10 (Deterministic)", description: "Seeded Fisher-Yates Shuffle" },
  ];

  const notes = [
    "Fisher-Yates (Knuth) Shuffle algorithm guarantees $O(N)$ uniform random distribution.",
    "Toggling 'Deterministic Seed' produces identical arrays for checking test cases.",
    "Useful for generating random permutations of nodes, values, or weights.",
  ];

  return (
    <ToolLayout
      examples={examples}
      notes={notes}
      timeComplexity="O(N)"
      spaceComplexity="O(N)"
      onSelectExample={handleSelectExample}
    >
      <ToolHeader
        title="Array Shuffler"
        description="Randomize array elements with Fisher-Yates sorting, supporting deterministic seeds."
        category="Generation"
        difficulty="Easy"
        shortcut="Alt+Shift+7"
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
            title="Reset"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </CardHeader>
        <CardContent className="p-6 space-y-5">
          <div className="flex flex-wrap items-center gap-6 pt-1 select-none">
            <div className="flex items-center gap-1.5 text-xs">
              <Checkbox
                id="use-seed"
                checked={useSeed}
                onCheckedChange={(checked) => setUseSeed(!!checked)}
              />
              <label htmlFor="use-seed" className="cursor-pointer font-medium text-foreground/80">
                Enable Deterministic Seed (LCG RNG)
              </label>
            </div>

            {useSeed && (
              <div className="w-32">
                <InputField
                  label="Seed Integer"
                  value={seedVal}
                  onChange={setSeedVal}
                  error={error || undefined}
                />
              </div>
            )}
          </div>

          <InputEditor
            label="Source Array (space separated)"
            value={arrayInput}
            onChange={setArrayInput}
            placeholder="e.g. 1 2 3 4 5 6 7 8"
          />

          <Button
            onClick={handleShuffle}
            className="w-full justify-center gap-1.5 mt-2 cursor-pointer"
          >
            <Shuffle className="h-4 w-4" />
            Shuffle Array Elements
          </Button>

          {shuffledOutput && (
            <div className="pt-4 border-t border-border/10">
              <OutputViewer label="Shuffled Result Output" value={shuffledOutput} />
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
