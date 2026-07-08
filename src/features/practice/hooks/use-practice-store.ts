"use client";

import * as React from "react";

export interface PracticeProblem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  platform: string;
  statement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  exampleInput: string;
  exampleOutput: string;
  notes: string;
  category: "Arrays" | "Graphs" | "DP" | "Strings" | "Greedy" | "Math";
  isBookmarked: boolean;
}

export interface PracticeSettings {
  fontSize: number;
  wordWrap: boolean;
  compactMode: boolean;
  autosave: boolean;
}

export interface PracticeState {
  problems: PracticeProblem[];
  scratchpad: string;
  settings: PracticeSettings;
}

const DEFAULT_PROBLEMS: PracticeProblem[] = [
  {
    id: "1",
    title: "Two Sum",
    difficulty: "Easy",
    platform: "LeetCode",
    statement: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    inputFormat: "First line contains N and Target. Next line contains N space-separated integers.",
    outputFormat: "Output two indices representing the sums.",
    constraints: "2 <= N <= 10^5, -10^9 <= nums[i] <= 10^9",
    exampleInput: "4 9\n2 7 11 15",
    exampleOutput: "0 1",
    notes: "Sort and use two pointers or use an unordered_map hash table.",
    category: "Arrays",
    isBookmarked: false,
  },
  {
    id: "2",
    title: "Graph Cycle Detection",
    difficulty: "Medium",
    platform: "Codeforces",
    statement: "Detect if a given directed graph contains any cycles.",
    inputFormat: "First line contains V and E. Next E lines contain edges U V.",
    outputFormat: "Output YES if cycle exists, otherwise NO.",
    constraints: "2 <= V <= 10^5, 1 <= E <= 2*10^5",
    exampleInput: "3 3\n1 2\n2 3\n3 1",
    exampleOutput: "YES",
    notes: "Use topological sorting (Kahn's) or cycle-check via DFS backtracking.",
    category: "Graphs",
    isBookmarked: false,
  },
  {
    id: "3",
    title: "Longest Common Subsequence",
    difficulty: "Medium",
    platform: "AtCoder",
    statement: "Given two strings S and T, return the length of their longest common subsequence.",
    inputFormat: "First line contains S. Second line contains T.",
    outputFormat: "Output the integer representing length.",
    constraints: "1 <= |S|, |T| <= 2000",
    exampleInput: "abcde\nace",
    exampleOutput: "3",
    notes: "Classic DP. state(i, j) = state(i-1, j-1) + 1 if match.",
    category: "DP",
    isBookmarked: false,
  },
];

const DEFAULT_STATE: PracticeState = {
  problems: DEFAULT_PROBLEMS,
  scratchpad: "// Code dry run scratchpad space here\n",
  settings: {
    fontSize: 14,
    wordWrap: true,
    compactMode: false,
    autosave: true,
  },
};

export function usePracticeStore() {
  const [state, setState] = React.useState<PracticeState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Load from local storage
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("cpkit_practice_state");
      if (stored) {
        setState(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load practice state from localStorage", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage
  const saveState = (newState: PracticeState) => {
    setState(newState);
    try {
      localStorage.setItem("cpkit_practice_state", JSON.stringify(newState));
    } catch (e) {
      console.error("Failed to save practice state to localStorage", e);
    }
  };

  const updateProblem = (updated: PracticeProblem) => {
    const list = state.problems.map((p) => (p.id === updated.id ? updated : p));
    saveState({ ...state, problems: list });
  };

  const setScratchpad = (scratchpad: string) => {
    saveState({ ...state, scratchpad });
  };

  const updateSettings = (settings: Partial<PracticeSettings>) => {
    saveState({ ...state, settings: { ...state.settings, ...settings } });
  };

  const toggleBookmark = (id: string) => {
    const list = state.problems.map((p) =>
      p.id === id ? { ...p, isBookmarked: !p.isBookmarked } : p
    );
    saveState({ ...state, problems: list });
  };

  return {
    state,
    isLoaded,
    updateProblem,
    setScratchpad,
    updateSettings,
    toggleBookmark,
  };
}
