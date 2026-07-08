"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Tag, ArrowUpRight } from "lucide-react";

export default function ReleasesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 text-left font-sans pb-16">
      <div className="flex items-center gap-4 bg-card/65 border border-border/40 p-5 rounded-2xl">
        <div className="p-3 bg-primary/10 text-primary border border-primary/20 rounded-xl">
          <Tag className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-lg font-black text-foreground">Release Notes & Versions</h2>
          <p className="text-xs text-muted-foreground">Detailed timeline logs of CPKit sprints releases.</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Release v2.2.0 */}
        <Card className="border-border/40 bg-card/65">
          <CardHeader className="pb-3 border-b border-border/10 flex flex-row items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-bold text-foreground">Version 2.2.0</CardTitle>
                <Badge variant="primary" className="text-[9px]">Latest Release</Badge>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">Released on 2026-07-08</p>
            </div>
          </CardHeader>
          <CardContent className="p-5 text-xs text-muted-foreground leading-relaxed space-y-2">
            <p><strong>Core UX Upgrades:</strong> Implemented global appearance settings configurations, favorite bookmark boards, recent history restores tables, and FAQ guides help desks.</p>
          </CardContent>
        </Card>

        {/* Release v2.1.0 */}
        <Card className="border-border/40 bg-card/65">
          <CardHeader className="pb-3 border-b border-border/10 flex flex-row items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-bold text-foreground">Version 2.1.0</CardTitle>
                <Badge variant="secondary" className="text-[9px]">Stable</Badge>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">Released on 2026-07-08</p>
            </div>
          </CardHeader>
          <CardContent className="p-5 text-xs text-muted-foreground leading-relaxed space-y-2">
            <p><strong>Practice Workspace:</strong> Renders distraction-free practice catalogs, tag checklists categorizations, custom inputs console runners, and code draft pads.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
