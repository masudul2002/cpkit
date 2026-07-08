"use client";

import * as React from "react";
import { GdHeader } from "../../shared/gd-header";
import { GdLayout } from "../../shared/gd-layout";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function FractionalKnapsackTool() {
  const [weightsStr, setWeightsStr] = React.useState("10, 20, 30");
  const [valuesStr, setValuesStr] = React.useState("60, 100, 120");
  const [capacityStr, setCapacityStr] = React.useState("50");

  const [compared, setCompared] = React.useState(false);
  const [itemsList, setItemsList] = React.useState<{ id: number; w: number; v: number; ratio: number; taken: number; profit: number }[]>([]);
  const [maxProfit, setMaxProfit] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleEvaluate = () => {
    setError(null);
    setCompared(true);
    setItemsList([]);
    setMaxProfit(null);

    const wt = weightsStr.split(",").map((s) => parseFloat(s.trim()));
    const val = valuesStr.split(",").map((s) => parseFloat(s.trim()));
    const W = parseFloat(capacityStr);

    if (wt.some(isNaN) || val.some(isNaN) || isNaN(W) || W <= 0) {
      setError("Please check weights, values, and capacity inputs.");
      return;
    }

    if (wt.length !== val.length) {
      setError("Weights and Values arrays must have the same length.");
      return;
    }

    const n = wt.length;
    const items = Array.from({ length: n }, (_, idx) => ({
      id: idx + 1,
      w: wt[idx],
      v: val[idx],
      ratio: val[idx] / wt[idx],
      taken: 0,
      profit: 0,
    }));

    // Sort by ratio value/weight descending
    items.sort((a, b) => b.ratio - a.ratio);

    let remainingW = W;
    let totalP = 0;

    for (let i = 0; i < n; i++) {
      if (remainingW === 0) break;
      const curr = items[i];
      if (curr.w <= remainingW) {
        curr.taken = 1.0;
        curr.profit = curr.v;
        totalP += curr.v;
        remainingW -= curr.w;
      } else {
        const fraction = remainingW / curr.w;
        curr.taken = fraction;
        curr.profit = curr.v * fraction;
        totalP += curr.v * fraction;
        remainingW = 0;
      }
    }

    setItemsList(items);
    setMaxProfit(totalP);
  };

  const definition = "The Fractional Knapsack problem permits items to be broken down fractionally. Given items of weights and values, fill a knapsack of capacity W to maximize value.";
  const greedyChoice = "Always pick the item with the highest value-per-unit-weight density (value / weight) next. If the capacity is filled before exhausting the item, take a fraction.";
  const optimalSubstructure = "An optimal solution to fractional knapsack contains the highest density item plus the optimal solution to the remaining subproblem with decreased capacity.";
  const proofIdea = "Proof by contradiction: if we select a lower-density item over a higher-density one, swapping the lower-density fraction with the higher-density one yields a strictly higher profit.";
  const pseudocode = `FractionalKnapsack(W, wt, val):
  N = wt.length
  items = list of (wt[i], val[i], ratio = val[i]/wt[i], index)
  sort items by ratio descending
  total_profit = 0
  for item in items:
    if W == 0: break
    if item.w <= W:
      total_profit += item.v
      W -= item.w
    else:
      total_profit += item.ratio * W
      W = 0
  return total_profit`;

  const applications = [
    "Dividing bulk commodities cargo loadings.",
    "Resource allocation and budget scheduling.",
    "Portfolio asset allocations weight ratios."
  ];
  const mistakes = [
    "Attempting to solve the 0/1 variation (whole items only) using density greedy sorting (which is incorrect for 0/1 Knapsack).",
    "Not dividing fractions floating-point division correctly."
  ];
  const cpTips = [
    "Fractional Knapsack is a classic example of greedy correctness. Always double-check if items are divisible. If divisible, use Greedy; if whole, use Dynamic Programming!"
  ];

  return (
    <GdLayout
      timeComplexity="O(N log N) sorting + O(N) sweep"
      spaceComplexity="O(N) items array storage"
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
              Sorted Density Items Filling Audit
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {/* Visual item bars */}
            <div className="space-y-3">
              {itemsList.map((item, idx) => {
                const percentage = item.taken * 100;
                return (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex justify-between font-mono text-[11px]">
                      <span>Item {item.id} (w: {item.w}, v: {item.v}) | Ratio: {item.ratio.toFixed(2)}</span>
                      <span className="font-bold text-emerald-500">Taken: {percentage.toFixed(1)}% (+${item.profit.toFixed(2)})</span>
                    </div>
                    <div className="h-2 w-full bg-muted/30 border border-border/5 rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {compared && maxProfit !== null && (
              <div className="border-t border-border/5 pt-3 font-mono text-xs text-left">
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Maximum Total Profit Obtained:</span>
                  <span className="font-bold text-emerald-500">${maxProfit.toFixed(2)}</span>
                </div>
              </div>
            )}
            {error && <div className="text-xs text-rose-500 font-semibold font-mono">{error}</div>}
          </CardContent>
        </Card>
      }
    >
      <GdHeader
        title="Fractional Knapsack"
        description="Greedily select commodities density ratios to maximize knapsack profit values."
        category="Greedy"
        difficulty="Easy"
        shortcut="Alt+Shift+F"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <InputField label="Item Weights (comma separated)" value={weightsStr} onChange={setWeightsStr} />
          <InputField label="Item Values (comma separated)" value={valuesStr} onChange={setValuesStr} />
          <InputField label="Knapsack Capacity (W)" value={capacityStr} onChange={setCapacityStr} />

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Fill Knapsack
          </Button>
        </CardContent>
      </Card>
    </GdLayout>
  );
}
