"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layers, Cpu } from "lucide-react";

interface GeneratorLayoutProps {
  children: React.ReactNode; // Left side input configuration panels
  previewChild: React.ReactNode; // Right side output preview panel
  notes?: string[];
  timeComplexity?: string;
  spaceComplexity?: string;
}

export function GeneratorLayout({
  children,
  previewChild,
  notes,
  timeComplexity,
  spaceComplexity,
}: GeneratorLayoutProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-12 items-start font-sans">
      {/* Left Column: Input Settings and Constraints Configuration */}
      <div className="lg:col-span-6 space-y-6">
        {children}
      </div>

      {/* Right Column: Generated Preview and Reference Notes */}
      <div className="lg:col-span-6 space-y-6">
        {previewChild}

        {/* Complexity specs */}
        {(timeComplexity || spaceComplexity) && (
          <Card className="border-border/40 shadow-xs">
            <CardHeader className="pb-2 border-b border-border/10">
              <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 font-bold">
                <Cpu className="h-4 w-4" />
                Complexity Specs
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-xs">
              {timeComplexity && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Time Complexity</span>
                  <Badge variant="primary" className="font-mono text-[10px] font-bold">
                    {timeComplexity}
                  </Badge>
                </div>
              )}
              {spaceComplexity && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Space Complexity</span>
                  <Badge variant="secondary" className="font-mono text-[10px] font-bold">
                    {spaceComplexity}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Notes section */}
        {notes && notes.length > 0 && (
          <Card className="border-border/40 shadow-xs">
            <CardHeader className="pb-2 border-b border-border/10">
              <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 font-bold">
                <Layers className="h-4 w-4" />
                Generator Info & Limits
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="list-disc list-inside space-y-2 text-xs text-muted-foreground leading-relaxed">
                {notes.map((note, idx) => (
                  <li key={idx} className="break-words">
                    <span className="text-foreground/80">{note}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
