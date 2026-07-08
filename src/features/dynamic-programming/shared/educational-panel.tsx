"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BookOpen, Layers, Lightbulb, MessageSquare } from "lucide-react";

interface EducationalPanelProps {
  definition: string;
  idea: string;
  recurrence: string;
  transition: string;
  pseudocode: string;
  applications: string[];
  mistakes: string[];
  cpTips?: string[];
  reference?: string;
}

export function EducationalPanel({
  definition,
  idea,
  recurrence,
  transition,
  pseudocode,
  applications,
  mistakes,
  cpTips,
  reference = "CP-Algorithms dynamic programming reference",
}: EducationalPanelProps) {
  const [activeTab, setActiveTab] = React.useState("info");

  return (
    <Card className="border-border/40 bg-card/65 shadow-xs">
      <CardHeader className="pb-2 border-b border-border/10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 max-w-md">
            <TabsTrigger value="info" className="cursor-pointer text-xs flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              Definition & Transition
            </TabsTrigger>
            <TabsTrigger value="code" className="cursor-pointer text-xs flex items-center gap-1">
              <Layers className="h-3.5 w-3.5" />
              Pseudocode
            </TabsTrigger>
            <TabsTrigger value="apps" className="cursor-pointer text-xs flex items-center gap-1">
              <Lightbulb className="h-3.5 w-3.5" />
              CP Tips & Apps
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-6">
        {activeTab === "info" && (
          <div className="space-y-4 text-xs text-left">
            <div>
              <span className="font-bold text-foreground uppercase tracking-wider text-[10px] text-muted-foreground block mb-1">
                Conceptual Overview
              </span>
              <p className="text-foreground/80 leading-relaxed">{definition}</p>
            </div>
            <div>
              <span className="font-bold text-foreground uppercase tracking-wider text-[10px] text-muted-foreground block mb-1">
                Recurrence Relation
              </span>
              <pre className="p-2.5 bg-muted/20 border border-border/10 rounded-lg font-mono text-[11px] leading-relaxed text-emerald-500 overflow-x-auto whitespace-pre">
                {recurrence}
              </pre>
            </div>
            <div>
              <span className="font-bold text-foreground uppercase tracking-wider text-[10px] text-muted-foreground block mb-1">
                State Transitions
              </span>
              <p className="text-foreground/80 leading-relaxed font-sans">{transition}</p>
            </div>
            {reference && (
              <div className="pt-2 border-t border-border/5 text-[10px] text-muted-foreground/60">
                Source: <span className="font-mono">{reference}</span>
              </div>
            )}
          </div>
        )}

        {activeTab === "code" && (
          <div className="space-y-4 text-xs text-left">
            <div>
              <span className="font-bold text-foreground uppercase tracking-wider text-[10px] text-muted-foreground block mb-1">
                Tabulation / Bottom-Up Code (Pseudocode)
              </span>
              <pre className="p-3 bg-muted/20 border border-border/10 rounded-lg font-mono text-[11px] leading-relaxed text-emerald-500 overflow-x-auto whitespace-pre">
                {pseudocode}
              </pre>
            </div>
          </div>
        )}

        {activeTab === "apps" && (
          <div className="space-y-4 text-xs text-left">
            <div>
              <span className="font-bold text-foreground uppercase tracking-wider text-[10px] text-muted-foreground block mb-1.5">
                Standard Applications
              </span>
              <ul className="list-disc list-inside space-y-1.5 text-foreground/80 leading-relaxed">
                {applications.map((app, idx) => (
                  <li key={idx}>{app}</li>
                ))}
              </ul>
            </div>

            {cpTips && cpTips.length > 0 && (
              <div className="pt-3 border-t border-border/5">
                <span className="font-bold text-emerald-500 uppercase tracking-wider text-[10px] block mb-1.5 flex items-center gap-1 font-sans">
                  <Lightbulb className="h-3.5 w-3.5" />
                  Competitive Programming Tips
                </span>
                <ul className="list-disc list-inside space-y-1 text-emerald-500/80 leading-relaxed">
                  {cpTips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {mistakes.length > 0 && (
              <div className="pt-3 border-t border-border/5">
                <span className="font-bold text-rose-500 uppercase tracking-wider text-[10px] block mb-1.5 flex items-center gap-1 font-sans">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Common Mistakes & Corner Cases
                </span>
                <ul className="list-disc list-inside space-y-1 text-rose-500/80 leading-relaxed">
                  {mistakes.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
