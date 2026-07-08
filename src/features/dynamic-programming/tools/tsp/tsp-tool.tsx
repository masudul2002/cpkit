"use client";

import * as React from "react";
import { DpHeader } from "../../shared/dp-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function TspTool() {
  return (
    <div className="space-y-6">
      <DpHeader
        title="Travelling Salesman"
        description="Solve TSP path bounds using bitmask subsets DP."
        category="Advanced DP"
        difficulty="Hard"
        shortcut="Alt+Shift+V"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans text-center py-16">
        <CardContent className="space-y-4">
          <Badge variant="primary" className="px-3 py-1 text-sm font-semibold uppercase tracking-wider bg-primary/10 border-primary/20">
            Coming Soon (Sprint 11)
          </Badge>
          <h2 className="text-xl font-bold text-foreground">TSP DP Architecture</h2>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            The Travelling Salesman Problem (TSP) finds the minimum cost Hamiltonian cycle visiting all nodes exactly once using dynamic programming with bitmasks in $O(2^N \cdot N^2)$ time.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
