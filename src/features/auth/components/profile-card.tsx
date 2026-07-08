"use client";

import * as React from "react";
import { User } from "../types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Github, Trophy, BookOpen, User as UserIcon, Mail } from "lucide-react";

export function ProfileCard({ user }: { user: User }) {
  const profile = user.profile;

  if (!profile) {
    return (
      <Card className="max-w-md w-full mx-auto text-center p-6 border-dashed">
        <CardContent className="space-y-4 pt-6">
          <UserIcon className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="font-bold">No profile loaded</h3>
          <p className="text-xs text-muted-foreground">Sign in to review your profile cards.</p>
        </CardContent>
      </Card>
    );
  }

  // Helper initials creator
  const getInitials = (name: string | null) => {
    if (!name) return "CP";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <Card className="max-w-xl w-full mx-auto shadow-md border-border/40 overflow-hidden">
      {/* Visual Header */}
      <div className="h-24 bg-gradient-to-r from-primary/20 to-violet-500/20 relative" />
      
      <CardContent className="relative px-6 pb-6 pt-0 space-y-6">
        {/* Avatar and Primary Details */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-10 gap-4 border-b border-border/10 pb-4">
          <div className="flex items-end gap-3.5">
            <div className="h-20 w-20 rounded-full border-4 border-card bg-primary text-primary-foreground flex items-center justify-center font-extrabold text-2xl shadow-md select-none">
              {getInitials(user.name)}
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-foreground">{user.name}</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                {user.email}
              </p>
            </div>
          </div>
          <Badge variant="primary" className="text-[10px] self-start sm:self-end uppercase tracking-wider">
            {user.role}
          </Badge>
        </div>

        {/* Bio Section */}
        {profile.bio && (
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Bio</span>
            <p className="text-xs text-foreground/80 leading-relaxed bg-muted/20 p-3 rounded-lg border">
              {profile.bio}
            </p>
          </div>
        )}

        {/* Profile Settings (University, Language, etc.) */}
        <div className="grid gap-4 sm:grid-cols-2 text-xs">
          {profile.university && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">University</span>
              <span className="font-medium text-foreground">{profile.university}</span>
            </div>
          )}
          {profile.country && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Country</span>
              <span className="font-medium text-foreground">{profile.country}</span>
            </div>
          )}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Language Preference</span>
            <span className="font-semibold text-primary uppercase">{profile.preferredLanguage}</span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Visual Theme</span>
            <span className="font-medium text-foreground capitalize">{profile.preferredTheme}</span>
          </div>
        </div>

        {/* Algorithmic Platforms / Handles */}
        <div className="space-y-3">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Coding Platforms</span>
          <div className="grid gap-2 sm:grid-cols-2">
            {profile.codeforcesHandle && (
              <a
                href={`https://codeforces.com/profile/${profile.codeforcesHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-lg border border-border/40 bg-card/45 hover:bg-accent/40 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  <span className="text-xs font-semibold text-foreground/90">Codeforces</span>
                </div>
                <span className="text-xs text-muted-foreground font-mono">{profile.codeforcesHandle}</span>
              </a>
            )}

            {profile.githubUsername && (
              <a
                href={`https://github.com/${profile.githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-lg border border-border/40 bg-card/45 hover:bg-accent/40 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4 text-foreground/80" />
                  <span className="text-xs font-semibold text-foreground/90">GitHub</span>
                </div>
                <span className="text-xs text-muted-foreground font-mono">{profile.githubUsername}</span>
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
