"use client";

import * as React from "react";
import { GeneratorHeader } from "../../shared/generator-header";
import { GeneratorLayout } from "../../shared/generator-layout";
import { PreviewPanel } from "../../shared/preview-panel";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Download, Files } from "lucide-react";

export function BatchGeneratorTool() {
  const { toast } = useToast();
  const [casesCount, setCasesCount] = React.useState<"10" | "50" | "100" | "1000">("10");
  const [sourceType, setSourceType] = React.useState<"int" | "arr" | "perm">("arr");
  const [selectedCaseIdx, setSelectedCaseIdx] = React.useState(0);

  const [previews, setPreviews] = React.useState<string[]>([]);

  const handleGenerate = React.useCallback(() => {
    const qty = parseInt(casesCount, 10);
    const results: string[] = [];

    for (let i = 0; i < qty; i++) {
      if (sourceType === "int") {
        results.push(String(Math.floor(Math.random() * 1000) + 1));
      } else if (sourceType === "perm") {
        const arr = Array.from({ length: 10 }, (_, idx) => idx + 1);
        for (let j = 9; j > 0; j--) {
          const k = Math.floor(Math.random() * (j + 1));
          [arr[j], arr[k]] = [arr[k], arr[j]];
        }
        results.push(arr.join(" "));
      } else {
        const arr = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1);
        results.push(arr.join(" "));
      }
    }

    setPreviews(results);
    setSelectedCaseIdx(0);
  }, [casesCount, sourceType]);

  React.useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  const handleDownloadZip = () => {
    toast({
      title: "Batch ZIP Download (v1.0)",
      description: `Creating zip containing ${casesCount} cases files. ZIP packaging is a future-ready placeholder.`,
      variant: "info",
    });
  };

  const notes = [
    "Useful for offline stress testers where directories of test cases are required.",
    "Allows previewing each individual input file sequentially by clicking lists.",
    "ZIP download is mocked as a future-ready placeholder for offline solver runs.",
  ];

  return (
    <GeneratorLayout
      notes={notes}
      timeComplexity="O(Cases * N)"
      spaceComplexity="O(Cases * N)"
      previewChild={
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground select-none">
            <span>Case Inspector Panel</span>
            <span>File: input_{String(selectedCaseIdx + 1).padStart(2, "0")}.txt</span>
          </div>

          <PreviewPanel
            value={previews[selectedCaseIdx] || ""}
            onRegenerate={handleGenerate}
            filename={`input_${String(selectedCaseIdx + 1).padStart(2, "0")}.txt`}
          />

          <Button
            onClick={handleDownloadZip}
            className="w-full justify-center gap-1.5 cursor-pointer bg-violet-600 hover:bg-violet-700 text-white font-bold h-9 shadow-sm"
          >
            <Download className="h-3.5 w-3.5" />
            Download ZIP Archive
          </Button>
        </div>
      }
    >
      <GeneratorHeader
        title="Batch Case Generator"
        description="Generate multiple test case files concurrently."
        category="Batch"
        difficulty="Hard"
        shortcut="Alt+Ctrl+T"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Files className="h-4 w-4 text-muted-foreground" />
            Batch Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">Batch Quantity</label>
              <Select value={casesCount} onChange={(e) => setCasesCount(e.target.value as any)}>
                <option value="10">10 cases (Recommended)</option>
                <option value="50">50 cases</option>
                <option value="100">100 cases</option>
                <option value="1000">1000 cases</option>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">Case Structure Template</label>
              <Select value={sourceType} onChange={(e) => setSourceType(e.target.value as any)}>
                <option value="int">Integer Stream</option>
                <option value="arr">Random Arrays (N=10)</option>
                <option value="perm">Permutations (N=10)</option>
              </Select>
            </div>
          </div>

          <div className="pt-2">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-2 select-none">
              Generated Files List ({previews.length} Files)
            </span>
            <div className="grid grid-cols-5 gap-1.5 max-h-48 overflow-y-auto p-1 border border-border/20 rounded-lg bg-background/25">
              {previews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedCaseIdx(idx)}
                  className={`px-1 py-2 text-[10px] font-mono rounded border transition-colors cursor-pointer ${
                    selectedCaseIdx === idx
                      ? "bg-primary/20 border-primary text-primary font-bold"
                      : "bg-muted/10 border-border/10 text-muted-foreground hover:bg-accent/40"
                  }`}
                >
                  #{idx + 1}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </GeneratorLayout>
  );
}
