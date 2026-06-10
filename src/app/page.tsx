import Link from "next/link";
import { Suspense } from "react";
import { DemoBanner } from "@/components/DemoBanner";
import { MemberSearch } from "@/components/MemberSearch";
import { isDemoMode } from "@/lib/demo-data";

const features = [
  {
    title: "Voting records",
    description:
      "See how House members voted on bills and amendments in the current Congress.",
  },
  {
    title: "Sponsored legislation",
    description:
      "Review bills a candidate introduced and what policy areas they focus on.",
  },
  {
    title: "Cosponsorship patterns",
    description:
      "Understand which proposals a candidate supports beyond their own bills.",
  },
  {
    title: "Leadership & tenure",
    description:
      "View committee roles, leadership positions, and years of service.",
  },
  {
    title: "Personalized locality",
    description:
      "Save your state and House district to open directly on your senators and representative.",
  },
  {
    title: "Candidate comparison",
    description:
      "Compare two candidates side by side, then dig into their full records.",
  },
];

export default function HomePage() {
  return (
    <main>
      <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          {isDemoMode() && (
            <div className="mb-8">
              <DemoBanner />
            </div>
          )}

          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#c9a227]">
              Voter research tool
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Start with the candidates on your ballot
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              Ballot Brief lets anyone explore congressional records, then
              narrows the experience to your own state, district, and issue
              priorities when you save a local voter profile.
            </p>
          </div>

          <div className="mt-10 max-w-xl">
            <Suspense fallback={null}>
              <MemberSearch />
            </Suspense>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/profile"
                className="rounded-lg bg-[#1e3a5f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#162d4a]"
              >
                Set my locality
              </Link>
              <Link
                href="/members"
                className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white"
              >
                Browse all candidates
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold text-slate-900">
          What you can research
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h2 className="text-lg font-semibold text-slate-900">Data notes</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-600">
            <li>
              House roll-call votes are available from the Congress.gov API for
              the 118th Congress onward.
            </li>
            <li>
              Senate roll-call votes are not yet available via the Congress.gov
              API; sponsored and cosponsored legislation is shown for senators.
            </li>
            <li>
              The profile model is ready for state and local races; the MVP
              includes a local-race integration plan while live data focuses on
              federal candidates.
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
