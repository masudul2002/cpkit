"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { HelpCircle, Keyboard, BookOpen, Bug, Sparkles } from "lucide-react";
import Link from "next/link";

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 text-left font-sans pb-16">
      <div className="flex items-center gap-4 bg-card/65 border border-border/40 p-5 rounded-2xl">
        <div className="p-3 bg-primary/10 text-primary border border-primary/20 rounded-xl">
          <HelpCircle className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-lg font-black text-foreground">Help Center</h2>
          <p className="text-xs text-muted-foreground">Keyboard shortcuts, platform guides, and FAQs.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Shortcuts */}
        <Card className="border-border/40 bg-card/65">
          <CardHeader className="pb-3 border-b border-border/10">
            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
              <Keyboard className="h-4 w-4 text-primary" />
              Keyboard Shortcuts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-3.5 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-sans">Global Search</span>
              <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border/30">Ctrl + K</kbd>
            </div>
            <div className="flex items-center justify-between border-t border-border/5 pt-3">
              <span className="text-muted-foreground font-sans">Toggle Sidebar</span>
              <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border/30">Ctrl + B</kbd>
            </div>
            <div className="flex items-center justify-between border-t border-border/5 pt-3">
              <span className="text-muted-foreground font-sans">Save Code notes</span>
              <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border/30">Ctrl + S</kbd>
            </div>
            <div className="flex items-center justify-between border-t border-border/5 pt-3">
              <span className="text-muted-foreground font-sans">Switch Dark/Light Theme</span>
              <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border/30">Ctrl + J</kbd>
            </div>
          </CardContent>
        </Card>

        {/* FAQs */}
        <Card className="border-border/40 bg-card/65">
          <CardHeader className="pb-3 border-b border-border/10">
            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4 text-xs">
            <div className="space-y-1">
              <h4 className="font-bold text-foreground">Is CPKit offline friendly?</h4>
              <p className="text-muted-foreground leading-relaxed">
                Yes! All algorithms checklists, test stress generators, templates, and workspace local problems notes operate entirely on the client side without needing database sync APIs.
              </p>
            </div>
            <div className="space-y-1 border-t border-border/5 pt-3">
              <h4 className="font-bold text-foreground">How do I submit issues?</h4>
              <p className="text-muted-foreground leading-relaxed">
                You can navigate to the <Link href="/feedback" className="text-primary hover:underline font-semibold">Feedback page</Link> to log bug tickets or feature templates requests.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
