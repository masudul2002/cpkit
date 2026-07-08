"use client";

import * as React from "react";
import { DpHeader } from "../../shared/dp-header";
import { DpLayout } from "../../shared/dp-layout";
import { DpTableGrid } from "../../visualization/dp-table-grid";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function CoinChangeTool() {
  const [coinsStr, setCoinsStr] = React.useState("1, 2, 5");
  const [amountStr, setAmountStr] = React.useState("7");

  const [compared, setCompared] = React.useState(false);
  const [dpMinCoinsTable, setDpMinCoinsTable] = React.useState<(number | string | null)[][]>([]);
  const [dpWaysTable, setDpWaysTable] = React.useState<(number | null)[][]>([]);
  const [rowHeaders, setRowHeaders] = React.useState<string[]>([]);
  const [colHeaders, setColHeaders] = React.useState<string[]>([]);

  const [minCoinsResult, setMinCoinsResult] = React.useState<number | string | null>(null);
  const [waysResult, setWaysResult] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleEvaluate = () => {
    setError(null);
    setCompared(true);
    setDpMinCoinsTable([]);
    setDpWaysTable([]);
    setMinCoinsResult(null);
    setWaysResult(null);

    const coins = coinsStr.split(",").map((s) => parseInt(s.trim(), 10));
    const amount = parseInt(amountStr, 10);

    if (coins.some(isNaN) || isNaN(amount) || amount < 0) {
      setError("Please check your coins array and target amount inputs.");
      return;
    }

    const n = coins.length;

    // 1. Min Coins DP: (n + 1) rows, (amount + 1) columns
    const dpMin = Array.from({ length: n + 1 }, () => new Array(amount + 1).fill(Infinity));
    for (let i = 0; i <= n; i++) dpMin[i][0] = 0;

    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= amount; j++) {
        if (coins[i - 1] <= j) {
          dpMin[i][j] = Math.min(
            dpMin[i - 1][j],
            1 + dpMin[i][j - coins[i - 1]]
          );
        } else {
          dpMin[i][j] = dpMin[i - 1][j];
        }
      }
    }

    // 2. Ways DP: (n + 1) rows, (amount + 1) columns
    const dpWays = Array.from({ length: n + 1 }, () => new Array(amount + 1).fill(0));
    for (let i = 0; i <= n; i++) dpWays[i][0] = 1;

    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= amount; j++) {
        if (coins[i - 1] <= j) {
          dpWays[i][j] = dpWays[i - 1][j] + dpWays[i][j - coins[i - 1]];
        } else {
          dpWays[i][j] = dpWays[i - 1][j];
        }
      }
    }

    // Format min table to display "INF" instead of Infinity
    const formattedMin = dpMin.map((row) =>
      row.map((val) => (val === Infinity ? "INF" : val))
    );

    const rHeaders = ["Base (0)"];
    coins.forEach((c) => rHeaders.push(`Coin ${c}`));

    const cHeaders = Array.from({ length: amount + 1 }, (_, i) => `amt=${i}`);

    setDpMinCoinsTable(formattedMin);
    setDpWaysTable(dpWays);
    setRowHeaders(rHeaders);
    setColHeaders(cHeaders);

    const minRes = dpMin[n][amount];
    setMinCoinsResult(minRes === Infinity ? "INF (Impossible)" : minRes);
    setWaysResult(dpWays[n][amount]);
  };

  const definition = "The Coin Change problem has two variations: Minimum Coins (find the fewest coins to make amount) and Number of Ways (find total unique combinations to make amount).";
  const idea = "Solves both by matching state transitions using current coin subsets. Minimum Coins minimises values picking current coin vs previous. Number of Ways sums transitions.";
  const recurrence = "dp[i][j] = min(dp[i-1][j], 1 + dp[i][j - coin]) for min coins;  dp[i][j] = dp[i-1][j] + dp[i][j - coin] for total ways";
  const transition = "For Min Coins: decides if taking coin i (1 + dp[i][j - coin]) is cheaper. For Ways: adds options using previous coins to options using coin i.";
  const pseudocode = `Ways(N, amount, coins):
  dp = Array of size (amount + 1) filled with 0
  dp[0] = 1
  for coin in coins:
    for j = coin..amount:
      dp[j] += dp[j - coin]
  return dp[amount]`;

  const applications = [
    "Vending machine currency conversions.",
    "Making financial change transactions.",
    "Evaluating coin sets combinations."
  ];
  const mistakes = [
    "Double counting coin combinations by ordering coin loops inner instead of outer.",
    "Incorrect base case values initialization."
  ];
  const cpTips = [
    "Ensure you know if duplicate combinations are allowed (order matters, e.g. [1, 2] vs [2, 1]). If order matters, place the amount loop in the outer scope!"
  ];

  return (
    <DpLayout
      timeComplexity="O(N * amount)"
      spaceComplexity="O(N * amount) / O(amount) optimized"
      definition={definition}
      idea={idea}
      recurrence={recurrence}
      transition={transition}
      pseudocode={pseudocode}
      applications={applications}
      mistakes={mistakes}
      cpTips={cpTips}
      visualizerChild={
        <Card className="border-border/40 bg-card/65 shadow-xs font-sans text-left">
          <CardHeader className="pb-2 border-b border-border/10">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Coin Change DP Table
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">
                Minimum Coins DP Grid:
              </span>
              <DpTableGrid
                table={dpMinCoinsTable}
                rowHeaders={rowHeaders}
                colHeaders={colHeaders}
              />
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">
                Total Unique Ways DP Grid:
              </span>
              <DpTableGrid
                table={dpWaysTable}
                rowHeaders={rowHeaders}
                colHeaders={colHeaders}
              />
            </div>

            {compared && (
              <div className="border-t border-border/5 pt-3 space-y-2 font-mono text-xs text-left">
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Minimum Coins needed:</span>
                  <span className="font-bold text-emerald-500">{minCoinsResult}</span>
                </div>
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Total Combinations (Ways):</span>
                  <span className="font-bold text-primary">{waysResult} combinations</span>
                </div>
              </div>
            )}
            {error && <div className="text-xs text-rose-500 font-semibold font-mono">{error}</div>}
          </CardContent>
        </Card>
      }
    >
      <DpHeader
        title="Coin Change Solver"
        description="Calculate the minimum coins needed or total ways to make change amounts."
        category="Algorithms"
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
          <InputField label="Coin Denominations (comma separated)" value={coinsStr} onChange={setCoinsStr} />
          <InputField label="Target Change Amount" value={amountStr} onChange={setAmountStr} />

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Run Coin Change Solver
          </Button>
        </CardContent>
      </Card>
    </DpLayout>
  );
}
