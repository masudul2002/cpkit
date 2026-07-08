"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cpu } from "lucide-react";
import { EducationalPanel } from "./educational-panel";

interface MxLayoutProps {
  children: React.ReactNode; // Left side input configuration panel
  resultChild: React.ReactNode; // Right side output results panel
  timeComplexity: string;
  spaceComplexity: string;
  
  // Educational panel data
  definition: string;
  formula: string;
  example: string;
  applications: string[];
  mistakes: string[];
  cpTips?: string[];
  reference?: string;
}

export function MxLayout({
  children,
  resultChild,
  timeComplexity,
  spaceComplexity,
  definition,
  formula,
  example,
  applications,
  mistakes,
  cpTips,
  reference,
}: MxLayoutProps) {
  return (
    <div className="space-y-6 font-sans">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Column: Config Panel */}
        <div className="lg:col-span-6 space-y-6">
          {children}
        </div>

        {/* Right Column: Result and Complexity */}
        <div className="lg:col-span-6 space-y-6">
          {resultChild}

          {/* Complexity Card */}
          <Card className="border-border/40 shadow-xs">
            <CardHeader className="pb-2 border-b border-border/10">
              <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 font-bold">
                <Cpu className="h-4 w-4" />
                Complexity Indices
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
                <span className="text-muted-foreground">Auxiliary Space</span>
                <Badge variant="secondary" className="font-mono text-[10px] font-bold">
                  {spaceComplexity}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Educational Panel below */}
      <EducationalPanel
        definition={definition}
        formula={formula}
        example={example}
        applications={applications}
        mistakes={mistakes}
        cpTips={cpTips}
        reference={reference}
      />
    </div>
  );
}
