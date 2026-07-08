"use client";

import * as React from "react";
import { GrHeader } from "../../shared/gr-header";
import { GrLayout } from "../../shared/gr-layout";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function UnionFindTool() {
  const [size, setSize] = React.useState("5");
  const [parent, setParent] = React.useState<number[]>([]);
  const [rank, setRank] = React.useState<number[]>([]);

  const [inputU, setInputU] = React.useState("0");
  const [inputV, setInputV] = React.useState("1");

  const [compared, setCompared] = React.useState(false);
  const [trace, setTrace] = React.useState<string[]>([]);
  const [findResult, setFindResult] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  // Initialize DSU
  const handleReset = () => {
    setError(null);
    setCompared(false);
    setTrace([]);
    setFindResult(null);

    const N = parseInt(size, 10);
    if (isNaN(N) || N < 1 || N > 10) {
      setError("Please enter valid size between 1 and 10.");
      return;
    }

    setParent(Array.from({ length: N }, (_, i) => i));
    setRank(new Array(N).fill(0));
  };

  React.useEffect(() => {
    handleReset();
  }, [size]);

  const find = (i: number): number => {
    let root = i;
    while (parent[root] !== root) {
      root = parent[root];
    }
    return root;
  };

  const handleUnion = () => {
    setError(null);
    setFindResult(null);

    const u = parseInt(inputU, 10);
    const v = parseInt(inputV, 10);
    const N = parent.length;

    if (isNaN(u) || isNaN(v) || u < 0 || u >= N || v < 0 || v >= N) {
      setError(`Nodes must be positive integers less than ${N}.`);
      return;
    }

    setCompared(true);
    const rootU = find(u);
    const rootV = find(v);

    const log = [...trace];

    if (rootU !== rootV) {
      const nextParent = [...parent];
      const nextRank = [...rank];

      if (nextRank[rootU] < nextRank[rootV]) {
        nextParent[rootU] = rootV;
        log.push(`• Union(${u}, ${v}): Attached root ${rootU} under root ${rootV}`);
      } else if (nextRank[rootU] > nextRank[rootV]) {
        nextParent[rootV] = rootU;
        log.push(`• Union(${u}, ${v}): Attached root ${rootV} under root ${rootU}`);
      } else {
        nextParent[rootV] = rootU;
        nextRank[rootU]++;
        log.push(`• Union(${u}, ${v}): Attached root ${rootV} under root ${rootU}. Incremented Rank[${rootU}] to ${nextRank[rootU]}`);
      }

      setParent(nextParent);
      setRank(nextRank);
    } else {
      log.push(`• Union(${u}, ${v}): Already in the same connected component (root ${rootU})`);
    }

    setTrace(log);
  };

  const handleFind = () => {
    setError(null);
    setCompared(true);

    const u = parseInt(inputU, 10);
    const N = parent.length;

    if (isNaN(u) || u < 0 || u >= N) {
      setError(`Node must be between 0 and ${N - 1}.`);
      return;
    }

    const root = find(u);
    setFindResult(`Root representative element of node ${u} is: ${root}`);
  };

  const definition = "Disjoint Set Union (DSU) / Union-Find maintains a partition of elements into disjoint sets, supporting merge (Union) and query (Find) operations in near-constant time.";
  const idea = "Each set is represented as a tree. Union merges two trees by pointing the root of one to another. Find traverses parents to locate the root representative.";
  const pseudocode = `Find(i):
  if parent[i] == i: return i
  return parent[i] = Find(parent[i]) // Path Compression

Union(i, j):
  rootI = Find(i)
  rootJ = Find(j)
  if rootI != rootJ:
    if rank[rootI] < rank[rootJ]: parent[rootI] = rootJ
    else if rank[rootI] > rank[rootJ]: parent[rootJ] = rootI
    else: parent[rootJ] = rootI, rank[rootI]++`;

  const applications = [
    "Kruskal's Minimum Spanning Tree algorithm.",
    "Dynamic graph connectivity checks.",
    "Cycle detection in undirected graphs."
  ];
  const mistakes = [
    "Forgetting path compression, causing Find operations to degrade to O(N) linear time.",
    "Incorrect rank check comparisons causing high tree depths."
  ];
  const cpTips = [
    "DSU is extremely powerful. When combined with path compression and union-by-rank, operations run in O(α(N)) time, where α is the inverse Ackermann function (essentially O(1) for all practical inputs)."
  ];

  return (
    <GrLayout
      timeComplexity="O(α(N)) near-constant time"
      spaceComplexity="O(N) parent & rank sizes"
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
              DSU Representative Forest
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {/* Visual parents list */}
            <div className="grid gap-4 grid-cols-5 text-center">
              {parent.map((p, idx) => (
                <div key={idx} className="p-2 border border-border/40 rounded-xl bg-background/25">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase">Element {idx}</div>
                  <div className="text-sm font-extrabold text-foreground mt-1">Parent: {p}</div>
                  <div className="text-[9px] text-muted-foreground/60 mt-0.5">Rank: {rank[idx]}</div>
                </div>
              ))}
            </div>

            {compared && (
              <div className="border-t border-border/5 pt-3 space-y-3 font-mono text-xs text-left">
                {findResult && (
                  <div className="p-2.5 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 rounded-lg">
                    {findResult}
                  </div>
                )}

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                    DSU Operations Log:
                  </span>
                  <div className="p-3 bg-muted/20 border border-border/10 rounded-lg max-h-40 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-1">
                    {trace.length > 0 ? trace.map((t, idx) => (
                      <div key={idx} className="text-foreground/80">{t}</div>
                    )) : <div className="text-muted-foreground">No operations logged yet.</div>}
                  </div>
                </div>
              </div>
            )}
            {error && <div className="text-xs text-rose-500 font-semibold font-mono">{error}</div>}
          </CardContent>
        </Card>
      }
    >
      <GrHeader
        title="DSU / Union-Find"
        description="Interact with disjoint sets using union-by-rank and trace element trees in real time."
        category="Set Structures"
        difficulty="Easy"
        shortcut="Alt+Shift+U"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <div className="grid gap-4 grid-cols-2">
            <InputField
              label="DSU Set Size (N <= 10)"
              value={size}
              onChange={(val) => {
                setSize(val);
                setCompared(false);
              }}
            />
            <Button variant="outline" onClick={handleReset} className="mt-6 justify-center cursor-pointer h-9">
              Reset Set
            </Button>
          </div>

          <div className="grid gap-4 grid-cols-2">
            <InputField label="Element U" value={inputU} onChange={setInputU} />
            <InputField label="Element V" value={inputV} onChange={setInputV} />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleUnion} className="flex-1 justify-center cursor-pointer">
              Union(U, V)
            </Button>
            <Button onClick={handleFind} variant="outline" className="flex-1 justify-center cursor-pointer">
              Find(U)
            </Button>
          </div>
        </CardContent>
      </Card>
    </GrLayout>
  );
}
