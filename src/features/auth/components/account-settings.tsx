"use client";

import * as React from "react";
import { User } from "../types";
import { useAuth } from "../hooks/use-auth";
import { useToast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";

export function AccountSettings({ user }: { user: User }) {
  const { toast } = useToast();
  const { updateProfile } = useAuth();
  const profile = user.profile;

  const [university, setUniversity] = React.useState(profile?.university || "");
  const [country, setCountry] = React.useState(profile?.country || "");
  const [codeforces, setCodeforces] = React.useState(profile?.codeforcesHandle || "");
  const [github, setGithub] = React.useState(profile?.githubUsername || "");
  const [language, setLanguage] = React.useState(profile?.preferredLanguage || "cpp");
  const [bio, setBio] = React.useState(profile?.bio || "");
  
  const [saving, setSaving] = React.useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    await new Promise((r) => setTimeout(r, 600));

    await updateProfile({
      university: university || null,
      country: country || null,
      codeforcesHandle: codeforces || null,
      githubUsername: github || null,
      preferredLanguage: language as any,
      bio: bio || null,
    });

    setSaving(false);
    toast({
      title: "Settings Updated",
      description: "Your CPKit user preferences have been saved successfully.",
      variant: "success",
    });
  };

  return (
    <Card className="max-w-2xl w-full mx-auto border-border/40 shadow-xs">
      <CardHeader className="pb-3 border-b border-border/10 mb-6">
        <CardTitle className="text-lg">Account & Preferences</CardTitle>
        <CardDescription>
          Customize your academic background and platform handles.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSave}>
        <CardContent className="space-y-6">
          {/* Section 1: Academic / Personal */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">University</label>
              <Input
                placeholder="University Name"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                disabled={saving}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">Country</label>
              <Input
                placeholder="Country Name"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                disabled={saving}
              />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">Bio</label>
              <Textarea
                placeholder="Write a short description about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={saving}
                rows={3}
              />
            </div>
          </div>

          <Divider label="Contest Preferences" />

          {/* Section 2: CP Specifics */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">Coding Language Preference</label>
              <Select value={language} onChange={(e) => setLanguage(e.target.value as any)} disabled={saving}>
                <option value="cpp">C++ (std::cpp20)</option>
                <option value="java">Java (OpenJDK 21)</option>
                <option value="python">Python (v3.11)</option>
                <option value="rust">Rust (std::2021)</option>
              </Select>
            </div>
          </div>

          <Divider label="Coding Platforms Integration" />

          {/* Section 3: Platform Handles */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">Codeforces Handle</label>
              <Input
                placeholder="e.g. tourist"
                value={codeforces}
                onChange={(e) => setCodeforces(e.target.value)}
                disabled={saving}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">GitHub Username</label>
              <Input
                placeholder="e.g. torvalds"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                disabled={saving}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-end border-t border-border/10 mt-6 pt-4">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving Changes..." : "Save Preferences"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
