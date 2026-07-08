import { Info, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6">
      <div className="flex flex-col items-center text-center space-y-4 border border-border/45 bg-card/45 rounded-xl p-8 backdrop-blur-md shadow-sm">
        <div className="p-3 bg-primary/10 rounded-full text-primary">
          <Info className="h-6 w-6" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight">About CPKit</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          CPKit is an open-source, community-driven Competitive Programming Toolkit built for students and competitive programmers to speed up contest workflows and algorithm lookups.
        </p>
      </div>

      <div className="border border-border/45 bg-card/25 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-bold">Project Philosophy</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Inspired by raycast-like search interfaces and modern developer platforms like Notion and Vercel. We believe that tools for competitive programmers should not only be highly functional but also beautiful, minimal, and lightning-fast.
        </p>
        <div className="flex items-center gap-1.5 text-xs text-primary font-semibold">
          <span>Made with</span>
          <Heart className="h-3.5 w-3.5 fill-primary" />
          <span>for the Competitive Programming Community</span>
        </div>
      </div>
    </div>
  );
}
