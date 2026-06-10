import { ProfileForm } from "@/components/ProfileForm";

export const metadata = {
  title: "Voter profile",
};

export default function ProfilePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#c9a227]">
          Personalize Ballot Brief
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Tell us where you vote
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Save just enough locality information to narrow the app from a
          national directory to the candidates and offices that are likely to be
          on your ballot.
        </p>
      </div>
      <ProfileForm />
    </main>
  );
}
