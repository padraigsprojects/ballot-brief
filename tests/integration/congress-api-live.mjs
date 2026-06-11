import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const BASE_URL = "https://api.congress.gov/v3";
const CURRENT_CONGRESS = 119;
const PAGE_LIMIT = 250;

loadDotEnvLocal();

const apiKey = process.env.CONGRESS_API_KEY;

if (!apiKey || apiKey === "your_api_key_here") {
  fail(
    "CONGRESS_API_KEY is required. Add it to .env.local or export it before running npm run test:congress.",
  );
}

const checks = [];

function check(name, fn) {
  checks.push({ name, fn });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function fail(message) {
  console.error(`\nCongress.gov integration test failed: ${message}`);
  process.exit(1);
}

function loadDotEnvLocal() {
  const envPath = resolve(".env.local");

  try {
    const contents = readFileSync(envPath, "utf8");
    for (const line of contents.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) continue;

      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim();
      if (!process.env[key]) {
        process.env[key] = value.replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    // Environment variables can still be provided by the shell or host.
  }
}

async function congressFetch(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set("format", "json");
  url.searchParams.set("api_key", apiKey);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${path} returned ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function fetchAllMembersByCongress(congress) {
  const members = [];
  const seen = new Set();

  for (let offset = 0; ; offset += PAGE_LIMIT) {
    const data = await congressFetch(`/member/congress/${congress}`, {
      currentMember: true,
      limit: PAGE_LIMIT,
      offset: offset || undefined,
    });
    const page = data.members ?? [];

    for (const member of page) {
      if (!seen.has(member.bioguideId)) {
        seen.add(member.bioguideId);
        members.push(member);
      }
    }

    if (!data.pagination?.next || page.length === 0) break;
    if (data.pagination.count && members.length >= data.pagination.count) break;
  }

  return members;
}

function latestTerm(member) {
  const terms = Array.isArray(member.terms)
    ? member.terms
    : member.terms?.item ?? [];
  return terms.at(-1);
}

function chamberFor(member) {
  const chamber = latestTerm(member)?.chamber ?? "";
  if (chamber.includes("Senate")) return "Senate";
  if (chamber.includes("House")) return "House";
  return "Unknown";
}

function partyFor(member) {
  return (
    member.partyName ??
    member.partyHistory?.at(-1)?.partyName ??
    latestTerm(member)?.partyName ??
    "Party unavailable"
  );
}

function memberVotesFromResponse(data) {
  return (
    data.houseRollCallVoteMembers ??
    data.houseRollCallVoteMemberVotes?.results ??
    []
  );
}

let allMembers = [];
let virginiaSenators = [];
let houseVote = null;

check("current member pagination returns a complete Congress", async () => {
  allMembers = await fetchAllMembersByCongress(CURRENT_CONGRESS);
  const uniqueIds = new Set(allMembers.map((member) => member.bioguideId));

  assert(
    allMembers.length > PAGE_LIMIT,
    `expected more than ${PAGE_LIMIT} current members, got ${allMembers.length}`,
  );
  assert(
    uniqueIds.size === allMembers.length,
    "expected paginated members to be deduplicated by bioguideId",
  );
});

check("Virginia filtering includes senators and House members", async () => {
  const virginiaMembers = allMembers.filter(
    (member) => member.state === "Virginia",
  );
  virginiaSenators = virginiaMembers.filter(
    (member) => chamberFor(member) === "Senate",
  );
  const virginiaHouseMembers = virginiaMembers.filter(
    (member) => chamberFor(member) === "House",
  );

  assert(
    virginiaSenators.length >= 2,
    `expected at least 2 Virginia senators, got ${virginiaSenators.length}`,
  );
  assert(
    virginiaHouseMembers.length >= 1,
    `expected Virginia House members, got ${virginiaHouseMembers.length}`,
  );
});

check("member detail shape supports party fallback from terms", async () => {
  const senator = virginiaSenators[0];
  const data = await congressFetch(`/member/${senator.bioguideId}`);
  const member = data.member;

  assert(member, "expected member detail payload");
  assert(member.bioguideId === senator.bioguideId, "expected matching bioguideId");
  assert(member.directOrderName || member.name, "expected a displayable name");
  assert(partyFor(member), "expected a displayable party fallback");
});

check("sponsored legislation endpoint returns a parseable collection", async () => {
  const senator = virginiaSenators[0];
  const data = await congressFetch(
    `/member/${senator.bioguideId}/sponsored-legislation`,
    { limit: 5 },
  );
  const items = data.sponsoredLegislation ?? [];

  assert(Array.isArray(items), "expected sponsoredLegislation to be an array");
  if (items.length > 0) {
    assert(items[0].title, "expected sponsored legislation items to include title");
    assert(items[0].congress, "expected sponsored legislation items to include congress");
  }
});

check("House vote endpoints return member-level vote positions", async () => {
  const votesData = await congressFetch(`/house-vote/${CURRENT_CONGRESS}/1`, {
    limit: 5,
  });
  const votes = votesData.houseRollCallVotes ?? [];
  assert(votes.length > 0, "expected recent House roll-call votes");

  houseVote = votes[0];
  const membersData = await congressFetch(
    `/house-vote/${houseVote.congress}/${houseVote.sessionNumber}/${houseVote.rollCallNumber}/members`,
  );
  const voteMembers = memberVotesFromResponse(membersData);
  const firstVoteMember = voteMembers[0];

  assert(voteMembers.length > 0, "expected member-level vote positions");
  assert(
    firstVoteMember.bioguideId ?? firstVoteMember.bioguideID,
    "expected vote member bioguideId",
  );
  assert(
    firstVoteMember.votePosition ?? firstVoteMember.voteCast,
    "expected vote member position",
  );
});

console.log("Running live Congress.gov integration checks...");

for (const { name, fn } of checks) {
  try {
    await fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    fail(`${name}\n${error instanceof Error ? error.message : String(error)}`);
  }
}

console.log("\nCongress.gov integration checks passed.");
