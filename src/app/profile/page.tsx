"use client";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { ProfileCard } from "@/features/auth/components/profile-card";
import { EmptyState } from "@/components/ui/feedback-states";
import { PageContainer, PageHeader } from "@/components/ui/containers";
import { User, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <PageContainer size="narrow">
      <PageHeader
        title="User Profile"
        description="Public credentials, coding handles, and biography info."
      />
      <div className="py-6">
        {user ? (
          <ProfileCard user={user} />
        ) : (
          <EmptyState
            title="Authentication Required"
            description="You are currently browsing as a guest. Sign in to view and edit your coder profile."
            icon={<User className="h-10 w-10 text-muted-foreground/50" />}
            actionLabel="Sign In"
            onAction={() => router.push("/login")}
          />
        )}
      </div>
    </PageContainer>
  );
}
