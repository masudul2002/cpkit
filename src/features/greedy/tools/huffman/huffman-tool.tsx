"use client";

import * as React from "react";
import { GdHeader } from "../../shared/gd-header";
import { GdLayout } from "../../shared/gd-layout";
import { TreeCanvas, TreeNode, TreeEdge } from "@/features/tree/visualization/tree-canvas";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface HuffmanNode {
  char?: string;
  freq: number;
  left?: HuffmanNode;
  right?: HuffmanNode;
  id: string;
}

export function HuffmanTool() {
  const [charsStr, setCharsStr] = React.useState("A, B, C, D, E, F");
  const [freqsStr, setFreqsStr] = React.useState("5, 9, 12, 13, 16, 45");

  const [compared, setCompared] = React.useState(false);
  const [nodes, setNodes] = React.useState<TreeNode[]>([]);
  const [edges, setEdges] = React.useState<TreeEdge[]>([]);
  const [codes, setCodes] = React.useState<Record<string, string>>({});
  const [ratio, setRatio] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleEvaluate = () => {
    setError(null);
    setCompared(true);
    setNodes([]);
    setEdges([]);
    setCodes({});
    setRatio(null);

    const chars = charsStr.split(",").map((s) => s.trim());
    const freqs = freqsStr.split(",").map((s) => parseInt(s.trim(), 10));

    if (chars.some((c) => c.length === 0) || freqs.some(isNaN) || chars.length === 0) {
      setError("Please check your characters and frequencies inputs.");
      return;
    }

    if (chars.length !== freqs.length) {
      setError("Characters list and Frequencies list must have the same length.");
      return;
    }

    const n = chars.length;
    let leafNodesList: HuffmanNode[] = Array.from({ length: n }, (_, idx) => ({
      char: chars[idx],
      freq: freqs[idx],
      id: `leaf_${idx}`,
    }));

    // Build Huffman tree using Priority Queue array simulations
    const queue = [...leafNodesList];
    let parentCounter = 1;

    while (queue.length > 1) {
      // Sort ascending by frequency
      queue.sort((a, b) => a.freq - b.freq);

      const left = queue.shift()!;
      const right = queue.shift()!;

      const parent: HuffmanNode = {
        freq: left.freq + right.freq,
        left,
        right,
        id: `parent_${parentCounter++}`,
      };

      queue.push(parent);
    }

    const root = queue[0];
    const generatedCodes: Record<string, string> = {};

    // Traverse tree recursively to build codes
    const extractCodes = (curr: HuffmanNode | undefined, prefix: string) => {
      if (!curr) return;
      if (curr.char !== undefined) {
        generatedCodes[curr.char] = prefix;
        return;
      }
      extractCodes(curr.left, prefix + "0");
      extractCodes(curr.right, prefix + "1");
    };

    extractCodes(root, "");

    // Layout the tree for TreeCanvas
    const treeNodes: TreeNode[] = [];
    const treeEdges: TreeEdge[] = [];

    const assignCoordinates = (curr: HuffmanNode | undefined, x: number, y: number, spread: number) => {
      if (!curr) return;

      const labelText = curr.char !== undefined ? `'${curr.char}':${curr.freq}` : `${curr.freq}`;
      treeNodes.push({
        id: curr.id,
        label: labelText,
        x,
        y,
      });

      if (curr.left) {
        treeEdges.push({
          id: `${curr.id}-${curr.left.id}`,
          from: curr.id,
          to: curr.left.id,
        });
        assignCoordinates(curr.left, x - spread, y + 60, spread * 0.5);
      }

      if (curr.right) {
        treeEdges.push({
          id: `${curr.id}-${curr.right.id}`,
          from: curr.id,
          to: curr.right.id,
        });
        assignCoordinates(curr.right, x + spread, y + 60, spread * 0.5);
      }
    };

    assignCoordinates(root, 250, 40, 100);

    // Calculate compression ratio
    // Assume fixed ASCII coding uses 8 bits per character.
    let totalBitsHuffman = 0;
    let totalFreq = 0;
    for (let idx = 0; idx < n; idx++) {
      const c = chars[idx];
      const codeLen = generatedCodes[c] ? generatedCodes[c].length : 8;
      totalBitsHuffman += freqs[idx] * codeLen;
      totalFreq += freqs[idx];
    }
    const totalBitsFixed = totalFreq * 8;
    const compressionRatio = totalBitsFixed / totalBitsHuffman;

    setNodes(treeNodes);
    setEdges(treeEdges);
    setCodes(generatedCodes);
    setRatio(compressionRatio);
  };

  const definition = "Huffman Coding is an entropy encoding algorithm used for lossless data compression, assigning variable-length prefix codes based on character frequencies.";
  const greedyChoice = "Repeatedly merge the two nodes with the lowest frequencies into a parent node whose frequency is the sum of the children's frequencies.";
  const optimalSubstructure = "An optimal Huffman tree for N characters contains an optimal Huffman tree for N-1 characters as a subtree, merged via the lowest frequency pair.";
  const proofIdea = "Proof by sibling property: if the lowest frequency characters are not leaves at the bottom of the tree, swapping them with higher frequency nodes increases the total weighted path length.";
  const pseudocode = `BuildHuffmanTree(frequencies):
  PQ = Min-Priority Queue of nodes
  for char, freq in frequencies:
    PQ.insert(LeafNode(char, freq))
  while PQ.size > 1:
    left = PQ.extract_min()
    right = PQ.extract_min()
    parent = InternalNode(left.freq + right.freq, left, right)
    PQ.insert(parent)
  return PQ.extract_min() // root`;

  const applications = [
    "Lossless data compression algorithms (e.g. GZIP, JPEG, MP3).",
    "Transmission lines bandwidth optimizations.",
    "Prefix codes dictionary designs."
  ];
  const mistakes = [
    "Not using a min-priority queue (which causes incorrect node pairings).",
    "Forgetting to sum frequencies correctly during parent merges."
  ];
  const cpTips = [
    "Huffman coding is isomorphic to the 'Merge adjacent elements with minimum cost' problem. In competitive programming, when you need to construct optimal prefix decisions trees, think of Huffman Coding!"
  ];

  return (
    <GdLayout
      timeComplexity="O(N log N) with priority queue"
      spaceComplexity="O(N) tree size nodes buffers"
      definition={definition}
      greedyChoice={greedyChoice}
      optimalSubstructure={optimalSubstructure}
      proofIdea={proofIdea}
      pseudocode={pseudocode}
      applications={applications}
      mistakes={mistakes}
      cpTips={cpTips}
      visualizerChild={
        <Card className="border-border/40 bg-card/65 shadow-xs font-sans text-left">
          <CardHeader className="pb-2 border-b border-border/10">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Huffman Tree and Prefix Codes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Tree Canvas */}
            <div className="h-[280px] border border-border/40 rounded-xl relative overflow-hidden bg-muted/5">
              <TreeCanvas nodes={nodes} edges={edges} />
            </div>

            {compared && ratio !== null && (
              <div className="border-t border-border/5 pt-3 space-y-3 font-mono text-xs text-left">
                <div className="flex justify-between border-b border-border/5 pb-1">
                  <span>Compression Ratio (vs 8-bit ASCII):</span>
                  <span className="font-bold text-emerald-500">{ratio.toFixed(2)}x compression</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Variable-Length Prefix Codes Dictionary:
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {Object.keys(codes).map((c) => (
                      <div key={c} className="px-3 py-1.5 border border-border/40 rounded bg-background/25">
                        <span className="text-muted-foreground font-semibold">'{c}': </span>
                        <span className="font-extrabold text-primary">{codes[c]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {error && <div className="text-xs text-rose-500 font-semibold font-mono">{error}</div>}
          </CardContent>
        </Card>
      }
    >
      <GdHeader
        title="Huffman Coding"
        description="Construct optimal prefix codes for data compression."
        category="Greedy"
        difficulty="Hard"
        shortcut="Alt+Shift+H"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs font-sans">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-left">
          <InputField label="Alphabet Characters (comma separated)" value={charsStr} onChange={setCharsStr} />
          <InputField label="Characters Frequencies (comma separated)" value={freqsStr} onChange={setFreqsStr} />

          <Button onClick={handleEvaluate} className="w-full justify-center cursor-pointer">
            Build Huffman Tree
          </Button>
        </CardContent>
      </Card>
    </GdLayout>
  );
}
