"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, StatCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/feedback-states";
import {
  Trophy,
  Bug,
  Sparkles,
  Search,
  BookOpen,
  Keyboard,
  Clock,
  Star,
  Activity,
  ArrowRight,
  TrendingUp,
  FileCode2,
  Share2,
  Terminal,
  Grid
} from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function Dashboard() {
  const { toast } = useToast();

  const handleFavoriteAction = (toolName: string) => {
    toast({
      title: "Added to Favorites",
      description: `${toolName} has been pinned to your dashboard.`,
      variant: "success",
    });
  };

  const categories = [
    { title: "Strings", href: "/strings", count: "4 tools" },
    { title: "Number Theory", href: "/number-theory", count: "5 tools" },
    { title: "Matrix", href: "/matrix", count: "3 tools" },
    { title: "Graph", href: "/graph", count: "6 tools" },
    { title: "Tree", href: "/tree", count: "4 tools" },
    { title: "DP Optimization", href: "/dp", count: "4 tools" },
    { title: "Greedy Choice", href: "/greedy", count: "3 tools" },
    { title: "Geometry", href: "/geometry", count: "4 tools" },
  ];

  const quickActions = [
    { name: "Prime Checker", href: "/number-theory" },
    { name: "Base Converter", href: "/number-theory" },
    { name: "Compare Output", href: "/debug" },
    { name: "Random Array Gen", href: "/generator" },
    { name: "Graph Visualizer", href: "/graph" },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* 1. WELCOME GREETING BANNER */}
      <section className="rounded-2xl border border-border/40 bg-card/35 p-6 md:p-8 backdrop-blur-md relative overflow-hidden shadow-xs">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent" />
        <div className="relative z-10 space-y-2">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 animate-pulse" />
            Coder Dashboard Active
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            Welcome back, Competitive Programmer.
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground max-w-xl leading-relaxed">
            Quickly stress test solution codes, write inputs, and reference optimal templates. Use the keyboard shortcuts panel below to speed up context shifts.
          </p>
        </div>
      </section>

      {/* 2. STATS OVERVIEW */}
      <section className="grid gap-6 sm:grid-cols-3">
        <StatCard
          title="Active Contests"
          value="2"
          description="Codeforces Round 954 starting in 2h"
          icon={<Trophy className="h-4.5 w-4.5 text-amber-500" />}
        />
        <StatCard
          title="Recent Solves"
          value="24"
          description="Solutions compiled this week"
          icon={<FileCode2 className="h-4.5 w-4.5 text-primary" />}
          trend={{ value: "+8% growth", positive: true }}
        />
        <StatCard
          title="Fast I/O Active"
          value="Enabled"
          description="Template templates loaded"
          icon={<Terminal className="h-4.5 w-4.5 text-emerald-500" />}
        />
      </section>

      {/* 3. WORKSPACE PANELS: CONTINUE WORKING & FAVORITES */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Column: Activity Log */}
        <div className="lg:col-span-8 space-y-6">
          {/* Continue Working / History */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/10 mb-4">
              <div className="space-y-0.5">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4.5 w-4.5 text-muted-foreground" />
                  Continue Working
                </CardTitle>
                <CardDescription>Quick access to your recently loaded tools.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="py-6">
              <EmptyState
                title="No recent tools"
                description="Browse modules in the sidebar or search files using Cmd+K to populate your active history."
                icon={<Clock className="h-8 w-8 text-muted-foreground/50" />}
              />
            </CardContent>
          </Card>

          {/* Categories Grid */}
          <Card>
            <CardHeader className="pb-3 border-b border-border/10 mb-4">
              <CardTitle className="text-base">Reference Libraries</CardTitle>
              <CardDescription>Optimized data structures and mathematical templates.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                {categories.map((c, idx) => (
                  <Link
                    key={idx}
                    href={c.href}
                    className="group border border-border/40 hover:border-primary/30 p-4 rounded-lg bg-card/15 hover:bg-accent/30 transition-all flex flex-col justify-between cursor-pointer"
                  >
                    <span className="text-xs font-bold text-foreground/80 group-hover:text-primary transition-colors">
                      {c.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-2 block font-medium">
                      {c.count}
                    </span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Favorites & Shortcuts */}
        <div className="lg:col-span-4 space-y-6">
          {/* Favorites List */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/10 mb-4">
              <div className="space-y-0.5">
                <CardTitle className="text-base flex items-center gap-2">
                  <Star className="h-4.5 w-4.5 text-amber-500 fill-amber-500/20" />
                  Favorites
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="py-6">
              <EmptyState
                title="No favorites pinned"
                description="Star features in the command palette to pin them here for instant access."
                icon={<Star className="h-8 w-8 text-amber-500/40" />}
              />
            </CardContent>
          </Card>

          {/* Quick Actions Panel */}
          <Card>
            <CardHeader className="pb-2 border-b border-border/10 mb-4">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {quickActions.map((qa, idx) => (
                <Link key={idx} href={qa.href} className="w-full">
                  <Button
                    variant="outline"
                    className="w-full justify-between text-xs h-9 cursor-pointer"
                    onClick={() => handleFavoriteAction(qa.name)}
                  >
                    <span>{qa.name}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Keyboard Shortcuts Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/10 mb-4">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Keyboard className="h-4 w-4" />
                Shortcuts Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Global Search Palette</span>
                <kbd className="px-1.5 py-0.5 border rounded bg-muted/60 font-mono font-bold text-[10px]">
                  Cmd+K
                </kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Focus Navigation</span>
                <kbd className="px-1.5 py-0.5 border rounded bg-muted/60 font-mono font-bold text-[10px]">
                  Tab
                </kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Dismiss Modals / ESC</span>
                <kbd className="px-1.5 py-0.5 border rounded bg-muted/60 font-mono font-bold text-[10px]">
                  Escape
                </kbd>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
