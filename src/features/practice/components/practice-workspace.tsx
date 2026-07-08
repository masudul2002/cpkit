"use client";

import * as React from "react";
import { usePracticeStore, PracticeProblem } from "../hooks/use-practice-store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import {
  Code,
  BookOpen,
  Keyboard,
  Star,
  StarOff,
  Settings as SettingsIcon,
  Calculator,
  Compass,
  Zap,
  Bookmark,
  Share2,
  Trash2,
  FolderClosed,
  ChevronDown,
  Terminal,
  Activity,
  Plus
} from "lucide-react";

export function PracticeWorkspace() {
  const { toast } = useToast();
  const {
    state,
    isLoaded,
    updateProblem,
    setScratchpad,
    updateSettings,
    toggleBookmark,
  } = usePracticeStore();

  const [activeProbId, setActiveProbId] = React.useState("1");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [bottomTab, setBottomTab] = React.useState<"notes" | "scratchpad" | "console">("notes");
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  
  // Quick tools state
  const [primeInput, setPrimeInput] = React.useState("29");
  const [primeResult, setPrimeResult] = React.useState<string | null>(null);

  // New dry-run console states
  const [dryRunInput, setDryRunInput] = React.useState("");
  const [dryRunOutput, setDryRunOutput] = React.useState<string | null>(null);

  const activeProblem = state.problems.find((p) => p.id === activeProbId) || state.problems[0];

  React.useEffect(() => {
    if (activeProblem) {
      setDryRunInput(activeProblem.exampleInput);
    }
  }, [activeProbId, activeProblem]);

  // Keyboard shortcut listener
  React.useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toast({
          title: "Auto-Saved Successfully",
          description: "All coding notes and scratchpad revisions persisted.",
          variant: "success",
        });
      }
    };
    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, [toast]);

  if (!isLoaded) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center font-mono text-xs text-muted-foreground">
        Loading Practice Workspace configuration...
      </div>
    );
  }

  // Categories list
  const categories = ["All", "Arrays", "Graphs", "DP", "Strings", "Greedy", "Math", "Bookmarks"];

  // Filter problems
  const filteredProblems = state.problems.filter((prob) => {
    if (selectedCategory === "All") return true;
    if (selectedCategory === "Bookmarks") return prob.isBookmarked;
    return prob.category === selectedCategory;
  });

  const checkPrime = () => {
    const num = parseInt(primeInput);
    if (isNaN(num) || num <= 1) {
      setPrimeResult("Not Prime");
      return;
    }
    for (let i = 2; i * i <= num; i++) {
      if (num % i === 0) {
        setPrimeResult("Not Prime");
        return;
      }
    }
    setPrimeResult("Is Prime!");
  };

  const executeDryRun = () => {
    if (!activeProblem) return;
    // Mock dry run execution
    setDryRunOutput(`Executing simulated test...\nInput:\n${dryRunInput}\n\nOutcome:\n${activeProblem.exampleOutput}\n\n-- Finished in 2ms --`);
    toast({
      title: "Dry Run Completed",
      description: "Sample test outputs parsed cleanly.",
      variant: "success",
    });
  };

  return (
    <div className="space-y-6 font-sans text-left pb-10">
      {/* 1. WORKSPACE HEADER CONTROL */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card/65 border border-border/40 p-5 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary border border-primary/20 rounded-xl">
            <Code className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-foreground">Practice Workspace</h2>
            <p className="text-xs text-muted-foreground">distraction-free competitive coding workspace</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="cursor-pointer gap-2"
          >
            <SettingsIcon className="h-4 w-4" />
            Editor Options
          </Button>
        </div>
      </div>

      {/* 2. SETTINGS PANEL MODAL CARDS */}
      {settingsOpen && (
        <Card className="border-primary/20 bg-primary/5 p-4 rounded-2xl grid gap-4 grid-cols-2 md:grid-cols-4 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Font Size</span>
            <select
              value={state.settings.fontSize}
              onChange={(e) => updateSettings({ fontSize: parseInt(e.target.value) })}
              className="bg-background text-xs border border-border/20 rounded-lg p-1 text-foreground w-full"
            >
              {[12, 14, 16, 18].map((sz) => (
                <option key={sz} value={sz}>{sz}px</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Compact Mode</span>
            <select
              value={state.settings.compactMode ? "true" : "false"}
              onChange={(e) => updateSettings({ compactMode: e.target.value === "true" })}
              className="bg-background text-xs border border-border/20 rounded-lg p-1 text-foreground w-full"
            >
              <option value="false">Standard Spacing</option>
              <option value="true">Compact Spacing</option>
            </select>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Word Wrap</span>
            <select
              value={state.settings.wordWrap ? "true" : "false"}
              onChange={(e) => updateSettings({ wordWrap: e.target.value === "true" })}
              className="bg-background text-xs border border-border/20 rounded-lg p-1 text-foreground w-full"
            >
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button size="sm" onClick={() => setSettingsOpen(false)} className="w-full cursor-pointer justify-center">
              Close Options
            </Button>
          </div>
        </Card>
      )}

      {/* 3. MULTI COLUMN SPLIT VIEW LAYOUT */}
      <div className={`grid gap-6 lg:grid-cols-12 items-start ${state.settings.compactMode ? "gap-3" : ""}`}>
        {/* Left sidebar panel (3 cols): Problems catalog filter */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="border-border/40 bg-card/65 shadow-xs">
            <CardHeader className="pb-2 border-b border-border/10">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                <span>Collections</span>
                <FolderClosed className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Category tabs list */}
              <div className="flex flex-wrap gap-1">
                {categories.map((cat) => (
                  <Badge
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    variant={selectedCategory === cat ? "primary" : "secondary"}
                    className="cursor-pointer text-[10px] scale-90"
                  >
                    {cat}
                  </Badge>
                ))}
              </div>

              {/* Problems list */}
              <div className="space-y-1.5 pt-2 border-t border-border/5">
                {filteredProblems.map((prob) => {
                  const isActive = prob.id === activeProbId;
                  const isEasy = prob.difficulty === "Easy";
                  const isMedium = prob.difficulty === "Medium";

                  return (
                    <div
                      key={prob.id}
                      onClick={() => setActiveProbId(prob.id)}
                      className={`p-3 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                        isActive
                          ? "bg-primary/5 border-primary shadow-xs"
                          : "bg-background/40 border-border/10 hover:bg-card"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold block text-foreground">{prob.title}</span>
                        <span className="text-[9px] text-muted-foreground uppercase">{prob.platform}</span>
                      </div>
                      <Badge
                        variant={isEasy ? "success" : isMedium ? "warning" : "danger"}
                        className="text-[8px] scale-90"
                      >
                        {prob.difficulty}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center column (6 cols): Active Problem Statement & Editor tabs */}
        <div className="lg:col-span-6 space-y-6">
          {activeProblem && (
            <Card className="border-border/40 bg-card/65 shadow-xs">
              <CardHeader className="pb-3 border-b border-border/10 flex flex-row items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-black text-foreground">
                      {activeProblem.title}
                    </CardTitle>
                    <Badge variant="secondary" className="text-[10px]">{activeProblem.platform}</Badge>
                  </div>
                  <span className="text-[10px] text-muted-foreground">Category: {activeProblem.category}</span>
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => toggleBookmark(activeProblem.id)}
                  className="h-8 w-8 text-amber-500 hover:text-amber-600 cursor-pointer"
                >
                  {activeProblem.isBookmarked ? (
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                  ) : (
                    <StarOff className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </CardHeader>
              <CardContent className="p-5 space-y-5">
                {/* Statement */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Description</span>
                  <p className="text-xs leading-relaxed text-foreground/90">{activeProblem.statement}</p>
                </div>

                {/* Input output formatting */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Input format</span>
                    <p className="text-[11px] leading-normal text-muted-foreground">{activeProblem.inputFormat}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Output format</span>
                    <p className="text-[11px] leading-normal text-muted-foreground">{activeProblem.outputFormat}</p>
                  </div>
                </div>

                {/* Constraints */}
                <div className="space-y-1 bg-muted/10 p-3 border border-border/10 rounded-xl font-mono text-[11px]">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block font-sans">Constraints</span>
                  <span className="text-foreground">{activeProblem.constraints}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bottom Tabs Drawer (Notes, scratchpad, console runner) */}
          <Card className="border-border/40 bg-card/65 shadow-xs">
            <CardHeader className="pb-0 border-b border-border/10">
              <div className="flex items-center gap-1.5 -mb-[1px]">
                {(["notes", "scratchpad", "console"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setBottomTab(tab)}
                    className={`pb-3 px-3 text-xs font-bold capitalize transition-all border-b-2 cursor-pointer ${
                      bottomTab === tab
                        ? "border-primary text-primary font-black"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="p-5">
              {bottomTab === "notes" && activeProblem && (
                <div className="space-y-1.5 text-left">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Per Problem Code/Notes</span>
                  <textarea
                    rows={6}
                    value={activeProblem.notes}
                    onChange={(e) => updateProblem({ ...activeProblem, notes: e.target.value })}
                    className="w-full bg-background/50 border border-border/20 rounded-xl p-3 text-xs text-foreground font-mono focus:outline-hidden focus:border-primary"
                    style={{ fontSize: `${state.settings.fontSize}px` }}
                  />
                </div>
              )}

              {bottomTab === "scratchpad" && (
                <div className="space-y-1.5 text-left">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Persistent Scratchpad</span>
                  <textarea
                    rows={6}
                    value={state.scratchpad}
                    onChange={(e) => setScratchpad(e.target.value)}
                    className="w-full bg-background/50 border border-border/20 rounded-xl p-3 text-xs text-foreground font-mono focus:outline-hidden focus:border-primary"
                    style={{ fontSize: `${state.settings.fontSize}px` }}
                  />
                </div>
              )}

              {bottomTab === "console" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 text-left">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Custom Input</span>
                      <textarea
                        rows={4}
                        value={dryRunInput}
                        onChange={(e) => setDryRunInput(e.target.value)}
                        className="w-full bg-background/50 border border-border/20 rounded-xl p-2.5 text-xs text-foreground font-mono"
                      />
                    </div>
                    <div className="space-y-1 text-left">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Dry Run Console Output</span>
                      <pre className="w-full h-[96px] bg-background/80 border border-border/20 rounded-xl p-2.5 text-[10px] text-emerald-500 font-mono overflow-auto whitespace-pre-wrap">
                        {dryRunOutput || "No test executed yet. Click Dry Run below."}
                      </pre>
                    </div>
                  </div>
                  <Button onClick={executeDryRun} size="sm" className="cursor-pointer w-full gap-2 justify-center">
                    <Terminal className="h-4 w-4" />
                    Dry Run Test Case
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar panel (3 cols): Embedded quick tools */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="border-border/40 bg-card/65 shadow-xs">
            <CardHeader className="pb-2 border-b border-border/10">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Practice Quick Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Prime Checkers */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Prime Checker</span>
                <div className="flex gap-2">
                  <Input value={primeInput} onChange={(e) => setPrimeInput(e.target.value)} className="h-8 text-xs font-mono" />
                  <Button size="sm" onClick={checkPrime} className="cursor-pointer h-8 text-xs">Verify</Button>
                </div>
                {primeResult !== null && (
                  <div className="p-2 border border-border/10 bg-muted/10 rounded-lg text-center font-mono text-xs text-emerald-500 font-extrabold">
                    Result: {primeResult}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
