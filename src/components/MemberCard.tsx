import Link from "next/link";
import type { MemberSummary } from "@/lib/types";
import {
  formatDistrict,
  formatMemberName,
  getMemberChamber,
} from "@/lib/member-utils";
import { PartyBadge } from "./PartyBadge";

export function MemberCard({ member }: { member: MemberSummary }) {
  const chamber = getMemberChamber(member);

  return (
    <Link
      href={`/members/${member.bioguideId}`}
      className="group block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#1e3a5f]/30 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 group-hover:text-[#1e3a5f]">
            {formatMemberName(member)}
          </h3>
          <p className="mt-1 text-sm text-slate-500">{formatDistrict(member)}</p>
        </div>
        <PartyBadge party={member.partyName} />
      </div>
      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-400">
        {chamber === "Unknown" ? "Congress" : chamber}
      </p>
    </Link>
  );
}
