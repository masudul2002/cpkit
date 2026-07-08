"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutStore } from "@/lib/store";
import { ThemeToggle } from "@/components/theme-toggle";
import { AvatarMenu } from "@/features/auth/components/avatar-menu";
import { Search, Github, HelpCircle, Command } from "lucide-react";
import { useEffect, useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const { toggleCommandPalette } = useLayoutStore();
  const [osShortcut, setOsShortcut] = useState("Ctrl + K");
  const isLandingPage = pathname === "/";

  useEffect(() => {
    // Determine OS for proper shortcut label
    if (typeof window !== "undefined") {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      setOsShortcut(isMac ? "Cmd + K" : "Ctrl + K");
    }
  }, []);

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-border/45 bg-background/60 px-6 backdrop-blur-md">
      {/* Left side: branding/logo or title */}
      <div className="flex items-center gap-4">
        {isLandingPage ? (
          <Link href="/" className="flex items-center gap-2 font-bold text-primary cursor-pointer">
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
              CPKit
            </span>
          </Link>
        ) : (
          <h1 className="text-sm font-semibold tracking-tight text-foreground/80 md:block hidden animate-fade-in">
            Competitive Programming Toolkit
          </h1>
        )}
      </div>

      {/* Middle: Search Box Placeholder (Raycast/Linear Style) */}
      <div className="flex-1 max-w-md mx-6">
        <button
          onClick={toggleCommandPalette}
          className="flex h-10 w-full items-center justify-between rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-sm text-muted-foreground hover:bg-accent/40 hover:text-foreground transition-all duration-200 cursor-pointer shadow-sm"
        >
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <span>Search utilities, docs, or settings...</span>
          </div>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-border/80 bg-muted px-1.5 font-mono text-[10px] font-bold text-muted-foreground shadow-sm">
            <Command className="h-2.5 w-2.5" />
            <span>K</span>
          </kbd>
        </button>
      </div>

      {/* Right side: Actions & Theme Toggles */}
      <div className="flex items-center gap-3">
        {/* Quick Reference Shortcut */}
        <Link
          href="/quick-reference"
          className="p-2 rounded-lg border border-border/40 bg-card/50 text-foreground/80 hover:text-foreground hover:bg-accent/40 transition-colors shadow-sm"
          title="Quick Reference Guide"
        >
          <HelpCircle className="h-5 w-5" />
        </Link>

        {/* GitHub Link */}
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg border border-border/40 bg-card/50 text-foreground/80 hover:text-foreground hover:bg-accent/40 transition-colors shadow-sm"
          title="View GitHub Repository"
        >
          <Github className="h-5 w-5" />
        </a>

        {/* Theme Toggler */}
        <ThemeToggle />

        {/* User Session Menu */}
        <AvatarMenu />
      </div>
    </header>
  );
}
