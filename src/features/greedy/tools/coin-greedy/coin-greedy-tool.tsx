"use client";

import * as React from "react";
import { GdHeader } from "../../shared/gd-header";
import { GdLayout } from "../../shared/gd-layout";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function CoinGreedyTool() {
  const [denomsStr, setDenomsStr] = React.useState("1, 3, 4");
  const [targetStr, setTargetStr] = React.useState("6");

  const [compared, setCompared] = React.useState(false);
  const [greedyCoins, setGreedyCoins] = React.useState<number[]>([]);
  const [optimalCoins, setOptimalCoins] = React.useState<number[]>([]);
  const [isOptimal, setIsOptimal] = React.useState<boolean | null>(null);
  const [explanation, setExplanation] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const handleEvaluate = () => {
    setError(null);
    setCompared(true);
    setGreedyCoins([]);
    setOptimalCoins([]);
    setIsOptimal(null);
    setExplanation("");

    const coins = denomsStr.split(",").map((s) => parseInt(s.trim(), 10));
    const target = parseInt(targetStr, 10);

    if (coins.some(isNaN) || isNaN(target) || target < 0) {
      setError("Please check coin denominations and target amount inputs.");
      return;
    }

    // Sort denominations descending for greedy choices
    const sortedDenoms = [...coins].sort((a, b) => b - a);

    // 1. Run Greedy Simulation
    let tempTarget = target;
    const greedyResult: number[] = [];
    for (let i = 0; i < sortedDenoms.length; i++) {
      const denom = sortedDenoms[i];
      while (tempTarget >= denom) {
        greedyResult.push(denom);
        tempTarget -= denom;
      }
    }

    // 2. Run DP Optimal Solver
    const dp = new Array(target + 1).fill(Infinity);
    const parent = new Array(target + 1).fill(-1);
    dp[0] = 0;

    for (let i = 1; i <= target; i++) {
      for (let j = 0; j < coins.length; j++) {
        const c = coins[j];
        if (c <= i && dp[i - c] + 1 < dp[i]) {
          dp[i] = dp[i - c] + 1;
          parent[i] = c;
        }
      }
    }

    const optimalResult: number[] = [];
    if (dp[target] !== Infinity) {
      let curr = target;
      while (curr > 0) {
        const c = parent[curr];
        optimalResult.push(c);
        curr -= c;
      }
    }

    setGreedyCoins(greedyResult);
    setOptimalCoins(optimalResult);

    const matches = greedyResult.length === optimalResult.length;
    setIsOptimal(matches);

    if (matches) {
      setExplanation(
        "Greedy selection succeeded! The greedy choice matched the dynamic programming optimal solution. For this coin set and target, greedy holds."
      );
    } else {
      setExplanation(
        `Greedy failed! For target amount ${target}, Greedy picked [${greedyResult.join(
          ", "
        )}] (${greedyResult.length} coins) by always choosing the largest coin first. However, the optimal solution is [${optimalResult.join(
          ", "
        )}] (${optimalResult.length} coins). This happens because the coin set is non-canonical.`
      );
    }
  };

  const definition = "The Coin Change greedy simulator tries to solve the change problem by repeatedly choosing the largest coin denomination that fits in the remaining target amount.";
  const greedyChoice = "Always choose the largest coin value <= remaining target amount. Reduce the target and repeat.";
  const optimalSubstructure = "While coin change has optimal substructure, it does NOT always satisfy the Greedy Choice Property. The greedy choice is optimal only for canonical coin systems (e.g. US coins).";
  const proofIdea = "Counter-example proof: for coins [1, 3, 4] and target 6, greedy picks 4 + 1 + 1 (3 coins) whereas optimal is 3 + 3 (2 coins). This proves the greedy choice is locally optimal but globally suboptimal.";
  const pseudocode = `GreedyChange(target, coins):
  sort coins descending
  selected = []
  for c in coins:
    while target >= c:
      selected.append(c)
      target -= c
  return selected`;

  const applications = [
    "Simulating vending machine change algorithms.",
    "Checking currency sets efficiency design.",
    "Studying bounds of greedy vs DP correctness."
  ];
  const mistakes = [
    "Assuming greedy is always correct for all coin sets configurations.",
    "Not sorting coins descending before running greedy loops."
  ];
  const cpTips = [
    "In competitive programming, unless the problem specifies the coin set is canonical (like standard fiat currencies), NEVER use Greedy for Coin Change. Always use dynamic programming!"
  ];

  return (
    <GdLayout
      timeComplexity="O(CoinsCount) for greedy / O(Target * CoinsCount) for DP optimal"
      spaceComplexity="O(Target) DP memory size"
      definition={definition}
      greedyChoice={greedyChoice}
      optimalSubstructure={optimalSubstructure}
      proofIdea={proofIdea}
      pseudocode={pseudocode}
      applications={applications}
      mistakes={mistakes}
      cpTips={cpTips}
      visualizerChild={
        <Card className="border-border/40 bg-card/65 shadow-xs font-sans text-left">
          <CardHeader className="pb-2 border-b border-border/10">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Greedy vs Optimal Comparison Audit
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            {/* Visual comparison */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-4 border border-border/40 rounded-xl bg-background/20 space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Greedy Coin Set Selected</span>
                <div className="text-lg font-extrabold text-amber-500">
                  {compared ? `${greedyCoins.length} coins` : "-"}
                </div>
                <div className="text-[10px] font-mono text-muted-foreground/80 mt-1.5">
                  [ {compared ? greedyCoins.join(", ") || "No change" : ""} ]
                </div>
              </div>

              <div className="p-4 border border-border/40 rounded-xl bg-background/20 space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Optimal DP Coin Set</span>
                <div className="text-lg font-extrabold text-emerald-500">
                  {compared ? `${optimalCoins.length} coins` : "-"}
                </div>
                <div className="text-[10px] font-mono text-muted-foreground/80 mt-1.5">
                  [ {compared ? optimalCoins.join(", ") || "No change" : ""} ]
                </div>
              </div>
            </div>

            {compared && isOptimal !== null && (
              <div className="border-t border-border/5 pt-3 space-y-2 font-sans text-xs">
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span className="font-semibold text-muted-foreground">Is Greedy Selection Optimal:</span>
                  <span className={`font-extrabold font-mono ${isOptimal ? "text-emerald-500" : "text-rose-500"}`}>
                    {isOptimal ? "OPTIMAL (True)" : "SUBOPTIMAL (False)"}
                  </span>
                </div>
                <p className="text-muted-foreground/90 leading-relaxed font-mono text-[10px] pt-1">{explanation}</p>
              </div>
            )}
            {error && <div className="text-xs text-rose-500 font-semibold font-mono">{error}</div>}
          </CardContent>
        </Card>
      }
    >
      <GdHeader
        title="Coin Greedy Simulator"
        description="Verify local greedy choices against global optimal changes."
        category="Greedy"
        difficulty="Medium"
        shortcut="Alt+Shift+C"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <InputField label="Coin Denominations (comma separated)" value={denomsStr} onChange={setDenomsStr} />
          <InputField label="Target Amount" value={targetStr} onChange={setTargetStr} />

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Run Greedy Check
          </Button>
        </CardContent>
      </Card>
    </GdLayout>
  );
}
