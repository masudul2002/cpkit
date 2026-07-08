"use client";

import * as React from "react";
import { MxHeader } from "../../shared/mx-header";
import { MxLayout } from "../../shared/mx-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RotateCcw } from "lucide-react";

export function PathfindingTool() {
  const [grid, setGrid] = React.useState<string[][]>(() =>
    Array.from({ length: 6 }, () => new Array(6).fill("empty"))
  );
  const [start, setStart] = React.useState<[number, number]>([0, 0]);
  const [target, setTarget] = React.useState<[number, number]>([5, 5]);
  const [algorithm, setAlgorithm] = React.useState<"bfs" | "dijkstra" | "astar">("bfs");

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

    if (r === start[0] && c === start[1]) return;
    if (r === target[0] && c === target[1]) return;

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

  const runPathfinding = () => {
    setError(null);
    setCompared(true);
    setVisited([]);
    setPath([]);

    if (algorithm !== "bfs") {
      setError(`Dijkstra and A* algorithm visualizers are coming soon in next sprints. BFS is active below.`);
    }

    const R = grid.length;
    const C = grid[0].length;
    const q: [number, number][] = [start];
    const parent: Record<string, string> = {};
    const visitedOrder: string[] = [];
    const isVisited = Array.from({ length: R }, () => new Array(C).fill(false));

    isVisited[start[0]][start[1]] = true;

    const dirs = [
      [-1, 0], [1, 0], [0, -1], [0, 1]
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

  const definition = "Pathfinding algorithms search coordinate graphs to calculate optimal routes. BFS finds unweighted shortest paths; Dijkstra scales this for weights; A* uses heuristics.";
  const formula = "BFS: uses FIFO queue. Dijkstra: uses priority queues. A*: f(n) = g(n) + h(n) where h is Manhattan/Euclidean distances.";
  const example = "Starting from (0,0) to target (5,5), BFS expands in concentric rings, computing the unweighted path in 10 steps.";
  const applications = [
    "Grid pathfinders inside games.",
    "Network packets routing.",
    "GPS mapping routes computations."
  ];
  const mistakes = [
    "Using unweighted BFS on weighted grids, returning sub-optimal paths.",
    "Heuristic calculation slips in A* violating target admissibility."
  ];
  const cpTips = [
    "In competitive programming, unweighted grid pathfinding is solved with simple BFS. For grid weights (e.g. cell weights), use Dijkstra with standard 4-neighbor transition arrays."
  ];

  return (
    <MxLayout
      timeComplexity="O(R * C log(R * C)) / O(R * C)"
      spaceComplexity="O(R * C) heap and structures space"
      definition={definition}
      formula={formula}
      example={example}
      applications={applications}
      mistakes={mistakes}
      cpTips={cpTips}
      resultChild={
        <Card className="border-border/40 bg-card/65 shadow-xs font-sans text-left">
          <CardHeader className="pb-2 border-b border-border/10">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex justify-between items-center">
              <span>Pathfinder Visualizer Grid</span>
              <Badge variant="primary" className="text-[8px] uppercase tracking-wider scale-95">{algorithm}</Badge>
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
                    <span>Final Route Length:</span>
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
        title="Pathfinding Algorithms"
        description="Visualize shortest path searches using BFS, Dijkstra, or A* heuristic grids."
        category="Grid Search"
        difficulty="Hard"
        shortcut="Alt+Shift+P"
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
            <label className="text-xs font-semibold text-foreground/80">Pathfinding Algorithm</label>
            <Select value={algorithm} onChange={(e) => { setAlgorithm(e.target.value as any); setCompared(false); }}>
              <option value="bfs">Breadth-First Search (BFS)</option>
              <option value="dijkstra">Dijkstra (Coming Soon)</option>
              <option value="astar">A* Heuristics (Coming Soon)</option>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground">
            Click on cells in the visualizer grid to build walls (obstacles) then click run to trace the route.
          </p>
          <Button onClick={runPathfinding} className="w-full justify-center cursor-pointer">
            Run Pathfinder
          </Button>
        </CardContent>
      </Card>
    </MxLayout>
  );
}
