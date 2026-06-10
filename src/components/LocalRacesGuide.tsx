"use client";

import Link from "next/link";
import { useState } from "react";
import { getStateName } from "@/lib/member-utils";
import { readStoredProfile } from "@/lib/profile-storage";
import type { VoterProfile } from "@/lib/types";

const raceTypes = [
  "Governor and statewide executive offices",
  "State senate and state house",
  "County commission and sheriff",
  "Mayor and city council",
  "School board",
  "Judicial retention or judicial elections",
  "Ballot measures and amendments",
];

const dataSteps = [
  "Use ZIP/address to resolve state, congressional district, precinct, and local districts.",
  "Connect a civic ballot data source, such as Google Civic Information API where available.",
  "Normalize local candidate profiles into the same profile, issue, vote, and source model.",
  "Show source citations and confidence levels because local data quality varies by jurisdiction.",
];

export function LocalRacesGuide() {
  const [profile] = useState<VoterProfile | null>(() => readStoredProfile());

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          Locality foundation
        </h2>
        {profile ? (
          <p className="mt-2 text-slate-600">
            Your saved profile is set to {getStateName(profile.stateCode)}
            {profile.houseDistrict
              ? `, U.S. House District ${profile.houseDistrict}`
              : ""}
            {profile.zipCode ? `, ZIP ${profile.zipCode}` : ""}. This is the
            information needed to target future state and local races.
          </p>
        ) : (
          <p className="mt-2 text-slate-600">
            Create a profile with your state, ZIP code, and House district so
            Ballot Brief can narrow future local races to your actual ballot.
          </p>
        )}
        <Link
          href="/profile"
          className="mt-4 inline-flex rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#162d4a]"
        >
          {profile ? "Edit profile" : "Create profile"}
        </Link>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Offices to support
          </h2>
          <ul className="mt-4 space-y-3">
            {raceTypes.map((race) => (
              <li key={race} className="flex gap-3 text-sm text-slate-700">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#c9a227]" />
                <span>{race}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Data integration path
          </h2>
          <ol className="mt-4 space-y-3">
            {dataSteps.map((step, index) => (
              <li key={step} className="flex gap-3 text-sm text-slate-700">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
