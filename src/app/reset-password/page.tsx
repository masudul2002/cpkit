"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { Lock } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password !== confirmPassword) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);

    toast({
      title: "Password Updated",
      description: "Your password has been successfully reset. Please sign in.",
      variant: "success",
    });
    router.push("/login");
  };

  return (
    <div className="flex-1 flex items-center justify-center py-10 md:py-16">
      <Card className="max-w-md w-full mx-auto border-border/40 shadow-xs">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-bold">New Password</CardTitle>
          <CardDescription>
            Enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">New Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="h-4 w-4 text-muted-foreground" />}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">Confirm New Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={<Lock className="h-4 w-4 text-muted-foreground" />}
                required
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full justify-center" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
