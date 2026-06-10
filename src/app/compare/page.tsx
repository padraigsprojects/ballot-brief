import { CandidateCompare } from "@/components/CandidateCompare";
import { DemoBanner } from "@/components/DemoBanner";
import { CURRENT_CONGRESS, fetchMembersByCongress } from "@/lib/congress-api";
import { DEMO_MEMBERS, isDemoMode } from "@/lib/demo-data";
import type { MemberSummary } from "@/lib/types";

export const metadata = {
  title: "Compare candidates",
};

interface ComparePageProps {
  searchParams: Promise<{ ids?: string }>;
}

async function loadMembers(): Promise<MemberSummary[]> {
  if (isDemoMode()) return DEMO_MEMBERS;
  return fetchMembersByCongress(CURRENT_CONGRESS);
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const params = await searchParams;
  const members = await loadMembers();
  const initialIds = params.ids?.split(",").filter(Boolean) ?? [];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {isDemoMode() && (
        <div className="mb-6">
          <DemoBanner />
        </div>
      )}

      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#c9a227]">
          Side-by-side research
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Compare candidates
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Choose two current members to compare their office, party, locality,
          and links into their full voting and legislation records.
        </p>
      </div>

      <CandidateCompare members={members} initialIds={initialIds} />
    </main>
  );
}
