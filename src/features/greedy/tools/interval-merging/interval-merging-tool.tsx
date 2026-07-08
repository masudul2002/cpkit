"use client";

import * as React from "react";
import { GdHeader } from "../../shared/gd-header";
import { GdLayout } from "../../shared/gd-layout";
import { TimelineChart, TimelineInterval } from "../../visualization/timeline-chart";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function IntervalMergingTool() {
  const [intervalsStr, setIntervalsStr] = React.useState("1-3, 2-6, 8-10, 15-18");

  const [compared, setCompared] = React.useState(false);
  const [originalTimeline, setOriginalTimeline] = React.useState<TimelineInterval[]>([]);
  const [mergedTimeline, setMergedTimeline] = React.useState<TimelineInterval[]>([]);
  const [mergedResult, setMergedResult] = React.useState<string>("");
  const [error, setError] = React.useState<string | null>(null);

  const handleEvaluate = () => {
    setError(null);
    setCompared(true);
    setOriginalTimeline([]);
    setMergedTimeline([]);
    setMergedResult("");

    const parts = intervalsStr.split(",").map((s) => s.trim());
    const intervals: { start: number; end: number; label: string }[] = [];

    for (let i = 0; i < parts.length; i++) {
      const bound = parts[i].split("-").map((s) => parseInt(s.trim(), 10));
      if (bound.length !== 2 || isNaN(bound[0]) || isNaN(bound[1])) {
        setError(`Invalid interval format: '${parts[i]}'. Use 'Start-End' format.`);
        return;
      }
      intervals.push({
        start: bound[0],
        end: bound[1],
        label: `Int ${i + 1} (${bound[0]}-${bound[1]})`,
      });
    }

    // Original intervals timeline rendering
    const origTimeline = intervals.map((item, idx) => ({
      start: item.start,
      end: item.end,
      label: item.label,
      status: "pending" as const,
      track: idx,
    }));

    // Sort by start times ascending
    intervals.sort((a, b) => a.start - b.start);

    const merged: { start: number; end: number }[] = [];
    if (intervals.length > 0) {
      merged.push({ start: intervals[0].start, end: intervals[0].end });

      for (let i = 1; i < intervals.length; i++) {
        const curr = intervals[i];
        const last = merged[merged.length - 1];

        if (curr.start <= last.end) {
          last.end = Math.max(last.end, curr.end);
        } else {
          merged.push({ start: curr.start, end: curr.end });
        }
      }
    }

    const mergeTimeline = merged.map((item, idx) => ({
      start: item.start,
      end: item.end,
      label: `Merged ${idx + 1} (${item.start}-${item.end})`,
      status: "selected" as const,
      track: idx,
    }));

    setOriginalTimeline(origTimeline);
    setMergedTimeline(mergeTimeline);
    setMergedResult(
      merged.map((m) => `[${m.start}, ${m.end}]`).join(", ")
    );
  };

  const definition = "The Merge Intervals problem merges all overlapping intervals from a given collection and returns an array of the non-overlapping intervals.";
  const greedyChoice = "Sort intervals by start times ascending. Maintain a list of merged intervals; if the current interval overlaps with the last merged one, merge them by extending the end boundary.";
  const optimalSubstructure = "Sorting by start times ensures that once we process interval i and it does not overlap with the current merged range, no subsequent interval can overlap with it either.";
  const proofIdea = "Proof by induction: since intervals are sorted by start time, interval i has start >= previous start. If start > last_end, all subsequent intervals also have start > last_end, guaranteeing separation.";
  const pseudocode = `MergeIntervals(intervals):
  sort intervals by start time ascending
  merged = [intervals[0]]
  for i = 1..N-1:
    last = merged[-1]
    curr = intervals[i]
    if curr.start <= last.end:
      last.end = max(last.end, curr.end)
    else:
      merged.append(curr)
  return merged`;

  const applications = [
    "Consolidating calendar free/busy blocks.",
    "Merging memory buffer allocations ranges.",
    "Database queries consolidation."
  ];
  const mistakes = [
    "Not sorting by start times first (failing to detect overlaps out of order).",
    "Failing to extend end times using maximum bounds (e.g. merging [1, 5] and [2, 3] into [1, 3] instead of [1, 5])."
  ];
  const cpTips = [
    "Merge intervals is a core sweep-line sub-routine. Keep it in mind whenever you need to compute the total length of a set of overlapping 1D segments!"
  ];

  return (
    <GdLayout
      timeComplexity="O(N log N) sorting + O(N) merge"
      spaceComplexity="O(N) mapping intervals storage"
      definition={definition}
      greedyChoice={greedyChoice}
      optimalSubstructure={optimalSubstructure}
      proofIdea={proofIdea}
      pseudocode={pseudocode}
      applications={applications}
      mistakes={mistakes}
      cpTips={cpTips}
      visualizerChild={
        <Card className="border-border/40 bg-card/65 shadow-xs font-sans text-left">
          <CardHeader className="pb-2 border-b border-border/10">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Intervals Merging Visual Comparison
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">
                Original Input Intervals (stacked):
              </span>
              <TimelineChart intervals={originalTimeline} />
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">
                Merged Output Intervals (aligned):
              </span>
              <TimelineChart intervals={mergedTimeline} />
            </div>

            {compared && mergedResult && (
              <div className="border-t border-border/5 pt-3 font-mono text-xs text-left">
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Merged Ranges:</span>
                  <span className="font-bold text-emerald-500">{mergedResult}</span>
                </div>
              </div>
            )}
            {error && <div className="text-xs text-rose-500 font-semibold font-mono">{error}</div>}
          </CardContent>
        </Card>
      }
    >
      <GdHeader
        title="Merge Intervals"
        description="Sort by start times and merge overlapping ranges greedily."
        category="Greedy"
        difficulty="Medium"
        shortcut="Alt+Shift+M"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <InputField label="Source Intervals (comma separated, e.g. 1-3, 2-6)" value={intervalsStr} onChange={setIntervalsStr} />

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Merge Overlaps
          </Button>
        </CardContent>
      </Card>
    </GdLayout>
  );
}
