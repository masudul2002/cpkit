import { Trophy, Code2, Link2, ExternalLink } from "lucide-react";

export function Footer() {
  const platforms = [
    { name: "Codeforces", url: "https://codeforces.com" },
    { name: "AtCoder", url: "https://atcoder.jp" },
    { name: "LeetCode", url: "https://leetcode.com" },
    { name: "CodeChef", url: "https://codechef.com" },
  ];

  return (
    <footer className="mt-auto border-t border-border/45 bg-card/25 py-4 px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        {/* Left: Platform Indicators */}
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Codeforces API: Online
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            AtCoder Scraper: Ready
          </span>
        </div>

        {/* Middle: Links */}
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

        {/* Right: Version info */}
        <div>
          <span>CPKit v0.1.0 • Built for Performance</span>
        </div>
      </div>
    </footer>
  );
}
