"use client";

import * as React from "react";
import { GdHeader } from "../../shared/gd-header";
import { GdLayout } from "../../shared/gd-layout";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function GasStationTool() {
  const [gasStr, setGasStr] = React.useState("1, 2, 3, 4, 5");
  const [costStr, setCostStr] = React.useState("3, 4, 5, 1, 2");

  const [compared, setCompared] = React.useState(false);
  const [startIndex, setStartIndex] = React.useState<number | null>(null);
  const [simulationLogs, setSimulationLogs] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handleEvaluate = () => {
    setError(null);
    setCompared(true);
    setStartIndex(null);
    setSimulationLogs([]);

    const gas = gasStr.split(",").map((s) => parseInt(s.trim(), 10));
    const cost = costStr.split(",").map((s) => parseInt(s.trim(), 10));

    if (gas.some(isNaN) || cost.some(isNaN) || gas.length === 0) {
      setError("Please check your gas and cost arrays inputs.");
      return;
    }

    if (gas.length !== cost.length) {
      setError("Gas and Cost arrays must have the same length.");
      return;
    }

    const n = gas.length;
    const totalGas = gas.reduce((a, b) => a + b, 0);
    const totalCost = cost.reduce((a, b) => a + b, 0);

    const logs: string[] = [];

    if (totalGas < totalCost) {
      logs.push(`• Total Gas (${totalGas}) is less than Total Cost (${totalCost}). It is impossible to complete the circuit.`);
      setSimulationLogs(logs);
      setStartIndex(-1);
      return;
    }

    let tank = 0;
    let startIdx = 0;

    for (let i = 0; i < n; i++) {
      tank += gas[i] - cost[i];
      logs.push(`• Station ${i}: Added gas ${gas[i]}, cost to next is ${cost[i]}. Running tank: ${tank}`);

      if (tank < 0) {
        logs.push(`  → Tank went negative (${tank}) at station ${i}. Resetting start search position to ${i + 1} and tank to 0.`);
        startIdx = i + 1;
        tank = 0;
      }
    }

    setSimulationLogs(logs);
    setStartIndex(startIdx < n ? startIdx : -1);
  };

  const definition = "The Gas Station problem finds the starting gas station's index from which you can travel around the circular circuit once in the clockwise direction without running out of gas, given gas levels and travel costs.";
  const greedyChoice = "Verify if total gas >= total cost first. If yes, sweep stations from 0. Keep a running gas tank balance: if the tank drops below 0 at station i, the start station cannot be between the previous start and i. Reset the start station search to i + 1.";
  const optimalSubstructure = "A valid start index is guaranteed to exist and complete the circuit once we identify a start index j that maintains a positive running tank for the rest of the array scan.";
  const proofIdea = "Proof by contradiction: if the tank goes negative at station i starting from j, no station between j and i can be a valid starting station because they would arrive at i with less than or equal gas.";
  const pseudocode = `CanCompleteCircuit(gas, cost):
  total_gas = sum(gas), total_cost = sum(cost)
  if total_gas < total_cost: return -1
  tank = 0, start = 0
  for i = 0..N-1:
    tank += gas[i] - cost[i]
    if tank < 0:
      start = i + 1
      tank = 0
  return start`;

  const applications = [
    "Fuel management planning across delivery routes.",
    "Circular buffer circular scans.",
    "Optimal pathfinding under constraints."
  ];
  const mistakes = [
    "Failing to check if total gas < total cost, which leads to infinite loops or incorrect indices on impossible setups.",
    "Not wrapping around station indices correctly when debugging full circuit completions."
  ];
  const cpTips = [
    "In competitive programming contests, this is a classic O(N) sweep logic. Whenever you need to locate a single starting cell in a circular array to satisfy a prefix sum inequality, think of the Gas Station greedy reset!"
  ];

  return (
    <GdLayout
      timeComplexity="O(N) single sweep"
      spaceComplexity="O(1) auxiliary variables"
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
              Gas Station Simulation Trace Logs
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {compared && startIndex !== null && (
              <div className="border-b border-border/5 pb-3 space-y-2 font-mono text-xs text-left">
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Starting Station Index (0-indexed):</span>
                  <span className={`font-bold ${startIndex === -1 ? "text-rose-500" : "text-emerald-500"}`}>
                    {startIndex === -1 ? "No Solution (-1)" : `Station ${startIndex}`}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                Simulation Running Steps:
              </span>
              <div className="p-2.5 bg-muted/20 border border-border/10 rounded-lg max-h-48 overflow-y-auto font-mono text-[11px] leading-relaxed text-foreground/80 space-y-1">
                {simulationLogs.length > 0 ? simulationLogs.map((log, idx) => (
                  <div key={idx}>{log}</div>
                )) : <div className="text-muted-foreground text-xs font-sans">Run simulation to audit logs.</div>}
              </div>
            </div>
          </CardContent>
        </Card>
      }
    >
      <GdHeader
        title="Gas Station"
        description="Greedily identify start indexes completing circular path gas checks."
        category="Greedy"
        difficulty="Medium"
        shortcut="Alt+Shift+G"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <InputField label="Gas Station Levels (comma separated)" value={gasStr} onChange={setGasStr} />
          <InputField label="Travel Costs to Next Station (comma separated)" value={costStr} onChange={setCostStr} />

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Run Simulation
          </Button>
        </CardContent>
      </Card>
    </GdLayout>
  );
}
