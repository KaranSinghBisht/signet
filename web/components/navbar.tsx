import Link from "next/link";

export function Navbar() {
  return (
    <nav className="px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)]">
            <span className="text-sm font-bold text-[var(--accent)]">S</span>
          </div>
          <div>
            <span className="text-base font-bold tracking-tight">Signet</span>
            <span className="ml-1.5 text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
              Protocol
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1 rounded-full border border-[var(--border)] px-1 py-1">
          <span className="rounded-full bg-[var(--bg-subtle)] px-4 py-1.5 text-sm font-medium">
            Home
          </span>
          <Link
            href="#how-it-works"
            className="px-4 py-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="#agents"
            className="px-4 py-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
          >
            Agents
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#chat"
            className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-medium text-black hover:bg-[var(--accent-hover)] transition-colors"
          >
            Launch App →
          </a>
          <a
            href="https://github.com/KaranSinghBisht/signet"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[var(--border)] px-5 py-2 text-sm font-medium hover:border-[var(--border-light)] transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
