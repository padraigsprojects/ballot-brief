"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MemberCard } from "@/components/MemberCard";
import {
  filterMembersForVoterProfile,
  getMemberChamber,
  getStateName,
} from "@/lib/member-utils";
import { readStoredProfile } from "@/lib/profile-storage";
import type { MemberSummary, VoterProfile } from "@/lib/types";

export function PersonalizedDashboard({
  members,
}: {
  members: MemberSummary[];
}) {
  const [profile] = useState<VoterProfile | null>(() => readStoredProfile());

  const localMembers = useMemo(() => {
    if (!profile) return [];
    return filterMembersForVoterProfile(members, profile);
  }, [members, profile]);

  const senators = localMembers.filter(
    (member) => getMemberChamber(member) === "Senate",
  );
  const houseMembers = localMembers.filter(
    (member) => getMemberChamber(member) === "House",
  );

  if (!profile) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">
          Start with your locality
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          You can still browse every candidate, but a saved profile lets Ballot
          Brief open directly on the races that matter to you: your senators,
          your House district, and future state/local races.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/profile"
            className="rounded-lg bg-[#1e3a5f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#162d4a]"
          >
            Create profile
          </Link>
          <Link
            href="/members"
            className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Browse all candidates
          </Link>
        </div>
      </div>
    );
  }

  const compareIds = localMembers
    .slice(0, 2)
    .map((member) => member.bioguideId)
    .join(",");

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#c9a227]">
              Your ballot brief
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              {profile.displayName
                ? `${profile.displayName}'s races`
                : "Your local races"}
            </h1>
            <p className="mt-2 text-slate-600">
              Showing federal candidates for {getStateName(profile.stateCode)}
              {profile.houseDistrict
                ? `, U.S. House District ${profile.houseDistrict}`
                : ""}.
            </p>
          </div>
          <Link
            href="/profile"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Edit profile
          </Link>
        </div>

        {profile.issuePriorities.length ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {profile.issuePriorities.map((issue) => (
              <span
                key={issue}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
              >
                {issue}
              </span>
            ))}
          </div>
        ) : null}
      </section>

      <section>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Federal races</h2>
            <p className="mt-1 text-sm text-slate-500">
              Your two U.S. Senate seats plus your House district when provided.
            </p>
          </div>
          {compareIds && (
            <Link
              href={`/compare?ids=${compareIds}`}
              className="hidden rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#162d4a] sm:inline-flex"
            >
              Compare
            </Link>
          )}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...senators, ...houseMembers].map((member) => (
            <MemberCard key={member.bioguideId} member={member} />
          ))}
        </div>

        {!localMembers.length && (
          <p className="mt-4 rounded-lg border border-dashed border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">
            No federal members matched this profile. Try clearing the House
            district or choosing a different state.
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          State and local races
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          This MVP is ready for local-election data but does not ingest it yet.
          The next step is connecting an address-to-ballot API so the app can
          add governor, state legislature, county, city, school board, judges,
          and ballot measures for your exact address.
        </p>
        <Link
          href="/local-races"
          className="mt-4 inline-flex rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          View local-race plan
        </Link>
      </section>
    </div>
  );
}
