"use client";

import * as React from "react";
import { ToolHeader } from "../../shared/tool-header";
import { ToolLayout } from "../../shared/tool-layout";
import { InputEditor } from "../../shared/input-editor";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RotateCcw } from "lucide-react";

interface DiffLine {
  num: number;
  expected: string | null;
  received: string | null;
  status: "correct" | "missing" | "extra" | "changed";
}

export function LineDiffTool() {
  const [expected, setExpected] = React.useState("");
  const [received, setReceived] = React.useState("");
  const [showCorrect, setShowCorrect] = React.useState(true);
  const [showMissing, setShowMissing] = React.useState(true);
  const [showExtra, setShowExtra] = React.useState(true);
  const [showChanged, setShowChanged] = React.useState(true);
  const [compared, setCompared] = React.useState(false);

  const handleClear = () => {
    setExpected("");
    setReceived("");
    setCompared(false);
  };

  const handleSelectExample = (exp: string, rec?: string) => {
    setExpected(exp);
    setReceived(rec || "");
    setCompared(true);
  };

  const diffs = React.useMemo<DiffLine[]>(() => {
    const linesExp = expected ? expected.split(/\r?\n/) : [];
    const linesRec = received ? received.split(/\r?\n/) : [];
    const maxLines = Math.max(linesExp.length, linesRec.length);
    const result: DiffLine[] = [];

    for (let i = 0; i < maxLines; i++) {
      const exp = i < linesExp.length ? linesExp[i] : null;
      const rec = i < linesRec.length ? linesRec[i] : null;

      if (exp === null && rec !== null) {
        result.push({ num: i + 1, expected: null, received: rec, status: "extra" });
      } else if (exp !== null && rec === null) {
        result.push({ num: i + 1, expected: exp, received: null, status: "missing" });
      } else if (exp !== null && rec !== null) {
        if (exp === rec) {
          result.push({ num: i + 1, expected: exp, received: rec, status: "correct" });
        } else {
          result.push({ num: i + 1, expected: exp, received: rec, status: "changed" });
        }
      }
    }

    return result;
  }, [expected, received]);

  const filteredDiffs = React.useMemo(() => {
    return diffs.filter((d) => {
      if (d.status === "correct") return showCorrect;
      if (d.status === "missing") return showMissing;
      if (d.status === "extra") return showExtra;
      if (d.status === "changed") return showChanged;
      return true;
    });
  }, [diffs, showCorrect, showMissing, showExtra, showChanged]);

  const summary = React.useMemo(() => {
    const stats = { correct: 0, missing: 0, extra: 0, changed: 0 };
    for (const d of diffs) {
      stats[d.status]++;
    }
    return stats;
  }, [diffs]);

  const examples = [
    {
      input: "line1\nline2\nline3\nline4",
      input2: "line1\nlineX\nline3\nline4\nline5",
      output: "Correct: 3 | Changed: 1 | Extra: 1",
      description: "Code modifications and additions",
    },
  ];

  const notes = [
    "Useful for checking large stress-test comparisons where you only want to see changed/extra lines.",
    "Toggle checkboxes below to filter and display only specific line statuses.",
    "Clicking loaded examples hydrates inputs instantly.",
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
        title="Line Difference Checker"
        description="Filter and display line-by-line file comparisons (Correct, Changed, Missing, Extra)."
        category="Difference"
        difficulty="Easy"
        shortcut="Alt+Shift+2"
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
          <div className="grid gap-4 md:grid-cols-2">
            <InputEditor
              label="Expected File Lines"
              value={expected}
              onChange={(val) => {
                setExpected(val);
                setCompared(false);
              }}
            />
            <InputEditor
              label="Received File Lines"
              value={received}
              onChange={(val) => {
                setReceived(val);
                setCompared(false);
              }}
            />
          </div>

          <Button
            onClick={() => setCompared(true)}
            className="w-full justify-center mt-2 cursor-pointer"
          >
            Compare Files
          </Button>

          {compared && (expected || received) && (
            <div className="space-y-4 pt-4 border-t border-border/10">
              {/* Filter controls */}
              <div className="flex flex-wrap items-center gap-4 py-2 border rounded-lg px-4 bg-muted/20 border-border/40 select-none">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Show Lines:</span>
                
                <div className="flex items-center gap-1.5 text-xs">
                  <Checkbox
                    id="show-correct"
                    checked={showCorrect}
                    onCheckedChange={(checked) => setShowCorrect(!!checked)}
                  />
                  <label htmlFor="show-correct" className="cursor-pointer flex items-center gap-1 text-emerald-500 font-bold">
                    Correct ({summary.correct})
                  </label>
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <Checkbox
                    id="show-missing"
                    checked={showMissing}
                    onCheckedChange={(checked) => setShowMissing(!!checked)}
                  />
                  <label htmlFor="show-missing" className="cursor-pointer flex items-center gap-1 text-rose-500 font-bold">
                    Missing ({summary.missing})
                  </label>
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <Checkbox
                    id="show-extra"
                    checked={showExtra}
                    onCheckedChange={(checked) => setShowExtra(!!checked)}
                  />
                  <label htmlFor="show-extra" className="cursor-pointer flex items-center gap-1 text-cyan-500 font-bold">
                    Extra ({summary.extra})
                  </label>
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <Checkbox
                    id="show-changed"
                    checked={showChanged}
                    onCheckedChange={(checked) => setShowChanged(!!checked)}
                  />
                  <label htmlFor="show-changed" className="cursor-pointer flex items-center gap-1 text-amber-500 font-bold">
                    Changed ({summary.changed})
                  </label>
                </div>
              </div>

              {/* Diffs Table */}
              <div className="border border-border/40 rounded-lg overflow-hidden bg-background/25">
                <div className="grid grid-cols-12 bg-muted/80 border-b border-border/40 font-bold text-[9px] uppercase tracking-wider text-muted-foreground py-2 px-3">
                  <div className="col-span-1 text-right pr-2">Line</div>
                  <div className="col-span-5 border-r border-border/10 pl-2">Expected</div>
                  <div className="col-span-5 pl-2">Received</div>
                  <div className="col-span-1 text-center">Status</div>
                </div>

                <div className="divide-y divide-border/10 font-mono text-[11px] leading-[20px]">
                  {filteredDiffs.length > 0 ? (
                    filteredDiffs.map((line) => {
                      let statusBg = "";
                      let statusLabel = "";
                      let statusColor = "";

                      switch (line.status) {
                        case "correct":
                          statusBg = "bg-emerald-500/[0.02]";
                          statusLabel = "OK";
                          statusColor = "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
                          break;
                        case "missing":
                          statusBg = "bg-rose-500/[0.03]";
                          statusLabel = "MISSING";
                          statusColor = "text-rose-500 bg-rose-500/10 border-rose-500/20";
                          break;
                        case "extra":
                          statusBg = "bg-cyan-500/[0.03]";
                          statusLabel = "EXTRA";
                          statusColor = "text-cyan-500 bg-cyan-500/10 border-cyan-500/20";
                          break;
                        case "changed":
                          statusBg = "bg-amber-500/[0.03]";
                          statusLabel = "DIFF";
                          statusColor = "text-amber-500 bg-amber-500/10 border-amber-500/20";
                          break;
                      }

                      return (
                        <div
                          key={line.num}
                          className={`grid grid-cols-12 py-1.5 px-3 transition-colors ${statusBg}`}
                        >
                          <div className="col-span-1 text-right pr-2 select-none text-muted-foreground/45">
                            {line.num}
                          </div>
                          <div className="col-span-5 border-r border-border/10 pr-2 pl-2 break-all overflow-x-auto whitespace-pre-wrap">
                            {line.expected !== null ? line.expected : <span className="text-muted-foreground/10 italic">&lt;none&gt;</span>}
                          </div>
                          <div className="col-span-5 pl-2 pr-2 break-all overflow-x-auto whitespace-pre-wrap">
                            {line.received !== null ? line.received : <span className="text-muted-foreground/10 italic">&lt;none&gt;</span>}
                          </div>
                          <div className="col-span-1 flex justify-center items-center">
                            <span className={`text-[8px] font-bold px-1 py-0.5 rounded-sm border ${statusColor}`}>
                              {statusLabel}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center text-xs text-muted-foreground bg-muted/5">
                      No lines to display matching your filters.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
