import { DemoBanner } from "@/components/DemoBanner";
import { PersonalizedDashboard } from "@/components/PersonalizedDashboard";
import { CURRENT_CONGRESS, fetchMembersByCongress } from "@/lib/congress-api";
import { DEMO_MEMBERS, isDemoMode } from "@/lib/demo-data";
import type { MemberSummary } from "@/lib/types";

export const metadata = {
  title: "My races",
};

async function loadMembers(): Promise<MemberSummary[]> {
  if (isDemoMode()) return DEMO_MEMBERS;
  return fetchMembersByCongress(CURRENT_CONGRESS);
}

export default async function DashboardPage() {
  const members = await loadMembers();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {isDemoMode() && (
        <div className="mb-6">
          <DemoBanner />
        </div>
      )}
      <PersonalizedDashboard members={members} />
    </main>
  );
}
