"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/use-auth";
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";
import { Button } from "@/components/ui/button";
import { LogoutDialog } from "./logout-dialog";
import { User, Settings, Sparkles, LogOut, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Divider } from "@/components/ui/divider";

export function AvatarMenu() {
  const router = useRouter();
  const { user, checkSession } = useAuth();
  const [logoutOpen, setLogoutOpen] = React.useState(false);

  // Check for session token on mount
  React.useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Initial generator helper
  const getInitials = (name: string | null) => {
    if (!name) return "CP";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  if (!user) {
    return (
      <Link href="/login">
        <Button variant="outline" size="sm" className="cursor-pointer">
          Sign In
        </Button>
      </Link>
    );
  }

  return (
    <>
      <Dropdown
        trigger={
          <button className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-xs cursor-pointer select-none border border-border/10">
            {getInitials(user.name)}
          </button>
        }
        align="right"
      >
        {/* User Card inside Dropdown */}
        <div className="px-2.5 py-1.5 text-left space-y-0.5">
          <p className="text-xs font-bold text-foreground truncate">{user.name}</p>
          <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
        </div>

        <div className="h-[1px] bg-border/20 my-1.5" />

        <DropdownItem onClick={() => router.push("/profile")}>
          <User className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
          My Profile
        </DropdownItem>
        <DropdownItem onClick={() => router.push("/settings/account")}>
          <Settings className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
          Account Settings
        </DropdownItem>
        <DropdownItem onClick={() => router.push("/design-system")}>
          <Sparkles className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
          Design System
        </DropdownItem>

        <div className="h-[1px] bg-border/20 my-1.5" />

        <DropdownItem onClick={() => setLogoutOpen(true)} className="text-rose-500">
          <LogOut className="mr-2 h-3.5 w-3.5 text-rose-500" />
          Sign Out
        </DropdownItem>
      </Dropdown>

      {/* Logout Confirmation Dialog */}
      <LogoutDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
    </>
  );
}
