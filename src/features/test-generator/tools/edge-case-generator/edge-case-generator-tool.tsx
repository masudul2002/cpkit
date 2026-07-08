"use client";

import * as React from "react";
import { GeneratorHeader } from "../../shared/generator-header";
import { GeneratorLayout } from "../../shared/generator-layout";
import { PreviewPanel } from "../../shared/preview-panel";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function EdgeCaseGeneratorTool() {
  const [structure, setStructure] = React.useState<"int" | "array" | "string" | "graph">("array");
  const [edgeType, setEdgeType] = React.useState<"min" | "max" | "overflow" | "duplicate" | "alternating" | "reversed">("min");

  const [output, setOutput] = React.useState("");

  const handleGenerate = React.useCallback(() => {
    setOutput("");

    if (structure === "int") {
      if (edgeType === "min") setOutput("1");
      else if (edgeType === "max") setOutput("1000000000"); // 10^9
      else if (edgeType === "overflow") setOutput("9223372036854775807"); // LLONG_MAX
      else setOutput("-1");
    } else if (structure === "array") {
      if (edgeType === "min") {
        setOutput("1\n42");
      } else if (edgeType === "max") {
        const arr = new Array(10000).fill("1000000000");
        setOutput(`10000\n${arr.join(" ")}`);
      } else if (edgeType === "overflow") {
        const arr = ["2147483647", "-2147483648", "9223372036854775807", "-9223372036854775808"];
        setOutput(`4\n${arr.join(" ")}`);
      } else if (edgeType === "duplicate") {
        const arr = new Array(20).fill("5");
        setOutput(`20\n${arr.join(" ")}`);
      } else if (edgeType === "alternating") {
        const arr = Array.from({ length: 20 }, (_, i) => (i % 2 === 0 ? "0" : "1"));
        setOutput(`20\n${arr.join(" ")}`);
      } else if (edgeType === "reversed") {
        const arr = Array.from({ length: 20 }, (_, i) => 20 - i);
        setOutput(`20\n${arr.join(" ")}`);
      }
    } else if (structure === "string") {
      if (edgeType === "min") {
        setOutput("a");
      } else if (edgeType === "max") {
        setOutput("a".repeat(10000));
      } else if (edgeType === "duplicate") {
        setOutput("x".repeat(100));
      } else if (edgeType === "alternating") {
        setOutput("ab".repeat(50));
      } else {
        setOutput("xyz");
      }
    } else if (structure === "graph") {
      if (edgeType === "min") {
        // 2 nodes, 1 edge
        setOutput("2 1\n1 2");
      } else if (edgeType === "max" || edgeType === "reversed") {
        // Line/Path graph
        const edges: string[] = [];
        for (let i = 1; i < 50; i++) edges.push(`${i} ${i + 1}`);
        setOutput(`50 49\n${edges.join("\n")}`);
      } else if (edgeType === "duplicate") {
        // Star Graph (center connected to all)
        const edges: string[] = [];
        for (let i = 2; i <= 50; i++) edges.push(`1 ${i}`);
        setOutput(`50 49\n${edges.join("\n")}`);
      } else {
        // Clique (Complete Graph)
        const edges: string[] = [];
        for (let i = 1; i <= 10; i++) {
          for (let j = i + 1; j <= 10; j++) {
            edges.push(`${i} ${j}`);
          }
        }
        setOutput(`10 ${edges.length}\n${edges.join("\n")}`);
      }
    }
  }, [structure, edgeType]);

  React.useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  const notes = [
    "Useful for checking solution boundary errors like division-by-zero or overflows.",
    "Overflow case outputs values matching limits of C++ standard limits (2^31-1 and 2^63-1).",
    "Selecting custom configurations overrides standard settings.",
  ];

  return (
    <GeneratorLayout
      notes={notes}
      timeComplexity="O(N)"
      spaceComplexity="O(N)"
      previewChild={<PreviewPanel value={output} onRegenerate={handleGenerate} />}
    >
      <GeneratorHeader
        title="Edge Case Generator"
        description="Quickly generate boundary limits and tricky corner inputs."
        category="Verification"
        difficulty="Medium"
        shortcut="Alt+Ctrl+E"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">Data Structure</label>
              <Select value={structure} onChange={(e) => setStructure(e.target.value as any)}>
                <option value="int">Single Integer</option>
                <option value="array">Array / List</option>
                <option value="string">String Sequence</option>
                <option value="graph">Graph Structure</option>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">Edge Case Type</label>
              <Select value={edgeType} onChange={(e) => setEdgeType(e.target.value as any)}>
                <option value="min">Minimum Value Case</option>
                <option value="max">Maximum Size Case</option>
                <option value="overflow">Primitive Overflow Case</option>
                <option value="duplicate">Identical Duplicates Case</option>
                <option value="alternating">Alternating Patterns</option>
                <option value="reversed">Reverse Sorted Case</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </GeneratorLayout>
  );
}
