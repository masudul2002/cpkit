"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Layers, Cpu, ArrowRight } from "lucide-react";

export interface ExampleCase {
  input: string;
  output: string;
  description?: string;
  input2?: string; // Optional second input for comparison tools
}

interface ToolLayoutProps {
  children: React.ReactNode;
  examples?: ExampleCase[];
  notes?: string[];
  timeComplexity?: string;
  spaceComplexity?: string;
  onSelectExample?: (input: string, input2?: string) => void;
}

export function ToolLayout({
  children,
  examples,
  notes,
  timeComplexity,
  spaceComplexity,
  onSelectExample,
}: ToolLayoutProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-12 items-start">
      {/* Left Column: Interactive Tool Body */}
      <div className="lg:col-span-8 space-y-6">
        {children}
      </div>

      {/* Right Column: Reference & Examples Sidebar */}
      <div className="lg:col-span-4 space-y-6">
        {/* Examples Section */}
        {examples && examples.length > 0 && (
          <Card className="border-border/40 shadow-xs">
            <CardHeader className="pb-2 border-b border-border/10">
              <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 font-bold">
                <HelpCircle className="h-4 w-4" />
                Example Test Cases
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {examples.map((ex, idx) => (
                <div
                  key={idx}
                  onClick={() => onSelectExample && onSelectExample(ex.input, ex.input2)}
                  className={`p-3 rounded-lg border border-border/40 bg-card/25 text-xs transition-all ${
                    onSelectExample ? "hover:border-primary/50 hover:bg-accent/40 cursor-pointer" : ""
                  }`}
                >
                  {ex.description && (
                    <span className="font-bold text-foreground block mb-2">{ex.description}</span>
                  )}
                  <div className="space-y-1 font-mono text-[10px]">
                    <div className="flex gap-2">
                      <span className="text-muted-foreground uppercase text-[9px] w-12 shrink-0">Input 1:</span>
                      <span className="text-foreground break-words truncate max-w-[150px]">{ex.input}</span>
                    </div>
                    {ex.input2 && (
                      <div className="flex gap-2">
                        <span className="text-muted-foreground uppercase text-[9px] w-12 shrink-0">Input 2:</span>
                        <span className="text-foreground break-words truncate max-w-[150px]">{ex.input2}</span>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <span className="text-muted-foreground uppercase text-[9px] w-12 shrink-0">Output:</span>
                      <span className="text-primary font-bold break-words">{ex.output}</span>
                    </div>
                  </div>
                  {onSelectExample && (
                    <div className="flex justify-end mt-2 text-[9px] text-primary font-bold items-center gap-1">
                      Load Case
                      <ArrowRight className="h-2.5 w-2.5" />
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Complexity Metadata */}
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

        {/* Reference Notes */}
        {notes && notes.length > 0 && (
          <Card className="border-border/40 shadow-xs">
            <CardHeader className="pb-2 border-b border-border/10">
              <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 font-bold">
                <Layers className="h-4 w-4" />
                Notes & Tips
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
