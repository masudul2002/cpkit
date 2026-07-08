"use client";

import * as React from "react";
import { useWorkspaceStore, WorkspaceProblem } from "../hooks/use-workspace-store";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import {
  Timer,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  BookOpen,
  Keyboard,
  Plus,
  Save,
  CheckCircle,
  Clock,
  LayoutGrid,
  Sparkles,
  Calculator,
  Compass,
  Star,
  Activity
} from "lucide-react";

export function WorkspaceLayout() {
  const { toast } = useToast();
  const {
    state,
    isLoaded,
    setContestName,
    setPlatform,
    setTimeLeft,
    setScratchpad,
    updateProblem,
    addProblem,
  } = useWorkspaceStore();

  const [activeProblemId, setActiveProblemId] = React.useState("A");
  const [isRunning, setIsRunning] = React.useState(true);
  const [isFullscreenTimer, setIsFullscreenTimer] = React.useState(false);
  const [focusMode, setFocusMode] = React.useState(false);
  
  // Quick tools state
  const [calcVal1, setCalcVal1] = React.useState("10");
  const [calcVal2, setCalcVal2] = React.useState("5");
  const [calcResult, setCalcResult] = React.useState<number | null>(null);

  // New problem input states
  const [newProbId, setNewProbId] = React.useState("");
  const [newProbTitle, setNewProbTitle] = React.useState("");
  const [newProbDiff, setNewProbDiff] = React.useState("");

  const activeProblem = state.problems.find((p) => p.id === activeProblemId) || state.problems[0];

  // Countdown timer clock ticks
  React.useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      if (state.timeLeftSeconds > 0) {
        setTimeLeft(state.timeLeftSeconds - 1);
      } else {
        setIsRunning(false);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, state.timeLeftSeconds, setTimeLeft]);

  // Keyboard listener for custom shortcuts
  React.useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      // Ctrl + S: Save scratchpad manually
      if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toast({
          title: "Auto-Saved",
          description: "All problems and scratchpad saved to Local Storage.",
          variant: "success",
        });
      }
      // Ctrl + B: Toggle Focus Mode
      if (e.key === "b" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setFocusMode((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, [toast]);

  if (!isLoaded) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center font-mono text-xs text-muted-foreground">
        Loading persistent contest workspace...
      </div>
    );
  }

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAddNewProblem = () => {
    if (!newProbId || !newProbTitle) {
      toast({
        title: "Error",
        description: "Problem ID (e.g. D) and Title are required.",
        variant: "error",
      });
      return;
    }
    addProblem(newProbId, newProbTitle, newProbDiff || "1000");
    setNewProbId("");
    setNewProbTitle("");
    setNewProbDiff("");
    toast({
      title: "Problem Added",
      description: `Added Problem ${newProbId} to local list.`,
      variant: "success",
    });
  };

  const handleAddCalc = () => {
    const v1 = parseFloat(calcVal1);
    const v2 = parseFloat(calcVal2);
    if (!isNaN(v1) && !isNaN(v2)) setCalcResult(v1 + v2);
  };

  const handleSubCalc = () => {
    const v1 = parseFloat(calcVal1);
    const v2 = parseFloat(calcVal2);
    if (!isNaN(v1) && !isNaN(v2)) setCalcResult(v1 - v2);
  };

  const handleMulCalc = () => {
    const v1 = parseFloat(calcVal1);
    const v2 = parseFloat(calcVal2);
    if (!isNaN(v1) && !isNaN(v2)) setCalcResult(v1 * v2);
  };

  const handleDivCalc = () => {
    const v1 = parseFloat(calcVal1);
    const v2 = parseFloat(calcVal2);
    if (!isNaN(v1) && v2 !== 0) setCalcResult(v1 / v2);
  };

  const solvedCount = state.problems.filter((p) => p.status === "Solved").length;

  return (
    <div className={`space-y-6 font-sans text-left pb-10 ${focusMode ? "max-w-full p-4" : ""}`}>
      {/* 1. FOCUS MODE STATUS BANNER */}
      {focusMode && (
        <div className="bg-primary/10 border border-primary/20 p-2 rounded-xl text-center flex items-center justify-between text-xs text-primary">
          <span>Focus Mode active. Hiding sidebar and headers templates. Press <strong>Ctrl + B</strong> to return.</span>
          <Button size="sm" variant="secondary" onClick={() => setFocusMode(false)} className="cursor-pointer">
            Exit Focus
          </Button>
        </div>
      )}

      {/* 2. TIMER BANNER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card/65 border border-border/40 p-5 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary border border-primary/20 rounded-xl">
            <Timer className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <Input
              value={state.name}
              onChange={(e) => setContestName(e.target.value)}
              className="text-lg font-black h-8 bg-transparent border-none p-0 focus-visible:ring-0 max-w-sm"
            />
            <div className="flex items-center gap-1.5 mt-0.5">
              <Badge variant="secondary" className="text-[10px] scale-90">{state.platform}</Badge>
              <span className="text-xs text-muted-foreground">{solvedCount} / {state.problems.length} solved</span>
            </div>
          </div>
        </div>

        {/* Dynamic Countdown clock */}
        <div className="flex items-center gap-4 bg-muted/20 border border-border/10 p-3 rounded-xl">
          <span className="font-mono text-xl font-bold tracking-tight text-emerald-500">
            {formatTime(state.timeLeftSeconds)}
          </span>
          <div className="flex items-center gap-1.5 border-l border-border/20 pl-3">
            <Button
              size="icon"
              variant="outline"
              onClick={() => setIsRunning(!isRunning)}
              className="h-8 w-8 cursor-pointer text-muted-foreground hover:text-foreground"
            >
              {isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => setIsFullscreenTimer(!isFullscreenTimer)}
              className="h-8 w-8 cursor-pointer text-muted-foreground hover:text-foreground"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* 3. MULTI PANEL SPLIT COLUMNS VIEW */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Column (4 cols): Problems Dashboard list */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-border/40 bg-card/65 shadow-xs">
            <CardHeader className="pb-2 border-b border-border/10">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Problems Board
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="space-y-1.5">
                {state.problems.map((prob) => {
                  const isActive = prob.id === activeProblemId;
                  const isSolved = prob.status === "Solved";

                  return (
                    <div
                      key={prob.id}
                      onClick={() => setActiveProblemId(prob.id)}
                      className={`p-3 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                        isActive
                          ? "bg-primary/5 border-primary shadow-xs"
                          : "bg-background/40 border-border/10 hover:bg-card"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-foreground">{prob.id}</span>
                        <div className="space-y-0.5">
                          <span className="text-xs font-semibold block text-foreground/90">{prob.title}</span>
                          <span className="text-[9px] text-muted-foreground uppercase">{prob.tags || "no tags"}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Badge variant={isSolved ? "success" : "secondary"} className="text-[8px] scale-90">
                          {prob.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Custom Problem */}
              <div className="pt-3 border-t border-border/5 space-y-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Add problem</span>
                <div className="grid grid-cols-3 gap-2">
                  <Input placeholder="ID" value={newProbId} onChange={(e) => setNewProbId(e.target.value)} className="h-8 text-xs" />
                  <Input placeholder="Title" value={newProbTitle} onChange={(e) => setNewProbTitle(e.target.value)} className="h-8 text-xs col-span-2" />
                </div>
                <Button onClick={handleAddNewProblem} size="sm" className="w-full h-8 text-xs cursor-pointer gap-1 justify-center">
                  <Plus className="h-3.5 w-3.5" />
                  Add Problem
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center Column (5 cols): Code, Notes Editor, Scratchpad */}
        <div className="lg:col-span-5 space-y-6">
          {activeProblem && (
            <Card className="border-border/40 bg-card/65 shadow-xs">
              <CardHeader className="pb-3 border-b border-border/10">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-bold text-foreground">
                      Problem {activeProblem.id}: {activeProblem.title}
                    </CardTitle>
                    <CardDescription className="text-xs">Difficulty: {activeProblem.difficulty}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={activeProblem.status}
                      onChange={(e) => updateProblem({ ...activeProblem, status: e.target.value as any })}
                      className="bg-background text-xs border border-border/30 rounded-lg p-1 text-foreground"
                    >
                      {["Not Started", "Reading", "Solving", "Debugging", "Solved", "Review", "Skipped"].map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <InputField label="Estimated (mins)" value={activeProblem.timeEst} onChange={(val) => updateProblem({ ...activeProblem, timeEst: val })} />
                  <InputField label="Actual (mins)" value={activeProblem.timeAct} onChange={(val) => updateProblem({ ...activeProblem, timeAct: val })} />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Problem tags</span>
                  <Input
                    placeholder="implementation, dp, greedy..."
                    value={activeProblem.tags}
                    onChange={(e) => updateProblem({ ...activeProblem, tags: e.target.value })}
                    className="h-8 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Problem notes & formulas</span>
                  <textarea
                    rows={4}
                    placeholder="Draft constraints, test outcomes here..."
                    value={activeProblem.notes}
                    onChange={(e) => updateProblem({ ...activeProblem, notes: e.target.value })}
                    className="w-full bg-background/50 border border-border/20 rounded-xl p-3 text-xs text-foreground font-mono focus:outline-hidden focus:border-primary"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Persistent Scratchpad */}
          <Card className="border-border/40 bg-card/65 shadow-xs">
            <CardHeader className="pb-2 border-b border-border/10 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Contest Scratchpad
              </CardTitle>
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            </CardHeader>
            <CardContent className="p-4">
              <textarea
                rows={5}
                value={state.scratchpad}
                onChange={(e) => setScratchpad(e.target.value)}
                className="w-full bg-background/50 border border-border/20 rounded-xl p-3 text-xs text-foreground font-mono focus:outline-hidden focus:border-primary"
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column (3 cols): embedded mini tools */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="border-border/40 bg-card/65 shadow-xs">
            <CardHeader className="pb-2 border-b border-border/10">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Embedded Quick Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Mini Calculator */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Mini Calculator</span>
                <div className="grid grid-cols-2 gap-2">
                  <Input value={calcVal1} onChange={(e) => setCalcVal1(e.target.value)} className="h-8 text-xs font-mono" />
                  <Input value={calcVal2} onChange={(e) => setCalcVal2(e.target.value)} className="h-8 text-xs font-mono" />
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  <Button size="sm" onClick={handleAddCalc} className="cursor-pointer">+</Button>
                  <Button size="sm" onClick={handleSubCalc} className="cursor-pointer">-</Button>
                  <Button size="sm" onClick={handleMulCalc} className="cursor-pointer">*</Button>
                  <Button size="sm" onClick={handleDivCalc} className="cursor-pointer">/</Button>
                </div>
                {calcResult !== null && (
                  <div className="p-2 border border-border/10 bg-muted/10 rounded-lg text-center font-mono text-xs text-emerald-500 font-extrabold">
                    Result: {calcResult}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 4. FULLSCREEN TIMING OVERLAY */}
      {isFullscreenTimer && (
        <div
          onClick={() => setIsFullscreenTimer(false)}
          className="fixed inset-0 z-50 bg-background/95 flex flex-col items-center justify-center text-center cursor-pointer select-none"
        >
          <div className="space-y-4 font-mono">
            <span className="text-6xl md:text-8xl font-black tracking-tighter text-emerald-500 animate-pulse">
              {formatTime(state.timeLeftSeconds)}
            </span>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-sans">
              Tap anywhere to return to the workspace board
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple internal input field helper
function InputField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1 text-left">
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">{label}</span>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 text-xs font-mono"
      />
    </div>
  );
}
