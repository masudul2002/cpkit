"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { Info, HelpCircle, Heart, Star, Sparkles, Send, Bug, MessageSquare, Terminal } from "lucide-react";

import { LogoIcon } from "@/components/branding/LogoIcon";

export default function AboutPage() {
  const { toast } = useToast();
  const [feedbackType, setFeedbackType] = React.useState<"bug" | "feature" | "general">("feature");
  const [feedbackTitle, setFeedbackTitle] = React.useState("");
  const [feedbackDesc, setFeedbackDesc] = React.useState("");

  const submitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackTitle || !feedbackDesc) {
      toast({
        title: "Missing Fields",
        description: "Title and description comments are required.",
        variant: "error",
      });
      return;
    }
    toast({
      title: "Feedback Submitted",
      description: "Thank you! Your feedback log has been submitted.",
      variant: "success",
    });
    setFeedbackTitle("");
    setFeedbackDesc("");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 text-left font-sans pb-16">
      {/* Vision Header Card */}
      <div className="flex items-center gap-4 bg-card/65 border border-border/40 p-5 rounded-2xl">
        <div className="p-3 bg-primary/10 text-primary border border-primary/20 rounded-xl">
          <LogoIcon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-black text-foreground">About CPKit Platform</h2>
          <p className="text-xs text-muted-foreground">Vision milestones, Help Center, and Feedback Portal.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Left Column (8 cols): Info + FAQ */}
        <div className="md:col-span-8 space-y-6">
          <Card className="border-border/40 bg-card/65">
            <CardHeader className="pb-3 border-b border-border/10">
              <CardTitle className="text-sm font-bold text-foreground">Our Philosophy</CardTitle>
            </CardHeader>
            <CardContent className="p-5 text-xs text-muted-foreground leading-relaxed space-y-3">
              <p>
                Inspired by high-speed desktop utilities like Raycast, VS Code and online editors like Notion.
                We believe that tools for competitive programmers should be fast, highly modular, and support offline-first local data state configurations.
              </p>
              <div className="flex items-center gap-1 font-semibold text-primary">
                <span>Designed with</span>
                <Heart className="h-3 w-3 fill-primary text-primary" />
                <span>for the Global Competitive Programming Community</span>
              </div>
            </CardContent>
          </Card>

          {/* FAQ / Help Center */}
          <Card className="border-border/40 bg-card/65">
            <CardHeader className="pb-3 border-b border-border/10">
              <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-primary" />
                Help Center & FAQs
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <h4 className="font-bold text-foreground">How does offline storage work?</h4>
                <p className="text-muted-foreground leading-relaxed">
                  CPKit persists all contest scratchpads, problem codes, bookmarks, and preferences locally inside the browser Local Storage. No cloud accounts are required.
                </p>
              </div>
              <div className="space-y-1.5 border-t border-border/5 pt-3">
                <h4 className="font-bold text-foreground">How do I access Keyboard Shortcuts?</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Pressing <kbd className="px-1 bg-muted rounded border border-border/30">Ctrl + B</kbd> triggers distraction-free Focus Mode. <kbd className="px-1 bg-muted rounded border border-border/30">Ctrl + S</kbd> forces an local storage saves dump update.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (4 cols): Feedback Form */}
        <div className="md:col-span-4 space-y-6">
          <Card className="border-border/40 bg-card/65">
            <CardHeader className="pb-3 border-b border-border/10">
              <CardTitle className="text-sm font-bold text-foreground">Feedback Portal</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <form onSubmit={submitFeedback} className="space-y-3.5 text-xs text-left">
                {/* Feedback selector */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block">Report Category</span>
                  <div className="flex gap-1.5">
                    <Button
                      type="button"
                      size="sm"
                      variant={feedbackType === "bug" ? "primary" : "outline"}
                      onClick={() => setFeedbackType("bug")}
                      className="w-full cursor-pointer h-7 text-[10px] p-0"
                    >
                      <Bug className="h-3 w-3 mr-1" />
                      Bug
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={feedbackType === "feature" ? "primary" : "outline"}
                      onClick={() => setFeedbackType("feature")}
                      className="w-full cursor-pointer h-7 text-[10px] p-0"
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      Feature
                    </Button>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block">Issue Title</span>
                  <Input
                    placeholder="e.g. Broken links on Sieve pages..."
                    value={feedbackTitle}
                    onChange={(e) => setFeedbackTitle(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block">Description comments</span>
                  <textarea
                    rows={4}
                    placeholder="Add steps to replicate or details..."
                    value={feedbackDesc}
                    onChange={(e) => setFeedbackDesc(e.target.value)}
                    className="w-full bg-background/50 border border-border/20 rounded-xl p-2.5 text-xs text-foreground font-mono focus:outline-hidden focus:border-primary"
                  />
                </div>

                <Button type="submit" size="sm" className="w-full cursor-pointer gap-1.5 h-8">
                  <Send className="h-3.5 w-3.5" />
                  Submit Ticket
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
