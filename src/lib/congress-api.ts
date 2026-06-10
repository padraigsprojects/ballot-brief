import { unstable_cache } from "next/cache";
import type {
  BillDetail,
  HouseVoteSummary,
  LegislationItem,
  MemberDetail,
  MemberSummary,
  MemberVoteRecord,
} from "./types";

const BASE_URL = "https://api.congress.gov/v3";
const CURRENT_CONGRESS = 119;

function getApiKey(): string | undefined {
  return process.env.CONGRESS_API_KEY;
}

export function hasApiKey(): boolean {
  return Boolean(getApiKey());
}

class CongressApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "CongressApiError";
  }
}

async function congressFetch<T>(
  path: string,
  params: Record<string, string | number | boolean | undefined> = {},
): Promise<T> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new CongressApiError("CONGRESS_API_KEY is not configured");
  }

  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set("format", "json");
  url.searchParams.set("api_key", apiKey);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url.toString(), {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new CongressApiError(
      `Congress.gov API error: ${response.status} ${response.statusText}`,
      response.status,
    );
  }

  return response.json() as Promise<T>;
}

interface MembersListResponse {
  members?: MemberSummary[];
  pagination?: { count: number; next?: string };
}

interface MemberDetailResponse {
  member?: MemberDetail;
}

interface LegislationListResponse {
  sponsoredLegislation?: LegislationItem[];
  cosponsoredLegislation?: LegislationItem[];
  pagination?: { count: number; next?: string };
}

interface HouseVotesListResponse {
  houseRollCallVotes?: HouseVoteSummary[];
  pagination?: { count: number; next?: string };
}

interface HouseVoteMembersResponse {
  houseRollCallVoteMembers?: Array<{
    bioguideId: string;
    votePosition: string;
    firstName?: string;
    lastName?: string;
    party?: string;
    state?: string;
  }>;
}

interface BillDetailResponse {
  bill?: BillDetail;
}

export async function fetchCurrentMembers(): Promise<MemberSummary[]> {
  const data = await congressFetch<MembersListResponse>("/member", {
    currentMember: true,
    limit: 250,
  });
  return data.members ?? [];
}

export async function fetchMembersByCongress(
  congress: number = CURRENT_CONGRESS,
): Promise<MemberSummary[]> {
  const data = await congressFetch<MembersListResponse>(
    `/member/congress/${congress}`,
    { currentMember: true, limit: 250 },
  );
  return data.members ?? [];
}

export async function fetchMember(
  bioguideId: string,
): Promise<MemberDetail | null> {
  const data = await congressFetch<MemberDetailResponse>(
    `/member/${bioguideId}`,
  );
  return data.member ?? null;
}

export async function fetchSponsoredLegislation(
  bioguideId: string,
  limit = 20,
): Promise<LegislationItem[]> {
  const data = await congressFetch<LegislationListResponse>(
    `/member/${bioguideId}/sponsored-legislation`,
    { limit },
  );
  return data.sponsoredLegislation ?? [];
}

export async function fetchCosponsoredLegislation(
  bioguideId: string,
  limit = 20,
): Promise<LegislationItem[]> {
  const data = await congressFetch<LegislationListResponse>(
    `/member/${bioguideId}/cosponsored-legislation`,
    { limit },
  );
  return data.cosponsoredLegislation ?? [];
}

export async function fetchHouseVotes(
  congress: number,
  session: number,
  limit = 100,
): Promise<HouseVoteSummary[]> {
  const data = await congressFetch<HouseVotesListResponse>(
    `/house-vote/${congress}/${session}`,
    { limit },
  );
  return data.houseRollCallVotes ?? [];
}

export async function fetchBill(
  congress: number,
  billType: string,
  billNumber: number,
): Promise<BillDetail | null> {
  const data = await congressFetch<BillDetailResponse>(
    `/bill/${congress}/${billType.toLowerCase()}/${billNumber}`,
  );
  return data.bill ?? null;
}

async function fetchMemberPositionOnVote(
  congress: number,
  session: number,
  rollCallNumber: number,
  bioguideId: string,
): Promise<string | null> {
  const data = await congressFetch<HouseVoteMembersResponse>(
    `/house-vote/${congress}/${session}/${rollCallNumber}/members`,
  );
  const match = data.houseRollCallVoteMembers?.find(
    (m) => m.bioguideId === bioguideId,
  );
  return match?.votePosition ?? null;
}

async function buildMemberVoteHistory(
  bioguideId: string,
  congress: number,
  maxVotes: number,
): Promise<MemberVoteRecord[]> {
  const sessions = [1, 2];
  const allVotes: HouseVoteSummary[] = [];

  for (const session of sessions) {
    try {
      const votes = await fetchHouseVotes(congress, session, 100);
      allVotes.push(...votes);
    } catch {
      // Session may have no votes yet.
    }
  }

  allVotes.sort((a, b) => {
    const dateA = a.voteDate ?? "";
    const dateB = b.voteDate ?? "";
    return dateB.localeCompare(dateA);
  });

  const records: MemberVoteRecord[] = [];

  for (const vote of allVotes) {
    if (records.length >= maxVotes) break;

    const position = await fetchMemberPositionOnVote(
      vote.congress,
      vote.sessionNumber,
      vote.rollCallNumber,
      bioguideId,
    );

    if (position) {
      records.push({ vote, position });
    }
  }

  return records;
}

export function getCachedMemberVoteHistory(
  bioguideId: string,
  congress: number = CURRENT_CONGRESS,
  maxVotes = 40,
): Promise<MemberVoteRecord[]> {
  return unstable_cache(
    () => buildMemberVoteHistory(bioguideId, congress, maxVotes),
    [`member-votes-${bioguideId}-${congress}-${maxVotes}`],
    { revalidate: 7200 },
  )();
}

export function getCurrentChamber(member: MemberDetail): "House" | "Senate" | null {
  const terms = member.terms?.item;
  if (!terms?.length) return null;

  const current = [...terms]
    .reverse()
    .find((t) => !t.endYear || t.endYear >= new Date().getFullYear());

  if (!current?.chamber) return null;
  return current.chamber.includes("Senate") ? "Senate" : "House";
}

export { CURRENT_CONGRESS, CongressApiError };
