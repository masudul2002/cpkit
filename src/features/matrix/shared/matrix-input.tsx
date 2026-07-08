"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Shuffle, RotateCcw } from "lucide-react";

interface MatrixInputProps {
  rows: number;
  cols: number;
  value: number[][];
  onChange: (val: number[][]) => void;
  minVal?: number;
  maxVal?: number;
}

export function MatrixInput({
  rows,
  cols,
  value,
  onChange,
  minVal = 0,
  maxVal = 9,
}: MatrixInputProps) {
  // Ensure the value matrix matches the rows and columns dimensions
  React.useEffect(() => {
    let changed = false;
    const nextVal = Array.from({ length: rows }, (_, r) => {
      const rowArr = value[r] || [];
      return Array.from({ length: cols }, (_, c) => {
        if (rowArr[c] === undefined) {
          changed = true;
          return 0;
        }
        return rowArr[c];
      });
    });

    if (changed || value.length !== rows) {
      onChange(nextVal);
    }
  }, [rows, cols]);

  const handleCellChange = (r: number, c: number, cellVal: string) => {
    let parsed = parseInt(cellVal, 10);
    if (isNaN(parsed)) parsed = 0;

    const nextVal = value.map((rowArr, rowIndex) =>
      rowArr.map((colVal, colIndex) => {
        if (rowIndex === r && colIndex === c) {
          return parsed;
        }
        return colVal;
      })
    );
    onChange(nextVal);
  };

  const handleRandomize = () => {
    const nextVal = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal)
    );
    onChange(nextVal);
  };

  const handleReset = () => {
    const nextVal = Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));
    onChange(nextVal);
  };

  return (
    <div className="space-y-4 font-mono text-xs select-none">
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handleRandomize} className="gap-1 text-[11px] cursor-pointer">
          <Shuffle className="h-3 w-3" />
          Randomize
        </Button>
        <Button variant="outline" size="sm" onClick={handleReset} className="gap-1 text-[11px] cursor-pointer">
          <RotateCcw className="h-3 w-3" />
          Zero Fill
        </Button>
      </div>

      <div
        className="grid gap-1.5 p-3 border border-border/40 rounded-xl bg-background/25 max-w-full overflow-x-auto"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(40px, 60px))`,
          width: "max-content",
        }}
      >
        {Array.from({ length: rows }).map((_, r) =>
          Array.from({ length: cols }).map((_, c) => {
            const val = (value[r] && value[r][c] !== undefined) ? value[r][c] : 0;
            return (
              <input
                key={`${r}-${c}`}
                type="number"
                value={val}
                onChange={(e) => handleCellChange(r, c, e.target.value)}
                className="w-full h-9 border border-border/40 rounded-lg text-center bg-card/60 text-foreground font-bold hover:border-primary/50 focus:border-primary focus:outline-hidden"
              />
            );
          })
        )}
      </div>
    </div>
  );
}
