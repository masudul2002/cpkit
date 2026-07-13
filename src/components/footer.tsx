"use client";

import * as React from "react";
import { Heart, Github, ExternalLink } from "lucide-react";
import { Logo } from "@/components/branding/Logo";
import { VersionBadge } from "@/branding/version-badge";
import {
  GITHUB_REPO,
  LICENSE_NAME,
  LICENSE_URL,
  AUTHOR_NAME,
  AUTHOR_DEPT,
  AUTHOR_UNIV
} from "@/constants/branding";

export function Footer() {
  const quickLinks = [
    { name: "GitHub Repository", url: GITHUB_REPO, external: true },
    { name: "Documentation", url: "/docs", external: false },
    { name: "Project Roadmap", url: "/releases", external: false },
    { name: "Report a Bug", url: `${GITHUB_REPO}/issues/new`, external: true },
  ];

  return (
    <footer className="mt-auto border-t border-border/45 bg-card/25 py-8 px-6 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Top Segment: 3-Column Grid */}
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-12 border-b border-border/10 pb-8">
          
          {/* Left Column: Branding */}
          <div className="lg:col-span-4 flex flex-col items-start gap-3">
            <div className="flex items-center gap-2">
              <Logo showWordmark={true} />
              <VersionBadge variant="compact" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              Everything a Competitive Programmer Needs. A professional open-source toolkit.
            </p>
            <a
              href={LICENSE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              Licensed under {LICENSE_NAME}
            </a>
          </div>

          {/* Middle Column: Developer */}
          <div className="lg:col-span-5 flex flex-col items-start gap-2.5">
            <span className="text-xs font-bold text-foreground/80 tracking-wide uppercase">Developer</span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500 animate-pulse" />
              <span>by</span>
              <span className="font-semibold text-foreground">{AUTHOR_NAME}</span>
            </div>
            <div className="text-[11px] text-muted-foreground/75 leading-relaxed">
              <p>{AUTHOR_DEPT}</p>
              <p>{AUTHOR_UNIV}</p>
            </div>
          </div>

          {/* Right Column: Links */}
          <div className="lg:col-span-3 flex flex-col items-start gap-3">
            <span className="text-xs font-bold text-foreground/80 tracking-wide uppercase">Quick Links</span>
            <div className="flex flex-col gap-1.5 w-full">
              {quickLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <span>{link.name}</span>
                  {link.external && <ExternalLink className="h-3 w-3 opacity-60" />}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Segment: Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground/75">
          <span>&copy; {new Date().getFullYear()} CPKit. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
