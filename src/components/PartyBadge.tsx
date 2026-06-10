import { partyColor } from "@/lib/member-utils";

export function PartyBadge({ party }: { party: string }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${partyColor(party)}`}
    >
      {party}
    </span>
  );
}
