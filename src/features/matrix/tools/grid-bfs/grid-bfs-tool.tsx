"use client";

import * as React from "react";
import { MxHeader } from "../../shared/mx-header";
import { MxLayout } from "../../shared/mx-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export function GridBfsTool() {
  const [grid, setGrid] = React.useState<string[][]>(() =>
    Array.from({ length: 6 }, () => new Array(6).fill("empty"))
  );
  const [start, setStart] = React.useState<[number, number]>([0, 0]);
  const [target, setTarget] = React.useState<[number, number]>([5, 5]);

  const [compared, setCompared] = React.useState(false);
  const [visited, setVisited] = React.useState<string[]>([]);
  const [path, setPath] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handleClear = () => {
    setGrid(Array.from({ length: 6 }, () => new Array(6).fill("empty")));
    setStart([0, 0]);
    setTarget([5, 5]);
    setCompared(false);
    setVisited([]);
    setPath([]);
    setError(null);
  };

  const handleCellClick = (r: number, c: number) => {
    setCompared(false);
    setVisited([]);
    setPath([]);

    if (r === start[0] && c === start[1]) {
      // Cannot edit start cell directly (cycle through empty)
      return;
    }
    if (r === target[0] && c === target[1]) {
      return;
    }

    const nextGrid = grid.map((rowArr, rowIndex) =>
      rowArr.map((cellVal, colIndex) => {
        if (rowIndex === r && colIndex === c) {
          return cellVal === "empty" ? "wall" : "empty";
        }
        return cellVal;
      })
    );
    setGrid(nextGrid);
  };

  const runBfs = () => {
    setError(null);
    setCompared(true);
    setVisited([]);
    setPath([]);

    const R = grid.length;
    const C = grid[0].length;
    const q: [number, number][] = [start];
    const parent: Record<string, string> = {};
    const visitedOrder: string[] = [];
    const isVisited = Array.from({ length: R }, () => new Array(C).fill(false));

    isVisited[start[0]][start[1]] = true;

    const dirs = [
      [-1, 0], // Up
      [1, 0],  // Down
      [0, -1], // Left
      [0, 1],  // Right
    ];

    let found = false;

    while (q.length > 0) {
      const [r, c] = q.shift()!;
      visitedOrder.push(`${r},${c}`);

      if (r === target[0] && c === target[1]) {
        found = true;
        break;
      }

      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < R && nc >= 0 && nc < C) {
          if (!isVisited[nr][nc] && grid[nr][nc] !== "wall") {
            isVisited[nr][nc] = true;
            parent[`${nr},${nc}`] = `${r},${c}`;
            q.push([nr, nc]);
          }
        }
      }
    }

    setVisited(visitedOrder);

    if (found) {
      const shortestPath: string[] = [];
      let curr = `${target[0]},${target[1]}`;
      while (curr) {
        shortestPath.push(curr);
        curr = parent[curr];
      }
      setPath(shortestPath.reverse());
    } else {
      setError("No path exists between start and target cell.");
    }
  };

  const definition = "Grid BFS uses a FIFO queue to traverse cells layer-by-layer, guaranteeing the shortest path in unweighted grids.";
  const formula = "Dirs: (r+dr, c+dc) for dr,dc in {(-1,0), (1,0), (0,-1), (0,1)}. Time: O(V + E) = O(R * C) in grid lattices.";
  const example = "Starting from (0,0) to find (5,5). BFS traverses outward in concentric circles, returning path size 10.";
  const applications = [
    "Shortest path in unweighted 2D grid maps.",
    "Lee algorithm for routing layouts.",
    "Grid flood fill connections."
  ];
  const mistakes = [
    "Not flagging cells as visited immediately upon queue insertion, causing duplicate queue items and TLE.",
    "Out of bounds coordinate checks."
  ];
  const cpTips = [
    "In competitive programming, represent direction arrays compactly as: `int dr[] = {-1, 1, 0, 0}; int dc[] = {0, 0, -1, 1};` to quickly loop neighbors."
  ];

  return (
    <MxLayout
      timeComplexity="O(R * C)"
      spaceComplexity="O(R * C) queue and visited tables"
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
              Interactive Grid Visualizer
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
                  rowArr.map((cellVal, c) => {
                    const isStart = r === start[0] && c === start[1];
                    const isTarget = r === target[0] && c === target[1];
                    const isPath = path.includes(`${r},${c}`);
                    const isVisitedCell = visited.includes(`${r},${c}`);

                    let cellBg = "bg-card/60 hover:bg-accent/40 border-border/40";
                    if (isStart) cellBg = "bg-primary border-primary text-primary-foreground font-extrabold";
                    else if (isTarget) cellBg = "bg-emerald-500 border-emerald-500 text-white font-extrabold";
                    else if (cellVal === "wall") cellBg = "bg-zinc-700 border-zinc-600";
                    else if (isPath) cellBg = "bg-amber-500/25 border-amber-500 text-amber-400 font-bold animate-pulse";
                    else if (isVisitedCell) cellBg = "bg-primary/10 border-primary/20 text-primary/70";

                    return (
                      <div
                        key={`${r}-${c}`}
                        onClick={() => handleCellClick(r, c)}
                        className={`w-10 h-10 border rounded-lg flex items-center justify-center font-mono text-[10px] cursor-pointer transition-all ${cellBg}`}
                        title={isStart ? "Start" : isTarget ? "Target" : cellVal === "wall" ? "Wall" : "Empty"}
                      >
                        {isStart ? "S" : isTarget ? "T" : ""}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="flex gap-4 justify-center text-[10px] text-muted-foreground select-none">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-primary rounded" /> Start</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-500 rounded" /> Target</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-zinc-700 rounded" /> Wall</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-primary/20 rounded" /> Visited</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-500/20 rounded" /> Path</span>
            </div>

            {compared && (
              <div className="space-y-1 font-mono text-xs">
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Visited Order Count:</span>
                  <span className="font-bold">{visited.length} cells</span>
                </div>
                {path.length > 0 && (
                  <div className="flex justify-between pb-1">
                    <span>Shortest Path Length:</span>
                    <span className="font-bold text-amber-500">{path.length - 1} steps</span>
                  </div>
                )}
                {error && <div className="text-xs text-rose-500 font-semibold font-sans">{error}</div>}
              </div>
            )}
          </CardContent>
        </Card>
      }
    >
      <MxHeader
        title="Grid BFS Traversal"
        description="Visualize unweighted grid pathfinding layer-by-layer using FIFO queues."
        category="Grid Search"
        difficulty="Medium"
        shortcut="Alt+Shift+B"
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
          <p className="text-xs text-muted-foreground">
            Click on cells in the visualizer grid to build walls (obstacles) then click run to trace the shortest path.
          </p>
          <Button onClick={runBfs} className="w-full justify-center cursor-pointer">
            Run Grid BFS
          </Button>
        </CardContent>
      </Card>
    </MxLayout>
  );
}
