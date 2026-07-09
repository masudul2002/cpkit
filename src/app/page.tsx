"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Bug,
  Sparkles,
  Layers,
  BookOpen,
  ArrowRight,
  Github,
  Zap,
  Shield,
  Eye,
  GitBranch,
  Terminal,
  Grid,
  Lock,
  GitPullRequest
} from "lucide-react";
import { motion } from "framer-motion";
import { APP_VERSION } from "@/constants/branding";

export default function LandingPage() {
  const features = [
    {
      title: "Contest Utilities",
      desc: "Parse problem files from competitive platforms and auto-generate clean boilerplate files.",
      icon: Trophy,
      badge: "Popular",
    },
    {
      title: "Debug Tools",
      desc: "Compare brute-force solutions with optimized approaches to stress test and isolate edge cases.",
      icon: Bug,
      badge: "Core",
    },
    {
      title: "Test Generator",
      desc: "Create random grids, arrays, trees, and weights under custom numeric thresholds.",
      icon: Sparkles,
      badge: "New",
    },
    {
      title: "Graph Visualizer",
      desc: "Build and visualize dynamic graphs, DAGs, and shortest-path tree flows in real-time.",
      icon: GitBranch,
    },
    {
      title: "Number Theory",
      desc: "Fast exponents, prime sieve builders, combinatorics solvers, and modular inverse tools.",
      icon: Terminal,
    },
    {
      title: "String Algorithms",
      desc: "Reference templates for KMP string search, Z-array, Trie nodes, and Suffix automatons.",
      icon: Layers,
    },
    {
      title: "Matrix Tools",
      desc: "Solve linear equations and perform matrix exponentiation in logarithmic time.",
      icon: Grid,
    },
    {
      title: "Quick Reference",
      desc: "Lookup standard code macros, time complexities, and fast I/O optimizations.",
      icon: BookOpen,
    },
  ];

  const advantages = [
    { title: "Lightning Fast", desc: "Built with Next.js Turbopack for optimal client response speeds.", icon: Zap },
    { title: "Offline Ready", desc: "Cache templates and logic locally for seamless usage during offline practice.", icon: Shield },
    { title: "100% Free", desc: "No subscriptions or locked features. Free for students and teams.", icon: GitPullRequest },
    { title: "Developer Friendly", desc: "Clean keyboard navigation, console output copying, and theme toggling.", icon: Terminal },
  ];

  const stats = [
    { value: "50+", label: "Planned Tools" },
    { value: "10", label: "Algorithm Categories" },
    { value: "100%", label: "Open Source" },
    { value: "Sub-50ms", label: "Interactive Latency" },
  ];

  return (
    <div className="space-y-24 py-10 md:py-16">
      {/* 1. HERO SECTION */}
      <section className="container max-w-7xl mx-auto px-6 grid gap-12 lg:grid-cols-12 items-center">
        <div className="lg:col-span-7 space-y-6 text-left">
          <Badge variant="primary" className="px-3 py-1 text-xs">
            Introducing CPKit v{APP_VERSION}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-none text-foreground">
            Everything a <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">Competitive Programmer</span> Needs.
          </h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
            A modern, production-ready toolbox for Competitive Programming. Practice faster, debug smarter, generate custom edge cases, and lookup optimized library scripts in one place.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2 cursor-pointer shadow-md shadow-primary/10">
                Explore Tools
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="gap-2 cursor-pointer">
                <Github className="h-4.5 w-4.5" />
                View GitHub
              </Button>
            </a>
          </div>
        </div>

        {/* Abstract Developer SVG Illustration */}
        <div className="lg:col-span-5 relative flex justify-center items-center">
          <div className="absolute inset-0 bg-primary/10 rounded-full filter blur-3xl opacity-30 animate-pulse" />
          <svg
            className="w-full max-w-[380px] h-auto drop-shadow-2xl text-primary"
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Visual Editor Frame */}
            <rect x="20" y="20" width="360" height="360" rx="16" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.2" />
            <rect x="20" y="20" width="360" height="48" rx="0" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.1" />
            <circle cx="45" cy="44" r="5" fill="#ef4444" />
            <circle cx="60" cy="44" r="5" fill="#f59e0b" />
            <circle cx="75" cy="44" r="5" fill="#10b981" />
            
            {/* Abstract Tree Nodes Representing Algorithms */}
            <line x1="200" y1="120" x2="120" y2="220" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" strokeDasharray="4 4" />
            <line x1="200" y1="120" x2="280" y2="220" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" />
            <line x1="120" y1="220" x2="80" y2="300" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />
            <line x1="120" y1="220" x2="160" y2="300" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />

            <circle cx="200" cy="120" r="16" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" />
            <circle cx="200" cy="120" r="6" fill="currentColor" />
            
            <circle cx="120" cy="220" r="14" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="120" cy="220" r="5" fill="currentColor" fillOpacity="0.8" />
            
            <circle cx="280" cy="220" r="14" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="280" cy="220" r="5" fill="currentColor" fillOpacity="0.8" />

            <circle cx="80" cy="300" r="10" fill="currentColor" fillOpacity="0.02" stroke="currentColor" strokeWidth="1" />
            <circle cx="160" cy="300" r="10" fill="currentColor" fillOpacity="0.02" stroke="currentColor" strokeWidth="1" />

            {/* Glowing brackets */}
            <path d="M 310 85 L 330 85 L 330 145 L 310 145" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.4" />
            <path d="M 90 85 L 70 85 L 70 145 L 90 145" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.4" />
          </svg>
        </div>
      </section>

      {/* 2. STATISTICS GRID */}
      <section className="bg-muted/30 border-y border-border/40 py-12">
        <div className="container max-w-7xl mx-auto px-6 grid gap-8 grid-cols-2 md:grid-cols-4 text-center">
          {stats.map((s, idx) => (
            <div key={idx} className="space-y-1">
              <div className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">{s.value}</div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURE PREVIEW GRID */}
      <section className="container max-w-7xl mx-auto px-6 space-y-10">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <h2 className="text-3xl font-extrabold tracking-tight">Features Built for Contest Workflows</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Every feature runs independently in the browser, providing offline capabilities and sub-millisecond execution times.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <Card key={idx} className="group hover:border-primary/40 hover:bg-accent/25 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="relative z-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    {f.badge && <Badge variant="primary" className="text-[9px] px-1.5">{f.badge}</Badge>}
                  </div>
                  <CardTitle className="text-base group-hover:text-primary transition-colors">{f.title}</CardTitle>
                  <CardDescription className="pt-2 text-xs leading-relaxed">{f.desc}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 4. WHY CPKIT */}
      <section className="container max-w-7xl mx-auto px-6 grid gap-12 lg:grid-cols-2 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight">The Modern Developer Interface, Applied to Competitive Programming.</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Old contest suites suffer from cluttered, outdated UI elements and slow loading speeds. CPKit introduces a sleek Notion-like editor structure integrated with a Raycast-style command menu to let you switch contexts instantly.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {advantages.map((adv, idx) => {
              const Icon = adv.icon;
              return (
                <div key={idx} className="flex gap-3">
                  <div className="text-primary mt-0.5 shrink-0"><Icon className="h-4.5 w-4.5" /></div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-foreground">{adv.title}</h4>
                    <p className="text-xs text-muted-foreground leading-normal">{adv.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Abstract Preview Panel */}
        <div className="border border-border/45 bg-card/65 rounded-xl p-6 backdrop-blur-md shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border/10 pb-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Fast stress_test.py generator</span>
            <Badge variant="success">Offline Ready</Badge>
          </div>
          <div className="space-y-2">
            <div className="flex gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-mono text-muted-foreground">Generating tests...</span>
            </div>
            <div className="p-3 bg-muted/40 rounded-lg font-mono text-[11px] text-foreground/80 leading-relaxed overflow-x-auto">
              {`def generate_tree(n):
    parent = [i for i in range(n)]
    for i in range(1, n):
        parent[i] = random.randint(0, i - 1)
    return parent`}
            </div>
          </div>
        </div>
      </section>

      {/* 5. RECENT UPDATES & ROADMAP */}
      <section className="container max-w-4xl mx-auto px-6 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight">Recent Updates & Roadmap</h2>
          <p className="text-sm text-muted-foreground">Track updates, upcoming releases, and feature completions.</p>
        </div>

        <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-4 before:w-[1px] before:bg-border/60">
          {/* Release 1 */}
          <div className="relative pl-10 space-y-1.5 group">
            <div className="absolute left-2.5 top-1.5 h-3 w-3 rounded-full bg-primary border-4 border-background group-hover:scale-125 transition-transform" />
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-primary">v0.1.0</span>
              <span className="text-[10px] text-muted-foreground border px-1 rounded uppercase font-semibold">Active Release</span>
            </div>
            <h4 className="text-sm font-bold text-foreground">Project Foundation & Design System</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Complete setup of Next.js configurations, HSL theme variable system, responsive sidebar shell layouts, and interactive command palette commands.
            </p>
          </div>

          {/* Release 2 */}
          <div className="relative pl-10 space-y-1.5 group">
            <div className="absolute left-2.5 top-1.5 h-3 w-3 rounded-full bg-muted-foreground/30 border-4 border-background group-hover:scale-125 transition-transform" />
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-muted-foreground">v0.2.0</span>
              <span className="text-[10px] text-muted-foreground border px-1 rounded uppercase font-semibold">Upcoming</span>
            </div>
            <h4 className="text-sm font-bold text-foreground">Contest Utilities & Debug Tools</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Integrating browser-based file parsers to import problem test inputs, stress-test compiler hooks, and manual output comparisons.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
