"use client";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { AccountSettings } from "@/features/auth/components/account-settings";
import { EmptyState } from "@/components/ui/feedback-states";
import { PageContainer, PageHeader } from "@/components/ui/containers";
import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AccountSettingsPage() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <PageContainer size="narrow">
      <PageHeader
        title="Settings"
        description="Manage your account preferences, university links, and platform sync."
      />
      <div className="py-6">
        {user ? (
          <AccountSettings user={user} />
        ) : (
          <EmptyState
            title="Authentication Required"
            description="You are currently browsing as a guest. Sign in to customize your language preferences and platform handles."
            icon={<Settings className="h-10 w-10 text-muted-foreground/50" />}
            actionLabel="Sign In"
            onAction={() => router.push("/login")}
          />
        )}
      </div>
    </PageContainer>
  );
}
