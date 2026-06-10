import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1e3a5f] text-sm font-bold text-white">
            BB
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight text-slate-900 group-hover:text-[#1e3a5f]">
              Ballot Brief
            </p>
            <p className="text-xs text-slate-500">Research before you vote</p>
          </div>
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium text-slate-600">
          <Link href="/dashboard" className="hover:text-[#1e3a5f]">
            My races
          </Link>
          <Link href="/members" className="hover:text-[#1e3a5f]">
            Candidates
          </Link>
          <Link href="/compare" className="hidden hover:text-[#1e3a5f] sm:inline">
            Compare
          </Link>
          <Link href="/profile" className="hidden hover:text-[#1e3a5f] sm:inline">
            Profile
          </Link>
          <a
            href="https://www.congress.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden hover:text-[#1e3a5f] sm:inline"
          >
            Congress.gov
          </a>
        </nav>
      </div>
    </header>
  );
}
