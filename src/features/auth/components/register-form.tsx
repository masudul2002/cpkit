"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/use-auth";
import { validateEmail, validatePassword, validateUsername, validateConfirmPassword } from "../validation/auth-schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/loading-states";
import Link from "next/link";
import { Mail, Lock, User as UserIcon } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const { register, loading } = useAuth();

  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  
  const [errors, setErrors] = React.useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const userErr = validateUsername(username);
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    const confirmErr = validateConfirmPassword(password, confirmPassword);

    if (userErr || emailErr || passErr || confirmErr) {
      setErrors({
        username: userErr || undefined,
        email: emailErr || undefined,
        password: passErr || undefined,
        confirmPassword: confirmErr || undefined,
      });
      return;
    }

    const success = await register(email, username, "MD. Masudul Hasan");
    if (success) {
      router.push("/dashboard");
    } else {
      setErrors({ general: "Registration failed. Please try again." });
    }
  };

  return (
    <Card className="max-w-md w-full mx-auto shadow-lg border-border/40">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
        <CardDescription>
          Sign up to sync competitive programming history, code templates, and favorites.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg">
              {errors.general}
            </div>
          )}

          {/* Username field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80">Username</label>
            <Input
              placeholder="coder_profile"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              icon={<UserIcon className="h-4 w-4 text-muted-foreground" />}
              className={errors.username ? "border-rose-500/50 focus-visible:ring-rose-500" : ""}
            />
            {errors.username && <p className="text-[10px] text-rose-500 font-semibold">{errors.username}</p>}
          </div>

          {/* Email field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80">Email Address</label>
            <Input
              type="email"
              placeholder="name@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              icon={<Mail className="h-4 w-4 text-muted-foreground" />}
              className={errors.email ? "border-rose-500/50 focus-visible:ring-rose-500" : ""}
            />
            {errors.email && <p className="text-[10px] text-rose-500 font-semibold">{errors.email}</p>}
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              icon={<Lock className="h-4 w-4 text-muted-foreground" />}
              className={errors.password ? "border-rose-500/50 focus-visible:ring-rose-500" : ""}
            />
            {errors.password && <p className="text-[10px] text-rose-500 font-semibold">{errors.password}</p>}
          </div>

          {/* Confirm Password field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80">Confirm Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              icon={<Lock className="h-4 w-4 text-muted-foreground" />}
              className={errors.confirmPassword ? "border-rose-500/50 focus-visible:ring-rose-500" : ""}
            />
            {errors.confirmPassword && (
              <p className="text-[10px] text-rose-500 font-semibold">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full justify-center" disabled={loading}>
            {loading ? <Spinner size="sm" variant="white" className="mr-2" /> : null}
            Sign Up
          </Button>

          <div className="text-center text-xs text-muted-foreground pt-2">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-bold">
              Sign In
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
