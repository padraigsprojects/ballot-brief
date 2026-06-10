export type Chamber = "House" | "Senate";

export type Party = "Democratic" | "Republican" | "Independent" | string;

export type VotePosition =
  | "Yea"
  | "Nay"
  | "Not Voting"
  | "Present"
  | string;

export interface CongressPagination {
  count: number;
  next?: string;
  previous?: string;
}

export interface MemberTerm {
  chamber: string;
  congress?: number;
  startYear?: number;
  endYear?: number;
  stateCode?: string;
  stateName?: string;
  partyName?: string;
  partyCode?: string;
  district?: number;
  memberType?: string;
}

export interface MemberSummary {
  bioguideId: string;
  name: string;
  state: string;
  partyName: string;
  district?: number;
  depiction?: { imageUrl?: string };
  terms?: { item: MemberTerm[] };
  url?: string;
}

export interface MemberDetail extends MemberSummary {
  birthYear?: number;
  officialWebsiteUrl?: string;
  depiction?: { imageUrl?: string; attribution?: string };
  addressInformation?: {
    officeAddress?: string;
    phoneNumber?: string;
  };
  leadership?: { item: LeadershipRole[] };
  sponsoredLegislation?: { count: number; url: string };
  cosponsoredLegislation?: { count: number; url: string };
  terms?: { item: MemberTerm[] };
  currentMember?: boolean;
  firstName?: string;
  lastName?: string;
  directOrderName?: string;
  invertedOrderName?: string;
  honorificName?: string;
}

export interface LeadershipRole {
  type: string;
  congress?: number;
  current?: boolean;
}

export interface LegislationItem {
  congress: number;
  type: string;
  number: number;
  title: string;
  introducedDate?: string;
  latestAction?: {
    actionDate?: string;
    text?: string;
  };
  policyArea?: { name: string };
  url?: string;
}

export interface HouseVoteSummary {
  congress: number;
  sessionNumber: number;
  rollCallNumber: number;
  voteDate?: string;
  voteQuestion?: string;
  voteType?: string;
  result?: string;
  legislationNumber?: string;
  legislationType?: string;
  legislationUrl?: string;
  description?: string;
}

export interface MemberVoteRecord {
  vote: HouseVoteSummary;
  position: VotePosition;
}

export interface BillDetail {
  congress: number;
  type: string;
  number: number;
  title: string;
  introducedDate?: string;
  originChamber?: string;
  originChamberCode?: string;
  policyArea?: { name: string };
  latestAction?: {
    actionDate?: string;
    text?: string;
  };
  sponsors?: { item: BillSponsor[] };
  cosponsors?: { count: number; url?: string };
  summaries?: { count: number; url?: string };
  subjects?: { count: number; url?: string };
  url?: string;
}

export interface BillSponsor {
  bioguideId?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  party?: string;
  state?: string;
}

export interface MemberFilters {
  query?: string;
  chamber?: Chamber | "all";
  state?: string;
  party?: string;
}

export interface VoterProfile {
  displayName?: string;
  stateCode: string;
  houseDistrict?: number;
  zipCode?: string;
  city?: string;
  issuePriorities: string[];
}
