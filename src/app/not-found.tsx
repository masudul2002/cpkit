"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-5 font-sans">
      <div className="p-4 rounded-full bg-primary/10 text-primary border border-primary/25 animate-pulse">
        <Compass className="h-10 w-10" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-black text-foreground">404 - Page Not Found</h3>
        <p className="text-xs text-muted-foreground max-w-sm">
          The algorithm route you are looking for does not exist or has been shifted.
        </p>
      </div>
      <Link href="/dashboard">
        <Button className="cursor-pointer gap-2">
          <Home className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
