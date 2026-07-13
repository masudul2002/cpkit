"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutStore } from "@/lib/store";
import { ThemeToggle } from "@/components/theme-toggle";
import { AvatarMenu } from "@/features/auth/components/avatar-menu";
import { Search, Github, HelpCircle, Command, Menu } from "lucide-react";
import { Logo } from "@/components/branding/Logo";
import { LogoBadge } from "@/components/branding/LogoBadge";
import { useEffect, useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const { toggleCommandPalette, toggleSidebar } = useLayoutStore();
  const [osShortcut, setOsShortcut] = useState("Ctrl + K");

  useEffect(() => {
    // Determine OS for proper shortcut label
    if (typeof window !== "undefined") {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      setOsShortcut(isMac ? "Cmd + K" : "Ctrl + K");
    }
  }, []);

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-border/45 bg-background/60 px-4 md:px-6 backdrop-blur-md">
      {/* Left side: branding/logo */}
      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground lg:hidden cursor-pointer"
          aria-label="Toggle navigation drawer"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <Logo />
        </Link>
        <LogoBadge />
      </div>

      {/* Middle: Search Box Placeholder (Raycast/Linear Style) */}
      <div className="flex-1 max-w-md mx-2 md:mx-6">
        <button
          onClick={toggleCommandPalette}
          className="flex h-10 w-full items-center justify-between rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-sm text-muted-foreground hover:bg-accent/40 hover:text-foreground transition-all duration-200 cursor-pointer shadow-sm"
        >
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="hidden sm:inline">Search utilities, docs...</span>
            <span className="inline sm:hidden">Search...</span>
          </div>
          <kbd className="pointer-events-none hidden md:inline-flex h-5 select-none items-center gap-0.5 rounded border border-border/80 bg-muted px-1.5 font-mono text-[10px] font-bold text-muted-foreground shadow-sm">
            <Command className="h-2.5 w-2.5" />
            <span>K</span>
          </kbd>
        </button>
      </div>

      {/* Right side: Actions & Theme Toggles */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Quick Reference Shortcut */}
        <Link
          href="/reference"
          className="hidden sm:inline-flex p-2 rounded-lg border border-border/40 bg-card/50 text-foreground/80 hover:text-foreground hover:bg-accent/40 transition-colors shadow-sm"
          title="Quick Reference Guide"
        >
          <HelpCircle className="h-5 w-5" />
        </Link>

        {/* GitHub Link */}
        <a
          href="https://github.com/masudul2002/cpkit"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex p-2 rounded-lg border border-border/40 bg-card/50 text-foreground/80 hover:text-foreground hover:bg-accent/40 transition-colors shadow-sm"
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
