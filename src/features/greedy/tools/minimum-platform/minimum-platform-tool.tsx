"use client";

import * as React from "react";
import { GdHeader } from "../../shared/gd-header";
import { GdLayout } from "../../shared/gd-layout";
import { TimelineChart, TimelineInterval } from "../../visualization/timeline-chart";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function MinimumPlatformTool() {
  const [arrivalsStr, setArrivalsStr] = React.useState("900, 940, 950, 1100, 1500, 1800");
  const [departuresStr, setDeparturesStr] = React.useState("910, 1200, 1120, 1130, 1900, 2000");

  const [compared, setCompared] = React.useState(false);
  const [timelineItems, setTimelineItems] = React.useState<TimelineInterval[]>([]);
  const [minPlatforms, setMinPlatforms] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleEvaluate = () => {
    setError(null);
    setCompared(true);
    setTimelineItems([]);
    setMinPlatforms(null);

    const arrivals = arrivalsStr.split(",").map((s) => parseInt(s.trim(), 10));
    const departures = departuresStr.split(",").map((s) => parseInt(s.trim(), 10));

    if (arrivals.some(isNaN) || departures.some(isNaN) || arrivals.length === 0) {
      setError("Please check your arrival and departure times inputs.");
      return;
    }

    if (arrivals.length !== departures.length) {
      setError("Arrival times and Departure times arrays must have the same length.");
      return;
    }

    const n = arrivals.length;

    // To assign tracks visually: sort intervals by arrival time, assign to lowest free track
    const trains = Array.from({ length: n }, (_, idx) => ({
      id: idx + 1,
      arr: arrivals[idx],
      dep: departures[idx],
      label: `Train ${idx + 1}`,
    }));

    trains.sort((a, b) => a.arr - b.arr);

    const timeline: TimelineInterval[] = [];
    const activeTracksEndTimes: number[] = [];

    trains.forEach((t) => {
      // Find lowest track index where previous train has already departed
      let assignedTrack = -1;
      for (let i = 0; i < activeTracksEndTimes.length; i++) {
        if (activeTracksEndTimes[i] <= t.arr) {
          assignedTrack = i;
          activeTracksEndTimes[i] = t.dep;
          break;
        }
      }

      if (assignedTrack === -1) {
        assignedTrack = activeTracksEndTimes.length;
        activeTracksEndTimes.push(t.dep);
      }

      timeline.push({
        start: t.arr,
        end: t.dep,
        label: `${t.label} (${t.arr}-${t.dep})`,
        status: "selected",
        track: assignedTrack,
      });
    });

    // Pure minimum platforms count using two pointers on sorted arrays
    const sortedArr = [...arrivals].sort((a, b) => a - b);
    const sortedDep = [...departures].sort((a, b) => a - b);

    let platformsNeeded = 0;
    let maxPlatforms = 0;
    let i = 0;
    let j = 0;

    while (i < n && j < n) {
      if (sortedArr[i] <= sortedDep[j]) {
        platformsNeeded++;
        maxPlatforms = Math.max(maxPlatforms, platformsNeeded);
        i++;
      } else {
        platformsNeeded--;
        j++;
      }
    }

    setTimelineItems(timeline);
    setMinPlatforms(maxPlatforms);
  };

  const definition = "The Minimum Platforms problem finds the minimum number of platforms required for a railway station so that no train has to wait, assuming arrival and departure schedules are fixed.";
  const greedyChoice = "Sort arrival and departure events independently in ascending order. Process events chronologically: if arrival, increment platform count; if departure, decrement platform count.";
  const optimalSubstructure = "The peak number of overlapping train intervals represents the minimum platforms required at any instant in the global schedule.";
  const proofIdea = "Proof by sweep-line: a railway station cannot hold more trains than the peak overlapping count without collision, so at least Peak platforms are required.";
  const pseudocode = `MinPlatforms(arr, dep):
  sort(arr), sort(dep)
  platforms = 0, max_platforms = 0
  i = 0, j = 0
  while i < arr.length and j < dep.length:
    if arr[i] <= dep[j]:
      platforms++
      max_platforms = max(max_platforms, platforms)
      i++
    else:
      platforms--
      j++
  return max_platforms`;

  const applications = [
    "Train station schedules management.",
    "Air traffic control runway allocations.",
    "Classroom schedule tracks routing."
  ];
  const mistakes = [
    "Pairing arrivals and departures together during sweeps (they must be sorted independently).",
    "Not handling identical arrival/departure times correctly."
  ];
  const cpTips = [
    "This is a classic sweep-line interval overlap problem. In competitive programming, whenever you need to find the 'maximum overlapping segment depth' of intervals, think of Minimum Platforms!"
  ];

  return (
    <GdLayout
      timeComplexity="O(N log N) sorting + O(N) sweep"
      spaceComplexity="O(N) mapping buffers"
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
              Parallel Track Platform Routing Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <TimelineChart intervals={timelineItems} maxTime={2400} />

            {compared && minPlatforms !== null && (
              <div className="border-t border-border/5 pt-3 space-y-2 font-mono text-xs text-left">
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Minimum Platforms Required:</span>
                  <span className="font-bold text-emerald-500">{minPlatforms} platforms</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      }
    >
      <GdHeader
        title="Minimum Platforms"
        description="Determine the minimum platforms needed to prevent train schedule waiting overlaps."
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
          <InputField label="Arrival Times (24h format, e.g. 900, 1100)" value={arrivalsStr} onChange={setArrivalsStr} />
          <InputField label="Departure Times (24h format, e.g. 910, 1120)" value={departuresStr} onChange={setDeparturesStr} />

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Run Overlaps Check
          </Button>
        </CardContent>
      </Card>
    </GdLayout>
  );
}
