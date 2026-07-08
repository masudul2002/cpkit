"use client";

import * as React from "react";
import { MxHeader } from "../../shared/mx-header";
import { MxLayout } from "../../shared/mx-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { RotateCcw } from "lucide-react";

export function FloodFillTool() {
  const [grid, setGrid] = React.useState<number[][]>(() => [
    [1, 1, 2, 2, 3, 3],
    [1, 1, 1, 2, 2, 3],
    [3, 3, 1, 1, 2, 2],
    [3, 3, 3, 1, 1, 2],
    [2, 2, 3, 3, 1, 1],
    [2, 2, 2, 3, 3, 1],
  ]);
  const [paintColor, setPaintColor] = React.useState<number>(4); // New color index: 4

  const [compared, setCompared] = React.useState(false);
  const [filledCount, setFilledCount] = React.useState(0);
  const [componentsCount, setComponentsCount] = React.useState(0);

  const handleClear = () => {
    setGrid([
      [1, 1, 2, 2, 3, 3],
      [1, 1, 1, 2, 2, 3],
      [3, 3, 1, 1, 2, 2],
      [3, 3, 3, 1, 1, 2],
      [2, 2, 3, 3, 1, 1],
      [2, 2, 2, 3, 3, 1],
    ]);
    setCompared(false);
    setFilledCount(0);
    setComponentsCount(0);
  };

  // Counts total distinct connected components in the grid
  const countComponents = (currentGrid: number[][]): number => {
    const R = currentGrid.length;
    const C = currentGrid[0].length;
    const visited = Array.from({ length: R }, () => new Array(C).fill(false));
    let count = 0;

    const dfs = (r: number, c: number, color: number) => {
      visited[r][c] = true;
      const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < R && nc >= 0 && nc < C) {
          if (!visited[nr][nc] && currentGrid[nr][nc] === color) {
            dfs(nr, nc, color);
          }
        }
      }
    };

    for (let r = 0; r < R; r++) {
      for (let c = 0; c < C; c++) {
        if (!visited[r][c]) {
          count++;
          dfs(r, c, currentGrid[r][c]);
        }
      }
    }

    return count;
  };

  const handleCellClick = (startRow: number, startCol: number) => {
    const R = grid.length;
    const C = grid[0].length;
    const oldColor = grid[startRow][startCol];
    const newColor = paintColor;

    if (oldColor === newColor) return;

    setCompared(true);
    const nextGrid = grid.map((rowArr) => [...rowArr]);
    let fillCounter = 0;

    const flood = (r: number, c: number) => {
      if (r < 0 || r >= R || c < 0 || c >= C) return;
      if (nextGrid[r][c] !== oldColor) return;

      nextGrid[r][c] = newColor;
      fillCounter++;

      flood(r - 1, c);
      flood(r + 1, c);
      flood(r, c - 1);
      flood(r, c + 1);
    };

    flood(startRow, startCol);
    setGrid(nextGrid);
    setFilledCount(fillCounter);

    // Compute updated connected components count
    setComponentsCount(countComponents(nextGrid));
  };

  // Component sweep on initialization
  React.useEffect(() => {
    setComponentsCount(countComponents(grid));
  }, []);

  const getColorClass = (val: number): string => {
    switch (val) {
      case 1: return "bg-blue-500/80 border-blue-600 text-white font-bold";
      case 2: return "bg-rose-500/80 border-rose-600 text-white font-bold";
      case 3: return "bg-zinc-700/80 border-zinc-600 text-white font-bold";
      case 4: return "bg-emerald-500/85 border-emerald-600 text-white font-bold";
      case 5: return "bg-amber-500/85 border-amber-600 text-white font-bold";
      default: return "bg-card border-border/40 text-foreground";
    }
  };

  const definition = "Flood fill algorithm (seed fill) determines and alters the area connected to a given node in a multi-dimensional array with a matching target color.";
  const formula = "DFS/BFS check: If cell is valid and color == target, paint it and recurse on 4 cardinal directions.";
  const example = "Clicking a blue cell (color 1) with paint color 4 fills all contiguous blue cells with emerald green (color 4).";
  const applications = [
    "Bucket fill paint tools.",
    "Connected components labeling in graphs.",
    "Minesweeper area sweeps."
  ];
  const mistakes = [
    "Infinite loops if the target paint color is identical to the clicked cell's color.",
    "Stack overflows on large canvases due to deep recursive calls."
  ];
  const cpTips = [
    "In competitive programming, you can count the number of connected components on a grid efficiently using a Disjoint Set Union (DSU) or simple O(V) DFS runs."
  ];

  return (
    <MxLayout
      timeComplexity="O(R * C)"
      spaceComplexity="O(R * C) recursion stack size"
      definition={definition}
      formula={formula}
      example={example}
      applications={applications}
      mistakes={mistakes}
      cpTips={cpTips}
      resultChild={
        <Card className="border-border/40 bg-card/65 shadow-xs font-sans text-left">
          <CardHeader className="pb-2 border-b border-border/10">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Connected Components & Paint Grid
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-center select-none">
              <div
                className="grid gap-1.5 p-3 border border-border/40 rounded-xl bg-background/25"
                style={{
                  gridTemplateColumns: "repeat(6, 40px)",
                }}
              >
                {grid.map((rowArr, r) =>
                  rowArr.map((cellVal, c) => (
                    <div
                      key={`${r}-${c}`}
                      onClick={() => handleCellClick(r, c)}
                      className={`w-10 h-10 border rounded-lg flex items-center justify-center font-mono text-[10px] cursor-pointer transition-all ${getColorClass(cellVal)}`}
                    >
                      {cellVal}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-1 font-mono text-xs">
              <div className="flex justify-between border-b border-border/5 pb-1">
                <span>Distinct Connected Components:</span>
                <span className="font-bold text-emerald-500">{componentsCount} components</span>
              </div>
              {compared && (
                <div className="flex justify-between pb-1">
                  <span>Last Filled Cells Count:</span>
                  <span className="font-bold text-amber-500">{filledCount} cells</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      }
    >
      <MxHeader
        title="Flood Fill Paint Tool"
        description="Interact with grid cells using a paint bucket tool to count connected components."
        category="Grid Search"
        difficulty="Easy"
        shortcut="Alt+Shift+F"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="flex flex-row justify-between items-center pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="h-7 w-7 p-0 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <div className="space-y-1.5 max-w-[200px]">
            <label className="text-xs font-semibold text-foreground/80">Select Paint Color</label>
            <Select value={paintColor.toString()} onChange={(e) => setPaintColor(parseInt(e.target.value, 10))}>
              <option value="4">Green (Color 4)</option>
              <option value="5">Orange (Color 5)</option>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground">
            Click on cells in the visualizer grid to trigger a flood fill bucket action from that starting cell.
          </p>
        </CardContent>
      </Card>
    </MxLayout>
  );
}
