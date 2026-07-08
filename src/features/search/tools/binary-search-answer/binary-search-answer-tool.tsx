"use client";

import * as React from "react";
import { SrHeader } from "../../shared/sr-header";
import { SrLayout } from "../../shared/sr-layout";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function BinarySearchAnswerTool() {
  const [pagesStr, setPagesStr] = React.useState("12, 34, 67, 90");
  const [studentsStr, setStudentsStr] = React.useState("2");

  const [compared, setCompared] = React.useState(false);
  const [optimalAnswer, setOptimalAnswer] = React.useState<number | null>(null);
  const [traceLogs, setTraceLogs] = React.useState<string[]>([]);
  const [allocations, setAllocations] = React.useState<{ studentId: number; books: number[]; totalPages: number }[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const isFeasible = (pages: number[], k: number, maxLimit: number) => {
    let studentCount = 1;
    let currentSum = 0;

    for (let i = 0; i < pages.length; i++) {
      if (pages[i] > maxLimit) return false;
      if (currentSum + pages[i] > maxLimit) {
        studentCount++;
        currentSum = pages[i];
        if (studentCount > k) return false;
      } else {
        currentSum += pages[i];
      }
    }
    return true;
  };

  const handleEvaluate = () => {
    setError(null);
    setCompared(true);
    setOptimalAnswer(null);
    setTraceLogs([]);
    setAllocations([]);

    const pages = pagesStr.split(",").map((s) => parseInt(s.trim(), 10));
    const k = parseInt(studentsStr, 10);

    if (pages.some(isNaN) || isNaN(k) || k <= 0 || pages.length === 0) {
      setError("Please check your pages list and students count inputs.");
      return;
    }

    if (k > pages.length) {
      setError("Number of students cannot be greater than the number of books.");
      return;
    }

    const logs: string[] = [];
    let low = Math.max(...pages);
    let high = pages.reduce((a, b) => a + b, 0);
    let ans = high;
    let step = 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const possible = isFeasible(pages, k, mid);

      logs.push(
        `Step ${step++}: Search bounds [${low}, ${high}] | Checking max limit: ${mid} → ${
          possible ? "FEASIBLE" : "NOT FEASIBLE"
        }`
      );

      if (possible) {
        ans = mid;
        logs.push(`  → Feasible. Record answer = ${mid}, trying to minimize further (high = ${mid - 1}).`);
        high = mid - 1;
      } else {
        logs.push(`  → Not feasible. Increasing maximum limit limit (low = ${mid + 1}).`);
        low = mid + 1;
      }
    }

    // Build the final allocation structure based on optimal max limit 'ans'
    const studentAllocations: { studentId: number; books: number[]; totalPages: number }[] = [];
    let currentBooks: number[] = [];
    let currentSum = 0;
    let sId = 1;

    pages.forEach((p) => {
      if (currentSum + p > ans) {
        studentAllocations.push({
          studentId: sId++,
          books: currentBooks,
          totalPages: currentSum,
        });
        currentBooks = [p];
        currentSum = p;
      } else {
        currentBooks.push(p);
        currentSum += p;
      }
    });

    studentAllocations.push({
      studentId: sId,
      books: currentBooks,
      totalPages: currentSum,
    });

    setTraceLogs(logs);
    setOptimalAnswer(ans);
    setAllocations(studentAllocations);
  };

  const definition = "Binary Search on Answer finds the optimal (minimum or maximum) value that satisfies a feasibility function by running binary search on the range of all possible outcomes.";
  const idea = "Identify the bounds [low, high] of the solution space. For each mid, test if it is possible/feasible. Halve the bounds based on the result.";
  const pseudocode = `BinarySearchOnAnswer(pages, K):
  low = max(pages), high = sum(pages)
  ans = high
  while low <= high:
    mid = low + (high - low) / 2
    if isFeasible(pages, K, mid):
      ans = mid
      high = mid - 1
    else:
      low = mid + 1
  return ans`;

  const applications = [
    "Book Allocation / Painter's Partition problem.",
    "Aggressive Cows (maximizing minimum distance).",
    "Capacity shipping container schedules optimizations."
  ];
  const mistakes = [
    "Setting incorrect search bounds (low should start at max element, high should end at sum of elements).",
    "Incorrect condition in feasibility checks (e.g. studentCount off by 1)."
  ];
  const cpTips = [
    "Whenever you see a problem asking to 'minimize the maximum value' or 'maximize the minimum value' of a decision function, look for monotonic properties and use Binary Search on Answer!"
  ];

  return (
    <SrLayout
      timeComplexity="O(N log(Sum - Max)) iterations"
      spaceComplexity="O(1) auxiliary variables"
      definition={definition}
      idea={idea}
      pseudocode={pseudocode}
      applications={applications}
      mistakes={mistakes}
      cpTips={cpTips}
      visualizerChild={
        <Card className="border-border/40 bg-card/65 shadow-xs font-sans text-left">
          <CardHeader className="pb-2 border-b border-border/10">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Book Allocations Feasibility Visualizer
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            {/* Visual allocation bins */}
            <div className="grid gap-3 sm:grid-cols-2">
              {allocations.map((alloc) => (
                <div key={alloc.studentId} className="p-3 border border-border/40 rounded-xl bg-background/25 space-y-1 text-xs">
                  <span className="font-bold text-primary">Student {alloc.studentId}</span>
                  <div className="font-mono text-muted-foreground text-[10px] my-1">
                    Books Pages: [ {alloc.books.join(", ")} ]
                  </div>
                  <div className="flex justify-between border-t border-border/5 pt-1.5 font-mono text-[10px]">
                    <span>Total Pages Assigned:</span>
                    <span className="font-extrabold text-emerald-500">{alloc.totalPages} pages</span>
                  </div>
                </div>
              ))}
            </div>

            {compared && optimalAnswer !== null && (
              <div className="border-t border-border/5 pt-3 space-y-3 font-mono text-xs text-left">
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Minimum Maximum Pages Assigned:</span>
                  <span className="font-bold text-emerald-500">{optimalAnswer} pages</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Feasibility Checking Trace:
                  </span>
                  <div className="p-2.5 bg-muted/20 border border-border/10 rounded-lg max-h-36 overflow-y-auto font-mono text-[11px] leading-relaxed text-foreground/80 space-y-1">
                    {traceLogs.map((log, idx) => (
                      <div key={idx}>{log}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {error && <div className="text-xs text-rose-500 font-semibold font-mono">{error}</div>}
          </CardContent>
        </Card>
      }
    >
      <SrHeader
        title="Binary Search on Answer"
        description="Verify feasibility thresholds greedily using binary search."
        category="Searching"
        difficulty="Hard"
        shortcut="Alt+Shift+A"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <InputField label="Books Pages (comma separated)" value={pagesStr} onChange={setPagesStr} />
          <InputField label="Students Count (K)" value={studentsStr} onChange={setStudentsStr} />

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Calculate Optimal Allocation
          </Button>
        </CardContent>
      </Card>
    </SrLayout>
  );
}
