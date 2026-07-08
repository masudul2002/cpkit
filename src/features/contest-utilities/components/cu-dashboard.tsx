"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageContainer, PageHeader } from "@/components/ui/containers";
import {
  Calculator,
  RefreshCw,
  Binary,
  Hash,
  BookOpen,
  FileCode2,
  Cpu,
  Layers,
  Search,
  Star,
  ArrowRight
} from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface Tool {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut: string;
}

const TOOLS: Tool[] = [
  {
    id: "calc",
    title: "Standard Calculator",
    description: "Evaluate float arithmetic equations containing addition, subtraction, products, quotients, and percentages.",
    category: "Arithmetic",
    difficulty: "Easy",
    href: "/contest-utilities/calculator",
    icon: Calculator,
    shortcut: "Alt+1",
  },
  {
    id: "base",
    title: "Base Converter",
    description: "Live numerical converter mapping numbers between Binary, Octal, Decimal, and Hexadecimal representations.",
    category: "Base Conversion",
    difficulty: "Easy",
    href: "/contest-utilities/base-converter",
    icon: RefreshCw,
    shortcut: "Alt+2",
  },
  {
    id: "bin-calc",
    title: "Binary Calculator",
    description: "Perform bitwise operations (AND, OR, XOR, NOT, left/right shifts) and base conversions on numbers.",
    category: "Logical Operations",
    difficulty: "Medium",
    href: "/contest-utilities/binary-calculator",
    icon: Binary,
    shortcut: "Alt+3",
  },
  {
    id: "ascii",
    title: "ASCII Table Reference",
    description: "Searchable reference mapping ASCII values to character, decimal, hex, and binary representation.",
    category: "Characters",
    difficulty: "Easy",
    href: "/contest-utilities/ascii-table",
    icon: Hash,
    shortcut: "Alt+4",
  },
  {
    id: "roman",
    title: "Roman Numerals",
    description: "Bidirectional converter mapping Roman numerals to decimal integers and vice versa.",
    category: "Base Conversion",
    difficulty: "Easy",
    href: "/contest-utilities/roman-converter",
    icon: BookOpen,
    shortcut: "Alt+5",
  },
  {
    id: "eval",
    title: "Expression Evaluator",
    description: "Safe mathematical expression evaluation with strict validation rules and formatted outputs.",
    category: "Arithmetic",
    difficulty: "Medium",
    href: "/contest-utilities/expression-evaluator",
    icon: FileCode2,
    shortcut: "Alt+6",
  },
  {
    id: "big-int",
    title: "Big Integer Calculator",
    description: "Perform standard calculations on numbers exceeding JavaScript limit bounds using native BigInt methods.",
    category: "Big Numbers",
    difficulty: "Medium",
    href: "/contest-utilities/bigint-calculator",
    icon: Layers,
    shortcut: "Alt+7",
  },
  {
    id: "overflow",
    title: "Overflow Checker",
    description: "Check if a specific numeric value fits into C++ primitive data types (int, long long, unsigned, short).",
    category: "Memory Check",
    difficulty: "Medium",
    href: "/contest-utilities/overflow-checker",
    icon: Cpu,
    shortcut: "Alt+8",
  },
];

export function CuDashboard() {
  const { toast } = useToast();
  const [search, setSearch] = React.useState("");
  const [favorites, setFavorites] = React.useState<Record<string, boolean>>({});

  const handleFavoriteToggle = (e: React.MouseEvent, toolId: string, toolTitle: string) => {
    e.preventDefault();
    e.stopPropagation();

    const updated = !favorites[toolId];
    setFavorites((prev) => ({ ...prev, [toolId]: updated }));

    toast({
      title: updated ? "Added to Favorites" : "Removed from Favorites",
      description: `${toolTitle} has been ${updated ? "pinned to" : "unpinned from"} your workspace dashboard.`,
      variant: updated ? "success" : "info",
    });
  };

  const filteredTools = TOOLS.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageContainer>
      <PageHeader
        title="Contest Utilities"
        description="Essential converters, bitwise logical calculators, memory overflows, and reference tables for contest workflows."
      />

      {/* Search Header */}
      <div className="flex max-w-md my-6">
        <Input
          placeholder="Filter utilities by title, category, or descriptions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      {/* Tools Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTools.map((tool) => {
          const Icon = tool.icon;
          const isFav = !!favorites[tool.id];

          return (
            <Card key={tool.id} className="group hover:border-primary/40 hover:bg-accent/25 transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
              <CardHeader className="pb-3 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    {tool.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <kbd className="px-1.5 py-0.5 border rounded bg-muted/60 font-mono text-[9px] text-muted-foreground select-none">
                      {tool.shortcut}
                    </kbd>
                    <button
                      onClick={(e) => handleFavoriteToggle(e, tool.id, tool.title)}
                      className="text-muted-foreground/60 hover:text-amber-500 transition-colors p-1 cursor-pointer"
                      title={isFav ? "Remove from Favorites" : "Pin to Favorites"}
                    >
                      <Star className={`h-4.5 w-4.5 ${isFav ? "fill-amber-500 text-amber-500" : ""}`} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base group-hover:text-primary transition-colors">
                    {tool.title}
                  </CardTitle>
                </div>

                <CardDescription className="pt-2 text-xs leading-relaxed">
                  {tool.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0 flex items-center justify-between border-t border-border/10 mt-auto px-6 py-4">
                <Badge variant={tool.difficulty === "Easy" ? "success" : "warning"}>
                  {tool.difficulty}
                </Badge>
                <Link href={tool.href}>
                  <Button variant="outline" size="sm" className="h-8 gap-1.5 cursor-pointer text-xs">
                    Open Utility
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </PageContainer>
  );
}
