"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getStateOptions } from "@/lib/member-utils";
import {
  ISSUE_OPTIONS,
  clearStoredProfile,
  readStoredProfile,
  saveStoredProfile,
} from "@/lib/profile-storage";
import type { VoterProfile } from "@/lib/types";

const emptyProfile: VoterProfile = {
  stateCode: "CA",
  issuePriorities: [],
};

export function ProfileForm() {
  const router = useRouter();
  const [profile, setProfile] = useState<VoterProfile>(
    () => readStoredProfile() ?? emptyProfile,
  );
  const [saved, setSaved] = useState(false);

  function updateProfile(update: Partial<VoterProfile>) {
    setProfile((current) => ({ ...current, ...update }));
    setSaved(false);
  }

  function toggleIssue(issue: string) {
    const issues = profile.issuePriorities.includes(issue)
      ? profile.issuePriorities.filter((item) => item !== issue)
      : [...profile.issuePriorities, issue];
    updateProfile({ issuePriorities: issues });
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    saveStoredProfile({
      ...profile,
      stateCode: profile.stateCode.toUpperCase(),
      houseDistrict: profile.houseDistrict || undefined,
      zipCode: profile.zipCode?.trim() || undefined,
      city: profile.city?.trim() || undefined,
      displayName: profile.displayName?.trim() || undefined,
    });
    setSaved(true);
  }

  function handleClear() {
    clearStoredProfile();
    setProfile(emptyProfile);
    setSaved(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Save your voter profile
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          This unauthenticated MVP stores your profile in this browser only. It
          can later be moved behind sign-in so the same details follow you
          across devices.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">
            Display name
          </span>
          <input
            value={profile.displayName ?? ""}
            onChange={(event) =>
              updateProfile({ displayName: event.target.value })
            }
            placeholder="Optional"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">State</span>
          <select
            value={profile.stateCode}
            onChange={(event) => updateProfile({ stateCode: event.target.value })}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900"
          >
            {getStateOptions().map((state) => (
              <option key={state.code} value={state.code}>
                {state.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">
            U.S. House district
          </span>
          <input
            type="number"
            min={0}
            max={99}
            value={profile.houseDistrict ?? ""}
            onChange={(event) =>
              updateProfile({
                houseDistrict: event.target.value
                  ? Number(event.target.value)
                  : undefined,
              })
            }
            placeholder="Example: 11"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
          />
          <span className="mt-1 block text-xs text-slate-500">
            Leave blank to show every House district in your state.
          </span>
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">
            ZIP code
          </span>
          <input
            inputMode="numeric"
            value={profile.zipCode ?? ""}
            onChange={(event) => updateProfile({ zipCode: event.target.value })}
            placeholder="Optional"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
          />
          <span className="mt-1 block text-xs text-slate-500">
            Reserved for future address-to-district lookup and local races.
          </span>
        </label>
      </div>

      <div className="mt-6">
        <p className="text-sm font-medium text-slate-700">Top issues</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {ISSUE_OPTIONS.map((issue) => {
            const selected = profile.issuePriorities.includes(issue);
            return (
              <button
                key={issue}
                type="button"
                onClick={() => toggleIssue(issue)}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                  selected
                    ? "border-[#1e3a5f] bg-[#1e3a5f] text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-[#1e3a5f]/40"
                }`}
              >
                {issue}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="rounded-lg bg-[#1e3a5f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#162d4a]"
        >
          Save profile
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          View my races
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="text-sm font-medium text-slate-500 hover:text-slate-800"
        >
          Clear saved profile
        </button>
        {saved && <span className="text-sm text-emerald-700">Saved.</span>}
      </div>
    </form>
  );
}
