import Link from "next/link";
import type { LegislationItem } from "@/lib/types";
import { billPath } from "@/lib/member-utils";

export function LegislationList({
  items,
  emptyMessage,
}: {
  items: LegislationItem[];
  emptyMessage: string;
}) {
  if (!items.length) {
    return (
      <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
      {items.map((item, index) => {
        const href = billPath(item.congress, item.type, item.number);
        const content = (
          <>
            <div className="flex flex-wrap items-center gap-2">
              {item.type && item.number ? (
                <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                  {item.type} {item.number}
                </span>
              ) : (
                <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                  Legislation
                </span>
              )}
              {item.policyArea?.name && (
                <span className="text-xs text-slate-500">
                  {item.policyArea.name}
                </span>
              )}
              {item.introducedDate && (
                <span className="text-xs text-slate-400">
                  Introduced {item.introducedDate}
                </span>
              )}
            </div>
            <p className="mt-2 font-medium text-slate-900">{item.title}</p>
            {item.latestAction?.text && (
              <p className="mt-1 text-sm text-slate-500 line-clamp-2">
                {item.latestAction.text}
              </p>
            )}
          </>
        );

        return (
          <li key={`${item.congress}-${item.type}-${item.number}-${index}`}>
            {href ? (
              <Link href={href} className="block px-4 py-4 transition hover:bg-slate-50">
                {content}
              </Link>
            ) : (
              <div className="px-4 py-4">{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
