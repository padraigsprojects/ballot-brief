import type { VoterProfile } from "./types";

export const PROFILE_STORAGE_KEY = "ballotBriefVoterProfile";

export const ISSUE_OPTIONS = [
  "Economy",
  "Health care",
  "Immigration",
  "Education",
  "Climate",
  "Housing",
  "Veterans",
  "Civil rights",
  "Public safety",
  "Foreign policy",
];

export function readStoredProfile(): VoterProfile | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as VoterProfile;
    if (!parsed.stateCode) return null;
    return {
      ...parsed,
      stateCode: parsed.stateCode.toUpperCase(),
      issuePriorities: parsed.issuePriorities ?? [],
    };
  } catch {
    return null;
  }
}

export function saveStoredProfile(profile: VoterProfile): void {
  window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

export function clearStoredProfile(): void {
  window.localStorage.removeItem(PROFILE_STORAGE_KEY);
}
