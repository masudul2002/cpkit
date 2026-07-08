"use client";

import * as React from "react";
import { GdHeader } from "../../shared/gd-header";
import { GdLayout } from "../../shared/gd-layout";
import { TimelineChart, TimelineInterval } from "../../visualization/timeline-chart";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ActivitySelectionTool() {
  const [startsStr, setStartsStr] = React.useState("1, 3, 0, 5, 8, 5");
  const [endsStr, setEndsStr] = React.useState("2, 4, 6, 7, 9, 9");

  const [compared, setCompared] = React.useState(false);
  const [timelineItems, setTimelineItems] = React.useState<TimelineInterval[]>([]);
  const [selectedCount, setSelectedCount] = React.useState<number | null>(null);
  const [selectedIndices, setSelectedIndices] = React.useState<number[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handleEvaluate = () => {
    setError(null);
    setCompared(true);
    setTimelineItems([]);
    setSelectedCount(null);
    setSelectedIndices([]);

    const starts = startsStr.split(",").map((s) => parseInt(s.trim(), 10));
    const ends = endsStr.split(",").map((s) => parseInt(s.trim(), 10));

    if (starts.some(isNaN) || ends.some(isNaN) || starts.length === 0) {
      setError("Please check your start and end times inputs.");
      return;
    }

    if (starts.length !== ends.length) {
      setError("Start times and End times arrays must have the same length.");
      return;
    }

    const n = starts.length;
    // Map to objects with original index to track sort
    const activities = Array.from({ length: n }, (_, idx) => ({
      id: idx,
      start: starts[idx],
      end: ends[idx],
      label: `A${idx + 1} (${starts[idx]}-${ends[idx]})`,
    }));

    // Greedy choice: sort by end times ascending
    activities.sort((a, b) => a.end - b.end);

    const selectedIds: number[] = [];
    const timeline: TimelineInterval[] = [];

    // First activity is always selected
    if (n > 0) {
      selectedIds.push(activities[0].id);
      timeline.push({
        start: activities[0].start,
        end: activities[0].end,
        label: activities[0].label,
        status: "selected",
        track: 0,
      });

      let prevEnd = activities[0].end;

      for (let i = 1; i < n; i++) {
        const curr = activities[i];
        if (curr.start >= prevEnd) {
          selectedIds.push(curr.id);
          timeline.push({
            start: curr.start,
            end: curr.end,
            label: curr.label,
            status: "selected",
            track: 0,
          });
          prevEnd = curr.end;
        } else {
          timeline.push({
            start: curr.start,
            end: curr.end,
            label: curr.label,
            status: "discarded",
            track: 1, // place overlaps on track 1 for visual clarity
          });
        }
      }
    }

    setTimelineItems(timeline);
    setSelectedCount(selectedIds.length);
    setSelectedIndices(selectedIds);
  };

  const definition = "The Activity Selection problem selects the maximum number of mutually compatible activities that can be performed by a single person or resource, assuming start and end times are given.";
  const greedyChoice = "Always select the next compatible activity that finishes earliest (end time is minimized), leaving the maximum time remaining for subsequent activities.";
  const optimalSubstructure = "If we select activity A1 with earliest finish time, the optimal global solution consists of A1 plus the optimal solution to the subproblem of activities starting after A1 finishes.";
  const proofIdea = "Proof by contradiction / exchange argument: suppose another optimal choice does not select the earliest finishing activity. Replacing its first activity with the earliest finishing one cannot increase overlaps, preserving optimality.";
  const pseudocode = `ActivitySelection(start, end):
  N = start.length
  activities = list of (start[i], end[i], index)
  sort activities by end time ascending
  selected = [activities[0]]
  prev_end = activities[0].end
  for i = 1..N-1:
    if activities[i].start >= prev_end:
      selected.append(activities[i])
      prev_end = activities[i].end
  return selected`;

  const applications = [
    "Meeting room bookings and conference allocations.",
    "CPU task schedulers scheduling.",
    "Interval scheduling optimization."
  ];
  const mistakes = [
    "Sorting by start times instead of finish times (fails on long activities starting early).",
    "Sorting by durations (fails on elements overlapping central bounds)."
  ];
  const cpTips = [
    "Activity selection is identical to Maximum Interval Scheduling. In competitive programming contests, always look for constraints demanding 'non-overlapping intervals maximization' and sort by end times!"
  ];

  return (
    <GdLayout
      timeComplexity="O(N log N) sorting + O(N) linear sweep"
      spaceComplexity="O(N) mapping storage sizes"
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
              Sorted Activity Selection Timeline (Track 0 selected, Track 1 discarded)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <TimelineChart intervals={timelineItems} />

            {compared && selectedCount !== null && (
              <div className="border-t border-border/5 pt-3 space-y-2 font-mono text-xs text-left">
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Maximum Compatible Activities Selected:</span>
                  <span className="font-bold text-emerald-500">{selectedCount} activities</span>
                </div>
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Selected Activity Indices (1-indexed original):</span>
                  <span className="font-bold text-primary">
                    [ {selectedIndices.map((i) => `A${i + 1}`).join(", ") || "None"} ]
                  </span>
                </div>
              </div>
            )}
            {error && <div className="text-xs text-rose-500 font-semibold font-mono">{error}</div>}
          </CardContent>
        </Card>
      }
    >
      <GdHeader
        title="Activity Selection"
        description="Select the maximum possible compatible activities scheduling."
        category="Greedy"
        difficulty="Easy"
        shortcut="Alt+Shift+A"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <InputField label="Start Times (comma separated)" value={startsStr} onChange={setStartsStr} />
          <InputField label="End Times (comma separated)" value={endsStr} onChange={setEndsStr} />

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Run Selection Solver
          </Button>
        </CardContent>
      </Card>
    </GdLayout>
  );
}
