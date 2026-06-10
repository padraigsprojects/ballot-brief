export function DemoBanner() {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <p className="font-semibold">Demo mode</p>
      <p className="mt-1">
        Add a free{" "}
        <a
          href="https://api.congress.gov/sign-up/"
          className="font-medium underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Congress.gov API key
        </a>{" "}
        to <code className="rounded bg-amber-100 px-1">.env.local</code> as{" "}
        <code className="rounded bg-amber-100 px-1">CONGRESS_API_KEY</code> to
        load live congressional data.
      </p>
    </div>
  );
}
