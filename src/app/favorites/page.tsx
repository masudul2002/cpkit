import { PageContainer, PageHeader } from "@/components/ui/containers";
import { EmptyState } from "@/components/ui/feedback-states";
import { Star } from "lucide-react";

export default function FavoritesPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Favorite Tools"
        description="Pin frequently used competitive programming templates and stress test modules here."
      />
      <div className="py-12">
        <EmptyState
          title="No Pinned Favorites"
          description="Click the star icons next to tools in the search palette or dashboard list to add them here."
          icon={<Star className="h-10 w-10 text-amber-500/40" />}
        />
      </div>
    </PageContainer>
  );
}
