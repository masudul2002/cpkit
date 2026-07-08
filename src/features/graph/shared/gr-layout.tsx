"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cpu } from "lucide-react";
import { EducationalPanel } from "./educational-panel";

interface GrLayoutProps {
  children: React.ReactNode; // Left Column: Config Panel
  visualizerChild: React.ReactNode; // Right Column: Canvas/Visuals
  timeComplexity: string;
  spaceComplexity: string;

  // Educational Panel Data
  definition: string;
  idea: string;
  pseudocode: string;
  applications: string[];
  mistakes: string[];
  cpTips?: string[];
  reference?: string;
}

export function GrLayout({
  children,
  visualizerChild,
  timeComplexity,
  spaceComplexity,
  definition,
  idea,
  pseudocode,
  applications,
  mistakes,
  cpTips,
  reference,
}: GrLayoutProps) {
  return (
    <div className="space-y-6 font-sans">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Column: Configs */}
        <div className="lg:col-span-4 space-y-6">
          {children}

          {/* Complexities Badges */}
          <Card className="border-border/40 shadow-xs">
            <CardHeader className="pb-2 border-b border-border/10">
              <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 font-bold">
                <Cpu className="h-4 w-4" />
                Complexity Mappings
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Time Complexity</span>
                <Badge variant="primary" className="font-mono text-[10px] font-bold">
                  {timeComplexity}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Space Complexity</span>
                <Badge variant="secondary" className="font-mono text-[10px] font-bold">
                  {spaceComplexity}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Interactive Canvas Visualizer */}
        <div className="lg:col-span-8 space-y-6">
          {visualizerChild}
        </div>
      </div>

      {/* Educational details below */}
      <EducationalPanel
        definition={definition}
        idea={idea}
        pseudocode={pseudocode}
        applications={applications}
        mistakes={mistakes}
        cpTips={cpTips}
        reference={reference}
      />
    </div>
  );
}
