"use client";

import * as React from "react";
import { ExternalLink, Heart } from "lucide-react";
import { Logo } from "@/components/branding/Logo";

export function Footer() {
  const platforms = [
    { name: "Codeforces", url: "https://codeforces.com" },
    { name: "AtCoder", url: "https://atcoder.jp" },
    { name: "LeetCode", url: "https://leetcode.com" },
  ];

  return (
    <footer className="mt-auto border-t border-border/45 bg-card/25 py-6 px-6">
      <div className="flex flex-col gap-6 text-xs text-muted-foreground max-w-7xl mx-auto">
        
        {/* Top section: Brand, Links and Platforms */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-border/10 pb-4">
          <div className="flex items-center gap-3">
            <Logo className="h-5 w-5" />
            <span className="font-semibold text-foreground">v1.6.1</span>
            <span className="text-border/40">•</span>
            <a href="https://github.com/masudul2002/cpkit/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              MIT License
            </a>
            <span className="text-border/40">•</span>
            <a href="https://github.com/masudul2002/cpkit" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              GitHub
            </a>
          </div>

          <div className="flex items-center gap-4">
            {platforms.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-0.5 hover:text-foreground transition-colors"
              >
                <span>{p.name}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom section: Credits */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-muted-foreground/80">
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />
            <span>by</span>
            <span className="font-bold text-foreground">MD. Masudul Hasan</span>
          </div>
          <div>
            <span>Department of Computer Science & Engineering • Sunamganj Science and Technology University</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
