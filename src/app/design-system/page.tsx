"use client";

import * as React from "react";
import { PageContainer, PageHeader, SectionContainer, ToolContainer, ToolPanel } from "@/components/ui/containers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, StatCard } from "@/components/ui/card";
import { Badge, Chip } from "@/components/ui/badge";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";
import { Spinner, Skeleton, Progress } from "@/components/ui/loading-states";
import { Alert, EmptyState, ErrorState } from "@/components/ui/feedback-states";
import { useToast } from "@/components/ui/toast";
import { Divider } from "@/components/ui/divider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Sparkles, Check, Flame, Trophy, Info, Settings, Code, Layers } from "lucide-react";

export default function DesignSystemShowcase() {
  const { toast } = useToast();
  
  // State variables for interactive demo components
  const [activeTab, setActiveTab] = React.useState("basics");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [switchChecked, setSwitchChecked] = React.useState(true);
  const [checkboxChecked, setCheckboxChecked] = React.useState(false);
  const [selectValue, setSelectValue] = React.useState("cpp20");
  const [progressVal, setProgressVal] = React.useState(65);
  
  // Chip state list
  const [chips, setChips] = React.useState([
    { id: "1", label: "Greedy", variant: "primary" as const },
    { id: "2", label: "Strings", variant: "success" as const },
    { id: "3", label: "Geometry", variant: "danger" as const },
  ]);

  const removeChip = (id: string) => {
    setChips((prev) => prev.filter((c) => c.id !== id));
    toast({
      title: "Tag Removed",
      description: "Successfully cleared category filter.",
      variant: "info",
    });
  };

  const handleFireToast = (variant: "default" | "success" | "warning" | "error" | "info") => {
    toast({
      title: `${variant.toUpperCase()} Notification`,
      description: "This is a reactive toast notification fired from the design system hook.",
      variant: variant === "error" ? "error" : variant,
    });
  };

  return (
    <PageContainer className="pb-16">
      <PageHeader
        title="CPKit Design System"
        description="A beautiful, interactive showcase of CPKit's reusable UI library. All items support Light/Dark mode, standard spacing, and keyboard accessibility."
        actions={
          <Button onClick={() => setDialogOpen(true)} variant="primary" className="cursor-pointer">
            <Sparkles className="mr-2 h-4 w-4" />
            Open Demo Dialog
          </Button>
        }
      />

      {/* Main Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap w-full md:w-auto h-auto p-1 bg-muted/20">
          <TabsTrigger value="basics">Basics & Buttons</TabsTrigger>
          <TabsTrigger value="forms">Forms & Toggles</TabsTrigger>
          <TabsTrigger value="layouts">Layouts & Cards</TabsTrigger>
          <TabsTrigger value="feedback">Feedback & States</TabsTrigger>
          <TabsTrigger value="overlays">Overlays & Dialogs</TabsTrigger>
        </TabsList>

        {/* 1. BASICS & BUTTONS */}
        <TabsContent value="basics" className="space-y-8">
          <SectionContainer title="Buttons" description="Standard buttons in various configurations, shapes, and color variables.">
            <div className="flex flex-wrap gap-4 items-center p-6 border rounded-xl bg-card/20">
              <Button variant="primary">Primary Accent</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline Border</Button>
              <Button variant="ghost">Ghost Trigger</Button>
              <Button variant="danger">Danger Action</Button>
            </div>
          </SectionContainer>

          <SectionContainer title="Button Sizes" description="Sizes ranging from compact small buttons to full icon-only triggers.">
            <div className="flex flex-wrap gap-4 items-center p-6 border rounded-xl bg-card/20">
              <Button size="sm">Small Action</Button>
              <Button size="md">Medium Default</Button>
              <Button size="lg">Large Size</Button>
              <Button size="icon" variant="outline">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </SectionContainer>

          <SectionContainer title="Badges & Tags" description="Used for categorization, difficulties, and status indications.">
            <div className="flex flex-col gap-4 p-6 border rounded-xl bg-card/20">
              <div className="flex flex-wrap gap-2">
                <Badge variant="primary">Primary</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="danger">Danger</Badge>
                <Badge variant="info">Info</Badge>
              </div>
              <Divider label="Dismissible Chips" />
              <div className="flex flex-wrap gap-2">
                {chips.map((c) => (
                  <Chip key={c.id} variant={c.variant} onRemove={() => removeChip(c.id)}>
                    {c.label}
                  </Chip>
                ))}
                {chips.length === 0 && (
                  <span className="text-xs text-muted-foreground">All tags cleared. Refresh the page to reload them.</span>
                )}
              </div>
            </div>
          </SectionContainer>
        </TabsContent>

        {/* 2. FORMS & TOGGLES */}
        <TabsContent value="forms" className="space-y-8">
          <SectionContainer title="Input Controls" description="Interactive input formats for textboxes, search panels, and code areas.">
            <div className="grid gap-6 md:grid-cols-2 p-6 border rounded-xl bg-card/20">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80">Search Box</label>
                <Input placeholder="Search templates..." icon={<Search className="h-4 w-4 text-muted-foreground" />} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80">Number Field</label>
                <Input type="number" defaultValue="42" placeholder="Enter integer..." />
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80">Textarea Block</label>
                <Textarea placeholder="Paste custom inputs or code boilerplate here..." rows={4} />
              </div>
            </div>
          </SectionContainer>

          <SectionContainer title="Selection Dropdowns & Toggles" description="Switch switches, checkbox triggers, and select components.">
            <div className="grid gap-6 md:grid-cols-3 p-6 border rounded-xl bg-card/20">
              <div className="flex items-center gap-3">
                <Switch checked={switchChecked} onCheckedChange={setSwitchChecked} />
                <span className="text-sm font-medium">Switch Toggle: {switchChecked ? "On" : "Off"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox checked={checkboxChecked} onCheckedChange={setCheckboxChecked} />
                <span className="text-sm font-medium">Checkbox: {checkboxChecked ? "Checked" : "Unchecked"}</span>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80">Native Select</label>
                <Select value={selectValue} onChange={(e) => setSelectValue(e.target.value)}>
                  <option value="cpp17">C++17 (GCC 9.2)</option>
                  <option value="cpp20">C++20 (GCC 13.2)</option>
                  <option value="python">Python 3.11</option>
                  <option value="java">Java 21</option>
                </Select>
              </div>
            </div>
          </SectionContainer>
        </TabsContent>

        {/* 3. LAYOUTS & CARDS */}
        <TabsContent value="layouts" className="space-y-8">
          <SectionContainer title="Stat Cards" description="Display data metrics with positive/negative trend lines and indicators.">
            <div className="grid gap-6 sm:grid-cols-3">
              <StatCard
                title="Codeforces Rating"
                value="1824"
                description="Expert"
                icon={<Trophy className="h-4 w-4 text-amber-500" />}
                trend={{ value: "+145 this month", positive: true }}
              />
              <StatCard
                title="Submissions"
                value="4,821"
                description="Total solutions compiled"
                icon={<Code className="h-4 w-4 text-primary" />}
                trend={{ value: "96.4% success", positive: true }}
              />
              <StatCard
                title="Contest Rank"
                value="#142"
                description="Codeforces Round 954"
                icon={<Flame className="h-4 w-4 text-rose-500" />}
                trend={{ value: "-45 positions", positive: false }}
              />
            </div>
          </SectionContainer>

          <SectionContainer title="Feature Cards" description="Display tools or specific layout cards with headers and footers.">
            <ToolContainer>
              <ToolPanel span={8}>
                <Card glass>
                  <CardHeader>
                    <CardTitle>Glassmorphism Editor Panel</CardTitle>
                    <CardDescription>A card using backdrop-filter blur parameters for a premium look.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Use this card structure to build interactive tools. It enforces uniform spacing scales across card headers, content areas, and footers.
                    </p>
                    <div className="p-3 rounded-lg border border-border bg-card/60 font-mono text-xs text-foreground">
                      g++ -O3 solution.cpp -o solution
                    </div>
                  </CardContent>
                  <CardFooter className="justify-between">
                    <span className="text-[10px] text-muted-foreground">Compiler: GCC 13.2</span>
                    <Button size="sm" variant="outline">Run Test</Button>
                  </CardFooter>
                </Card>
              </ToolPanel>
              <ToolPanel span={4}>
                <Card>
                  <CardHeader>
                    <CardTitle>Sidebar Controls</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase">Configure Panel</span>
                      <Progress value={progressVal} showLabel variant="primary" />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => setProgressVal(prev => Math.max(prev - 10, 0))}>Dec</Button>
                      <Button size="sm" variant="secondary" onClick={() => setProgressVal(prev => Math.min(prev + 10, 100))}>Inc</Button>
                    </div>
                  </CardContent>
                </Card>
              </ToolPanel>
            </ToolContainer>
          </SectionContainer>
        </TabsContent>

        {/* 4. FEEDBACK & STATES */}
        <TabsContent value="feedback" className="space-y-8">
          <SectionContainer title="Toast Trigger System" description="Fire different variations of global toast notifications.">
            <div className="flex flex-wrap gap-4 p-6 border rounded-xl bg-card/20">
              <Button onClick={() => handleFireToast("default")} variant="secondary">Default Toast</Button>
              <Button onClick={() => handleFireToast("success")} variant="outline" className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10 border-emerald-500/20">Success Toast</Button>
              <Button onClick={() => handleFireToast("warning")} variant="outline" className="text-amber-500 hover:text-amber-600 hover:bg-amber-500/10 border-amber-500/20">Warning Toast</Button>
              <Button onClick={() => handleFireToast("error")} variant="outline" className="text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 border-rose-500/20">Error Toast</Button>
              <Button onClick={() => handleFireToast("info")} variant="outline" className="text-blue-500 hover:text-blue-600 hover:bg-blue-500/10 border-blue-500/20">Info Toast</Button>
            </div>
          </SectionContainer>

          <SectionContainer title="Status Banners (Alerts)" description="Display critical or supportive feedback lines to the programmer.">
            <div className="space-y-4">
              <Alert variant="info" title="Boilerplate Template Active">
                Your preloaded template macros (like Fast I/O, `long long` definitions) are automatically applied to the generator output.
              </Alert>
              <Alert variant="warning" title="Memory Limit Warning">
                The current Segment Tree array size exceeds 128MB. Adjust your size constraints to prevent Memory Limit Exceeded (MLE).
              </Alert>
              <Alert variant="danger" title="Compilation Error">
                g++ error: 'usePathname' was not declared in this scope. Check imports in layout.tsx.
              </Alert>
            </div>
          </SectionContainer>

          <SectionContainer title="Placeholder States" description="Empty layout states and screen loading skeleton screens.">
            <div className="grid gap-6 md:grid-cols-2">
              <EmptyState
                title="No Stress Tests Active"
                description="Stress tests compare a brute-force solution with your optimized solution to isolate corner cases."
                actionLabel="Create Stress Test"
                onAction={() => handleFireToast("success")}
              />
              <div className="border rounded-xl p-6 bg-card space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-muted-foreground">Skeleton Loading Placeholder</span>
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
                <div className="flex gap-2">
                  <Spinner size="sm" />
                  <span className="text-xs text-muted-foreground">Computing optimal tree layout...</span>
                </div>
              </div>
            </div>
          </SectionContainer>
        </TabsContent>

        {/* 5. OVERLAYS & DIALOGS */}
        <TabsContent value="overlays" className="space-y-8">
          <SectionContainer title="Modal Trigger" description="Triggers a dialog overlay containing action items.">
            <div className="p-6 border rounded-xl bg-card/20 text-center">
              <Button onClick={() => setDialogOpen(true)}>Open Dialog Box</Button>
            </div>
          </SectionContainer>

          <SectionContainer title="Custom Dropdown Overlay" description="A custom dropdown trigger displaying menu actions.">
            <div className="p-6 border rounded-xl bg-card/20 text-center">
              <Dropdown
                trigger={
                  <Button variant="outline">
                    More Actions
                    <Search className="ml-2 h-4 w-4" />
                  </Button>
                }
              >
                <DropdownItem onClick={() => handleFireToast("info")}>Profile Details</DropdownItem>
                <DropdownItem onClick={() => handleFireToast("info")}>Keyboard Shortcuts</DropdownItem>
                <DropdownItem active onClick={() => handleFireToast("success")}>Toggle Fast Mode</DropdownItem>
                <DropdownItem onClick={() => handleFireToast("error")} className="text-rose-500">Sign Out</DropdownItem>
              </Dropdown>
            </div>
          </SectionContainer>

          <SectionContainer title="Scroll Area Wrapper" description="Vertical scroll viewport container with custom inline styling.">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Contest Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea maxHeight="120px" className="border rounded-lg p-3 bg-muted/10 font-mono text-xs">
                  <div className="space-y-1">
                    <p className="text-emerald-500">[16:04:12] Test Case 1: PASSED (12ms)</p>
                    <p className="text-emerald-500">[16:04:12] Test Case 2: PASSED (14ms)</p>
                    <p className="text-rose-500">[16:04:13] Test Case 3: WRONG ANSWER on line 42</p>
                    <p className="text-muted-foreground">[16:04:13] Expected: 'Yes', Found: 'No'</p>
                    <p className="text-muted-foreground">[16:04:14] Retrying test generator with seed 4821...</p>
                    <p className="text-emerald-500">[16:04:15] Test Case 4: PASSED (8ms)</p>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </SectionContainer>
        </TabsContent>
      </Tabs>

      {/* Interactive Modal Dialog Container */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogHeader>
          <DialogTitle>Stress Test Configuration</DialogTitle>
          <DialogDescription>
            Configure constraints, select test generator files, and start stress testing.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80">Number of iterations</label>
            <Input type="number" defaultValue="100" placeholder="Iterations (e.g. 100)" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80">Test Generator script</label>
            <Select>
              <option>random_array_gen.py</option>
              <option>tree_gen.py</option>
              <option>graph_gen.py</option>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setDialogOpen(false);
              toast({
                title: "Stress Testing Started",
                description: "Running 100 iterations of your solution...",
                variant: "success",
              });
            }}
          >
            Start Testing
          </Button>
        </DialogFooter>
      </Dialog>
    </PageContainer>
  );
}
