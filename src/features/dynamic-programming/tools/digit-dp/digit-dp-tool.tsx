"use client";

import * as React from "react";
import { DpHeader } from "../../shared/dp-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function DigitDpTool() {
  return (
    <div className="space-y-6">
      <DpHeader
        title="Digit DP Studio"
        description="Solve digit-counting range constraints queries."
        category="Advanced DP"
        difficulty="Hard"
        shortcut="Alt+Shift+D"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans text-center py-16">
        <CardContent className="space-y-4">
          <Badge variant="primary" className="px-3 py-1 text-sm font-semibold uppercase tracking-wider bg-primary/10 border-primary/20">
            Coming Soon (Sprint 11)
          </Badge>
          <h2 className="text-xl font-bold text-foreground">Digit DP Architecture</h2>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Digit Dynamic Programming lets you count numbers satisfying a specific property within a range $[L, R]$ by constructing numbers digit-by-digit.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
