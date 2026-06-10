"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { getStateOptions } from "@/lib/member-utils";

export function MemberFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const states = getStateOptions();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/members?${params.toString()}`);
  }

  const chamber = searchParams.get("chamber") ?? "all";
  const state = searchParams.get("state") ?? "all";
  const party = searchParams.get("party") ?? "all";

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">Chamber</span>
        <select
          value={chamber}
          onChange={(e) => updateParam("chamber", e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900"
        >
          <option value="all">All chambers</option>
          <option value="House">House</option>
          <option value="Senate">Senate</option>
        </select>
      </label>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">State</span>
        <select
          value={state}
          onChange={(e) => updateParam("state", e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900"
        >
          <option value="all">All states</option>
          {states.map((s) => (
            <option key={s.code} value={s.code}>
              {s.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">Party</span>
        <select
          value={party}
          onChange={(e) => updateParam("party", e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900"
        >
          <option value="all">All parties</option>
          <option value="Democratic">Democratic</option>
          <option value="Republican">Republican</option>
          <option value="Independent">Independent</option>
        </select>
      </label>
    </div>
  );
}
