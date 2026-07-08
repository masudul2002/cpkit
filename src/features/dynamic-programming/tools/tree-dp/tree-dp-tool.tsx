"use client";

import * as React from "react";
import { DpHeader } from "../../shared/dp-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function TreeDpTool() {
  return (
    <div className="space-y-6">
      <DpHeader
        title="Tree DP Studio"
        description="Solve dynamic programming constraints over tree subtrees."
        category="Advanced DP"
        difficulty="Hard"
        shortcut="Alt+Shift+T"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans text-center py-16">
        <CardContent className="space-y-4">
          <Badge variant="primary" className="px-3 py-1 text-sm font-semibold uppercase tracking-wider bg-primary/10 border-primary/20">
            Coming Soon (Sprint 11)
          </Badge>
          <h2 className="text-xl font-bold text-foreground">Tree DP Architecture</h2>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Tree Dynamic Programming evaluates subproblem states on subtrees recursively using DFS post-order traversals (e.g. finding Independent Sets or tree matching).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
