"use client";

import * as React from "react";

interface MatrixGridProps {
  matrix: number[][];
  highlightedCells?: string[]; // Array of "row,col" coordinates to highlight
  highlightClass?: string; // Tailwind bg color class
}

export function MatrixGrid({
  matrix,
  highlightedCells = [],
  highlightClass = "bg-primary/20 border-primary text-primary-foreground font-extrabold",
}: MatrixGridProps) {
  if (matrix.length === 0 || matrix[0].length === 0) {
    return <div className="text-xs text-muted-foreground">Empty matrix.</div>;
  }

  const rows = matrix.length;
  const cols = matrix[0].length;

  return (
    <div
      className="grid gap-1.5 p-3 border border-border/40 rounded-xl bg-background/25 max-w-full overflow-x-auto"
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(40px, 60px))`,
        width: "max-content",
      }}
    >
      {matrix.map((rowArr, r) =>
        rowArr.map((val, c) => {
          const isHighlighted = highlightedCells.includes(`${r},${c}`);
          return (
            <div
              key={`${r}-${c}`}
              className={`h-9 border rounded-lg flex items-center justify-center font-mono text-xs font-bold transition-all ${
                isHighlighted
                  ? `${highlightClass} border-2`
                  : "border-border/40 bg-card/65 text-foreground/80"
              }`}
            >
              {val}
            </div>
          );
        })
      )}
    </div>
  );
}
