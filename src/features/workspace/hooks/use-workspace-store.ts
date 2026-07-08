"use client";

import * as React from "react";

export interface WorkspaceProblem {
  id: string;
  title: string;
  difficulty: string;
  status: "Not Started" | "Reading" | "Solving" | "Debugging" | "Solved" | "Review" | "Skipped";
  tags: string;
  timeEst: string;
  timeAct: string;
  notes: string;
  isBookmarked: boolean;
}

export interface ContestState {
  name: string;
  platform: string;
  timeLeftSeconds: number;
  durationSeconds: number;
  problems: WorkspaceProblem[];
  scratchpad: string;
}

const DEFAULT_STATE: ContestState = {
  name: "Codeforces Round 950",
  platform: "Codeforces",
  timeLeftSeconds: 7200, // 2 hours
  durationSeconds: 7200,
  problems: [
    { id: "A", title: "Problem A", difficulty: "800", status: "Not Started", tags: "implementation", timeEst: "10", timeAct: "", notes: "", isBookmarked: false },
    { id: "B", title: "Problem B", difficulty: "1200", status: "Not Started", tags: "greedy", timeEst: "20", timeAct: "", notes: "", isBookmarked: false },
    { id: "C", title: "Problem C", difficulty: "1500", status: "Not Started", tags: "binary search", timeEst: "30", timeAct: "", notes: "", isBookmarked: false },
  ],
  scratchpad: "## Scratchpad\n\n- Draft ideas, constraints check and math here!\n",
};

export function useWorkspaceStore() {
  const [state, setState] = React.useState<ContestState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Load from local storage
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("cpkit_workspace_contest");
      if (stored) {
        setState(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load workspace state from localStorage", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage
  const saveState = (newState: ContestState) => {
    setState(newState);
    try {
      localStorage.setItem("cpkit_workspace_contest", JSON.stringify(newState));
    } catch (e) {
      console.error("Failed to save workspace state to localStorage", e);
    }
  };

  const setContestName = (name: string) => {
    saveState({ ...state, name });
  };

  const setPlatform = (platform: string) => {
    saveState({ ...state, platform });
  };

  const setTimeLeft = (timeLeftSeconds: number) => {
    saveState({ ...state, timeLeftSeconds });
  };

  const setScratchpad = (scratchpad: string) => {
    saveState({ ...state, scratchpad });
  };

  const updateProblem = (updated: WorkspaceProblem) => {
    const list = state.problems.map((p) => (p.id === updated.id ? updated : p));
    saveState({ ...state, problems: list });
  };

  const addProblem = (id: string, title: string, difficulty: string) => {
    const newProb: WorkspaceProblem = {
      id,
      title,
      difficulty,
      status: "Not Started",
      tags: "",
      timeEst: "",
      timeAct: "",
      notes: "",
      isBookmarked: false,
    };
    saveState({ ...state, problems: [...state.problems, newProb] });
  };

  return {
    state,
    isLoaded,
    setContestName,
    setPlatform,
    setTimeLeft,
    setScratchpad,
    updateProblem,
    addProblem,
  };
}
