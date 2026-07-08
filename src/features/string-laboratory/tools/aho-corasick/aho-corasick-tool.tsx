"use client";

import * as React from "react";
import { StHeader } from "../../shared/st-header";
import { StLayout } from "../../shared/st-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

export function AhoCorasickTool() {
  const definition = "Aho-Corasick algorithm is a multi-pattern string searching algorithm that constructs a finite state machine similar to a Trie with suffix links, finding all occurrences of multiple patterns in linear time.";
  const formula = "Transitions: go(state, char), fail(state), output(state). Built in O(sum of pattern lengths) using BFS queue traversal.";
  const example = "For patterns {'he', 'she', 'his', 'hers'} and text 'ushers': matches 'she' and 'he' at overlap bounds.";
  const applications = [
    "Plagiarism detectors and spellcheckers.",
    "Intrusion detection systems and packet auditing.",
    "Searching huge sets of keywords in stream texts."
  ];
  const mistakes = [
    "Not creating suffix fail links correctly, resulting in infinite state cycles.",
    "Forgetting to merge output lists at suffix fail targets."
  ];
  const cpTips = [
    "In competitive programming, the output link optimization is vital to speed up matching; bypass fail nodes that have empty patterns to prevent O(TextLength * MatchesCount) slowdowns."
  ];

  return (
    <StLayout
      timeComplexity="O(N + M + K)"
      spaceComplexity="O(S * AlphabetSize)"
      definition={definition}
      formula={formula}
      example={example}
      applications={applications}
      mistakes={mistakes}
      cpTips={cpTips}
      resultChild={
        <Card className="border-border/40 bg-card/65 shadow-xs">
          <CardHeader className="pb-2 border-b border-border/10">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Clock className="h-4 w-4 text-amber-500 animate-pulse" />
              Tool Roadmap Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center space-y-4">
            <div className="flex justify-center">
              <Badge variant="warning" className="text-[10px] uppercase font-bold py-1 px-2.5">
                Coming Soon
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
              The Aho-Corasick multi-pattern Trie parser state visualizer is scheduled for subsequent roadmap releases. Active development will integrate state node graphs and BFS queue transition logs.
            </p>
          </CardContent>
        </Card>
      }
    >
      <StHeader
        title="Aho-Corasick Trie Visualizer"
        description="Multi-pattern string search trie automaton matcher."
        category="Suffixes"
        difficulty="Hard"
        shortcut="Alt+Shift+Z"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p className="text-xs text-muted-foreground">
            Interactive pattern inputs are disabled. Suffix automaton fail link generation will initialize in Sprint 07.
          </p>
        </CardContent>
      </Card>
    </StLayout>
  );
}
