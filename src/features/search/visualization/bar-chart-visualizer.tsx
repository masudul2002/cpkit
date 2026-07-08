"use client";

import * as React from "react";

interface BarChartVisualizerProps {
  array: number[];
  comparingIndices?: number[];
  swappingIndices?: number[];
  sortedIndices?: number[];
  currentIndex?: number | null;
}

export function BarChartVisualizer({
  array,
  comparingIndices = [],
  swappingIndices = [],
  sortedIndices = [],
  currentIndex = null,
}: BarChartVisualizerProps) {
  if (array.length === 0) {
    return (
      <div className="py-12 text-center text-xs text-muted-foreground border border-dashed border-border/50 rounded-2xl bg-muted/5 font-sans">
        Array is empty.
      </div>
    );
  }

  const maxVal = Math.max(...array, 1);

  return (
    <div className="border border-border/40 rounded-2xl bg-muted/5 p-6 relative overflow-hidden select-none">
      <div className="flex items-end justify-between gap-1.5 h-48">
        {array.map((val, idx) => {
          const heightPercent = (val / maxVal) * 100;

          let colorClass = "bg-primary/45 border-primary/60";

          if (swappingIndices.includes(idx)) {
            colorClass = "bg-rose-500 border-rose-600 animate-pulse";
          } else if (comparingIndices.includes(idx)) {
            colorClass = "bg-amber-500 border-amber-600";
          } else if (sortedIndices.includes(idx)) {
            colorClass = "bg-emerald-500 border-emerald-600";
          } else if (currentIndex === idx) {
            colorClass = "bg-sky-500 border-sky-600 ring-2 ring-sky-300";
          }

          return (
            <div key={idx} className="flex-1 flex flex-col items-center">
              <span className="text-[9px] font-mono mb-1 text-muted-foreground">{val}</span>
              <div
                className={`w-full rounded-t-sm border transition-all duration-200 ${colorClass}`}
                style={{ height: `${Math.max(heightPercent, 8)}%` }}
              />
              <span className="text-[8px] font-mono mt-1 text-muted-foreground/50">{idx}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
