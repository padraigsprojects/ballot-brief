import Link from "next/link";
import type { MemberVoteRecord } from "@/lib/types";
import { billPath, votePositionColor } from "@/lib/member-utils";

export function VoteRecordTable({ votes }: { votes: MemberVoteRecord[] }) {
  if (!votes.length) {
    return (
      <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
        No roll-call votes found for this member in the current Congress.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-slate-700">
              Date
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-700">
              Legislation
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-700">
              Question
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-700">
              Result
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-700">
              Vote
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {votes.map((record) => {
            const { vote, position } = record;
            const billNumber = vote.legislationNumber
              ? parseInt(vote.legislationNumber.replace(/\D/g, ""), 10)
              : null;
            const billLink = billPath(
              vote.congress,
              vote.legislationType,
              billNumber,
            );

            return (
              <tr key={`${vote.congress}-${vote.sessionNumber}-${vote.rollCallNumber}`}>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                  {vote.voteDate ?? "—"}
                </td>
                <td className="px-4 py-3">
                  {billLink ? (
                    <Link
                      href={billLink}
                      className="font-medium text-[#1e3a5f] hover:underline"
                    >
                      {vote.legislationNumber}
                    </Link>
                  ) : (
                    <span className="text-slate-700">
                      {vote.legislationNumber ?? "—"}
                    </span>
                  )}
                  {vote.description && (
                    <p className="mt-0.5 text-xs text-slate-500 line-clamp-2">
                      {vote.description}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {vote.voteQuestion ?? "—"}
                </td>
                <td className="px-4 py-3 text-slate-600">{vote.result ?? "—"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${votePositionColor(position)}`}
                  >
                    {position}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
