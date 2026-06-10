import { Suspense } from "react";
import Link from "next/link";
import { DemoBanner } from "@/components/DemoBanner";
import { MemberCard } from "@/components/MemberCard";
import { MemberFilters } from "@/components/MemberFilters";
import { MemberSearch } from "@/components/MemberSearch";
import {
  fetchMembersByCongress,
  CURRENT_CONGRESS,
} from "@/lib/congress-api";
import { DEMO_MEMBERS, isDemoMode } from "@/lib/demo-data";
import { filterMembers } from "@/lib/member-utils";
import type { MemberSummary } from "@/lib/types";

export const metadata = {
  title: "Candidates",
};

interface MembersPageProps {
  searchParams: Promise<{
    q?: string;
    chamber?: string;
    state?: string;
    party?: string;
  }>;
}

async function loadMembers(): Promise<MemberSummary[]> {
  if (isDemoMode()) {
    return DEMO_MEMBERS;
  }
  return fetchMembersByCongress(CURRENT_CONGRESS);
}

export default async function MembersPage({ searchParams }: MembersPageProps) {
  const params = await searchParams;
  const members = await loadMembers();

  const filtered = filterMembers(members, {
    query: params.q,
    chamber:
      params.chamber === "House" || params.chamber === "Senate"
        ? params.chamber
        : "all",
    state: params.state,
    party: params.party,
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {isDemoMode() && (
        <div className="mb-6">
          <DemoBanner />
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Congressional candidates
        </h1>
        <p className="mt-2 text-slate-600">
          Current members of the {CURRENT_CONGRESS}th Congress. Select a member
          to view their record.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/profile"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white"
          >
            Save my locality
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#162d4a]"
          >
            View my races
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        <Suspense fallback={null}>
          <MemberSearch defaultQuery={params.q ?? ""} />
        </Suspense>
        <Suspense fallback={null}>
          <MemberFilters />
        </Suspense>
      </div>

      <p className="mt-6 text-sm text-slate-500">
        Showing {filtered.length} of {members.length} members
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((member) => (
          <MemberCard key={member.bioguideId} member={member} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-8 rounded-lg border border-dashed border-slate-200 bg-white px-4 py-12 text-center text-slate-500">
          No members match your filters. Try broadening your search.
        </p>
      )}
    </main>
  );
}
