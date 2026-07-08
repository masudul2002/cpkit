"use client";

import * as React from "react";
import { REF_DATA, COMPLEXITY_DATA, RefRecord } from "../constants/ref-data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import {
  Search,
  Star,
  Copy,
  BookOpen,
  Cpu,
  Layers,
  Sparkles,
  ClipboardCheck,
  Zap
} from "lucide-react";

export function RefDashboard() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [favorites, setFavorites] = React.useState<string[]>([]);
  const [activeRecord, setActiveRecord] = React.useState<RefRecord | null>(REF_DATA[0]);

  const handleFavoriteToggle = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const isFav = favorites.includes(id);
    if (isFav) {
      setFavorites(favorites.filter((favId) => favId !== id));
      toast({
        title: "Removed Favorite",
        description: "Removed from your bookmarks.",
        variant: "info",
      });
    } else {
      setFavorites([...favorites, id]);
      toast({
        title: "Added Favorite",
        description: "Pinned to your bookmarks.",
        variant: "success",
      });
    }
  };

  const handleCopyCode = (id: string, code?: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast({
      title: "Copied Code",
      description: "Code snippet copied to clipboard.",
      variant: "success",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredRecords = REF_DATA.filter((rec) => {
    const matchesSearch =
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || rec.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 font-sans text-left pb-10">
      {/* 1. TOP STATS BAR & QUICK SEARCH */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/10 pb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search STL containers, compiler flags, math formulas, templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 w-full"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {["All", "STL Containers", "Bitwise & Math", "Cheatsheets", "Templates & Compilers"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer border transition-all ${
                selectedCategory === cat
                  ? "bg-primary border-primary text-primary-foreground font-extrabold shadow-sm"
                  : "bg-background border-border/30 text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 2. DUAL COLUMNS INTERACTION */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Column: List of items */}
        <div className="lg:col-span-4 space-y-3 max-h-[600px] overflow-y-auto pr-1">
          {filteredRecords.map((rec) => {
            const isFav = favorites.includes(rec.id);
            const isActive = activeRecord?.id === rec.id;

            return (
              <div
                key={rec.id}
                onClick={() => setActiveRecord(rec)}
                className={`p-4 border rounded-xl cursor-pointer transition-all flex items-start justify-between select-none ${
                  isActive
                    ? "bg-primary/5 border-primary shadow-xs"
                    : "bg-card/50 border-border/40 hover:bg-card/95 hover:border-border/80"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm text-foreground">{rec.title}</span>
                    <Badge variant="secondary" className="text-[8px] scale-90 px-1">{rec.category}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">{rec.subtitle}</p>
                </div>
                <button
                  onClick={(e) => handleFavoriteToggle(rec.id, e)}
                  className="text-muted-foreground/30 hover:text-amber-500 transition-colors p-1"
                >
                  <Star className={`h-4 w-4 ${isFav ? "fill-amber-500 text-amber-500" : ""}`} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed View */}
        <div className="lg:col-span-8">
          {activeRecord ? (
            <Card className="border-border/40 bg-card/65 shadow-xs">
              <CardHeader className="pb-3 border-b border-border/10">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-black text-foreground">{activeRecord.title}</CardTitle>
                    <CardDescription className="text-xs text-primary font-medium">{activeRecord.subtitle}</CardDescription>
                  </div>
                  {activeRecord.codeSnippet && (
                    <button
                      onClick={() => handleCopyCode(activeRecord.id, activeRecord.codeSnippet)}
                      className="text-muted-foreground/60 hover:text-foreground border border-border/40 p-2 rounded-lg cursor-pointer hover:bg-accent/40 transition-colors"
                      title="Copy Code Snippet"
                    >
                      {copiedId === activeRecord.id ? (
                        <ClipboardCheck className="h-4.5 w-4.5 text-emerald-500 animate-bounce" />
                      ) : (
                        <Copy className="h-4.5 w-4.5" />
                      )}
                    </button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Description</span>
                  <p className="text-xs text-foreground/80 leading-relaxed">{activeRecord.description}</p>
                </div>

                {activeRecord.syntax && (
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Syntax / Includes</span>
                    <pre className="p-3 bg-muted/20 border border-border/10 rounded-lg font-mono text-[11px] leading-relaxed text-emerald-500 overflow-x-auto whitespace-pre">
                      {activeRecord.syntax}
                    </pre>
                  </div>
                )}

                {(activeRecord.timeComplexity || activeRecord.spaceComplexity) && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {activeRecord.timeComplexity && (
                      <div className="p-3 border border-border/20 rounded-lg bg-muted/5">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Time Complexity</span>
                        <code className="text-xs font-mono font-bold text-primary">{activeRecord.timeComplexity}</code>
                      </div>
                    )}
                    {activeRecord.spaceComplexity && (
                      <div className="p-3 border border-border/20 rounded-lg bg-muted/5">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Space Complexity</span>
                        <code className="text-xs font-mono font-bold text-amber-500">{activeRecord.spaceComplexity}</code>
                      </div>
                    )}
                  </div>
                )}

                {activeRecord.codeSnippet && (
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">Code Snippet</span>
                    <pre className="p-3.5 bg-muted/20 border border-border/10 rounded-xl font-mono text-[11px] leading-relaxed text-emerald-500 overflow-x-auto whitespace-pre">
                      {activeRecord.codeSnippet}
                    </pre>
                  </div>
                )}

                {activeRecord.mistakes && activeRecord.mistakes.length > 0 && (
                  <div className="border-t border-border/5 pt-3">
                    <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider block mb-1.5">Common Mistakes</span>
                    <ul className="list-disc list-inside space-y-1 text-xs text-rose-500/80 leading-relaxed">
                      {activeRecord.mistakes.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeRecord.tips && activeRecord.tips.length > 0 && (
                  <div className="border-t border-border/5 pt-3">
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider block mb-1.5">Tips & Tricks</span>
                    <ul className="list-disc list-inside space-y-1 text-xs text-emerald-500/80 leading-relaxed">
                      {activeRecord.tips.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="p-10 border border-dashed border-border/30 rounded-2xl flex flex-col items-center justify-center text-center">
              <Zap className="h-8 w-8 text-muted-foreground animate-pulse mb-3" />
              <p className="text-xs text-muted-foreground">Select a record from the list to view references.</p>
            </div>
          )}
        </div>
      </div>

      {/* 3. COMPLEXITY COMPARISON TABLE */}
      <div className="pt-6 border-t border-border/10">
        <Card className="border-border/40 bg-card/65 shadow-xs">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-foreground uppercase tracking-wider text-muted-foreground">
              Big-O Complexity Limits Scale
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-border/20 text-muted-foreground text-left">
                  <th className="p-3">Input N</th>
                  <th className="p-3">O(1)</th>
                  <th className="p-3">O(log N)</th>
                  <th className="p-3">O(N)</th>
                  <th className="p-3">O(N log N)</th>
                  <th className="p-3">O(N²)</th>
                  <th className="p-3">O(2ⁿ)</th>
                  <th className="p-3">O(N!)</th>
                </tr>
              </thead>
              <tbody>
                {COMPLEXITY_DATA.map((row) => (
                  <tr key={row.n} className="border-b border-border/5 hover:bg-muted/5 transition-colors">
                    <td className="p-3 font-bold text-foreground">{row.n}</td>
                    <td className="p-3 text-emerald-500">{row.o1}</td>
                    <td className="p-3 text-emerald-500">{row.oLogN}</td>
                    <td className="p-3 text-emerald-500">{row.oN}</td>
                    <td className="p-3 text-amber-500">{row.oNLogN}</td>
                    <td className="p-3 text-amber-500">{row.oNSq}</td>
                    <td className="p-3 text-rose-500">{row.oTwoN.toLocaleString()}</td>
                    <td className="p-3 text-rose-500">{row.oFactorial.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
