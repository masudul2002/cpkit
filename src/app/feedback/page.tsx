"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { MessageSquare, Send, Sparkles, Bug, ExternalLink } from "lucide-react";

export default function FeedbackPage() {
  const { toast } = useToast();
  const [type, setType] = React.useState<"bug" | "feature" | "general">("feature");
  const [title, setTitle] = React.useState("");
  const [desc, setDesc] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !desc) {
      toast({
        title: "Missing Fields",
        description: "Please specify both a title and description comments.",
        variant: "error",
      });
      return;
    }
    toast({
      title: "Feedback Logged",
      description: "Thank you! Your feedback will help improve CPKit.",
      variant: "success",
    });
    setTitle("");
    setDesc("");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 text-left font-sans pb-16">
      <div className="flex items-center gap-4 bg-card/65 border border-border/40 p-5 rounded-2xl">
        <div className="p-3 bg-primary/10 text-primary border border-primary/20 rounded-xl">
          <MessageSquare className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-lg font-black text-foreground">Feedback Portal</h2>
          <p className="text-xs text-muted-foreground">Report bugs or submit new features requests.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="border-border/40 bg-card/65">
            <CardHeader className="pb-3 border-b border-border/10">
              <CardTitle className="text-sm font-bold text-foreground">Submit a Ticket</CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block">Ticket Category</span>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={type === "bug" ? "primary" : "outline"}
                      onClick={() => setType("bug")}
                      className="w-full cursor-pointer h-8 text-xs"
                    >
                      <Bug className="h-3.5 w-3.5 mr-1.5" />
                      Bug Report
                    </Button>
                    <Button
                      type="button"
                      variant={type === "feature" ? "primary" : "outline"}
                      onClick={() => setType("feature")}
                      className="w-full cursor-pointer h-8 text-xs"
                    >
                      <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                      Feature Proposal
                    </Button>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block">Summary Title</span>
                  <Input
                    placeholder="Brief outline..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block">Details & Context</span>
                  <textarea
                    rows={5}
                    placeholder="Detail steps to replicate or suggestions..."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="w-full bg-background/50 border border-border/20 rounded-xl p-3 text-xs text-foreground font-mono focus:outline-hidden focus:border-primary"
                  />
                </div>

                <Button type="submit" size="sm" className="w-full cursor-pointer gap-1.5 h-9 justify-center">
                  <Send className="h-4 w-4" />
                  Submit Feedback
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border/40 bg-card/65 text-left">
            <CardHeader className="pb-3 border-b border-border/10">
              <CardTitle className="text-sm font-bold text-foreground">GitHub Tracker</CardTitle>
            </CardHeader>
            <CardContent className="p-5 text-xs text-muted-foreground space-y-3">
              <p>CPKit is actively developed on GitHub. You can view existing issue logs or report there directly.</p>
              <a
                href="https://github.com/masudul2002/cpkit/issues"
                target="_blank"
                rel="noreferrer"
                className="w-full"
              >
                <Button size="sm" variant="outline" className="w-full cursor-pointer gap-1.5 h-8 text-xs justify-center">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Go to Issues
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
