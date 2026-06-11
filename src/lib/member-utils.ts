import type {
  MemberDetail,
  MemberFilters,
  MemberSummary,
  VoterProfile,
} from "./types";

export const STATE_CODES: Record<string, string> = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
  DC: "District of Columbia",
};

export function getStateName(codeOrName: string): string {
  return STATE_CODES[codeOrName.toUpperCase()] ?? codeOrName;
}

export function getStateCode(stateName: string): string | undefined {
  const normalized = stateName.trim().toLowerCase();
  return Object.entries(STATE_CODES).find(
    ([code, name]) =>
      code.toLowerCase() === normalized || name.toLowerCase() === normalized,
  )?.[0];
}

export function getMemberChamber(
  member: MemberSummary | MemberDetail,
): "House" | "Senate" | "Unknown" {
  const terms = getMemberTerms(member);
  if (!terms?.length) return "Unknown";

  const latest = terms[terms.length - 1];
  if (latest.chamber?.includes("Senate")) return "Senate";
  if (latest.chamber?.includes("House")) return "House";
  return "Unknown";
}

export function getMemberTerms(
  member: MemberSummary | MemberDetail,
) {
  if (Array.isArray(member.terms)) return member.terms;
  return member.terms?.item ?? [];
}

export function formatMemberName(member: MemberSummary | MemberDetail): string {
  if ("directOrderName" in member && member.directOrderName) {
    return member.directOrderName;
  }
  const parts = member.name.split(", ");
  if (parts.length === 2) {
    return `${parts[1]} ${parts[0]}`;
  }
  return member.name;
}

export function formatDistrict(member: MemberSummary | MemberDetail): string {
  const chamber = getMemberChamber(member);
  if (chamber === "Senate") return `${member.state} (Senate)`;
  if (member.district === 0) return `${member.state} (At-large)`;
  if (member.district) return `${member.state} District ${member.district}`;
  return member.state;
}

export function getPartyName(member: MemberSummary | MemberDetail): string {
  const latestTerm = getMemberTerms(member).at(-1);
  const latestPartyHistory = member.partyHistory?.at(-1);

  return (
    member.partyName ??
    latestPartyHistory?.partyName ??
    latestTerm?.partyName ??
    "Party unavailable"
  );
}

export function filterMembers(
  members: MemberSummary[],
  filters: MemberFilters,
): MemberSummary[] {
  const query = filters.query?.trim().toLowerCase();

  return members.filter((member) => {
    const chamber = getMemberChamber(member);

    if (filters.chamber && filters.chamber !== "all") {
      if (filters.chamber === "House" && chamber !== "House") return false;
      if (filters.chamber === "Senate" && chamber !== "Senate") return false;
    }

    if (filters.state && filters.state !== "all") {
      const stateName = getStateName(filters.state);
      if (member.state !== stateName && member.state !== filters.state) {
        return false;
      }
    }

    if (filters.party && filters.party !== "all") {
      if (
        !getPartyName(member)
          .toLowerCase()
          .includes(filters.party.toLowerCase())
      ) {
        return false;
      }
    }

    if (query) {
      const name = formatMemberName(member).toLowerCase();
      const state = member.state.toLowerCase();
      if (!name.includes(query) && !state.includes(query)) {
        return false;
      }
    }

    return true;
  });
}

export function memberMatchesVoterProfile(
  member: MemberSummary | MemberDetail,
  profile: VoterProfile,
): boolean {
  const profileStateName = getStateName(profile.stateCode);
  const memberStateCode = getStateCode(member.state);

  if (
    member.state !== profileStateName &&
    memberStateCode !== profile.stateCode.toUpperCase()
  ) {
    return false;
  }

  const chamber = getMemberChamber(member);
  if (chamber === "Senate") return true;
  if (chamber !== "House") return false;

  if (!profile.houseDistrict) return true;
  return member.district === profile.houseDistrict;
}

export function filterMembersForVoterProfile(
  members: MemberSummary[],
  profile: VoterProfile,
): MemberSummary[] {
  return members.filter((member) => memberMatchesVoterProfile(member, profile));
}

export function getStateOptions(): { code: string; name: string }[] {
  return Object.entries(STATE_CODES)
    .map(([code, name]) => ({ code, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function billPath(
  congress?: number | null,
  type?: string | null,
  number?: number | null,
): string | null {
  if (!congress || !type || !number || Number.isNaN(number)) return null;
  return `/bills/${congress}/${type.toLowerCase()}/${number}`;
}

export function votePositionColor(position: string): string {
  switch (position) {
    case "Yea":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "Nay":
      return "bg-rose-100 text-rose-800 border-rose-200";
    case "Present":
      return "bg-amber-100 text-amber-800 border-amber-200";
    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
}

export function partyColor(party?: string): string {
  if (!party) {
    return "bg-slate-100 text-slate-700 border-slate-200";
  }

  const lower = party.toLowerCase();
  if (lower.includes("democrat")) {
    return "bg-blue-100 text-blue-900 border-blue-200";
  }
  if (lower.includes("republican")) {
    return "bg-red-100 text-red-900 border-red-200";
  }
  return "bg-slate-100 text-slate-700 border-slate-200";
}
