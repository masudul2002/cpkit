"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useLayoutStore } from "@/lib/store";
import { sidebarItems } from "@/constants/navigation";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  Sun,
  Moon,
  Laptop,
  Command,
  ArrowRight,
  Sparkles
} from "lucide-react";

export function CommandPalette() {
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const { commandPaletteOpen, setCommandPaletteOpen, toggleCommandPalette } =
    useLayoutStore();

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut listener for Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleCommandPalette();
      }
      if (e.key === "Escape" && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [commandPaletteOpen, toggleCommandPalette, setCommandPaletteOpen]);

  // Focus input when opened
  useEffect(() => {
    if (commandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery("");
      setSelectedIndex(0);
    }
  }, [commandPaletteOpen]);

  // Close command palette on route change
  useEffect(() => {
    setCommandPaletteOpen(false);
  }, [pathname, setCommandPaletteOpen]);

  // Build command list
  const themeItems = [
    { title: "Switch theme to Light", action: () => setTheme("light"), icon: Sun, type: "action" },
    { title: "Switch theme to Dark", action: () => setTheme("dark"), icon: Moon, type: "action" },
    { title: "Switch theme to System", action: () => setTheme("system"), icon: Laptop, type: "action" },
  ];

  const allItems = [
    ...sidebarItems.flatMap((item) => {
      const items = [{
        title: `Go to ${item.title}`,
        action: () => router.push(item.href),
        icon: item.icon,
        type: "navigation",
      }];
      if (item.children) {
        items.push(...item.children.map((sub) => ({
          title: `Go to ${item.title} > ${sub.title}`,
          action: () => router.push(sub.href),
          icon: sub.icon,
          type: "navigation",
        })));
      }
      return items;
    }),
    {
      title: "Go to Design System Showcase",
      action: () => router.push("/design-system"),
      icon: Sparkles,
      type: "navigation",
    },
    ...themeItems,
  ];

  // Filter items based on search query
  const filteredItems = allItems.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  // Handle keyboard navigation inside the palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!commandPaletteOpen || filteredItems.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        filteredItems[selectedIndex].action();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [commandPaletteOpen, filteredItems, selectedIndex]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm cursor-pointer"
            onClick={() => setCommandPaletteOpen(false)}
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="relative w-full max-w-xl overflow-hidden rounded-xl border border-border/50 bg-card shadow-2xl mx-4"
          >
            {/* Search Input Box */}
            <div className="flex items-center border-b border-border/45 px-3 py-3.5">
              <Search className="mr-2.5 h-5 w-5 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Type a command or search..."
                className="flex h-10 w-full rounded-md bg-transparent text-sm outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-border/80 bg-muted px-1.5 font-mono text-[10px] font-bold text-muted-foreground">
                ESC
              </kbd>
            </div>

            {/* Commands List View */}
            <div
              ref={listRef}
              className="max-h-[300px] overflow-y-auto p-2 space-y-0.5"
            >
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => {
                  const Icon = item.icon;
                  const isSelected = index === selectedIndex;

                  return (
                    <button
                      key={index}
                      onClick={() => item.action()}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-3 rounded-lg text-left text-sm transition-all duration-100 cursor-pointer",
                        isSelected
                          ? "bg-primary text-primary-foreground font-medium shadow-md shadow-primary/10"
                          : "text-foreground hover:bg-accent/40"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={cn("h-4.5 w-4.5", isSelected ? "text-primary-foreground" : "text-muted-foreground")} />
                        <span>{item.title}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {item.type === "action" && (
                          <span className={cn("text-[10px] px-1.5 py-0.5 rounded border uppercase font-mono tracking-widest", isSelected ? "border-primary-foreground/30 text-primary-foreground" : "border-border text-muted-foreground bg-muted/40")}>
                            Action
                          </span>
                        )}
                        {isSelected && <ArrowRight className="h-4 w-4" />}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="py-6 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
                  <Sparkles className="h-6 w-6 text-muted-foreground/50 animate-bounce" />
                  <span>No results found. Try searching for something else.</span>
                </div>
              )}
            </div>

            {/* Command Palette Footer */}
            <div className="flex items-center justify-between border-t border-border/45 px-4 py-3 bg-muted/20 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 border rounded bg-card shadow-sm font-bold">↑↓</kbd> Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 border rounded bg-card shadow-sm font-bold">Enter</kbd> Select
                </span>
              </div>
              <div>
                <span>Press <kbd className="px-1 border rounded bg-card shadow-sm font-bold font-mono text-[9px]">Cmd+K</kbd> to toggle</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
