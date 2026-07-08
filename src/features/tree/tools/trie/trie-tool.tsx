"use client";

import * as React from "react";
import { TrHeader } from "../../shared/tr-header";
import { TrLayout } from "../../shared/tr-layout";
import { TreeCanvas, TreeNode, TreeEdge } from "../../visualization/tree-canvas";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

class TrieNode {
  char: string;
  isEnd: boolean = false;
  children: Record<string, TrieNode> = {};

  constructor(char: string) {
    this.char = char;
  }
}

export function TrieTool() {
  const { toast } = useToast();
  const [words, setWords] = React.useState<string[]>(["cat", "car", "dog", "dot"]);
  const [inputWord, setInputWord] = React.useState("cab");
  const [searchWord, setSearchWord] = React.useState("car");

  const [nodes, setNodes] = React.useState<TreeNode[]>([]);
  const [edges, setEdges] = React.useState<TreeEdge[]>([]);
  const [highlightNodes, setHighlightNodes] = React.useState<string[]>([]);
  const [compared, setCompared] = React.useState(false);
  const [searchResult, setSearchResult] = React.useState<string | null>(null);

  const rebuildTrie = (wordList: string[]) => {
    const root = new TrieNode(""); // root char is empty string

    const insertWord = (word: string) => {
      let curr = root;
      for (let i = 0; i < word.length; i++) {
        const char = word[i];
        if (!curr.children[char]) {
          curr.children[char] = new TrieNode(char);
        }
        curr = curr.children[char];
      }
      curr.isEnd = true;
    };

    wordList.forEach(insertWord);

    // Position Trie nodes hierarchically
    const nNodes: TreeNode[] = [];
    const nEdges: TreeEdge[] = [];
    let leafX = 50;

    let seqId = 0;
    const generateId = () => {
      seqId++;
      return seqId.toString();
    };

    const positionSubtree = (node: TrieNode, depth: number, parentId?: string): { left: number; right: number } => {
      const uId = generateId();
      const nodeObj: TreeNode = {
        id: uId,
        label: node.char || "root",
        x: 0,
        y: 50 + depth * 70,
        val: node.isEnd ? "End of Word" : undefined,
      };

      if (parentId) {
        nEdges.push({
          id: `${parentId}-${uId}`,
          from: parentId,
          to: uId,
        });
      }

      const childrenKeys = Object.keys(node.children);

      if (childrenKeys.length === 0) {
        nodeObj.x = leafX;
        nNodes.push(nodeObj);
        const xPos = leafX;
        leafX += 70;
        return { left: xPos, right: xPos };
      }

      const bounds = childrenKeys.map((k) => positionSubtree(node.children[k], depth + 1, uId));
      const leftX = nNodes.find((n) => n.id === nEdges[nEdges.length - childrenKeys.length].to)!.x;
      const rightX = nNodes.find((n) => n.id === nEdges[nEdges.length - 1].to)!.x;

      nodeObj.x = (leftX + rightX) / 2;
      nNodes.push(nodeObj);
      return { left: bounds[0].left, right: bounds[bounds.length - 1].right };
    };

    positionSubtree(root, 0);

    const maxX = Math.max(...nNodes.map((n) => n.x), 100);
    const shift = Math.max((600 - maxX) / 2, 20);
    nNodes.forEach((node) => {
      node.x += shift;
    });

    setNodes(nNodes);
    setEdges(nEdges);
  };

  React.useEffect(() => {
    rebuildTrie(words);
  }, [words]);

  const handleInsert = () => {
    const w = inputWord.trim().toLowerCase();
    if (!w) return;
    if (words.includes(w)) {
      toast({
        title: "Word Exists",
        description: `Word "${w}" already exists inside the Trie.`,
        variant: "warning",
      });
      return;
    }
    const nextWords = [...words, w];
    setWords(nextWords);
    toast({
      title: "Word Inserted",
      description: `Word "${w}" added to Trie dictionary.`,
      variant: "success",
    });
  };

  const handleDelete = () => {
    const w = inputWord.trim().toLowerCase();
    if (!w) return;
    if (!words.includes(w)) {
      toast({
        title: "Word Not Found",
        description: `Word "${w}" does not exist inside the Trie.`,
        variant: "warning",
      });
      return;
    }
    const nextWords = words.filter((word) => word !== w);
    setWords(nextWords);
    toast({
      title: "Word Deleted",
      description: `Word "${w}" removed from Trie.`,
      variant: "info",
    });
  };

  const handleSearch = () => {
    setCompared(true);
    const w = searchWord.trim().toLowerCase();
    if (!w) {
      setSearchResult("Please enter a valid word to search.");
      return;
    }

    // Simulate search path on our visual nodes
    // Build actual Trie root to find highlighted IDs
    const root = new TrieNode("");
    const insertWord = (word: string) => {
      let curr = root;
      for (let i = 0; i < word.length; i++) {
        const char = word[i];
        if (!curr.children[char]) {
          curr.children[char] = new TrieNode(char);
        }
        curr = curr.children[char];
      }
      curr.isEnd = true;
    };
    words.forEach(insertWord);

    // Trace word traversal and map to generated visual IDs
    // Standard DFS to map trie nodes to visual IDs
    const matchedNodeIds: string[] = [];

    let seqId = 0;
    const generateId = () => {
      seqId++;
      return seqId.toString();
    };

    let found = false;

    const findMatchPath = (node: TrieNode, pathIdx: number, parentVisualId?: string) => {
      const uId = generateId();
      if (pathIdx === 0) {
        matchedNodeIds.push(uId); // root
      }

      if (pathIdx < w.length) {
        const char = w[pathIdx];
        if (node.children[char]) {
          // If we traverse, we can record the child visual ID
          const nextVisualId = (seqId + 1).toString(); // lookahead prediction matching rebuild layout recursion order
          // But lookahead prediction can be complex due to full recursive tree generation.
          // Alternatively, we can match by comparing label strings level by level.
        }
      }
    };

    // Simplify: Highlight visual nodes matching the characters level by level
    const highlighted: string[] = [];
    // DFS on visual tree matching prefix
    // We match by traversing level by level: root, level 1 matching w[0], level 2 matching w[1] ...
    // Build tree representation on visual nodes
    const rootNode = nodes.find((n) => n.label === "root");
    if (rootNode) {
      highlighted.push(rootNode.id);
      let currNode = rootNode;
      let matched = true;

      for (let i = 0; i < w.length; i++) {
        const char = w[i];
        // Find child node of currNode with label = char
        const childEdges = edges.filter((e) => e.from === currNode.id);
        const nextNode = nodes.find((n) => n.label === char && childEdges.some((e) => e.to === n.id));
        if (nextNode) {
          highlighted.push(nextNode.id);
          currNode = nextNode;
          if (i === w.length - 1 && nextNode.val === "End of Word") {
            found = true;
          }
        } else {
          matched = false;
          break;
        }
      }

      setHighlightNodes(highlighted);
      if (found) {
        setSearchResult(`Word "${w}" found! Matching path: ${w.split("").join(" → ")}`);
      } else {
        const prefixMatched = highlighted.length > 1;
        setSearchResult(
          prefixMatched
            ? `Word "${w}" not found, but prefix exists in Trie.`
            : `Word "${w}" has no matching prefix in Trie.`
        );
      }
    }
  };

  const definition = "A Trie (Prefix Tree) is an ordered tree data structure used to store a dynamic set of keys or strings, where keys are usually strings. Unlike a BST, no node in the tree stores the key associated with that node; instead, its position in the tree defines the key/prefix it is associated with.";
  const idea = "Starts from an empty root. For each character in a word, inserts children transitions if not present. Ends of words are marked with a terminal flag.";
  const pseudocode = `InsertTrie(word):
  curr = root
  for char in word:
    if char not in curr.children:
      curr.children[char] = TrieNode(char)
    curr = curr.children[char]
  curr.isEnd = true`;

  const applications = [
    "Autocomplete search query suggestions.",
    "IP routing longest prefix match routing calculations.",
    "Spell checkers and dictionary audits."
  ];
  const mistakes = [
    "Over-allocating node memory buffers. A simple char map of size 26 per node is O(26) space; use hash maps for sparse subdirectories.",
    "Not garbage collecting parent nodes during deletions of unused prefixes."
  ];
  const cpTips = [
    "Trie is extremely useful for XOR queries on integers by treating them as 32-bit binary strings (Binary Trie)!"
  ];

  return (
    <TrLayout
      timeComplexity="O(L) where L is length of word"
      spaceComplexity="O(N * Σ) alphabet size Σ"
      definition={definition}
      idea={idea}
      pseudocode={pseudocode}
      applications={applications}
      mistakes={mistakes}
      cpTips={cpTips}
      visualizerChild={
        <Card className="border-border/40 bg-card/65 shadow-xs font-sans text-left">
          <CardHeader className="pb-2 border-b border-border/10">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Trie Visual Character Forest
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <TreeCanvas
              nodes={nodes}
              edges={edges}
              highlightedNodes={highlightNodes}
            />

            {/* List dictionary */}
            <div className="border-t border-border/5 pt-3 space-y-2 text-left font-sans text-xs">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                Trie Word Dictionary:
              </span>
              <div className="flex flex-wrap gap-1.5 font-mono">
                {words.map((w, idx) => (
                  <div key={idx} className="px-2 py-1 border border-border/40 rounded bg-background/25 font-bold text-foreground">
                    "{w}"
                  </div>
                ))}
              </div>
            </div>

            {compared && searchResult && (
              <div className="border-t border-border/5 pt-3 font-mono text-xs text-left">
                <div className="p-2.5 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 rounded-lg">
                  {searchResult}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      }
    >
      <TrHeader
        title="Trie (Prefix Tree)"
        description="Insert, delete, and trace string prefixes dynamically in char trees."
        category="Set Structures"
        difficulty="Medium"
        shortcut="Alt+Shift+R"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <div className="grid gap-2 grid-cols-2">
            <InputField label="Input Word" value={inputWord} onChange={setInputWord} />
            <div className="flex gap-1.5 mt-6">
              <Button onClick={handleInsert} className="flex-1 justify-center cursor-pointer text-xs h-9">
                Insert
              </Button>
              <Button onClick={handleDelete} variant="danger" className="flex-1 justify-center cursor-pointer text-xs h-9">
                Delete
              </Button>
            </div>
          </div>

          <div className="grid gap-4 grid-cols-2">
            <InputField label="Search Word" value={searchWord} onChange={setSearchWord} />
            <Button onClick={handleSearch} variant="outline" className="mt-6 justify-center cursor-pointer h-9">
              Search Prefix
            </Button>
          </div>
        </CardContent>
      </Card>
    </TrLayout>
  );
}
