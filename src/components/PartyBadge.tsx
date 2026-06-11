import { partyColor } from "@/lib/member-utils";

export function PartyBadge({ party }: { party?: string }) {
  const label = party ?? "Party unavailable";

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${partyColor(party)}`}
    >
      {label}
    </span>
  );
}
