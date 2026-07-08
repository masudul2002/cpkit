"use client";

import * as React from "react";
import { ToolHeader } from "../../shared/tool-header";
import { ToolLayout } from "../../shared/tool-layout";
import { InputEditor } from "../../shared/input-editor";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { RotateCcw } from "lucide-react";

interface FreqRow {
  val: string;
  countA: number;
  countB: number;
  status: "match" | "diff";
}

export function FrequencyCompareTool() {
  const [dataA, setDataA] = React.useState("");
  const [dataB, setDataB] = React.useState("");
  const [dataType, setDataType] = React.useState<"int" | "char" | "string">("int");
  const [compared, setCompared] = React.useState(false);
  const [results, setResults] = React.useState<FreqRow[]>([]);

  const handleClear = () => {
    setDataA("");
    setDataB("");
    setCompared(false);
    setResults([]);
  };

  const tokenize = (input: string): string[] => {
    const trimmed = input.trim();
    if (!trimmed) return [];

    if (dataType === "char") {
      // Clean whitespace if checking non-space character frequencies
      return trimmed.replace(/\s+/g, "").split("");
    }
    
    // Split by whitespace
    return trimmed.split(/\s+/);
  };

  const handleEvaluate = () => {
    setCompared(true);
    const tokensA = tokenize(dataA);
    const tokensB = tokenize(dataB);

    const mapA: Record<string, number> = {};
    const mapB: Record<string, number> = {};

    for (const t of tokensA) mapA[t] = (mapA[t] || 0) + 1;
    for (const t of tokensB) mapB[t] = (mapB[t] || 0) + 1;

    const allKeys = Array.from(new Set([...Object.keys(mapA), ...Object.keys(mapB)]));

    // Sort keys based on type
    allKeys.sort((x, y) => {
      if (dataType === "int") {
        const nx = parseInt(x, 10);
        const ny = parseInt(y, 10);
        if (!isNaN(nx) && !isNaN(ny)) return nx - ny;
      }
      return x.localeCompare(y);
    });

    const list: FreqRow[] = allKeys.map((key) => {
      const cA = mapA[key] || 0;
      const cB = mapB[key] || 0;
      return {
        val: key,
        countA: cA,
        countB: cB,
        status: cA === cB ? "match" : "diff",
      };
    });

    setResults(list);
  };

  const handleSelectExample = (exp: string, rec?: string) => {
    // format example: "int;A;B"
    const [type, strA, strB] = exp.split(";");
    setDataType(type as any);
    setDataA(strA);
    setDataB(strB || "");
    setCompared(false);
  };

  const examples = [
    {
      input: "int;1 2 2 3 3 3;3 2 3 1 2 3",
      output: "Frequencies match completely (1:1, 2:2, 3:3)",
      description: "Permutation frequency match",
    },
    {
      input: "char;hello;world",
      output: "Mismatch on frequency of 'l', 'o', 'h', 'e', 'w', 'r', 'd'",
      description: "Character distribution comparison",
    },
  ];

  const notes = [
    "Supports tokenizing integers (numeric lists), raw characters, or words.",
    "Particularly helpful for checking if permutation answers contain valid counts.",
    "Highlighted red rows show count discrepancies between inputs.",
  ];

  return (
    <ToolLayout
      examples={examples}
      notes={notes}
      timeComplexity="O(N log N)"
      spaceComplexity="O(N)"
      onSelectExample={handleSelectExample}
    >
      <ToolHeader
        title="Frequency Comparator"
        description="Verify bag/multiset equalities by comparing frequency distributions of integers, strings, or characters."
        category="Multisets"
        difficulty="Medium"
        shortcut="Alt+Shift+4"
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
          <div className="space-y-1.5 max-w-[200px]">
            <label className="text-xs font-semibold text-foreground/80">Token Parsing Mode</label>
            <Select
              value={dataType}
              onChange={(e) => {
                setDataType(e.target.value as any);
                handleClear();
              }}
            >
              <option value="int">Integers (whitespace separated)</option>
              <option value="string">Strings / Words</option>
              <option value="char">Characters (raw string characters)</option>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <InputEditor
              label="Dataset A"
              value={dataA}
              onChange={(val) => {
                setDataA(val);
                setCompared(false);
              }}
              placeholder="e.g. 1 2 2 3 3 3"
            />
            <InputEditor
              label="Dataset B"
              value={dataB}
              onChange={(val) => {
                setDataB(val);
                setCompared(false);
              }}
              placeholder="e.g. 3 2 3 1 2 3"
            />
          </div>

          <Button
            onClick={handleEvaluate}
            className="w-full justify-center mt-2 cursor-pointer"
          >
            Compare Frequencies
          </Button>

          {compared && (dataA || dataB) && (
            <div className="pt-4 border-t border-border/10 space-y-4">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                Frequency Profile Grid
              </span>

              <div className="border border-border/40 rounded-lg overflow-hidden bg-background/25">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-muted/80 text-muted-foreground uppercase text-[9px] font-bold">
                    <tr>
                      <th className="px-4 py-2.5">Value</th>
                      <th className="px-4 py-2.5 text-center">Count A</th>
                      <th className="px-4 py-2.5 text-center">Count B</th>
                      <th className="px-4 py-2.5 text-center">Verdict</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/10">
                    {results.length > 0 ? (
                      results.map((row, idx) => (
                        <tr
                          key={idx}
                          className={`hover:bg-accent/15 transition-colors ${
                            row.status === "diff" ? "bg-rose-500/[0.03]" : "bg-emerald-500/[0.01]"
                          }`}
                        >
                          <td className="px-4 py-2 font-bold text-foreground">{row.val}</td>
                          <td className="px-4 py-2 text-center text-muted-foreground">{row.countA}</td>
                          <td className="px-4 py-2 text-center text-muted-foreground">{row.countB}</td>
                          <td className="px-4 py-2 text-center">
                            {row.status === "match" ? (
                              <span className="text-[9px] font-bold text-emerald-500 uppercase">Match</span>
                            ) : (
                              <span className="text-[9px] font-bold text-rose-500 uppercase">Mismatch</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                          Empty datasets.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
