import type {
  BillDetail,
  LegislationItem,
  MemberDetail,
  MemberSummary,
  MemberVoteRecord,
} from "./types";

export const DEMO_MEMBERS: MemberSummary[] = [
  {
    bioguideId: "P000197",
    name: "Pelosi, Nancy",
    state: "California",
    partyName: "Democratic",
    district: 11,
    terms: {
      item: [
        {
          chamber: "House of Representatives",
          congress: 119,
          stateCode: "CA",
          stateName: "California",
          partyName: "Democratic",
          district: 11,
        },
      ],
    },
  },
  {
    bioguideId: "M001157",
    name: "McCaul, Michael T.",
    state: "Texas",
    partyName: "Republican",
    district: 10,
    terms: {
      item: [
        {
          chamber: "House of Representatives",
          congress: 119,
          stateCode: "TX",
          stateName: "Texas",
          partyName: "Republican",
          district: 10,
        },
      ],
    },
  },
  {
    bioguideId: "S000148",
    name: "Schumer, Charles E.",
    state: "New York",
    partyName: "Democratic",
    terms: {
      item: [
        {
          chamber: "Senate",
          congress: 119,
          stateCode: "NY",
          stateName: "New York",
          partyName: "Democratic",
        },
      ],
    },
  },
  {
    bioguideId: "T000476",
    name: "Tillis, Thom",
    state: "North Carolina",
    partyName: "Republican",
    terms: {
      item: [
        {
          chamber: "Senate",
          congress: 119,
          stateCode: "NC",
          stateName: "North Carolina",
          partyName: "Republican",
        },
      ],
    },
  },
  {
    bioguideId: "W000805",
    name: "Warner, Mark R.",
    state: "Virginia",
    partyName: "Democratic",
    terms: {
      item: [
        {
          chamber: "Senate",
          congress: 119,
          stateCode: "VA",
          stateName: "Virginia",
          partyName: "Democratic",
        },
      ],
    },
  },
  {
    bioguideId: "K000384",
    name: "Kaine, Tim",
    state: "Virginia",
    partyName: "Democratic",
    terms: {
      item: [
        {
          chamber: "Senate",
          congress: 119,
          stateCode: "VA",
          stateName: "Virginia",
          partyName: "Democratic",
        },
      ],
    },
  },
  {
    bioguideId: "B001307",
    name: "Beyer, Donald S., Jr.",
    state: "Virginia",
    partyName: "Democratic",
    district: 8,
    terms: {
      item: [
        {
          chamber: "House of Representatives",
          congress: 119,
          stateCode: "VA",
          stateName: "Virginia",
          partyName: "Democratic",
          district: 8,
        },
      ],
    },
  },
];

export const DEMO_MEMBER_DETAILS: Record<string, MemberDetail> = {
  P000197: {
    ...DEMO_MEMBERS[0],
    currentMember: true,
    directOrderName: "Nancy Pelosi",
    invertedOrderName: "Pelosi, Nancy",
    honorificName: "Ms.",
    birthYear: 1940,
    officialWebsiteUrl: "https://pelosi.house.gov",
    sponsoredLegislation: { count: 245, url: "" },
    cosponsoredLegislation: { count: 4120, url: "" },
    leadership: {
      item: [{ type: "Speaker of the House", congress: 116, current: false }],
    },
    addressInformation: {
      officeAddress: "1236 Longworth House Office Building, Washington, DC 20515",
      phoneNumber: "(202) 225-4965",
    },
  },
  M001157: {
    ...DEMO_MEMBERS[1],
    currentMember: true,
    directOrderName: "Michael T. McCaul",
    invertedOrderName: "McCaul, Michael T.",
    honorificName: "Mr.",
    birthYear: 1962,
    officialWebsiteUrl: "https://mccaul.house.gov",
    sponsoredLegislation: { count: 89, url: "" },
    cosponsoredLegislation: { count: 1240, url: "" },
    leadership: { item: [] },
  },
  S000148: {
    ...DEMO_MEMBERS[2],
    currentMember: true,
    directOrderName: "Charles E. Schumer",
    invertedOrderName: "Schumer, Charles E.",
    honorificName: "Mr.",
    birthYear: 1950,
    officialWebsiteUrl: "https://www.schumer.senate.gov",
    sponsoredLegislation: { count: 312, url: "" },
    cosponsoredLegislation: { count: 2890, url: "" },
    leadership: {
      item: [{ type: "Senate Majority Leader", congress: 119, current: true }],
    },
  },
  T000476: {
    ...DEMO_MEMBERS[3],
    currentMember: true,
    directOrderName: "Thom Tillis",
    invertedOrderName: "Tillis, Thom",
    honorificName: "Mr.",
    birthYear: 1960,
    officialWebsiteUrl: "https://www.tillis.senate.gov",
    sponsoredLegislation: { count: 67, url: "" },
    cosponsoredLegislation: { count: 980, url: "" },
    leadership: { item: [] },
  },
  W000805: {
    ...DEMO_MEMBERS[4],
    currentMember: true,
    directOrderName: "Mark R. Warner",
    invertedOrderName: "Warner, Mark R.",
    honorificName: "Mr.",
    birthYear: 1954,
    officialWebsiteUrl: "https://www.warner.senate.gov",
    sponsoredLegislation: { count: 145, url: "" },
    cosponsoredLegislation: { count: 1520, url: "" },
    leadership: { item: [] },
  },
  K000384: {
    ...DEMO_MEMBERS[5],
    currentMember: true,
    directOrderName: "Tim Kaine",
    invertedOrderName: "Kaine, Tim",
    honorificName: "Mr.",
    birthYear: 1958,
    officialWebsiteUrl: "https://www.kaine.senate.gov",
    sponsoredLegislation: { count: 122, url: "" },
    cosponsoredLegislation: { count: 1340, url: "" },
    leadership: { item: [] },
  },
  B001307: {
    ...DEMO_MEMBERS[6],
    currentMember: true,
    directOrderName: "Donald S. Beyer Jr.",
    invertedOrderName: "Beyer, Donald S., Jr.",
    honorificName: "Mr.",
    birthYear: 1950,
    officialWebsiteUrl: "https://beyer.house.gov",
    sponsoredLegislation: { count: 77, url: "" },
    cosponsoredLegislation: { count: 1660, url: "" },
    leadership: { item: [] },
  },
};

