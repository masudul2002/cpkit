"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { Settings as SettingsIcon, ShieldAlert, Sparkles, Sliders, RotateCcw, Share2 } from "lucide-react";

export default function SettingsPage() {
  const { toast } = useToast();
  const [theme, setTheme] = React.useState("dark");
  const [accentColor, setAccentColor] = React.useState("blue");
  const [fontSize, setFontSize] = React.useState("14");
  const [compactMode, setCompactMode] = React.useState(false);
  const [animations, setAnimations] = React.useState(true);
  const [language, setLanguage] = React.useState("cpp");

  React.useEffect(() => {
    const savedTheme = localStorage.getItem("cpkit_theme") || "dark";
    const savedAccent = localStorage.getItem("cpkit_accent") || "blue";
    const savedFont = localStorage.getItem("cpkit_font_size") || "14";
    const savedCompact = localStorage.getItem("cpkit_compact") === "true";
    const savedAnimations = localStorage.getItem("cpkit_animations") !== "false";
    const savedLang = localStorage.getItem("cpkit_language") || "cpp";

    setTheme(savedTheme);
    setAccentColor(savedAccent);
    setFontSize(savedFont);
    setCompactMode(savedCompact);
    setAnimations(savedAnimations);
    setLanguage(savedLang);
  }, []);

  const handleSave = () => {
    localStorage.setItem("cpkit_theme", theme);
    localStorage.setItem("cpkit_accent", accentColor);
    localStorage.setItem("cpkit_font_size", fontSize);
    localStorage.setItem("cpkit_compact", compactMode ? "true" : "false");
    localStorage.setItem("cpkit_animations", animations ? "true" : "false");
    localStorage.setItem("cpkit_language", language);

    toast({
      title: "Settings Saved",
      description: "Preferences updated in local storage.",
      variant: "success",
    });
  };

  const handleReset = () => {
    localStorage.clear();
    toast({
      title: "Settings Reset",
      description: "All configuration preferences cleared.",
      variant: "warning",
    });
    setTimeout(() => window.location.reload(), 800);
  };

  const handleExport = () => {
    const data = JSON.stringify(localStorage);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cpkit_settings_export.json";
    a.click();
    toast({
      title: "Export Success",
      description: "Configuration files downloaded.",
      variant: "success",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 text-left font-sans pb-16">
      <div className="flex items-center gap-4 bg-card/65 border border-border/40 p-5 rounded-2xl">
        <div className="p-3 bg-primary/10 text-primary border border-primary/20 rounded-xl">
          <SettingsIcon className="h-6 w-6 animate-spin" />
        </div>
        <div>
          <h2 className="text-lg font-black text-foreground">Global Settings</h2>
          <p className="text-xs text-muted-foreground">Adjust CPKit appearance and developer defaults.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/40 bg-card/65">
          <CardHeader className="pb-3 border-b border-border/10">
            <CardTitle className="text-sm font-bold text-foreground">Appearance Options</CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Theme Mode</span>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="bg-background text-xs border border-border/20 rounded-lg p-1.5 text-foreground w-full focus:outline-hidden"
              >
                <option value="dark">Dark Onyx Theme</option>
                <option value="light">Light Paper Theme</option>
              </select>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Accent Colors</span>
              <select
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="bg-background text-xs border border-border/20 rounded-lg p-1.5 text-foreground w-full focus:outline-hidden"
              >
                <option value="blue">Blue Cobalt</option>
                <option value="emerald">Emerald Meadow</option>
                <option value="violet">Violet Quartz</option>
                <option value="amber">Amber Sunrise</option>
              </select>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Font Size Dimensions</span>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="bg-background text-xs border border-border/20 rounded-lg p-1.5 text-foreground w-full focus:outline-hidden"
              >
                <option value="12">12px - Small</option>
                <option value="14">14px - Default</option>
                <option value="16">16px - Medium</option>
                <option value="18">18px - Large</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/65">
          <CardHeader className="pb-3 border-b border-border/10">
            <CardTitle className="text-sm font-bold text-foreground">Contest Defaults</CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Code Language</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-background text-xs border border-border/20 rounded-lg p-1.5 text-foreground w-full focus:outline-hidden"
              >
                <option value="cpp">C++ (G++20)</option>
                <option value="python">Python 3</option>
                <option value="java">Java 17</option>
                <option value="rust">Rust 1.75</option>
              </select>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Layout Spacing</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={compactMode ? "primary" : "secondary"}
                  onClick={() => setCompactMode(true)}
                  className="w-full cursor-pointer"
                >
                  Compact
                </Button>
                <Button
                  size="sm"
                  variant={!compactMode ? "primary" : "secondary"}
                  onClick={() => setCompactMode(false)}
                  className="w-full cursor-pointer"
                >
                  Standard
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Transitions</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={animations ? "primary" : "secondary"}
                  onClick={() => setAnimations(true)}
                  className="w-full cursor-pointer"
                >
                  Enabled
                </Button>
                <Button
                  size="sm"
                  variant={!animations ? "primary" : "secondary"}
                  onClick={() => setAnimations(false)}
                  className="w-full cursor-pointer"
                >
                  Disabled
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Backup & Save Actions */}
      <Card className="border-border/40 bg-card/65">
        <CardContent className="p-5 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex items-center gap-3">
            <Sliders className="h-5 w-5 text-muted-foreground" />
            <div className="space-y-0.5 text-left">
              <span className="text-xs font-bold text-foreground">Save Configuration</span>
              <p className="text-[10px] text-muted-foreground">Persist adjustments immediately to browser parameters.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} className="cursor-pointer gap-1.5">
              <Sparkles className="h-4 w-4" />
              Save Preference
            </Button>
            <Button size="sm" variant="outline" onClick={handleExport} className="cursor-pointer gap-1.5">
              <Share2 className="h-4 w-4" />
              Backup Settings
            </Button>
            <Button size="sm" variant="danger" onClick={handleReset} className="cursor-pointer gap-1.5">
              <RotateCcw className="h-4 w-4" />
              Reset All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
