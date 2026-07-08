"use client";

import * as React from "react";
import { GdHeader } from "../../shared/gd-header";
import { GdLayout } from "../../shared/gd-layout";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function LoadBalancingTool() {
  const [jobsStr, setJobsStr] = React.useState("8, 5, 3, 2, 1");
  const [processorsStr, setProcessorsStr] = React.useState("3");

  const [compared, setCompared] = React.useState(false);
  const [processorsList, setProcessorsList] = React.useState<{ id: number; load: number; jobs: number[] }[]>([]);
  const [maxMakespan, setMaxMakespan] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleEvaluate = () => {
    setError(null);
    setCompared(true);
    setProcessorsList([]);
    setMaxMakespan(null);

    const jobs = jobsStr.split(",").map((s) => parseInt(s.trim(), 10));
    const m = parseInt(processorsStr, 10);

    if (jobs.some(isNaN) || isNaN(m) || m < 1) {
      setError("Please check your jobs array and processors count inputs.");
      return;
    }

    // Sort jobs descending to optimize greedy approximation (Graham's LPT algorithm)
    const sortedJobs = [...jobs].sort((a, b) => b - a);

    const processors = Array.from({ length: m }, (_, idx) => ({
      id: idx + 1,
      load: 0,
      jobs: [] as number[],
    }));

    sortedJobs.forEach((job) => {
      // Find processor with minimum load
      processors.sort((a, b) => a.load - b.load);
      processors[0].load += job;
      processors[0].jobs.push(job);
    });

    // Re-sort processors by ID for display consistency
    processors.sort((a, b) => a.id - b.id);

    const maxLoad = Math.max(...processors.map((p) => p.load), 0);

    setProcessorsList(processors);
    setMaxMakespan(maxLoad);
  };

  const definition = "The Load Balancing problem assigns N jobs with varying processing loads to M identical processors, minimizing the maximum load on any processor (known as the makespan).";
  const greedyChoice = "Sort jobs in descending order of size. Assign each job to the processor that currently has the minimum accumulated load (Graham's Longest Processing Time heuristic).";
  const optimalSubstructure = "While load balancing is NP-hard, the greedy LPT choice guarantees a 4/3-approximation ratio of the optimal schedule makespan.";
  const proofIdea = "Proof by approximation bounds: sorting descending prevents large jobs from being scheduled late, limiting the maximum deviation from the optimal average load to at most 33%.";
  const pseudocode = `LoadBalanceLPT(jobs, M):
  sort jobs descending
  processors = list of M processors initialized with load 0
  for job in jobs:
    p = processor with minimum load
    p.load += job
    p.jobs.append(job)
  return max(processors.load)`;

  const applications = [
    "Assigning server tasks across cloud clusters.",
    "Scheduling jobs on machines.",
    "Balancing web traffic across backend workers."
  ];
  const mistakes = [
    "Scheduling jobs without sorting them first (which gives a worse 2-approximation ratio).",
    "Not balancing loads dynamically."
  ];
  const cpTips = [
    "Load balancing is a classic NP-hard scheduling problem. In competitive programming contests, when you need a fast heuristic to balance sets sums, use this LPT greedy choice!"
  ];

  return (
    <GdLayout
      timeComplexity="O(N log N) sorting + O(N * M) assignments"
      spaceComplexity="O(M) processors list size"
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
              Processor Bins Load Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {/* Visual processor bins */}
            <div className="space-y-3">
              {processorsList.map((p, idx) => {
                const maxVal = maxMakespan || 1;
                const percentage = (p.load / maxVal) * 100;
                return (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex justify-between font-mono text-[11px]">
                      <span>Processor {p.id} | Jobs: [{p.jobs.join(", ")}]</span>
                      <span className="font-bold text-emerald-500">Load: {p.load}</span>
                    </div>
                    <div className="h-2.5 w-full bg-muted/30 border border-border/5 rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {compared && maxMakespan !== null && (
              <div className="border-t border-border/5 pt-3 font-mono text-xs text-left">
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Maximum Makespan (Peak Load):</span>
                  <span className="font-bold text-emerald-500">{maxMakespan} load units</span>
                </div>
              </div>
            )}
            {error && <div className="text-xs text-rose-500 font-semibold font-mono">{error}</div>}
          </CardContent>
        </Card>
      }
    >
      <GdHeader
        title="Load Balancing"
        description="Greedily distribute jobs across processors to minimize peak makespans."
        category="Greedy"
        difficulty="Medium"
        shortcut="Alt+Shift+L"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <InputField label="Job Sizes/Loads (comma separated)" value={jobsStr} onChange={setJobsStr} />
          <InputField label="Processors Count M" value={processorsStr} onChange={setProcessorsStr} />

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Balance Loads
          </Button>
        </CardContent>
      </Card>
    </GdLayout>
  );
}
