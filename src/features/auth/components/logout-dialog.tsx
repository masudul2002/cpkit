"use client";

import * as React from "react";
import { useAuth } from "../hooks/use-auth";
import { useToast } from "@/components/ui/toast";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export interface LogoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogoutDialog({ open, onOpenChange }: LogoutDialogProps) {
  const router = useRouter();
  const { logout, loading } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    await logout();
    onOpenChange(false);
    toast({
      title: "Logged Out",
      description: "You have been successfully signed out of your account.",
      variant: "info",
    });
    router.push("/");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Sign Out</DialogTitle>
        <DialogDescription>
          Are you sure you want to sign out? You will need to log back in to sync preferences and history.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleLogout} disabled={loading}>
          {loading ? "Signing Out..." : "Sign Out"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
