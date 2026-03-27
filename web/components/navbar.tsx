import Link from "next/link";

export function Navbar() {
  return (
    <nav className="px-6 py-5 border-b border-[var(--border)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--accent)] text-white text-xs font-bold">
            S
          </div>
          <span className="text-lg font-semibold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            Signet
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm">
          <Link href="#how-it-works" className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
            How It Works
          </Link>
          <Link href="#agents" className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
            Agents
          </Link>
          <Link href="#deploy" className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
            Deploy
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#chat"
            className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)] transition-colors"
          >
            Launch App
          </a>
          <a
            href="https://github.com/KaranSinghBisht/signet"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-muted)] hover:border-[var(--border-light)] hover:text-[var(--text)] transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
