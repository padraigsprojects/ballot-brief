import Link from "next/link";
import { notFound } from "next/navigation";
import { DemoBanner } from "@/components/DemoBanner";
import { fetchBill } from "@/lib/congress-api";
import { DEMO_BILL, isDemoMode } from "@/lib/demo-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ congress: string; type: string; number: string }>;
}) {
  const { congress, type, number } = await params;
  const bill = isDemoMode()
    ? DEMO_BILL
    : await fetchBill(parseInt(congress, 10), type, parseInt(number, 10));

  if (!bill) return { title: "Bill not found" };

  return {
    title: `${bill.type.toUpperCase()} ${bill.number}`,
    description: bill.title,
  };
}

export default async function BillDetailPage({
  params,
}: {
  params: Promise<{ congress: string; type: string; number: string }>;
}) {
  const { congress, type, number } = await params;
  const congressNum = parseInt(congress, 10);
  const billNum = parseInt(number, 10);

  const bill = isDemoMode()
    ? DEMO_BILL
    : await fetchBill(congressNum, type, billNum);

  if (!bill) notFound();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {isDemoMode() && (
        <div className="mb-6">
          <DemoBanner />
        </div>
      )}

      <Link
        href="/members"
        className="text-sm font-medium text-[#1e3a5f] hover:underline"
      >
        ← Back to candidates
      </Link>

      <article className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-lg bg-[#1e3a5f] px-3 py-1 text-sm font-bold text-white">
            {bill.type.toUpperCase()} {bill.number}
          </span>
          <span className="text-sm text-slate-500">
            {bill.congress}th Congress
          </span>
          {bill.policyArea?.name && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {bill.policyArea.name}
            </span>
          )}
        </div>

        <h1 className="mt-4 text-2xl font-bold leading-snug text-slate-900 sm:text-3xl">
          {bill.title}
        </h1>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          {bill.introducedDate && (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Introduced
              </dt>
              <dd className="mt-1 text-slate-700">{bill.introducedDate}</dd>
            </div>
          )}
          {bill.originChamber && (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Origin chamber
              </dt>
              <dd className="mt-1 text-slate-700">{bill.originChamber}</dd>
            </div>
          )}
        </dl>

        {bill.latestAction && (
          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Latest action
              {bill.latestAction.actionDate
                ? ` · ${bill.latestAction.actionDate}`
                : ""}
            </p>
            <p className="mt-2 text-sm text-slate-700">
              {bill.latestAction.text}
            </p>
          </div>
        )}

        {bill.sponsors?.item?.length ? (
          <div className="mt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              Sponsors
            </h2>
            <ul className="mt-2 space-y-2">
              {bill.sponsors.item.map((sponsor) => (
                <li key={sponsor.bioguideId ?? sponsor.fullName}>
                  {sponsor.bioguideId ? (
                    <Link
                      href={`/members/${sponsor.bioguideId}`}
                      className="font-medium text-[#1e3a5f] hover:underline"
                    >
                      {sponsor.fullName}
                    </Link>
                  ) : (
                    <span className="font-medium text-slate-800">
                      {sponsor.fullName}
                    </span>
                  )}
                  {(sponsor.party || sponsor.state) && (
                    <span className="ml-2 text-sm text-slate-500">
                      {[sponsor.party, sponsor.state].filter(Boolean).join(" · ")}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {bill.cosponsors?.count != null && (
          <p className="mt-4 text-sm text-slate-500">
            {bill.cosponsors.count} cosponsor
            {bill.cosponsors.count === 1 ? "" : "s"}
          </p>
        )}
      </article>
    </main>
  );
}
