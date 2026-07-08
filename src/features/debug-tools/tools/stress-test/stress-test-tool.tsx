"use client";

import * as React from "react";
import { ToolHeader } from "../../shared/tool-header";
import { ToolLayout } from "../../shared/tool-layout";
import { InputEditor } from "../../shared/input-editor";
import { DiffViewer } from "../../shared/diff-viewer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RotateCcw, Play, CheckCircle, XCircle } from "lucide-react";

export function StressTestTool() {
  const [testCase, setTestCase] = React.useState("");
  const [correctOutput, setCorrectOutput] = React.useState("");
  const [candidateOutput, setCandidateOutput] = React.useState("");
  
  const [generatorCode, setGeneratorCode] = React.useState(
    "// C++ Random Generator script (future execution support)\n" +
    "#include <bits/stdc++.h>\n" +
    "using namespace std;\n\n" +
    "int main() {\n" +
    "    srand(time(NULL));\n" +
    "    int n = rand() % 10 + 1;\n" +
    "    cout << n << endl;\n" +
    "    for(int i=0; i<n; i++) cout << rand() % 100 << ' ';\n" +
    "    cout << endl;\n" +
    "    return 0;\n" +
    "}"
  );

  const [compared, setCompared] = React.useState(false);
  const [passed, setPassed] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState("manual");

  const handleClear = () => {
    setTestCase("");
    setCorrectOutput("");
    setCandidateOutput("");
    setCompared(false);
  };

  const handleRunTest = () => {
    setCompared(true);
    const cleanCorrect = correctOutput.replace(/\r?\n$/, "");
    const cleanCandidate = candidateOutput.replace(/\r?\n$/, "");
    setPassed(cleanCorrect === cleanCandidate);
  };

  const handleSelectExample = (exp: string, rec?: string) => {
    // example layout
    const [test, correct, candidate] = exp.split(";");
    setTestCase(test.replace(/\\n/g, "\n"));
    setCorrectOutput(correct.replace(/\\n/g, "\n"));
    setCandidateOutput(candidate.replace(/\\n/g, "\n"));
    setCompared(false);
  };

  const examples = [
    {
      input: "5\\n1 5 2 9 3;20;11",
      input2: "",
      output: "Fails (Correct: 20, Got: 11)",
      description: "Sum array check mismatch",
    },
  ];

  const notes = [
    "Stress testing compares outputs from a brute-force approach against an optimized solver.",
    "Generator script placeholder is provided for future automated command execution.",
    "Helps identify edge cases (like zero, negative weights, large values).",
  ];

  return (
    <ToolLayout
      examples={examples}
      notes={notes}
      timeComplexity="O(N)"
      spaceComplexity="O(N)"
      onSelectExample={handleSelectExample}
    >
      <ToolHeader
        title="Stress Test Comparator"
        description="Run manual comparison iterations between brute-force outputs and candidate optimized outputs."
        category="Verification"
        difficulty="Hard"
        shortcut="Alt+Shift+0"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 max-w-sm mb-4">
          <TabsTrigger value="manual" className="cursor-pointer">Manual Diff</TabsTrigger>
          <TabsTrigger value="generator" className="cursor-pointer">Generator Script (MVP)</TabsTrigger>
        </TabsList>

        <TabsContent value="manual">
          <Card className="border-border/40 bg-card/65 shadow-xs">
            <CardHeader className="flex flex-row justify-between items-center pb-2 border-b border-border/10">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Iterative Compare panel
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                className="h-7 w-7 p-0 cursor-pointer"
                title="Reset"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <InputEditor
                label="Failing Test Case Input"
                value={testCase}
                onChange={(val) => {
                  setTestCase(val);
                  setCompared(false);
                }}
                placeholder="Paste the test case inputs here..."
                rows={4}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <InputEditor
                  label="Correct Output (Brute Force)"
                  value={correctOutput}
                  onChange={(val) => {
                    setCorrectOutput(val);
                    setCompared(false);
                  }}
                  rows={5}
                />
                <InputEditor
                  label="Candidate Output (Optimized)"
                  value={candidateOutput}
                  onChange={(val) => {
                    setCandidateOutput(val);
                    setCompared(false);
                  }}
                  rows={5}
                />
              </div>

              <Button
                onClick={handleRunTest}
                className="w-full justify-center gap-1.5 mt-2 cursor-pointer bg-primary hover:bg-primary/95 text-primary-foreground"
              >
                <Play className="h-4 w-4" />
                Run Stress Comparison
              </Button>

              {compared && (correctOutput || candidateOutput) && (
                <div className="pt-4 border-t border-border/10 space-y-4">
                  {passed ? (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center gap-3 text-sm font-bold">
                      <CheckCircle className="h-5 w-5" />
                      <span>Stress Test Passed! Outputs match.</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg flex items-center gap-3 text-sm font-bold">
                        <XCircle className="h-5 w-5" />
                        <span>Stress Test Failed! Found differences on Test Case.</span>
                      </div>

                      <DiffViewer expected={correctOutput} received={candidateOutput} />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generator">
          <Card className="border-border/40 bg-card/65 shadow-xs">
            <CardHeader className="pb-2 border-b border-border/10">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Random Generator script (C++)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Automated local script execution will be supported in v1.0. Right now, use this editor to draft your test case generators.
              </p>
              
              <div className="border border-border/40 rounded-lg overflow-hidden font-mono text-xs p-3.5 bg-background/25">
                <textarea
                  value={generatorCode}
                  onChange={(e) => setGeneratorCode(e.target.value)}
                  rows={15}
                  className="w-full bg-transparent border-0 focus:outline-hidden font-mono leading-relaxed"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
}
