"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";

interface DiffViewerProps {
  expected: string;
  received: string;
  ignoreTrailingNewline?: boolean;
}

interface DiffLine {
  num: number;
  expected: string | null;
  received: string | null;
  status: "correct" | "missing" | "extra" | "changed";
}

export function DiffViewer({ expected, received, ignoreTrailingNewline = true }: DiffViewerProps) {
  const diffs = React.useMemo<DiffLine[]>(() => {
    let expStr = expected;
    let recStr = received;

    if (ignoreTrailingNewline) {
      expStr = expStr.replace(/\r?\n$/, "");
      recStr = recStr.replace(/\r?\n$/, "");
    }

    const linesExp = expStr ? expStr.split(/\r?\n/) : [];
    const linesRec = recStr ? recStr.split(/\r?\n/) : [];
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
  }, [expected, received, ignoreTrailingNewline]);

  const summary = React.useMemo(() => {
    const stats = { correct: 0, missing: 0, extra: 0, changed: 0 };
    for (const d of diffs) {
      stats[d.status]++;
    }
    return stats;
  }, [diffs]);

  if (!expected && !received) return null;

  return (
    <div className="space-y-4">
      {/* Comparison statistics badges */}
      <div className="flex flex-wrap gap-2 text-xs font-semibold">
        <Badge variant="success" className="gap-1 font-mono">
          Correct: {summary.correct}
        </Badge>
        <Badge variant="danger" className="gap-1 font-mono">
          Missing: {summary.missing}
        </Badge>
        <Badge variant="primary" className="gap-1 font-mono">
          Extra: {summary.extra}
        </Badge>
        <Badge variant="warning" className="gap-1 font-mono">
          Changed: {summary.changed}
        </Badge>
      </div>

      {/* Table Side-by-Side Diff */}
      <div className="border border-border/40 rounded-lg overflow-hidden bg-background/25">
        <div className="grid grid-cols-12 bg-muted/80 border-b border-border/40 font-bold text-[9px] uppercase tracking-wider text-muted-foreground select-none py-2 px-3">
          <div className="col-span-1 text-right pr-2">Line</div>
          <div className="col-span-5 border-r border-border/10 pl-2">Expected</div>
          <div className="col-span-5 pl-2">Received</div>
          <div className="col-span-1 text-center">Status</div>
        </div>

        <div className="divide-y divide-border/10 font-mono text-[11px] leading-[20px]">
          {diffs.map((line) => {
            let statusBg = "";
            let statusLabel = "";
            let statusColor = "";

            switch (line.status) {
              case "correct":
                statusBg = "bg-emerald-500/[0.02] hover:bg-emerald-500/[0.04]";
                statusLabel = "OK";
                statusColor = "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
                break;
              case "missing":
                statusBg = "bg-rose-500/[0.03] hover:bg-rose-500/[0.05]";
                statusLabel = "MISSING";
                statusColor = "text-rose-500 bg-rose-500/10 border-rose-500/20";
                break;
              case "extra":
                statusBg = "bg-cyan-500/[0.03] hover:bg-cyan-500/[0.05]";
                statusLabel = "EXTRA";
                statusColor = "text-cyan-500 bg-cyan-500/10 border-cyan-500/20";
                break;
              case "changed":
                statusBg = "bg-amber-500/[0.03] hover:bg-amber-500/[0.05]";
                statusLabel = "DIFF";
                statusColor = "text-amber-500 bg-amber-500/10 border-amber-500/20";
                break;
            }

            return (
              <div
                key={line.num}
                className={`grid grid-cols-12 py-1.5 px-3 transition-colors ${statusBg}`}
              >
                {/* Line number gutter */}
                <div className="col-span-1 text-right pr-2 select-none text-muted-foreground/45">
                  {line.num}
                </div>

                {/* Expected Line block */}
                <div className="col-span-5 border-r border-border/10 pr-2 pl-2 break-all overflow-x-auto whitespace-pre-wrap">
                  {line.expected !== null ? (
                    <span className={line.status === "missing" ? "text-rose-500/80 font-bold" : ""}>
                      {line.expected || <span className="text-muted-foreground/20 italic">&lt;empty&gt;</span>}
                    </span>
                  ) : (
                    <span className="text-muted-foreground/10 italic">&lt;none&gt;</span>
                  )}
                </div>

                {/* Received Line block */}
                <div className="col-span-5 pl-2 pr-2 break-all overflow-x-auto whitespace-pre-wrap">
                  {line.received !== null ? (
                    <span
                      className={
                        line.status === "extra"
                          ? "text-cyan-500/80 font-bold"
                          : line.status === "changed"
                          ? "text-amber-500/80 font-bold"
                          : ""
                      }
                    >
                      {line.received || <span className="text-muted-foreground/20 italic">&lt;empty&gt;</span>}
                    </span>
                  ) : (
                    <span className="text-muted-foreground/10 italic">&lt;none&gt;</span>
                  )}
                </div>

                {/* Status indicator */}
                <div className="col-span-1 flex justify-center items-center select-none">
                  <span
                    className={`text-[8px] font-bold px-1 py-0.5 rounded-sm border ${statusColor}`}
                  >
                    {statusLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