export const DEMO_SPONSORED: LegislationItem[] = [
  {
    congress: 119,
    type: "HR",
    number: 4521,
    title: "Infrastructure Modernization and Rural Broadband Act",
    introducedDate: "2025-02-14",
    policyArea: { name: "Transportation and Public Works" },
    latestAction: {
      actionDate: "2025-03-01",
      text: "Referred to the Committee on Transportation and Infrastructure.",
    },
  },
  {
    congress: 119,
    type: "HR",
    number: 3890,
    title: "Veterans Mental Health Access Improvement Act",
    introducedDate: "2025-01-22",
    policyArea: { name: "Armed Forces and National Security" },
    latestAction: {
      actionDate: "2025-02-10",
      text: "Passed House under suspension of the rules.",
    },
  },
  {
    congress: 119,
    type: "S",
    number: 2104,
    title: "Prescription Drug Price Transparency Act",
    introducedDate: "2025-03-05",
    policyArea: { name: "Health" },
    latestAction: {
      actionDate: "2025-03-18",
      text: "Read twice and referred to the Committee on Health, Education, Labor, and Pensions.",
    },
  },
];

export const DEMO_VOTES: MemberVoteRecord[] = [
  {
    vote: {
      congress: 119,
      sessionNumber: 1,
      rollCallNumber: 84,
      voteDate: "2025-03-12",
      voteQuestion: "On Passage",
      result: "Passed",
      legislationNumber: "H.R. 3890",
      legislationType: "HR",
      description: "Veterans Mental Health Access Improvement Act",
    },
    position: "Yea",
  },
  {
    vote: {
      congress: 119,
      sessionNumber: 1,
      rollCallNumber: 72,
      voteDate: "2025-02-28",
      voteQuestion: "On Passage",
      result: "Failed",
      legislationNumber: "H.R. 1201",
      legislationType: "HR",
      description: "Border Security Enhancement Act",
    },
    position: "Nay",
  },
  {
    vote: {
      congress: 119,
      sessionNumber: 1,
      rollCallNumber: 61,
      voteDate: "2025-02-14",
      voteQuestion: "On the Amendment",
      result: "Agreed to",
      legislationNumber: "H.R. 4521",
      legislationType: "HR",
      description: "Amendment to increase rural broadband funding",
    },
    position: "Yea",
  },
  {
    vote: {
      congress: 119,
      sessionNumber: 1,
      rollCallNumber: 45,
      voteDate: "2025-01-30",
      voteQuestion: "On Passage",
      result: "Passed",
      legislationNumber: "H.R. 890",
      legislationType: "HR",
      description: "Government Funding Extension Act",
    },
    position: "Not Voting",
  },
];

export const DEMO_BILL: BillDetail = {
  congress: 119,
  type: "HR",
  number: 3890,
  title: "Veterans Mental Health Access Improvement Act",
  introducedDate: "2025-01-22",
  originChamber: "House",
  originChamberCode: "H",
  policyArea: { name: "Armed Forces and National Security" },
  latestAction: {
    actionDate: "2025-02-10",
    text: "Passed House under suspension of the rules.",
  },
  sponsors: {
    item: [
      {
        bioguideId: "M001157",
        fullName: "Michael T. McCaul",
        party: "R",
        state: "TX",
      },
    ],
  },
  cosponsors: { count: 42 },
  summaries: { count: 1 },
};

export function isDemoMode(): boolean {
  return (
    process.env.NEXT_PUBLIC_FORCE_DEMO_MODE === "true" ||
    !process.env.CONGRESS_API_KEY
  );
}
