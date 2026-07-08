"use client";

import * as React from "react";

interface DpTableGridProps {
  table: (number | string | null)[][];
  rowHeaders?: string[];
  colHeaders?: string[];
  highlightedCells?: [number, number][]; // coordinates [row, col] to color-code
}

export function DpTableGrid({
  table,
  rowHeaders = [],
  colHeaders = [],
  highlightedCells = [],
}: DpTableGridProps) {
  if (table.length === 0) {
    return (
      <div className="py-12 text-center text-xs text-muted-foreground border border-dashed border-border/50 rounded-2xl bg-muted/5 font-sans">
        DP table is empty.
      </div>
    );
  }

  const isHighlighted = (rIdx: number, cIdx: number) => {
    return highlightedCells.some(([r, c]) => r === rIdx && c === cIdx);
  };

  return (
    <div className="overflow-x-auto border border-border/40 rounded-2xl bg-muted/5 p-4 max-h-[340px] overflow-y-auto select-none">
      <table className="w-full text-center border-collapse font-mono text-xs">
        <thead>
          <tr className="border-b border-border/20 bg-muted/20">
            {/* Corner header */}
            <th className="p-2 border-r border-border/20 text-muted-foreground font-bold">i \ j</th>
            {colHeaders.map((col, cIdx) => (
              <th key={cIdx} className="p-2 text-foreground font-bold font-mono min-w-[45px]">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.map((row, rIdx) => (
            <tr key={rIdx} className="border-b border-border/10 hover:bg-accent/5">
              {/* Row header */}
              <td className="p-2 border-r border-border/20 font-bold bg-muted/15 text-foreground/80 font-mono text-left">
                {rowHeaders[rIdx] !== undefined ? rowHeaders[rIdx] : `R${rIdx}`}
              </td>

              {row.map((cell, cIdx) => {
                const high = isHighlighted(rIdx, cIdx);
                return (
                  <td
                    key={cIdx}
                    className={`p-2 border-r border-border/10 font-semibold transition-all duration-300 min-w-[45px] ${
                      high
                        ? "bg-primary text-primary-foreground font-extrabold shadow-inner"
                        : cell !== null && cell !== ""
                        ? "text-emerald-500 bg-background/25"
                        : "text-muted-foreground/30"
                    }`}
                  >
                    {cell !== null ? cell : "-"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
