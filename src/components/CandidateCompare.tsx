"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  formatDistrict,
  formatMemberName,
  getMemberChamber,
} from "@/lib/member-utils";
import { readStoredProfile } from "@/lib/profile-storage";
import type { MemberSummary, VoterProfile } from "@/lib/types";
import { PartyBadge } from "./PartyBadge";

export function CandidateCompare({
  members,
  initialIds,
}: {
  members: MemberSummary[];
  initialIds: string[];
}) {
  const [firstId, setFirstId] = useState(initialIds[0] ?? members[0]?.bioguideId);
  const [secondId, setSecondId] = useState(
    initialIds[1] ?? members[1]?.bioguideId,
  );
  const [profile] = useState<VoterProfile | null>(() => readStoredProfile());

  const sortedMembers = useMemo(
    () =>
      [...members].sort((a, b) =>
        formatMemberName(a).localeCompare(formatMemberName(b)),
      ),
    [members],
  );

  const first = members.find((member) => member.bioguideId === firstId);
  const second = members.find((member) => member.bioguideId === secondId);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-2">
        <CandidateSelect
          label="First candidate"
          value={firstId ?? ""}
          members={sortedMembers}
          onChange={setFirstId}
        />
        <CandidateSelect
          label="Second candidate"
          value={secondId ?? ""}
          members={sortedMembers}
          onChange={setSecondId}
        />
      </div>

      {profile?.issuePriorities.length ? (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-semibold text-slate-900">
            Compare them against your priorities
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.issuePriorities.map((issue) => (
              <span
                key={issue}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
              >
                {issue}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <ComparisonCard member={first} />
        <ComparisonCard member={second} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
        <p className="font-semibold text-slate-900">What to compare next</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Open each profile and compare recent votes on your top issues.</li>
          <li>Review sponsored bills to see where each candidate spends effort.</li>
          <li>
            Check cosponsorships for patterns of coalition-building or party
            alignment.
          </li>
        </ul>
      </div>
    </div>
  );
}

function CandidateSelect({
  label,
  value,
  members,
  onChange,
}: {
  label: string;
  value: string;
  members: MemberSummary[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900"
      >
        {members.map((member) => (
          <option key={member.bioguideId} value={member.bioguideId}>
            {formatMemberName(member)} · {formatDistrict(member)}
          </option>
        ))}
      </select>
    </label>
  );
}

function ComparisonCard({ member }: { member?: MemberSummary }) {
  if (!member) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-slate-500">
        Choose a candidate to compare.
      </div>
    );
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {formatMemberName(member)}
          </h2>
          <p className="mt-1 text-slate-600">{formatDistrict(member)}</p>
        </div>
        <PartyBadge party={member.partyName} />
      </div>

      <dl className="mt-6 space-y-4 text-sm">
        <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
          <dt className="font-medium text-slate-500">Chamber</dt>
          <dd className="text-right font-semibold text-slate-900">
            {getMemberChamber(member)}
          </dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
          <dt className="font-medium text-slate-500">State</dt>
          <dd className="text-right font-semibold text-slate-900">
            {member.state}
          </dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
          <dt className="font-medium text-slate-500">District</dt>
          <dd className="text-right font-semibold text-slate-900">
            {member.district ?? "Statewide"}
          </dd>
        </div>
      </dl>

      <Link
        href={`/members/${member.bioguideId}`}
        className="mt-6 inline-flex rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#162d4a]"
      >
        View full record
      </Link>
    </article>
  );
}
