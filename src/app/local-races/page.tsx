import { LocalRacesGuide } from "@/components/LocalRacesGuide";

export const metadata = {
  title: "State and local races",
};

export default function LocalRacesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#c9a227]">
          Beyond Congress
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          State and local election support
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Ballot Brief now has the profile model needed to personalize local
          ballots. This page makes the implementation path explicit while the
          MVP continues to use live federal data.
        </p>
      </div>
      <LocalRacesGuide />
    </main>
  );
}
