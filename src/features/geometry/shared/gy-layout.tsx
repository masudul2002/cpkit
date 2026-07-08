"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { EducationalPanel } from "./educational-panel";

interface GyLayoutProps {
  children: React.ReactNode;
  visualizerChild: React.ReactNode;
  timeComplexity: string;
  spaceComplexity: string;
  definition: string;
  formula: string;
  pseudocode: string;
  applications: string[];
  mistakes: string[];
  cpTips?: string[];
  reference?: string;
}

export function GyLayout({
  children,
  visualizerChild,
  timeComplexity,
  spaceComplexity,
  definition,
  formula,
  pseudocode,
  applications,
  mistakes,
  cpTips,
  reference,
}: GyLayoutProps) {
  return (
    <div className="space-y-6">
      {/* Top Split Section: Configuration and Visualizer */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Column: Algorithm Configuration controls */}
        <div className="lg:col-span-4 space-y-6">{children}</div>

        {/* Right Column: Visualizer Grid */}
        <div className="lg:col-span-8 space-y-6">{visualizerChild}</div>
      </div>

      {/* Complexity stats section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/40 bg-card/65 shadow-xs font-sans text-left">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Time Complexity
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <Badge variant="primary" className="text-sm font-mono tracking-tight font-extrabold px-3 py-1 bg-primary/10 border-primary/20">
              {timeComplexity}
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/65 shadow-xs font-sans text-left">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Space Complexity
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <Badge variant="secondary" className="text-sm font-mono tracking-tight font-extrabold px-3 py-1 bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500/15">
              {spaceComplexity}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Educational panel section */}
      <EducationalPanel
        definition={definition}
        formula={formula}
        pseudocode={pseudocode}
        applications={applications}
        mistakes={mistakes}
        cpTips={cpTips}
        reference={reference}
      />
    </div>
  );
}
