"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { Mail } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);

    toast({
      title: "Password Reset Sent",
      description: "Check your email for instructions to reset your password.",
      variant: "success",
    });
  };

  return (
    <div className="flex-1 flex items-center justify-center py-10 md:py-16">
      <Card className="max-w-md w-full mx-auto border-border/40 shadow-xs">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>
            Enter your email and we will send you a reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">Email Address</label>
              <Input
                type="email"
                placeholder="name@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="h-4 w-4 text-muted-foreground" />}
                required
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full justify-center" disabled={loading}>
              {loading ? "Sending link..." : "Send Reset Link"}
            </Button>
            <div className="text-center text-xs pt-2">
              <Link href="/login" className="text-primary hover:underline font-bold">
                Back to Sign In
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
