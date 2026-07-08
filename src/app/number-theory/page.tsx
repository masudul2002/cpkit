import { PageContainer } from "@/components/ui/containers";
import { NtDashboard } from "@/features/number-theory/components/nt-dashboard";

export default function NumberTheoryPage() {
  return (
    <PageContainer size="wide">
      <NtDashboard />
    </PageContainer>
  );
}
