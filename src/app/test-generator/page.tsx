import { PageContainer } from "@/components/ui/containers";
import { GenDashboard } from "@/features/test-generator/components/gen-dashboard";

export default function TestGeneratorPage() {
  return (
    <PageContainer size="wide">
      <GenDashboard />
    </PageContainer>
  );
}
