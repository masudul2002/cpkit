"use client";

import * as React from "react";
import { GdHeader } from "../../shared/gd-header";
import { GdLayout } from "../../shared/gd-layout";
import { TimelineChart, TimelineInterval } from "../../visualization/timeline-chart";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function IntervalSchedulingTool() {
  const [intervalsStr, setIntervalsStr] = React.useState("1-3, 2-4, 3-6, 5-7, 8-10");

  const [compared, setCompared] = React.useState(false);
  const [timelineItems, setTimelineItems] = React.useState<TimelineInterval[]>([]);
  const [selectedCount, setSelectedCount] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleEvaluate = () => {
    setError(null);
    setCompared(true);
    setTimelineItems([]);
    setSelectedCount(null);

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

    // Sort by end time ascending
    intervals.sort((a, b) => a.end - b.end);

    const timeline: TimelineInterval[] = [];
    let prevEnd = -Infinity;
    let count = 0;

    intervals.forEach((item) => {
      if (item.start >= prevEnd) {
        timeline.push({
          start: item.start,
          end: item.end,
          label: item.label,
          status: "selected",
          track: 0,
        });
        prevEnd = item.end;
        count++;
      } else {
        timeline.push({
          start: item.start,
          end: item.end,
          label: item.label,
          status: "discarded",
          track: 1,
        });
      }
    });

    setTimelineItems(timeline);
    setSelectedCount(count);
  };

  const definition = "The Interval Scheduling problem finds the maximum number of mutually compatible intervals from a given set of intervals.";
  const greedyChoice = "Sort intervals by end time ascending. Select the first interval, then select the next non-overlapping interval that finishes earliest.";
  const optimalSubstructure = "Selecting the earliest finishing interval leaves the maximum subset of remaining intervals available for subsequent scheduling.";
  const proofIdea = "Proof by induction: selecting any other interval can only equal or reduce the set of compatible remaining intervals compared to selecting the earliest ending one.";
  const pseudocode = `IntervalScheduling(intervals):
  sort intervals by end time ascending
  selected = []
  last_end = -INF
  for int in intervals:
    if int.start >= last_end:
      selected.append(int)
      last_end = int.end
  return selected`;

  const applications = [
    "Maximizing event schedules room bookings.",
    "Optimal project scheduling.",
    "Processor instruction pipelines."
  ];
  const mistakes = [
    "Sorting by start time (which fails if a very long interval starts early and blocks all others).",
    "Not handling strict inequality boundary conditions."
  ];
  const cpTips = [
    "Interval scheduling is identical to Activity Selection. Always remember to sort by end time to maximize non-overlapping subsets!"
  ];

  return (
    <GdLayout
      timeComplexity="O(N log N) sorting + O(N) sweep"
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
              Maximum Compatible Scheduling (Track 0 selected, Track 1 overlapping)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <TimelineChart intervals={timelineItems} />

            {compared && selectedCount !== null && (
              <div className="border-t border-border/5 pt-3 space-y-2 font-mono text-xs text-left">
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Maximum Compatible Intervals:</span>
                  <span className="font-bold text-emerald-500">{selectedCount} intervals</span>
                </div>
              </div>
            )}
            {error && <div className="text-xs text-rose-500 font-semibold font-mono">{error}</div>}
          </CardContent>
        </Card>
      }
    >
      <GdHeader
        title="Interval Scheduling"
        description="Greedily select maximum mutually compatible interval segments."
        category="Greedy"
        difficulty="Easy"
        shortcut="Alt+Shift+I"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <InputField label="Intervals Range (comma separated, e.g. 1-3, 2-4)" value={intervalsStr} onChange={setIntervalsStr} />

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Calculate Scheduling
          </Button>
        </CardContent>
      </Card>
    </GdLayout>
  );
}
