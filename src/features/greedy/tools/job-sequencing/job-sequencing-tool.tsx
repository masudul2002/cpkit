"use client";

import * as React from "react";
import { GdHeader } from "../../shared/gd-header";
import { GdLayout } from "../../shared/gd-layout";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function JobSequencingTool() {
  const [deadlinesStr, setDeadlinesStr] = React.useState("4, 1, 1, 1");
  const [profitsStr, setProfitsStr] = React.useState("20, 10, 40, 30");

  const [compared, setCompared] = React.useState(false);
  const [slotsList, setSlotsList] = React.useState<(string | null)[]>([]);
  const [maxProfit, setMaxProfit] = React.useState<number | null>(null);
  const [selectedCount, setSelectedCount] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleEvaluate = () => {
    setError(null);
    setCompared(true);
    setSlotsList([]);
    setMaxProfit(null);
    setSelectedCount(null);

    const deadlines = deadlinesStr.split(",").map((s) => parseInt(s.trim(), 10));
    const profits = profitsStr.split(",").map((s) => parseInt(s.trim(), 10));

    if (deadlines.some(isNaN) || profits.some(isNaN) || deadlines.length === 0) {
      setError("Please check your deadlines and profits inputs.");
      return;
    }

    if (deadlines.length !== profits.length) {
      setError("Deadlines and Profits arrays must have the same length.");
      return;
    }

    const n = deadlines.length;
    const jobs = Array.from({ length: n }, (_, idx) => ({
      id: idx + 1,
      deadline: deadlines[idx],
      profit: profits[idx],
    }));

    // Sort jobs by profit descending
    jobs.sort((a, b) => b.profit - a.profit);

    const maxDeadline = Math.max(...deadlines, 0);
    const slots = new Array(maxDeadline).fill(null);
    let totalP = 0;
    let count = 0;

    for (let i = 0; i < n; i++) {
      const job = jobs[i];
      // Try to assign job to furthest available slot before its deadline
      for (let j = job.deadline - 1; j >= 0; j--) {
        if (slots[j] === null) {
          slots[j] = `J${job.id} (+$${job.profit})`;
          totalP += job.profit;
          count++;
          break;
        }
      }
    }

    setSlotsList(slots);
    setMaxProfit(totalP);
    setSelectedCount(count);
  };

  const definition = "The Job Sequencing problem schedules jobs on a single machine where each job has a deadline and profit, assuming each job takes exactly 1 unit of time.";
  const greedyChoice = "Sort jobs by profit descending. For each job, schedule it in the latest possible free slot before its deadline. If no slots are available, skip the job.";
  const optimalSubstructure = "An optimal sequence of jobs contains the highest profit job scheduled in its latest slot plus the optimal schedule for the remaining subset of jobs.";
  const proofIdea = "Proof by exchange: if an optimal schedule does not select the highest profit job when a slot is free, swapping a lower profit job with it increases total profit, preserving scheduling rules.";
  const pseudocode = `JobSequencing(deadlines, profits):
  N = deadlines.length
  jobs = list of (deadlines[i], profits[i], index)
  sort jobs by profit descending
  max_d = max(deadlines)
  slots = array of size max_d filled with Null
  for job in jobs:
    for j = job.deadline - 1 down to 0:
      if slots[j] == Null:
        slots[j] = job
        break
  return slots`;

  const applications = [
    "Scheduling single-machine manufacturing lines.",
    "Maximizing revenue across server task allocations.",
    "Project task scheduling."
  ];
  const mistakes = [
    "Scheduling jobs in the earliest slot instead of the latest slot, which blocks subsequent earlier deadline jobs.",
    "Not checking deadlines offsets correctly (deadline 1 maps to slot index 0)."
  ];
  const cpTips = [
    "If max deadline constraints are massive (e.g. 10^5), the O(N^2) search loops fail. You can optimize slots tracking down to O(N log N) using a DSU (Disjoint Set Union) structure to find the next available slot in O(1)!"
  ];

  return (
    <GdLayout
      timeComplexity="O(N^2) / O(N log N) with DSU optimized"
      spaceComplexity="O(MaxDeadline) slots memory"
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
              Deadline Slot Allocations (1D sequence)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {/* Visual slots list */}
            <div className="flex flex-wrap gap-2.5">
              {slotsList.map((val, idx) => {
                return (
                  <div
                    key={idx}
                    className={`p-3.5 border rounded-xl flex flex-col items-center min-w-[70px] ${
                      val !== null
                        ? "bg-primary border-primary text-primary-foreground font-extrabold"
                        : "border-border/40 bg-background/25 text-muted-foreground/35"
                    }`}
                  >
                    <span className="text-[9px] opacity-65">Slot {idx + 1}</span>
                    <span className="text-xs font-extrabold my-1">{val !== null ? val : "FREE"}</span>
                  </div>
                );
              })}
            </div>

            {compared && maxProfit !== null && (
              <div className="border-t border-border/5 pt-3 space-y-2 font-mono text-xs text-left">
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Total Jobs Scheduled:</span>
                  <span className="font-bold text-emerald-500">{selectedCount} jobs</span>
                </div>
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Maximum Profit Achieved:</span>
                  <span className="font-bold text-primary">${maxProfit}</span>
                </div>
              </div>
            )}
            {error && <div className="text-xs text-rose-500 font-semibold font-mono">{error}</div>}
          </CardContent>
        </Card>
      }
    >
      <GdHeader
        title="Job Sequencing"
        description="Schedule jobs before deadlines to maximize revenue profit yields."
        category="Greedy"
        difficulty="Medium"
        shortcut="Alt+Shift+J"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <InputField label="Job Deadlines (comma separated)" value={deadlinesStr} onChange={setDeadlinesStr} />
          <InputField label="Job Profits (comma separated)" value={profitsStr} onChange={setProfitsStr} />

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Calculate Optimal Schedule
          </Button>
        </CardContent>
      </Card>
    </GdLayout>
  );
}
