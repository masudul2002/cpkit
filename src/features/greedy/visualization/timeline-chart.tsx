"use client";

import * as React from "react";

export interface TimelineInterval {
  start: number;
  end: number;
  label: string;
  status?: "selected" | "discarded" | "pending";
  track?: number; // track line index (optional, e.g. for platforms / tracks allocation)
}

interface TimelineChartProps {
  intervals: TimelineInterval[];
  maxTime?: number;
}

export function TimelineChart({ intervals, maxTime }: TimelineChartProps) {
  if (intervals.length === 0) {
    return (
      <div className="py-12 text-center text-xs text-muted-foreground border border-dashed border-border/50 rounded-2xl bg-muted/5 font-sans">
        Timeline is empty.
      </div>
    );
  }

  // Find max end time to scale the SVG widths
  const computedMaxTime = maxTime !== undefined ? maxTime : Math.max(...intervals.map((i) => i.end), 10);
  const minTime = 0;
  const range = computedMaxTime - minTime;

  // Determine tracks count to scale heights
  const tracks = intervals.map((i) => (i.track !== undefined ? i.track : 0));
  const tracksCount = Math.max(...tracks, 0) + 1;
  const rowHeight = 45;
  const svgHeight = tracksCount * rowHeight + 40;

  return (
    <div className="border border-border/40 rounded-2xl bg-muted/5 p-4 relative overflow-hidden select-none">
      <svg className="w-full" viewBox={`0 0 500 ${svgHeight}`} height={svgHeight}>
        {/* Draw vertical time grid lines */}
        {Array.from({ length: 6 }).map((_, idx) => {
          const t = minTime + (range * idx) / 5;
          const x = 50 + (t / computedMaxTime) * 420;
          return (
            <g key={idx} className="opacity-20 font-mono text-[9px]">
              <line x1={x} y1={10} x2={x} y2={svgHeight - 25} stroke="currentColor" strokeDasharray="3,3" />
              <text x={x} y={svgHeight - 10} textAnchor="middle" fill="currentColor">
                {t.toFixed(0)}
              </text>
            </g>
          );
        })}

        {/* Draw intervals */}
        {intervals.map((item, idx) => {
          const startX = 50 + (item.start / computedMaxTime) * 420;
          const endX = 50 + (item.end / computedMaxTime) * 420;
          const width = Math.max(endX - startX, 15);
          const trackIdx = item.track !== undefined ? item.track : 0;
          const y = 20 + trackIdx * rowHeight;

          let colorClass = "fill-muted-foreground/35 stroke-muted-foreground/45";
          let textColor = "fill-muted-foreground";

          if (item.status === "selected") {
            colorClass = "fill-primary/20 stroke-primary font-bold";
            textColor = "fill-primary font-bold";
          } else if (item.status === "discarded") {
            colorClass = "fill-rose-500/10 stroke-rose-500/30 opacity-40";
            textColor = "fill-rose-500/50 opacity-40";
          } else if (item.status === "pending") {
            colorClass = "fill-amber-500/10 stroke-amber-500/40";
            textColor = "fill-amber-500";
          }

          return (
            <g key={idx}>
              {/* Draw interval bar rectangle */}
              <rect
                x={startX}
                y={y}
                width={width}
                height={26}
                rx={6}
                className={`${colorClass} transition-all duration-300`}
                strokeWidth={1.5}
              />
              {/* Draw interval label text */}
              <text
                x={startX + width / 2}
                y={y + 16}
                textAnchor="middle"
                className={`font-mono text-[9px] ${textColor}`}
              >
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
