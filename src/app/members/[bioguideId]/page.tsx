import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DemoBanner } from "@/components/DemoBanner";
import { LegislationList } from "@/components/LegislationList";
import { PartyBadge } from "@/components/PartyBadge";
import { VoteRecordTable } from "@/components/VoteRecordTable";
import {
  fetchCosponsoredLegislation,
  fetchMember,
  fetchSponsoredLegislation,
  getCachedMemberVoteHistory,
  getCurrentChamber,
  CURRENT_CONGRESS,
} from "@/lib/congress-api";
import {
  DEMO_MEMBER_DETAILS,
  DEMO_SPONSORED,
  DEMO_VOTES,
  isDemoMode,
} from "@/lib/demo-data";
import { formatDistrict, formatMemberName, getMemberChamber } from "@/lib/member-utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ bioguideId: string }>;
}) {
  const { bioguideId } = await params;
  const member = isDemoMode()
    ? DEMO_MEMBER_DETAILS[bioguideId]
    : await fetchMember(bioguideId);

  if (!member) return { title: "Member not found" };

  return {
    title: formatMemberName(member),
    description: `Voting record and legislation for ${formatMemberName(member)} (${member.partyName}, ${member.state}).`,
  };
}

export default async function MemberDetailPage({
  params,
}: {
  params: Promise<{ bioguideId: string }>;
}) {
  const { bioguideId } = await params;

  let member;
  let sponsored;
  let cosponsored;
  let votes;

  if (isDemoMode()) {
    member = DEMO_MEMBER_DETAILS[bioguideId];
    if (!member) notFound();
    sponsored = DEMO_SPONSORED;
    cosponsored = DEMO_SPONSORED.slice(0, 2);
    votes = getMemberChamber(member) === "House" ? DEMO_VOTES : [];
  } else {
    member = await fetchMember(bioguideId);
    if (!member) notFound();

    [sponsored, cosponsored, votes] = await Promise.all([
      fetchSponsoredLegislation(bioguideId, 15),
      fetchCosponsoredLegislation(bioguideId, 15),
      getCurrentChamber(member) === "House"
        ? getCachedMemberVoteHistory(bioguideId)
        : Promise.resolve([]),
    ]);
  }

  const chamber = getMemberChamber(member);
  const imageUrl = member.depiction?.imageUrl;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {isDemoMode() && (
        <div className="mb-6">
          <DemoBanner />
        </div>
      )}

      <Link
        href="/members"
        className="text-sm font-medium text-[#1e3a5f] hover:underline"
      >
        ← Back to candidates
      </Link>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          {imageUrl && (
            <div className="relative h-36 w-28 shrink-0 overflow-hidden rounded-lg bg-slate-100">
              <Image
                src={imageUrl}
                alt={formatMemberName(member)}
                fill
                className="object-cover object-top"
                sizes="112px"
                unoptimized
              />
            </div>
          )}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-900">
                {formatMemberName(member)}
              </h1>
              <PartyBadge party={member.partyName} />
            </div>
            <p className="mt-2 text-lg text-slate-600">{formatDistrict(member)}</p>
            <p className="mt-1 text-sm text-slate-500">
              {chamber} · {CURRENT_CONGRESS}th Congress
              {member.birthYear ? ` · Born ${member.birthYear}` : ""}
            </p>

            {member.leadership?.item?.length ? (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Leadership
                </p>
                <ul className="mt-1 text-sm text-slate-700">
                  {member.leadership.item.map((role) => (
                    <li key={`${role.type}-${role.congress}`}>
                      {role.type}
                      {role.current ? " (current)" : ""}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              {member.officialWebsiteUrl && (
                <a
                  href={member.officialWebsiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#1e3a5f] hover:underline"
                >
                  Official website
                </a>
              )}
              {member.addressInformation?.phoneNumber && (
                <span className="text-slate-500">
                  {member.addressInformation.phoneNumber}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:w-56">
            <StatCard
              label="Sponsored"
              value={member.sponsoredLegislation?.count ?? sponsored.length}
            />
            <StatCard
              label="Cosponsored"
              value={member.cosponsoredLegislation?.count ?? cosponsored.length}
            />
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">Roll-call votes</h2>
        {chamber === "Senate" ? (
          <p className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
            Senate roll-call votes are not yet available through the Congress.gov
            API. Review sponsored and cosponsored legislation below, or visit{" "}
            <a
              href="https://www.senate.gov/legislative/votes_new.htm"
              className="font-medium text-[#1e3a5f] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Senate.gov
            </a>{" "}
            for official vote records.
          </p>
        ) : (
          <>
            <p className="mt-2 text-sm text-slate-500">
              Recent House votes in the {CURRENT_CONGRESS}th Congress where this
              member cast a recorded position.
            </p>
            <div className="mt-4">
              <VoteRecordTable votes={votes} />
            </div>
          </>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">Sponsored legislation</h2>
        <p className="mt-2 text-sm text-slate-500">
          Bills and resolutions this member introduced.
        </p>
        <div className="mt-4">
          <LegislationList
            items={sponsored}
            emptyMessage="No sponsored legislation found."
          />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">
          Cosponsored legislation
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Recent bills this member supported as a cosponsor.
        </p>
        <div className="mt-4">
          <LegislationList
            items={cosponsored}
            emptyMessage="No cosponsored legislation found."
          />
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-center">
      <p className="text-2xl font-bold text-slate-900">{value.toLocaleString()}</p>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
    </div>
  );
}
